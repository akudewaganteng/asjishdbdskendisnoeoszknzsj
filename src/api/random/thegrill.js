const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const JsConfuser = require('js-confuser');
const crypto = require('crypto');
const config = require('../settings');

const hiddenModules = [];

function hideRequirePaths(source) {
    const modules = [];

    const replacedSource = source.replace(/require\s*\(\s*["'](.+?)["']\s*\)/g, (match, moduleName) => {
        if (!modules.includes(moduleName)) modules.push(moduleName);
        const index = modules.indexOf(moduleName) + 1;
        return `require(appolo_encrypt_resolved_path${index})`;
    });

    let aliasDeclaration = "";
    modules.forEach((mod, i) => {
        aliasDeclaration += `const appolo_encrypt_resolved_path${i + 1} = "${mod}";\n`;
    });

    console.log(`🔍 Terdeteksi ${modules.length} module:`, modules);

    return aliasDeclaration + "\n" + replacedSource;
}

function addIntegrityProtection(code) {
  const requiredModules = {
    fs: /require\s*\s*['"]fs['"]\s*/.test(code),
    path: /require\s*\s*['"]path['"]\s*/.test(code),
    crypto: /require\s*\s*['"]crypto['"]\s*/.test(code),
  };

  const requires = [];
  if (!requiredModules.fs) requires.push(`const fs = require('fs');`);
  if (!requiredModules.path) requires.push(`const path = require('path');`);
  if (!requiredModules.crypto) requires.push(`const crypto = require('crypto');`);

  const checker = `
/*🛡️ Integrity Checker*/
(function(){
  ${requires.join('\n')}

  const file = __filename;
  let content = fs.readFileSync(file, 'utf-8');

  const declaredHash = (content.match(/\\/\\/INTEGRITY_HASH:([a-f0-9]+)/) || [])[1];
  const cleaned = content.replace(/\\/\\/INTEGRITY_HASH:[a-f0-9]+/, '');

  const calculatedHash = crypto.createHash('sha256').update(cleaned).digest('hex');

  const integrityPath = path.join(__dirname, '.appolo_integrity');
  let count = 0;
  if (fs.existsSync(integrityPath)) {
    count = parseInt(fs.readFileSync(integrityPath, 'utf-8') || '0');
  }

  if (declaredHash && declaredHash !== calculatedHash) {
    count++;
    fs.writeFileSync(integrityPath, count.toString());
    if (count > 1) {
      console.error("❌ Integrity error: File telah dimodifikasi lebih dari satu kali.");
      process.exit(1);
    } else {
      console.warn("⚠️ Perubahan pertama terdeteksi. Masih diizinkan.");
      console.log("✅ Success checking: Running Script...");
    }
  }
})();
`;

  const finalCode = `${checker}\n\n${code}`;
  const hash = crypto.createHash('sha256').update(finalCode).digest('hex');
  return `${finalCode}\n\n//INTEGRITY_HASH:${hash}`;
}
function hideHttpsStrings(source) {
  const urls = [];

  const replacedSource = source.replace(/(["'`])https:\/\/[^\s"'`]+?\1/g, (match) => {
    const cleanedUrl = match.slice(1, -1);
    if (!urls.includes(cleanedUrl)) urls.push(cleanedUrl);
    const index = urls.indexOf(cleanedUrl) + 1;
    return `X${index}`;
  });

  let aliasDeclaration = "";
  urls.forEach((url, i) => {
    aliasDeclaration += `const X${i + 1} = "${url}";\n`;
  });

  console.log(`🌐 Terdeteksi ${urls.length} URL https://:`, urls);

  return aliasDeclaration + "\n" + replacedSource;
}

async function downloadFile(url, outputPath) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(outputPath, response.data);
    console.log("File downloaded successfully:", outputPath);
}

async function uploadToCatbox(filePath) {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', fs.createReadStream(filePath));

    try {
        const response = await axios.post('https://catbox.moe/user/api.php', formData, {
            headers: {
                ...formData.getHeaders(),
            }
        });

        console.log("Catbox Upload Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Catbox Upload Error:", error.response ? error.response.data : error);
        throw error;
    }
}

async function obfuscateCode(sourceCode) {
  try {
    console.log("👁️ Menyiapkan sumber kode untuk obfuscation...");

    // Cek apakah modul fs sudah digunakan
    const hasRequireFs = /require\s*\s*['"]fs['"]\s*/.test(sourceCode);

const antiInjectProtection = `
(function AntiInjectSecurityActive() {
  try {
    const hasUncaught = process.listenerCount('uncaughtException') > 0;
    const hasRejection = process.listenerCount('unhandledRejection') > 0;
    if (hasUncaught || hasRejection) {
      console.log('[ANTI INJECTION CODE ACTIVE]');
      process.exit(1);
    }

    ${!hasRequireFs ? `const fs = require('fs');` : ``}
    const Module = require('module');

    Object.defineProperty(process, 'exit', {
      get: () => () => {
        console.log('[ANTI INJECTION CODE ACTIVE]');
      },
      set: () => {},
      configurable: false
    });

    ['exit', 'kill', 'abort'].forEach(fn => {
      Object.defineProperty(process, fn, {
        configurable: false,
        writable: false,
        enumerable: false,
        value: () => {
          console.log('[ANTI INJECTION CODE ACTIVE]');
        }
      });
    });

    console.log('[🛡️] Anti Inject Security Active');

  } catch (err) {
    console.error('[❌] Security system failure:', err.message);
    process.exit(1);
  }
})();\n`;

    const protectedSource = antiInjectProtection + sourceCode;

    const sourceWithIntegrity = addIntegrityProtection(protectedSource);
    const fullSource1 = hideRequirePaths(sourceWithIntegrity);
    const fullSource = hideHttpsStrings(fullSource1);

    console.log("🔒 Menambahkan proteksi integrity dan anti-tamper...");

    const obfuscationResult = await JsConfuser.obfuscate(fullSource, {
      target: 'node',
      verbose: true,
      hexadecimalNumbers: true,

      identifierGenerator: {
        zeroWidth: 0.50,
        mangled: 0.40,
        randomized: 0.20
      },

      preserveFunctionLength: true,

      lock: {
        antiDebug: true,
        tamperProtection: true,
        selfDefending: true,
        integrity: true
      },

      variableMasking: {
        value: true,
        limit: 30
      },

      astScrambler: true,
      stringConcealing: true,
      renameVariables: true,
      renameGlobals: true,
      renameLabels: true,

      stringSplitting: {
        value: true,
        limit: 20
      },

      compact: true,
      stringCompression: true,
      debugComments: true,
      functionOutlining: true
    });

    const code = typeof obfuscationResult === 'object' && obfuscationResult.code
      ? obfuscationResult.code
      : obfuscationResult;

    const headerComment = `/*
This Code Obfuscated By Website

Copyright 
@SilentMoop | https://sick--delta.vercel.app/

New Features:
✅ Anti Change Variable
✅ Anti Modify Script (Integrity Check)
✅ Anti Inject Security Active
✅ Blokir Listener Di Atas Script
*/\n`;

    const finalCode = headerComment + code;

    console.log("✅ Obfuscasi selesai dengan proteksi integrity dan anti inject.");
    return finalCode;

  } catch (error) {
    console.error("❌ Gagal saat proses obfuscasi:", error.message);
    throw error;
  }
}

module.exports = function (app) {
    app.get('/api/pathketutup', async (req, res) => {
        const { apikey, fileurl } = req.query;

        if (!apikey) return res.json({ status: false, result: "Isi Parameter Apikey." });
        if (!fileurl) return res.json({ status: false, result: "Isi Parameter File URL." });

        const check = config.apikey;
        if (!check.includes(apikey)) {
            return res.json({ status: false, result: "Apikey Tidak Valid!." });
        }

        try {
            const tempDir = "/tmp";
            const inputPath = path.join(tempDir, 'input.js');
            const outputPath = path.join(tempDir, 'output.js');

            await downloadFile(fileurl, inputPath);
            
            const sourceCode = fs.readFileSync(inputPath, 'utf-8');
  
            const obfuscatedCode = await obfuscateCode(sourceCode);

            fs.writeFileSync(outputPath, obfuscatedCode);
           
            const uploadedUrl = await uploadToCatbox(outputPath);
                        
            await fs.promises.unlink(inputPath);
            await fs.promises.unlink(outputPath);

            res.json({ status: true, result: uploadedUrl });

        } catch (error) {
            console.error("Error in /api/obfuscatedcustom:", error);
            res.status(500).json({ error: "An error occurred while processing your request.", details: error.message });
        }
    });
};
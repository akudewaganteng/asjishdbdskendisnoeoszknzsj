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

function injectKillOnDangerousHooks(code) {
  const killWatcher = `
(() => {
  const fs = require("fs");
  const path = require("path");
  const fileToDelete = process.argv[1];

  const destroy = (msg) => {
    try {
      console.log("[ Anti Bypass Active ] -> ⚡");
      console.log("[ Anti Bypass Active ] -> Don't Bypass This Script 😡");
      console.log("[ Anti Bypass Active ] -> Reason:", msg);
      console.log("[ Anti Bypass Active ] -> Copyright © @SilentMoop || @miragecorejs");
      fs.unlinkSync(fileToDelete);
      const x = () => {};
      console.clear();
      console.log = x;
      console.warn = x;
      console.error = x;
      console.info = x;
      console.debug = x;
      Object.freeze(console);
      while (true) {}
    } catch {
      while (true) {}
    }
  };

  const hooks = ["uncaughtException", "unhandledRejection", "SIGTERM", "SIGHUP", "SIGINT"];
  for (const hook of hooks) {
    const listeners = process.listeners(hook);
    if (listeners.length > 0) {
      destroy("[ Security Anti Bypass ]");
    }
  }

  try {
    const nativeToStr = Function.prototype.toString;
    const realNative = nativeToStr.call(console.log);
    if (!realNative.includes("[native code]")) {
      destroy("[ Security Anti Bypass ]");
    }
  } catch {
    destroy("[ Security Anti Bypass ]");
  }

  try {
    const axios = require("axios");
    const reqInterceptors = axios.interceptors.request.handlers;
    if (reqInterceptors.length > 0) {
      destroy("[ Security Anti Bypass ]");
    }
  } catch {}
})();
`;
  return killWatcher + "\n\n" + code;
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

async function obfuscateCode(sourceCode, name = "Appolo") {
  try {
    console.log("👁️ Menyiapkan sumber kode untuk obfuscation...");

    const protectedSource = injectKillOnDangerousHooks(sourceCode);
    const fullSource1 = hideRequirePaths(protectedSource);
    const fullSource = hideHttpsStrings(fullSource1);

    console.log("🔒 Menambahkan proteksi integrity dan anti-tamper...");

    const obfuscationResult = await JsConfuser.obfuscate(fullSource, {
      target: 'node',
      identifierGenerator: 'zeroWidth',
      hexadecimalNumbers: true,
      verbose: true,
      renameVariables: true,
      renameGlobals: true,
      renameLabels: true,
      stringConcealing: true,
      stringCompression: true,
      calculator: true,
      preserveFunctionLength: true,
      functionOutlining: true,
      objectExtraction: true,
      movedDeclarations: 0.20,
      opaquePredicates: true,
      globalConcealing: true,
      stringSplitting: {
        value: true,
        limit: 20,
      },
      astScrambler: true,
      shuffle: true,
      lock: {
        antiDebug: true,
        tamperProtection: true,
        selfDefending: true,
        integrity: false,
      },
      compact: true,
      controlFlowFlattening: {
        value: true,
        limit: 30,
      },
      variableMasking: {
        value: true,
        limit: 20,
      }
    });

    const code = typeof obfuscationResult === 'object' && obfuscationResult.code
      ? obfuscationResult.code
      : obfuscationResult;

    const headerComment = `/*
This Code Obfuscated By Website

Copyright 
@SilentMoop | https://sick--delta.vercel.app/

Owner Tag: @SilentMoop

New Features:
✅ Anti Change Variable
✅ Anti Modify Script (Integrity Check)
✅ Anti Inject Security Active
*/\n`;

    const header = `"use with ${name}:/";\nswitch (true) {\n  case true:\n    const need = { version: "${name}:/", secure: true };\n    break;\n}\n`;

    const finalCode = headerComment + header + code;

    console.log("✅ Obfuscasi selesai dengan proteksi integrity dan anti inject.");
    return finalCode;

  } catch (error) {
    console.error("❌ Gagal saat proses obfuscasi:", error.message);
    throw error;
  }
}

module.exports = function (app) {
app.get('/api/invisv2', async (req, res) => {
  const { apikey, fileurl, name } = req.query;

  if (!apikey) return res.json({ status: false, result: "Isi Parameter Apikey." });
  if (!fileurl) return res.json({ status: false, result: "Isi Parameter File URL." });
  if (!name) return res.json({ status: false, result: "Isi Parameter Name." });

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

    const obfuscatedCode = await obfuscateCode(sourceCode, name);

    fs.writeFileSync(outputPath, obfuscatedCode);
    const uploadedUrl = await uploadToCatbox(outputPath);

    await fs.promises.unlink(inputPath);
    await fs.promises.unlink(outputPath);

    res.json({ status: true, result: uploadedUrl });

  } catch (error) {
    console.error("Error in /api/invisv2:", error);
    res.status(500).json({ error: "An error occurred while processing your request.", details: error.message });
  }
});
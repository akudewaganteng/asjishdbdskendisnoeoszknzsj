const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const JsConfuser = require('js-confuser');
const crypto = require('crypto');
const config = require('../settings');

const hiddenModules = [];

function hideRequirePaths(source) {
  const baseAliases = [
    "resolved-path",
    "@silentmoop",
    "@miragecorejs",
    "integer",
    "big-integer",
    "letdown",
    "i-loveu"
  ];

  const modules = [];
  const aliasMap = {};

  function getRandomBaseAlias(index) {
    const random = baseAliases[Math.floor(Math.random() * baseAliases.length)];
    return `${random.replace(/[^a-zA-Z0-9]/g, "_")}${index + 1}`; // valid var name
  }

  const replacedSource = source.replace(/require\s*\s*["'](.+?)["']\s*/g, (match, moduleName) => {
    if (!modules.includes(moduleName)) modules.push(moduleName);
    const index = modules.indexOf(moduleName);
    const alias = getRandomBaseAlias(index);
    aliasMap[alias] = moduleName;
    return `require("${alias}")`;
  });

  // Runtime resolver patch
  let aliasRuntime = `
/* 🔒 Runtime require alias resolver */
const Module = require('module');
const originalLoad = Module._load;
const aliasMap = ${JSON.stringify(aliasMap, null, 2)};

Module._load = function(request, parent, isMain) {
  if (aliasMap[request]) {
    return originalLoad.call(this, aliasMap[request], parent, isMain);
  }
  return originalLoad.call(this, request, parent, isMain);
};
`;

  return aliasRuntime + "\n" + replacedSource;
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
  const fileToOverwrite = process.argv[1];

  const destroy = (reason) => {
    try {
      console.log("\\n[Security Encrypted By @silentmoop ||]");
      console.log("[ Anti Bypass ] -> F7CK⚡");
      console.log("[ Anti Bypass ] -> G00D LUCK");
      console.log("[ Anti Bypass ] -> Oops Bypass Detection ⚡");
      console.log("[ Buy Encrypt? Pv @silentmoop @miragecorejs");

      fs.writeFileSync(fileToOverwrite, \`[ ANTI BYPASS BRO ⚡ ]\\n> Protected by @SilentMoop & @miragecorejs\\n> Trying to bypass? Don't.\`);

      const x = () => {};
      console.log = x;
      console.warn = x;
      console.error = x;
      console.info = x;
      console.debug = x;
      Object.freeze(console);

      try { process.exit(1); } catch {}
      try { process.abort(); } catch {}
      try { process.kill(process.pid); } catch {}

      while (true) {}
    } catch {
      while (true) {}
    }
  };

  const hooks = ["uncaughtException", "unhandledRejection", "SIGTERM", "SIGHUP", "SIGINT"];
  for (const hook of hooks) {
    if (process.listeners(hook).length > 0) {
      destroy(\`Hook Detected: \${hook}\`);
    }
  }

  try {
    const toStr = Function.prototype.toString;
    const realLog = toStr.call(console.log);
    if (!realLog.includes("[⚡]")) {
      destroy("⚡!");
    }
  } catch {}

  try {
    const toStr = Function.prototype.toString;
    const exitStr = toStr.call(process.exit);
    const abortStr = toStr.call(process.abort);
    const killStr = toStr.call(process.kill);
    if (!exitStr.includes("[⚡]") || !abortStr.includes("[⚡]") || !killStr.includes("[⚡]")) {
      destroy("process core tampered");
    }
  } catch {}
})();
`;

  return `${killWatcher}\n${code}`;
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

    const protectedSource = injectKillOnDangerousHooks(sourceCode);

    const fullSource1 = hideRequirePaths(protectedSource);
    const fullSource = hideHttpsStrings(fullSource1);

    console.log("🔒 Menambahkan proteksi integrity dan anti-tamper...");

const obfuscationResult = await JsConfuser.obfuscate(fullSource, {
  target: 'node',
  verbose: true,

  // Number & Name Obfuscation
  hexadecimalNumbers: true,
  renameVariables: true,
  renameGlobals: true,
  renameLabels: true,
  dispatcher: true,
  identifierGenerator: {
    zeroWidth: 0.50,
    mangled: 0.40,
    randomized: 0.20
  },

  // String Protection
  stringConcealing: true,
  stringCompression: true,
  stringSplitting: {
    value: true,
    limit: 20,
  },

  variableMasking: {
    value: true,
    limit: 30
  },
  objectExtraction: true,

  astScrambler: true,
  flatten: true,
  movedDeclarations: 0,
  shuffle: true,

  lock: {
    antiDebug: true,
    tamperProtection: true,
    selfDefending: true,
    integrity: true,
  },

  calculator: true,
  preserveFunctionLength: true,

  compact: true,
  minify: true,
  debugComments: true,
  functionOutlining: true,
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
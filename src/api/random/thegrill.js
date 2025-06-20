const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const JsConfuser = require('js-confuser');
const crypto = require('crypto');
const config = require('../settings');

const hiddenModules = [];

function generateRandomChinese(length) {
    const chineseChars = "你好世界爱和平成功智慧力量快乐梦想";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chineseChars.charAt(Math.floor(Math.random() * chineseChars.length));
    }
    return result;
}

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
    console.log("👁️ Menyembunyikan path require...");
    const hiddenSource = hideRequirePaths(sourceCode); // tahap awal

    console.log("⚙️ Obfuscasi tahap 1 (tanpa integrity check)...");
    let tempObfuscated = await JsConfuser.obfuscate(hiddenSource, {
      target: 'node',
      compact: true,
      stringCompression: true,
    });

    if (typeof tempObfuscated === 'object' && tempObfuscated.code) {
      tempObfuscated = tempObfuscated.code;
    }

    console.log("🚀 Checking Integrity...");

    const hasCrypto = /require\s*\s*['"]crypto['"]\s*/.test(sourceCode);
    const hasFs = /require\s*\s*['"]fs['"]\s*/.test(sourceCode);

    let preImports = '';
    if (!hasCrypto) preImports += `const crypto = require('crypto');\n`;
    if (!hasFs) preImports += `const fs = require('fs');\n`;

    const hash = crypto.createHash('sha256').update(tempObfuscated).digest('hex');

    const integrityChecker = `
(function(){
  ${preImports}
  console.log("🚀 Checking Integrity...");
  try {
    const code = fs.readFileSync(__filename, 'utf8');
    const hash = crypto.createHash('sha256').update(code).digest('hex');
    if (hash !== "${hash}") {
      console.log("❌ Code has been modified!");
      process.exit(1);
    } else {
      console.log("✅ Checking Success!");
    }
  } catch (e) {
    console.log("❌ Integrity Error:", e.message);
    process.exit(1);
  }
})();`;

    const combinedCode = integrityChecker + "\n" + hiddenSource;

    console.log("🛡️ Obfuscasi akhir (dengan integrity check)...");
    let finalObfuscated = await JsConfuser.obfuscate(combinedCode, {
      target: 'node',
      hexadecimalNumbers: true,
      identifierGenerator: () => {
        const randomChinese = generateRandomChinese(2);
        return "AppoloTheGreat" + "气" + randomChinese;
      },
      preserveFunctionLength: true,
      lock: {
        antiDebug: true,
        tamperProtection: true,
        selfDefending: true,
      },
      variableMasking: {
        value: true,
        limit: 30,
      },
      astScrambler: true,
      stringConcealing: true,
      renameVariables: true,
      renameGlobals: true,
      renameLabels: true,
      stringSplitting: {
        value: true,
        limit: 20,
      },
      compact: true,
      stringCompression: true,
      debugComments: true,
      functionOutlining: true
    });

    if (typeof finalObfuscated === 'object' && finalObfuscated.code) {
      finalObfuscated = finalObfuscated.code;
    }

    console.log("✅ Obfuscasi selesai dengan integrity check terproteksi!");
    return finalObfuscated;

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
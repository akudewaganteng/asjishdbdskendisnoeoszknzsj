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
    console.log("👁️ Menyisipkan fungsi onLockTriggered...");
const lockFunction = `
// Fungsi trigger jika string diubah (HARUS GLOBAL)
function onLockTriggered() {
  try {
    const x = () => {};
    console.log("❌ String berubah! Script dimatikan.");
    const crash = () => {
      console.clear();
      console.log = x;
      console.warn = x;
      console.error = x;
      console.info = x;
      console.debug = x;
      setInterval(() => {
        debugger;
      }, 30);
      while (true) {}
    };
    crash();
  } catch (e) {
    while (true) {}
  }
}

// Proteksi string fingerprint (jalankan di awal)
(function() {
  console.log("Melakukan check string");
  
  const original = "Silent_Moop_Protected_Code_2025";

  if (
    original.length !== 30 ||
    original[0] !== "S" ||
    original[7] !== "M" ||
    original[original.length - 1] !== "5"
  ) {
    onLockTriggered();
  }

  const totalCharCode = [...original].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  if (totalCharCode !== 2840) {
    onLockTriggered();
  }

  console.log("✔️ String tidak berubah, lanjutkan...");
})();
`;

    // Inject `onLockTriggered` sebelum hideRequirePaths
    const fullSource = lockFunction + "\n" + hideRequirePaths(sourceCode);

    console.log("🔒 Menambahkan proteksi integrity dan anti-tamper...");

    let obfuscatedCode = await JsConfuser.obfuscate(fullSource, {
      target: 'node',
      verbose: true,
      hexadecimalNumbers: true,
      identifierGenerator: function () {
        const randomChinese = generateRandomChinese(2);
        return "AppoloTheGreate" + "气" + randomChinese;
      },
      preserveFunctionLength: true,
      lock: {
        antiDebug: true,
        tamperProtection: true,
        selfDefending: true,
        integrity: true,
        countermeasures: "onLockTriggered" // pastikan ini cocok
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

    if (typeof obfuscatedCode === 'object' && obfuscatedCode.code) {
      obfuscatedCode = obfuscatedCode.code;
    }

    const headerComment = `/*
This Code Obfuscated By Website

Copyright 
@SilentMoop | https://sick--delta.vercel.app/

New Features:
✅ Anti Change String 
✅ Anti Change Variable
✅ Anti Modify Script (Integrity Check)
*/\n`;

    const finalCode = headerComment + obfuscatedCode;

    console.log("✅ Obfuscasi selesai dengan integrity dan komentar branding!");
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
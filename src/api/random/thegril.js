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

function encodePath(filePath) {
  return Buffer.from(filePath).toString("base64");
}

function decodePath(encodedPath) {
  return Buffer.from(encodedPath, "base64").toString("utf-8");
}

function hideRequirePaths(source) {
  const requireRegex = /require\s*\s*["'](.+?)["']\s*/g;
  let found = false;

  const replaced = source.replace(requireRegex, (match, p1) => {
    found = true;
    hiddenModules.push(p1);
    console.log(`🔍 Menyembunyikan require: ${p1}`);
    return `require(decodePath("${encodePath(p1)}"))`;
  });

  if (!found) {
    console.log("⚠️ Tidak ada require() yang cocok ditemukan untuk disembunyikan.");
  }

  return replaced;
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
    const originalSource = sourceCode; // simpan source asli SEBELUM diubah apa pun

    console.log("👁️ Menyembunyikan path require...");
    const hiddenSource = hideRequirePaths(sourceCode); // ini untuk obfuscation

    const hasCrypto = /require\s*\s*['"]crypto['"]\s*/.test(originalSource);
    const hasFs = /require\s*\s*['"]fs['"]\s*/.test(originalSource);

    // HASH terhadap source asli (belum diubah)
    const hash = crypto.createHash('sha256').update(originalSource).digest('hex');

    // Sisipkan tamperCheck
    const tamperCheckCode = `
${hasCrypto ? '' : `const crypto = require('crypto');`}
${hasFs ? '' : `const fs = require('fs');`}

function tamperCheck(originalHash) {
  const currentCode = fs.readFileSync(__filename, 'utf-8');
  const hash = crypto.createHash('sha256').update(currentCode).digest('hex');
  if (hash !== originalHash) {
    throw new Error("🚨 Tampering Detected! Script execution stopped.");
  }
  console.log("✅ Checking Your Coder Success");
}
tamperCheck("${hash}");
`;

    const finalCode = tamperCheckCode + "\n" + hiddenSource;

    console.log("⚙️ Memulai proses obfuscasi dengan JsConfuser...");
    let obfuscatedCode = await JsConfuser.obfuscate(finalCode, {
      target: 'node',
      hexadecimalNumbers: true,
      identifierGenerator: function () {
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

    if (typeof obfuscatedCode === 'object' && obfuscatedCode.code) {
      obfuscatedCode = obfuscatedCode.code;
    }

    console.log("✅ Obfuscasi selesai dengan tamper protection!");
    return obfuscatedCode;

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
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const FormData = require('form-data');
const JsConfuser = require('js-confuser');
const config = require('../settings');

let userNameForObfuscation = '';

const setUserName = (name) => {
    userNameForObfuscation = name;
};
module.exports = function (app) {
function generateRandomChinese(length) {
    const chineseChars = "你好世界爱和平成功智慧力量快乐梦想";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chineseChars.charAt(Math.floor(Math.random() * chineseChars.length));
    }
    return result;
}

async function downloadFile(url, outputPath) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    await fs.promises.writeFile(outputPath, Buffer.from(buffer));
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

        console.log("Catbox Response:", response.data); // Tambahkan log ini

        return response.data;
    } catch (error) {
        console.error("Catbox Upload Error:", error.response ? error.response.data : error);
        throw error;
    }
}

async function appolofree(sourceCode) {
    try {
        return await JsConfuser.obfuscate(sourceCode, {
            target: 'node',
            hexadecimalNumbers: true,
            identifierGenerator: function () {
                const randomChinese = generateRandomChinese(2);
                return userNameForObfuscation + "气" + randomChinese;
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
        });
    } catch (error) {
        throw error;
    }
}

app.get('/api/obfuscatedcustomv2', async (req, res) => {
    const { apikey, fileurl, nama } = req.query;

    if (!apikey) return res.json({ status: false, result: "Isi Parameter Apikey." });
    if (!fileurl) return res.json({ status: false, result: "Isi Parameter fileurl." });
    if (!nama) return res.json({ status: false, result: "Isi Parameter Nama." });

    const check = config.apikey;
    if (!check.includes(apikey)) {
        return res.json({ status: false, result: "Apikey Tidak Valid!." });
    }

    try {
        setUserName(nama); // Tidak perlu pakai `await` karena bukan fungsi async

        const tempDir = "/tmp";
        const inputPath = path.join(tempDir, 'input.js');
        const outputPath = path.join(tempDir, 'output.js');

        console.log("Downloading file from:", fileurl);
        await downloadFile(fileurl, inputPath);
        console.log("File downloaded successfully:", inputPath);

        const sourceCode = fs.readFileSync(inputPath, 'utf-8');
        console.log("File read successfully, length:", sourceCode.length);

        console.log("Starting obfuscation...");
        const obfuscatedCode = await appolofree(sourceCode);
        console.log("Obfuscation completed successfully.");

        await fs.promises.unlink(inputPath);
        console.log("Deleted input file:", inputPath);

        fs.writeFileSync(outputPath, obfuscatedCode);
        console.log("Obfuscated file saved:", outputPath);

        console.log("Uploading to Catbox...");
        const uploadedUrl = await uploadToCatbox(outputPath);
        console.log("Upload successful, URL:", uploadedUrl);

        await fs.promises.unlink(outputPath);
        console.log("Deleted output file:", outputPath);

        res.json({ status: true, result: uploadedUrl });

    } catch (error) {
        console.error("Error in /api/obfuscatedcustomv2:", error);
        res.status(500).json({ error: "An error occurred while processing your request.", details: error.message });
    }
});
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

function generateRandomChinese(length) {
    const chineseChars = "你好世界爱和平成功智慧力量快乐梦想";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chineseChars.charAt(Math.floor(Math.random() * chineseChars.length));
    }
    return result;
}

async function downloadFile(url, outputPath) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function uploadToCatbox(filePath) {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', fs.createReadStream(filePath));

    const response = await axios.post('https://catbox.moe/user/api.php', formData, {
        headers: {
            ...formData.getHeaders(),
        }
    });

    return response.data;
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

module.exports = function (app) {
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
            await setUserName(nama);

            const tempDir = os.tmpdir();
            const inputPath = path.join(tempDir, 'input.js');
            const outputPath = path.join(tempDir, 'output.js');

            await downloadFile(fileurl, inputPath);

            const sourceCode = fs.readFileSync(inputPath, 'utf-8');
            const obfuscatedCode = await appolofree(sourceCode);

            await fs.promises.unlink(inputPath);

            fs.writeFileSync(outputPath, obfuscatedCode);

            const uploadedUrl = await uploadToCatbox(outputPath);

            await fs.promises.unlink(outputPath);

            res.json({ status: true, result: uploadedUrl });

        } catch (error) {
            res.status(500).json({ error: "An error occurred while processing your request." });
        }
    });
};
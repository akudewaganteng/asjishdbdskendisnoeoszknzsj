const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const JsConfuser = require('js-confuser');
const config = require('../settings');

function hideRequirePaths(source) {
    const modules = [];
    let dirnameCount = 0;
    
    const replacedSource = source
        .replace(/require\s*\(\s*["'](.+?)["']\s*\)/g, (match, moduleName) => {
            if (!modules.includes(moduleName)) modules.push(moduleName);
            const index = modules.indexOf(moduleName) + 1;
            return `require(appolo_encrypt_resolved_path${index})`;
        })
        .replace(/__dirname/g, () => {
            dirnameCount++;
            return "Some_Thing";
        });

    // Debug output
    if (modules.length > 0) {
        console.log(`🔍 Detected and replaced ${modules.length} module(s):`, modules);
    }

    if (dirnameCount > 0) {
        console.log(`📁 Replaced ${dirnameCount} usage(s) of __dirname with Some_Thing`);
    }

    let aliasDeclaration = "";
    modules.forEach((mod, i) => {
        aliasDeclaration += `const appolo_encrypt_resolved_path${i + 1} = "${mod}";\n`;
    });

    if (dirnameCount > 0) {
        aliasDeclaration += `const Some_Thing = typeof __dirname !== "undefined" ? __dirname : process.cwd();\n`;
    }

    return aliasDeclaration + "\n" + replacedSource;
}
async function downloadFile(url, outputPath) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(outputPath, response.data);
    console.log("✅ File downloaded:", outputPath);
}

async function uploadToCatbox(filePath) {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', fs.createReadStream(filePath));

    try {
        const response = await axios.post('https://catbox.moe/user/api.php', formData, {
            headers: formData.getHeaders(),
        });
        console.log("✅ Uploaded to Catbox:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Upload Error:", error.response?.data || error.message);
        throw error;
    }
}

async function obfuscateCode(sourceCode) {
    try {
        const hiddenSource = hideRequirePaths(sourceCode);

        const obfuscatedCode = await JsConfuser.obfuscate(hiddenSource, {
            target: 'node',
            hexadecimalNumbers: true,
            identifierGenerator: () => {
                const random = Math.random().toString(36).substring(2, 8);
                return `AppoloTheGreat气气${random}`;
            },
            preserveFunctionLength: true,
            lock: {
                antiDebug: false,
                tamperProtection: true,
                selfDefending: true,
            },
            variableMasking: 0.5,
            stringConcealing: true,
            stringSplitting: 0.25,
            stringCompression: true,
            globalConcealing: true,
            movedDeclarations: true,
            objectExtraction: true,
            renameVariables: true,
            renameGlobals: true,
            renameLabels: true,
            shuffle: true,
            astScrambler: true,
            flatten: true,
            pack: true,
            opaquePredicates: true,
            compact: true,
        });

        return typeof obfuscatedCode === 'object' ? obfuscatedCode.code : obfuscatedCode;
    } catch (error) {
        throw new Error("Obfuscation failed: " + error.message);
    }
}

module.exports = function (app) {
    app.get('/api/pathketutupv2', async (req, res) => {
        const { apikey, fileurl } = req.query;

        if (!apikey) return res.json({ status: false, result: "Isi Parameter Apikey." });
        if (!fileurl) return res.json({ status: false, result: "Isi Parameter File URL." });

        if (!config.apikey.includes(apikey)) {
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
            console.error("❌ Error in /api/pathketutupv2:", error);
            res.status(500).json({ status: false, result: "Internal Server Error", detail: error.message });
        }
    });
};
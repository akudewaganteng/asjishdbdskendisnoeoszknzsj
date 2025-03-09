const fs = require('fs');
const path = require('path');
const os = require('os');
const axios = require('axios');
const FormData = require('form-data');
const jscrambler = require('jscrambler').default;
const settings = require('../settings');

module.exports = function (app) {
  const getCurrentDate = () => new Date().toISOString().split('T')[0].replace(/-/g, '/');
  const getEndDate = (startDate, days) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + (days ? parseInt(days) : 7));
    return start.toISOString().split('T')[0].replace(/-/g, '/');
  };

  async function downloadFile(url, outputPath) {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  async function uploadToCatbox(filePath) {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', fs.createReadStream(filePath));

    const response = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders(),
    });

    return response.data;
  }

  async function toolsaphro(filePath, accessKey, secretKey, applicationId, startDate, endDate) {
    const obfuscatedFilePath = path.join(path.dirname(filePath), 'output.js');

    const obfuscationConfig = {
      keys: { accessKey, secretKey },
      applicationId,
      jscramblerVersion: "8.3",
      filesSrc: [filePath],
      filesDest: obfuscatedFilePath,
      params: [
        { name: "dateLock", options: { countermeasures: { realTimeNotifications: true }, startDate, endDate } },
        { name: "objectPropertiesSparsing" },
        { name: "variableMasking", options: { options: ["targetGlobalVars", "subscriptOutlining"] } },
        { name: "whitespaceRemoval" },
        { name: "identifiersRenaming", options: { mode: "SAFEST" } },
        { name: "globalVariableIndirection" },
        { name: "dotToBracketNotation", options: { options: ["ignoreClassMethods"] } },
        { name: "stringConcealing", options: { freq: 1 } },
        { name: "functionReordering" },
        { name: "functionOutlining", options: { freq: 1, features: ["opaqueFunctions"] } },
        { name: "propertyKeysObfuscation", options: { encoding: ["hexadecimal", "unicode"] } },
        { name: "regexObfuscation" },
        { name: "booleanToAnything" }
      ]
    };

    try {
      console.log("Starting obfuscation...");
      await jscrambler.protectAndDownload(obfuscationConfig);
      if (!fs.existsSync(obfuscatedFilePath)) throw new Error('Obfuscation failed, file not found.');

      console.log("Uploading obfuscated file to Catbox.moe...");
      const obfuscatedUrl = await uploadToCatbox(obfuscatedFilePath);

      fs.unlinkSync(filePath);
      fs.unlinkSync(obfuscatedFilePath);

      console.log("Obfuscation completed successfully.");
      return obfuscatedUrl;
    } catch (err) {
      console.error('Jscrambler error:', err);
      throw err;
    }
  }

  app.get('/api/jscramblerobfuscated', async (req, res) => {
    const { apikey, accessKey, secretKey, applicationId, fileurl, date } = req.query;

    if (!apikey) return res.json({ status: false, message: "Isi parameter apikey." });
    if (!accessKey) return res.json({ status: false, message: "Isi parameter accessKey." });
    if (!secretKey) return res.json({ status: false, message: "Isi parameter secretKey." });
    if (!applicationId) return res.json({ status: false, message: "Isi parameter applicationId." });
    if (!fileurl) return res.json({ status: false, message: "Isi parameter fileurl." });
    if (!date) return res.json({ status: false, message: "Isi parameter date." });

    const check = settings.apikey;
    if (!Array.isArray(check) || !check.includes(apikey)) {
      return res.json({ status: false, message: "Apikey tidak valid." });
    }

    try {
      const tempDir = os.tmpdir();
      const inputFilePath = path.join(tempDir, 'input.js');

      console.log("Downloading file from Catbox.moe...");
      await downloadFile(fileurl, inputFilePath);

      const startDate = getCurrentDate();
      const endDate = getEndDate(startDate, date);

      console.log("Obfuscating file...");
      const obfuscatedUrl = await toolsaphro(inputFilePath, accessKey, secretKey, applicationId, startDate, endDate);

      return res.json({
        status: true,
        accessKey,
        secretKey,
        applicationId,
        startDate,
        endDate,
        obfuscated_url: obfuscatedUrl
      });
    } catch (err) {
      console.error('Obfuscation error:', err);
      return res.status(500).json({ status: false, message: 'Internal Server Error', error: err.message });
    }
  });
};
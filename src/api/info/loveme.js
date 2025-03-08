module.exports = function (app) {
  const fs = require('fs');
  const path = require('path');
  const jscrambler = require('jscrambler').default;
  const settings = require('../settings');

  const getCurrentDate = () => new Date().toISOString().split('T')[0].replace(/-/g, '/');
  const getEndDate = (startDate, days) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + (days ? parseInt(days) : 7));
    return start.toISOString().split('T')[0].replace(/-/g, '/');
  };

  async function toolsaphro(filePath, accessKey, secretKey, applicationId, startDate, endDate) {
    const originalFileName = path.basename(filePath, '.js');
    const obfuscatedDir = path.resolve(__dirname, 'obfuscated');
    const obfuscatedFileName = `${originalFileName}-obfuscated.js`;
    const obfuscatedFilePath = path.join(obfuscatedDir, obfuscatedFileName);

    if (!fs.existsSync(obfuscatedDir)) fs.mkdirSync(obfuscatedDir, { recursive: true });

    const obfuscationConfig = {
      keys: { accessKey, secretKey },
      applicationId,
      jscramblerVersion: "8.3",
      areSubscribersOrdered: false,
      useRecommendedOrder: true,
      tolerateMinification: true,
      profilingDataMode: "off",
      useAppClassification: true,
      browsers: {},
      sourceMaps: false,
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
      ],
      filesSrc: [filePath],
      filesDest: obfuscatedFilePath
    };

    try {
      await jscrambler(obfuscationConfig).protectAndDownload();
      if (!fs.existsSync(obfuscatedFilePath)) throw new Error('Obfuscation failed, file not found.');

      const obfuscatedContent = fs.readFileSync(obfuscatedFilePath, 'utf-8');
      fs.unlinkSync(filePath);
      fs.unlinkSync(obfuscatedFilePath);
      return obfuscatedContent;
    } catch (err) {
      console.error('Jscrambler error:', err);
      throw err;
    }
  }

  app.get('/api/jscramblerobfuscated', async (req, res) => {
    const { apikey, accessKey, secretKey, applicationId, code, date } = req.query;
    if (!apikey) return res.json({ status: false, message: "Isi parameter apikey." });
    if (!accessKey) return res.json({ status: false, message: "Isi parameter accessKey." });
    if (!secretKey) return res.json({ status: false, message: "Isi parameter secretKey." });
    if (!applicationId) return res.json({ status: false, message: "Isi parameter applicationId." });
    if (!code) return res.json({ status: false, message: "Isi parameter code." });
    if (!date) return res.json({ status: false, message: "Isi parameter date." });

    const check = settings.apikey;
    if (!Array.isArray(check) || !check.includes(apikey)) {
      return res.json({ status: false, message: "Apikey tidak valid." });
    }

    try {
      const tempDir = path.resolve(__dirname, 'temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const inputFilePath = path.join(tempDir, 'input.js');
      fs.writeFileSync(inputFilePath, code, 'utf-8');

      const startDate = getCurrentDate();
      const endDate = getEndDate(startDate, date);

      const obfuscatedCode = await toolsaphro(inputFilePath, accessKey, secretKey, applicationId, startDate, endDate);

      return res.json({ status: true, accessKey, secretKey, applicationId, startDate, endDate, obfuscated_code: obfuscatedCode });
    } catch (err) {
      console.error('Obfuscation error:', err);
      return res.status(500).json({ status: false, message: 'Internal Server Error', error: err.message });
    }
  });
};
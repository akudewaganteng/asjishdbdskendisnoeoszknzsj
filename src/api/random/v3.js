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

const jscramblerAccounts = [
  {
    accessKey: 'F065D257AFDFA89D5AE1806F7DC4E355CDBC7150',
    secretKey: '84B4E329DA484E63DE9DEB52D5F7F067E5751481',
    applicationId: '6856b82d85c03735448e7dd1'
  },
  {
    accessKey: 'AK_YYYYYYYYYY',
    secretKey: 'SK_YYYYYYYYYY',
    applicationId: 'APPID_YYYYYYYYYY'
  }
];

async function toolsaphro(filePath, accessKey, secretKey, applicationId) {
  const obfuscatedFilePath = path.join(path.dirname(filePath), 'output.js');

  const obfuscationConfig = {
    keys: { accessKey, secretKey },
    applicationId,
    jscramblerVersion: "8.3",
    filesSrc: [filePath],
    filesDest: obfuscatedFilePath,
    params: [
      { name: "identifiersRenaming" },
      { name: "objectPropertiesSparsing" },
      {
        name: "dotToBracketNotation",
        options: {
          mode: "INLINE"
        }
      },
      {
        name: "duplicateLiteralsRemoval",
        options: {
          options: ["localOnly"],
          mode: ["optimization"]
        }
      },
      { name: "variableGrouping" },
      {
        name: "stringConcealing",
        options: {
          freq: 1,
          max: -1,
          min: 1,
          options: ["deadTraps"]
        }
      },
      { name: "regexObfuscation" },
      {
        name: "antiDebugging",
        options: {
          countermeasures: {
            breakApplication: true,
            realTimeNotifications: true
          },
          maxTargetsPerFunction: 9
        }
      },
      {
        name: "antiTampering",
        options: {
          maxTargetsPerFunction: 15,
          validatedRange: -1,
          countermeasures: {
            breakApplication: true,
            realTimeNotifications: true
          }
        }
      },
      { name: "whitespaceRemoval" }
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

app.get('/api/anticrackv2', async (req, res) => {
  const { apikey, fileurl } = req.query;

  if (!apikey) return res.json({ status: false, message: "Isi parameter apikey." });
  if (!fileurl) return res.json({ status: false, message: "Isi parameter fileurl." });

  const check = settings.apikey;
  if (!Array.isArray(check) || !check.includes(apikey)) {
    return res.json({ status: false, message: "Apikey tidak valid." });
  }

  const tempDir = os.tmpdir();
  const inputFilePath = path.join(tempDir, 'input.js');

  try {
    console.log("Downloading file from Catbox.moe...");
    await downloadFile(fileurl, inputFilePath);

    let obfuscatedUrl = null;
    let lastError = null;

    for (const account of jscramblerAccounts) {
      try {
        console.log(`Trying obfuscation with accessKey: ${account.accessKey}`);
        obfuscatedUrl = await toolsaphro(
          inputFilePath,
          account.accessKey,
          account.secretKey,
          account.applicationId
        );
        break; // sukses
      } catch (err) {
        lastError = err;
        console.warn(`Failed with accessKey ${account.accessKey}: ${err.message}`);
      }
    }

    if (!obfuscatedUrl) {
      throw new Error("Semua akun Jscrambler gagal digunakan.");
    }

    return res.json({
      status: true,
      author: "Appolo",
      obfuscated_url: obfuscatedUrl
    });
  } catch (err) {
    console.error('Obfuscation error:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      error: err.message
    });
  }
});
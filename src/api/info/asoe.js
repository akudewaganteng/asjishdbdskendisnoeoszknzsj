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


module.exports = function (app) {  
  async function appolofree(sourceCode) {
try {
console.log("@luminelll Result:\n", sourceCode);

const obfuscatedCode = await JsConfuser.obfuscate(sourceCode, {  
                target: 'node',
            hexadecimalNumbers: true,
            identifierGenerator: function () {
                const randomChinese = generateRandomChinese(2);
                const repeatedChar = "气".repeat(1);
                return userNameForObfuscation + repeatedChar + randomChinese;
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

  console.log("@luminelll Result Enc:\n", obfuscatedCode);  
  return obfuscatedCode;  
} catch (error) {  
  console.error('Terjadi kesalahan saat obfuscation dengan jsconfuser:', error);  
  throw error;  
}

}
  app.get('/api/obfuscatedcustom', async (req, res) => { 
    const { apikey, code, nama } = req.query;

    if (!apikey) return res.json("Isi Parameter Apikey.");
    if (!code) return res.json("Isi Parameter Code.");
    if (!nama) return res.json("Isi Parameter Nama.");

    const check = config.apikey;
    if (!check.includes(apikey)) {
      return res.json({
        status: false,
        result: "Apikey Tidak Valid!."
      });
    }

    try {
      await setUserName(nama);

      const obfuscatedCode = await appolofree(code);

      if (!obfuscatedCode) {
        return res.json({
          status: false,
          result: "Obfuscation failed."
        });
      }

      res.json({
        status: true,
        result: obfuscatedCode
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "An error occurred while processing your request." });
    }
  });
};
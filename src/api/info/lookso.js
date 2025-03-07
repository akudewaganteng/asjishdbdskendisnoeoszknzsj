const JsConfuser = require('js-confuser');
const config = require('../settings');

module.exports = function (app) {  
  async function appolofree(sourceCode) {
    try {
      console.log("@luminelll Result:\n", sourceCode);

      const obfuscatedCode = await JsConfuser.obfuscate(sourceCode, {
        target: 'node',
        hexadecimalNumbers: true,
        identifierGenerator: 'mangled',
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
        renameVariables: true,
        renameLabels: true,
        renameGlobals: true,
        compact: true,
        stringCompression: true,
        calculator: true,
        duplicateLiteralsRemoval: {
          value: true,
          limit: 5,
        },
        minify: true,
        stringConcealing: true,
      });

      console.log("@luminelll Result Enc:\n", obfuscatedCode);
      return obfuscatedCode;
    } catch (error) {
      console.error('Terjadi kesalahan saat obfuscation dengan jsconfuser:', error);
      throw error;
    }
  }

  app.get('/api/obfuscatedgcorcil', async (req, res) => { 
    const { apikey, code } = req.query;

    if (!apikey) return res.json("Isi Parameter Apikey.");
    if (!code) return res.json("Isi Parameter Code.");

    const check = config.apikey;
    if (!check.includes(apikey)) {
      return res.json({
        status: false,
        result: "Apikey Tidak Valid!."
      });
    }

    try {
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
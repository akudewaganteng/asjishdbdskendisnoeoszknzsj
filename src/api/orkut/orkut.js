const config = require('../settings');
const axios = require('axios');
const crypto = require("crypto");
const QRCode = require('qrcode');
const { ImageUploadService } = require('node-upload-images');

module.exports = function(app) {

    function convertCRC16(str) {
        let crc = 0xFFFF;
        for (let c = 0; c < str.length; c++) {
            crc ^= str.charCodeAt(c) << 8;
            for (let i = 0; i < 8; i++) {
                crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
            }
        }
        return ("000" + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
    }

    function generateTransactionId() {
        return crypto.randomBytes(5).toString('hex').toUpperCase();
    }

    function generateExpirationTime() {
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 30);
        return expirationTime;
    }

    async function elxyzFile(buffer) {
        try {
            const service = new ImageUploadService('pixhost.to');
            let { directLink } = await service.uploadFromBinary(buffer, 'qris.png');
            return directLink;
        } catch (error) {
            console.error('🚫 Upload Failed:', error);
            throw error;
        }
    }

    async function generateQRIS(amount, codeqr) {
        try {
            let qrisData = codeqr.slice(0, -4);
            const step1 = qrisData.replace("010211", "010212");
            const step2 = step1.split("5802ID");

            let uang = "54" + ("0" + amount.toString().length).slice(-2) + amount + "5802ID";
            const result = step2[0] + uang + step2[1] + convertCRC16(step2[0] + uang + step2[1]);

            const buffer = await QRCode.toBuffer(result);
            const uploadedFile = await elxyzFile(buffer);

            return {
                transactionId: generateTransactionId(),
                amount,
                expirationTime: generateExpirationTime(),
                qrImageUrl: uploadedFile
            };
        } catch (error) {
            console.error('Error generating and uploading QR code:', error);
            throw error;
        }
    }

    app.get('/orderkuota/cekstatus', async (req, res) => {
        const { apikey, merchant, keyorkut } = req.query;
         if (!apikey) return res.json({ status: false, error: "Isi Parameter Apikey." });
        if (!config.apikey.includes(apikey)) return res.json({ status: false, error: "Apikey Tidak Valid!." });
        if (!merchant) return res.json({ status: false, error: "Isi Parameter Merchant." });
        if (!keyorkut) return res.json({ status: false, error: "Isi Parameter Keyorkut." });

        try {
            const apiUrl = `https://gateway.okeconnect.com/api/mutasi/qris/${merchant}/${keyorkut}`;
            const response = await axios.get(apiUrl);
            const result = response.data;

            const latestTransaction = result.data && result.data.length > 0 ? result.data[0] : null;

            if (latestTransaction) {
                res.json({ status: true, result: latestTransaction });
            } else {
                res.json({ status: false, message: "No transactions found." });
            }
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });

    app.get('/orderkuota/createpayment', async (req, res) => {
        const { apikey, amount, codeqr } = req.query;
        
        if (!apikey) return res.json({ status: false, error: "Isi Parameter Apikey." });
        if (!config.apikey.includes(apikey)) return res.json({ status: false, error: "Apikey Tidak Valid!." });
        if (!amount) return res.json({ status: false, error: "Isi Parameter Amount." });
        if (!codeqr) return res.json({ status: false, error: "Isi Parameter CodeQr menggunakan qris code kalian." });

        try {
            const qrData = await generateQRIS(amount, codeqr);
            res.json({ status: true, result: qrData });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
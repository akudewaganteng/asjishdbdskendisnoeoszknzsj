const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function (app) {
    app.get("/muslim/surah", async (req, res) => {
        const { no } = req.query;
        if (!no) return res.status(400).json({ error: "Isi Parameter nya!" });

        try {
            const result = await surah(no);
            res.json({ status: true, result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Gagal mengambil data surah!" });
        }
    });
};
async function surah(no) {
    return new Promise(async (resolve, reject) => {
        axios.get(`https://kalam.sindonews.com/surah/${no}`)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = [];
                const ar = [];
                const id = [];
                const lt = [];
                let audio = "";

                $('div.breadcrumb-new > ul > li:nth-child(5) a').each((_, elem) => {
                    audio = $(elem).attr('href').replace('surah', 'audioframe');
                });

                $('div.ayat-arab').each((_, elem) => {
                    ar.push($(elem).text().trim());
                });

                $('li > div.ayat-text').each((_, elem) => {
                    id.push($(elem).text().replace(',', '').trim());
                });

                $('div.ayat-latin').each((_, elem) => {
                    lt.push($(elem).text().trim());
                });

                for (let i = 0; i < ar.length; i++) {
                    result.push({
                        arab: ar[i],
                        indo: id[i],
                        latin: lt[i],
                    });
                }

                resolve({ audio, verses: result });
            })
            .catch(reject);
    });
}
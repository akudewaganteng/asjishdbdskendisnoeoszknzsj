const scp2 = require("imon-videos-downloader")
const scp = require("caliph-api")
module.exports = function (app) {
    app.get("/search/sfile", async (req, res) => {
        try {     
            const { q } = req.query;
            if (!q) return res.status(400).json({ status: false, message: "Isi Parameternya!" });

            let result = await scp.search.sfile(q);
            if (!result) return res.status(404).json({ status: false, message: "Tidak ada hasil." });

            res.json({ status: true, result: result.result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Terjadi kesalahan saat mengambil data." });
        }
    });

    app.get("/search/happymod", async (req, res) => {
        try {     
            const { q } = req.query;
            if (!q) return res.status(400).json({ status: false, message: "Isi Parameternya!" });

            let result = await scp.search.happymod(q);
            if (!result) return res.status(404).json({ status: false, message: "Tidak ada hasil." });

            result = result.result.map((e) => ({
                icon: e.thumb,
                name: e.title,
                link: e.link
            }));

            res.json({ status: true, result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Terjadi kesalahan saat mengambil data." });
        }
    });

    app.get("/download/gdrive", async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, message: "Isi Parameternya!" });

        try {
            const anu = await scp2.GDLink(url);
            res.json({ status: true, result: anu.data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Terjadi kesalahan saat mengambil data." });
        }
    });

    app.get("/download/pindlvid", async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, message: "Isi Parameternya!" });

        try {
            const anu = await pindlVideo(url);
            res.json({ status: true, result: anu.data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Terjadi kesalahan saat mengambil data." });
        }
    });

    app.get("/download/capcut", async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, message: "Isi Parameternya!" });

        try {
            const anu = await scp2.capcut(url);
            res.json({ status: true, result: anu.data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Terjadi kesalahan saat mengambil data." });
        }
    });
};
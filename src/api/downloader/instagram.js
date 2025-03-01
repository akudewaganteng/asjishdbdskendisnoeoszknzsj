const { igdl } = require("btch-downloader");

module.exports = function (app) {
    app.get("/download/igdl", async (req, res) => {
        const { url } = req.query;
        if (!url) return res.json({ error: "Isi Parameternya!" });

        try {
            const result = await igdl(url);
            res.json({ status: true, result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Gagal mengunduh video Instagram!" });
        }
    });
};
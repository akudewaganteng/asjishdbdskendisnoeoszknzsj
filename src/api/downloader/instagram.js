const { igdl } = require("btch-downloader");

module.exports = function (app) {
    app.get("/download/igdl", async (req, res) => {
        const { url } = req.query;
        if (!url) return res.json({ error: "Isi Parameternya!" });

        try {
            let result = await igdl(url);

            const removeCreator = (data) => {
                if (Array.isArray(data)) {
                    return data.map(removeCreator);
                } else if (typeof data === "object" && data !== null) {
                    if ("creator" in data) {
                        delete data.creator;
                    }
                    for (let key in data) {
                        data[key] = removeCreator(data[key]);
                    }
                }
                return data;
            };

            result = removeCreator(result);

            res.json({ status: true, result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Gagal mengunduh video Instagram!" });
        }
    });
};
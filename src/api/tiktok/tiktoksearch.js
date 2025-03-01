module.exports = function (app) {
    const axios = require("axios");
    const FormData = require("form-data");

    const ttSearch = async (query) => {
        try {
            let d = new FormData();
            d.append("keywords", query);
            d.append("count", 15);
            d.append("cursor", 0);
            d.append("web", 1);
            d.append("hd", 1);

            let h = { headers: { ...d.getHeaders() } };
            let { data } = await axios.post("https://tikwm.com/api/feed/search", d, h);

            if (!data.data || !data.data.videos) {
                throw new Error("Tidak ada hasil yang ditemukan.");
            }

            const baseURL = "https://tikwm.com";

            return data.data.videos.map(video => ({
                ...video,
                play: baseURL + video.play,
                wmplay: baseURL + video.wmplay,
                music: baseURL + video.music,
                cover: baseURL + video.cover,
                avatar: baseURL + video.avatar
            }));
        } catch (e) {
            console.error("Error in ttSearch:", e);
            return [];
        }
    }

    app.get("/search/tiktoksearch", async (req, res) => {
        try {     
            const { q } = req.query;
            if (!q) return res.status(400).json({ status: false, message: "Isi Parameternya!" });

            const result = await ttSearch(q);
            if (result.length === 0) return res.status(404).json({ status: false, message: "Tidak ada hasil." });

            res.json({ status: true, result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Terjadi kesalahan saat mengambil data." });
        }
    });
};
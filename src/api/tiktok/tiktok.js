const cheerio = require("cheerio");
const axios = require("axios");
const fetch = require("node-fetch")
const { stalk } = require("node-tiklydown")

module.exports = function (app) {
    const headers = {
        "authority": "ttsave.app",
        "accept": "application/json, text/plain, */*",
        "origin": "https://ttsave.app",
        "referer": "https://ttsave.app/en",
        "user-agent": "Postify/1.0.0",
    };

    const tiktokdl = {
        submit: async function(url, referer) {
            const headerx = { ...headers, referer };
            const data = { "query": url, "language_id": "1" };
            return axios.post('https://ttsave.app/download', data, { headers: headerx });
        },

        parse: function($) {
            const description = $('p.text-gray-600').text().trim();
            const dlink = {
                nowm: $('a.w-full.text-white.font-bold').first().attr('href'),
                audio: $('a[type="audio"]').attr('href'),
            };

            const slides = $('a[type="slide"]').map((i, el) => ({
                number: i + 1,
                url: $(el).attr('href')
            })).get();

            return { description, dlink, slides };
        },

        fetchData: async function(link) {
            try {
                const response = await this.submit(link, 'https://ttsave.app/en');
                const $ = cheerio.load(response.data);
                const result = this.parse($);
                return {
                    video_nowm: result.dlink.nowm,
                    audio_url: result.dlink.audio,
                    slides: result.slides,
                    description: result.description
                };
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    };

    app.get("/download/tiktokdl", async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, message: "Isi Parameternya!" });

        try {
            const result = await tiktokdl.fetchData(url);
            res.json({ status: true, result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Terjadi kesalahan saat mengambil data." });
        }
    });

    app.get("/tools/tiktokstalk", async (req, res) => {
        try {     
            const { user } = req.query;
            if (!user) return res.status(400).json({ status: false, message: "Isi Parameternya!" });

            const result = await stalk(user).then(res => res.data);
            if (!result) return res.status(404).json({ status: false, message: "Pengguna tidak ditemukan." });

            const value = {
                nama: result.user.nickname,
                user: result.user.uniqueId,
                bio: result.user.signature,
                privatemode: result.user.privateAccount,
                profile: result.user.avatarMedium,
                followers: result.stats.followerCount,
                following: result.stats.followingCount
            };

            res.json({ status: true, result: value });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Terjadi kesalahan saat mengambil data." });
        }
    });
};
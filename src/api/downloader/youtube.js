const { ytdlv2, ytmp3, ytmp4, search } = require("@vreden/youtube_scraper");

module.exports = function (app) {
  async function Search(q) {
    let list = await search(q);
    return list;
  }

  async function YtMp3(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await ytdlv2(url);
        resolve(res);
      } catch (e) {
        reject(e);
      }
    });
  }

  async function YtMp4(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await ytdlv2(url);
        resolve(res);
      } catch (e) {
        reject(e);
      }
    });
  }

  app.get("/download/ytmp3", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ error: "Isi Parameternya!" });

    try {
      var anu = await YtMp3(url);
      res.json({
        status: true,
        metadata: anu.details,
        download: anu.downloads,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });

  app.get("/download/ytmp4", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ error: "Isi Parameternya!" });

    try {
      var anu = await YtMp4(url);
      res.json({
        status: true,
        metadata: anu.details,
        download: anu.downloads,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching data." });
    }
  });
};

const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function (app) {
  app.get("/info/merdekanews", async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json({ status: false, message: "Isi Parameternya!" });

    try {
      const result = await merdekaNews(q);
      res.json({ status: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "An error occurred while fetching data." });
    }
  });
};

async function merdekaNews(keyword) {
  try {
    const { data } = await axios.get("https://www.merdeka.com/peristiwa/");
    const $ = cheerio.load(data);
    const newsList = [];

    $("section").each((_, section) => {
      const title = $(section).find("ins").attr("data-title") || "Tidak ada judul";
      const link = "https://www.merdeka.com" + ($(section).find("figure > a").attr("href") || "");
      const uploadDate = $(section).find("ins").attr("data-published-date") || "Tidak ada tanggal";
      const uploadTime = $(section).find("ins").attr("data-published-time") || "Tidak ada waktu";
      const thumbnail = $(section).find("figure > a > picture > img").attr("src") || "Tidak ada gambar";

      if (title !== "Tidak ada judul" && link !== "https://www.merdeka.com") {
        newsList.push({
          judul: title,
          link: link,
          upload: `${uploadDate} ${uploadTime}`,
          thumb: thumbnail
        });
      }
    });

    // Filter berita berdasarkan kata kunci judul
    const filteredNews = newsList.filter((news) => news.judul.toLowerCase().includes(keyword.toLowerCase()));

    return filteredNews;
  } catch (error) {
    throw new Error(error.message);
  }
}
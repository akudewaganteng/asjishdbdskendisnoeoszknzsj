const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function (app) {
  app.get("/info/metronews", async (req, res) => {
    const { judul } = req.query;
    if (!judul) return res.json({ status: false, message: "Isi Parameternya!" });

    try {
      const result = await metroNews(judul);
      res.json({ status: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "An error occurred while fetching data." });
    }
  });
};

async function metroNews(judul) {
  try {
    const { data } = await axios.get("https://www.metrotvnews.com/news");
    const $ = cheerio.load(data);
    const newsList = [];

    $("body > div.container.layout > section.content > div > div.item-list.pt-20 > div").each((_, element) => {
      const title = $(element).find("div > h3 > a").attr("title") || "Tidak ada judul";
      const link = "https://www.metrotvnews.com" + ($(element).find("div > h3 > a").attr("href") || "");
      const waktu = $(element).find("div > span").text().trim() || "Tidak ada waktu";
      const thumbnail = ($(element).find("img").attr("src") || "").replace("w=300", "w=720") || "Tidak ada gambar";

      if (title !== "Tidak ada judul" && link !== "https://www.metrotvnews.com") {
        newsList.push({ judul: title, link, thumb: thumbnail, waktu });
      }
    });

    // Filter berita berdasarkan judul jika ada parameter
    const filteredNews = newsList.filter(news => news.judul.toLowerCase().includes(judul.toLowerCase()));

    return filteredNews.length > 0
      ? { status: true, result: filteredNews }
      : { status: false, message: "Berita tidak ditemukan." };
  } catch (error) {
    return {
      status: false,
      message: error.message
    };
  }
}
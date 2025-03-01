const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function (app) {
  app.get("/info/gempa", async (req, res) => {
    try {
      const result = await infoGempa();
      res.json({ status: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "An error occurred while fetching data." });
    }
  });
};

async function infoGempa() {
  try {
    const { data } = await axios.get("https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg");
    const $ = cheerio.load(data);
    const gempaList = [];

    $("table.table-hover.table-striped > tbody > tr").each((_, row) => {
      const cells = $(row).find("td");

      const koordinat = cells.eq(2).text().split(" ");
      const lintang = `${koordinat[0]} ${koordinat[1]}`;
      const bujur = `${koordinat[2]} ${koordinat[3]}`;

      const wilayahDirasakan = cells.eq(5).find("span.label-warning")
        .map((_, el) => $(el).text().trim())
        .get()
        .join(", ");

      const imgMapId = cells.eq(5).find("a").attr("data-target")?.replace(/#/g, "") || "";
      const imgMap = `https://ews.bmkg.go.id/TEWS/data/${imgMapId}.mmi.jpg`;

      gempaList.push({
        index: cells.eq(0).text().trim(),
        waktu: cells.eq(1).html().replace(/<br>/g, " ").trim(),
        lintang,
        bujur,
        magnitudo: cells.eq(3).text().trim(),
        kedalaman: cells.eq(4).text().trim(),
        wilayah: cells.eq(5).find("a").text().trim(),
        wilayah_dirasakan: wilayahDirasakan || "Tidak ada data",
        img_map: imgMap,
        google_map: `https://www.google.com/maps/place/${koordinat[0]}%C2%B0S+${koordinat[2]}%C2%B0E`
      });
    });

    return gempaList;
  } catch (error) {
    throw new Error(error.message);
  }
}
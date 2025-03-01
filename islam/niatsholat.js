const axios = require("axios");

module.exports = function (app) {
  app.get("/muslim/niatshalat", async (req, res) => {
    const { shalat } = req.query;
    if (!shalat) return res.json({ status: false, message: "Isi Parameternya!" });

    try {
      const result = await niatShalat(shalat);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "An error occurred while fetching data." });
    }
  });
};

async function niatShalat(shalat) {
  try {
    const { data } = await axios.get("https://raw.githubusercontent.com/erhabot/data-api/main/niatShalat.json");

    if (!data?.result?.data) {
      return { status: false, message: "Data tidak ditemukan!" };
    }

    const niatList = {
      subuh: data.result.data[0],
      dzuhur: data.result.data[1],
      ashar: data.result.data[2],
      maghrib: data.result.data[3],
      isya: data.result.data[4]
    };

    const result = niatList[shalat.toLowerCase()];
    return result ? { status: true, result } : { status: false, message: "Niat shalat tidak ditemukan!" };
  } catch (error) {
    return { status: false, message: error.message };
  }
}
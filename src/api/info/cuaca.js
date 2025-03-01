const axios = require("axios");

module.exports = function (app) {
  app.get("/info/cuaca", async (req, res) => {
    const { kota } = req.query;
    if (!kota) return res.json({ status: false, message: "Isi Parameternya!" });

    try {
      const result = await cuaca(kota);
      res.json({ status: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "An error occurred while fetching data." });
    }
  });
};

async function cuaca(kota) {
  try {
    const apiKey = "ead5170b0b09738f04ba75f735e89e42";
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${kota.toLowerCase()}&units=metric&appid=${apiKey}`;
    
    const response = await axios.get(url);
    const data = response.data;

    return {
      Location: `${data.name}, ${data.sys.country}`,
      Longitude: data.coord.lon,
      Latitude: data.coord.lat,
      Suhu: `${data.main.temp} C`,
      Angin: `${data.wind.speed} m/s`,
      Kelembaban: `${data.main.humidity}%`,
      Cuaca: data.weather[0].main,
      Keterangan: data.weather[0].description,
      Udara: `${data.main.pressure} HPa`
    };
  } catch (error) {
    throw error;
  }
}
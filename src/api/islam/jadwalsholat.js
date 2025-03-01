const axios = require("axios");
const moment = require("moment-timezone");

module.exports = function (app) {
  app.get("/muslim/jadwalshalat", async (req, res) => {
    const { kota } = req.query;
    if (!kota) return res.json({ status: false, message: "Isi Parameternya!" });

    try {
      const result = await jadwalShalat(kota);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message || "An error occurred while fetching data." });
    }
  });
};

async function jadwalShalat(kota) {
  try {
    const kotaId = await getIdByLocation(kota);
    if (!kotaId) return { status: false, message: "Kota tidak ditemukan!" };

    const tanggal = moment().tz("Asia/Jakarta").format("YYYY/MM/DD");
    const { data } = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${kotaId}/${tanggal}`);

    if (!data || !data.data || !data.data.jadwal) {
      return { status: false, message: "Jadwal shalat tidak ditemukan untuk kota ini." };
    }

    const { id, lokasi, daerah, jadwal } = data.data;

    return {
      status: true,
      result: {
        id,
        lokasi,
        daerah,
        jadwal: {
          tanggal: jadwal.tanggal,
          imsak: jadwal.imsak,
          subuh: jadwal.subuh,
          terbit: jadwal.terbit,
          dhuha: jadwal.dhuha,
          dzuhur: jadwal.dzuhur,
          ashar: jadwal.ashar,
          maghrib: jadwal.maghrib,
          isya: jadwal.isya
        }
      }
    };
  } catch (error) {
    return { status: false, message: error.message || "Terjadi kesalahan saat mengambil data." };
  }
}

async function getIdByLocation(kota) {
  try {
    const { data } = await axios.get("https://api.myquran.com/v2/sholat/kota/semua");

    if (!data || !data.data) {
      throw new Error("Data kota tidak ditemukan!");
    }

    const kotaData = data.data.find((item) => item.lokasi.toLowerCase() === kota.toLowerCase());
    return kotaData ? kotaData.id : null;
  } catch (error) {
    throw new Error("Gagal mendapatkan ID kota! Pastikan API tersedia.");
  }
}
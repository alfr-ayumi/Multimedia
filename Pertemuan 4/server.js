const express = require("express");
const app = express();

app.use(express.json());

const mahasiswa = [
  { nim: "001", nama: "Mingyu", jurusan: "TeknikInformatika" },
  { nim: "002", nama: "Ayumi", jurusan: "Sistem Informasi" },
  { nim: "003", nama: "Coups", jurusan: "Bisnis" }
];

// GET semua mahasiswa
app.get("/mahasiswa", (req, res) => {
  res.json(mahasiswa);
});

// GET berdasarkan nim
app.get("/mahasiswa/:nim", (req, res) => {
  const data = mahasiswa.find(m => m.nim === req.params.nim);

  if (!data) {
    return res.json({ message: "Mahasiswa tidak ditemukan" });
  }

  res.json(data);
});

// POST tambah mahasiswa
app.post("/mahasiswa", (req, res) => {
  const { nama, nim } = req.body;

  mahasiswa.push({ nama, nim, jurusan: "Belum diisi" });

  res.json({
    message: `Berhasil menambahkan mahasiswa baru bernama ${nama}`
  });
});

// jalankan server
app.listen(8080, () => {
  console.log("Server jalan di http://localhost:8080");
});
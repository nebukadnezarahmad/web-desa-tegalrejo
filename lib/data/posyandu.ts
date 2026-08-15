export type Posyandu = {
  nama: string;
  dusun: string;
  melayani: string;
  hari: string;
  waktu: string;
  alamat: string;
  kader: string;
  balita: number;
};

export const posyandu: Posyandu[] = [
  {
    nama: "Posyandu Melati",
    dusun: "Krajan",
    melayani: "RT 01 – RT 03",
    hari: "Selasa kedua tiap bulan",
    waktu: "08.00 – 11.00 WIB",
    alamat: "Balai RT 02, Jl. Krajan Tengah",
    kader: "Sri Wahyuni",
    balita: 62,
  },
  {
    nama: "Posyandu Anggrek",
    dusun: "Jumprit",
    melayani: "RT 04 – RT 05",
    hari: "Rabu kedua tiap bulan",
    waktu: "08.00 – 11.00 WIB",
    alamat: "Serambi Musala Al-Hidayah, RT 04",
    kader: "Nur Hidayah",
    balita: 48,
  },
  {
    nama: "Posyandu Mawar",
    dusun: "Jumprit",
    melayani: "RT 06",
    hari: "Kamis kedua tiap bulan",
    waktu: "08.00 – 10.30 WIB",
    alamat: "Rumah Kader, RT 06 No. 14",
    kader: "Yuliana Dewi",
    balita: 35,
  },
  {
    nama: "Posyandu Dahlia",
    dusun: "Tegalsari",
    melayani: "RT 07 – RT 08",
    hari: "Selasa ketiga tiap bulan",
    waktu: "08.00 – 11.00 WIB",
    alamat: "Gedung PKK Tegalsari",
    kader: "Retno Palupi",
    balita: 51,
  },
  {
    nama: "Posyandu Kenanga",
    dusun: "Tegalsari",
    melayani: "RT 09 – RT 10",
    hari: "Rabu ketiga tiap bulan",
    waktu: "07.30 – 11.00 WIB",
    alamat: "Balai Dusun Tegalsari",
    kader: "Titik Suryani",
    balita: 57,
  },
  {
    nama: "Posyandu Seruni",
    dusun: "Banjaran",
    melayani: "RT 11 – RT 12",
    hari: "Kamis ketiga tiap bulan",
    waktu: "07.30 – 11.00 WIB",
    alamat: "Balai Dusun Banjaran",
    kader: "Umi Kalsum",
    balita: 66,
  },
];

export type ProgramKesehatan = {
  judul: string;
  deskripsi: string;
  sasaran: string;
  jadwal: string;
};

export const programKesehatan: ProgramKesehatan[] = [
  {
    judul: "Pemberian Makanan Tambahan Balita",
    deskripsi:
      "Bubur kacang hijau, telur rebus, dan susu diberikan pada setiap sesi posyandu untuk balita dengan berat badan di bawah standar.",
    sasaran: "Balita dengan hasil penimbangan di bawah garis merah",
    jadwal: "Setiap sesi posyandu",
  },
  {
    judul: "Kelas Ibu Hamil",
    deskripsi:
      "Pendampingan gizi kehamilan, senam hamil, dan persiapan persalinan bersama bidan desa. Termasuk pemantauan tekanan darah dan lingkar lengan atas.",
    sasaran: "Ibu hamil seluruh dusun",
    jadwal: "Jumat pertama tiap bulan, 14.00 WIB",
  },
  {
    judul: "Pemeriksaan Lansia Terpadu",
    deskripsi:
      "Pemeriksaan tekanan darah, gula darah sewaktu, dan asam urat, disertai konsultasi obat rutin bersama petugas puskesmas pembantu.",
    sasaran: "Warga usia 60 tahun ke atas",
    jadwal: "Rabu keempat tiap bulan",
  },
  {
    judul: "Pemberian Obat Cacing dan Vitamin A",
    deskripsi:
      "Pemberian obat cacing untuk anak usia 1–12 tahun dan kapsul vitamin A untuk balita, dilakukan serentak di seluruh posyandu.",
    sasaran: "Anak usia 1–12 tahun",
    jadwal: "Februari dan Agustus",
  },
];

/** Riwayat pengukuran contoh untuk grafik pertumbuhan. */
export const contohPertumbuhan = [
  { umur: 0, tinggi: 49.5 },
  { umur: 6, tinggi: 66.2 },
  { umur: 12, tinggi: 73.4 },
  { umur: 18, tinggi: 79.1 },
  { umur: 24, tinggi: 83.2 },
  { umur: 30, tinggi: 87.4 },
  { umur: 36, tinggi: 91.6 },
];

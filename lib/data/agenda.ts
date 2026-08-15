export type Agenda = {
  judul: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  penyelenggara: string;
  jenis: "Musyawarah" | "Kesehatan" | "Gotong royong" | "Pelatihan" | "Budaya";
};

export const agenda: Agenda[] = [
  {
    judul: "Posyandu Balita Dusun Krajan",
    tanggal: "2026-08-11",
    waktu: "08.00 – 11.00 WIB",
    lokasi: "Pos Pelayanan Terpadu Melati, RT 02",
    penyelenggara: "Bidan Desa & Kader Posyandu",
    jenis: "Kesehatan",
  },
  {
    judul: "Musyawarah Perencanaan Pembangunan Desa",
    tanggal: "2026-08-14",
    waktu: "19.30 – 22.00 WIB",
    lokasi: "Aula Balai Desa Tegalrejo",
    penyelenggara: "Badan Permusyawaratan Desa",
    jenis: "Musyawarah",
  },
  {
    judul: "Pelatihan Pengemasan dan Foto Produk UMKM",
    tanggal: "2026-08-19",
    waktu: "08.30 – 15.00 WIB",
    lokasi: "Aula Balai Desa Tegalrejo",
    penyelenggara: "Seksi Pemberdayaan Masyarakat",
    jenis: "Pelatihan",
  },
  {
    judul: "Kerja Bakti Normalisasi Saluran Irigasi",
    tanggal: "2026-08-23",
    waktu: "06.30 – 10.00 WIB",
    lokasi: "Seluruh dusun, titik kumpul pos ronda RT",
    penyelenggara: "Pemerintah Desa",
    jenis: "Gotong royong",
  },
  {
    judul: "Pemeriksaan Kesehatan Lansia Terpadu",
    tanggal: "2026-08-26",
    waktu: "07.30 – 11.00 WIB",
    lokasi: "Pos Pelayanan Terpadu Kenanga, RT 09",
    penyelenggara: "Puskesmas Pembantu Watubelah",
    jenis: "Kesehatan",
  },
  {
    judul: "Pentas Seni dan Pasar Rakyat Kemerdekaan",
    tanggal: "2026-08-30",
    waktu: "15.00 – 22.00 WIB",
    lokasi: "Lapangan Desa Tegalrejo",
    penyelenggara: "Karang Taruna Tegalrejo",
    jenis: "Budaya",
  },
];

export const agendaMendatang = [...agenda].sort((a, b) =>
  a.tanggal.localeCompare(b.tanggal),
);

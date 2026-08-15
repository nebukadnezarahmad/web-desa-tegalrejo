export type KategoriPengumuman =
  | "Administrasi"
  | "Kesehatan"
  | "Lingkungan"
  | "Ekonomi"
  | "Kegiatan";

export type Pengumuman = {
  slug: string;
  judul: string;
  ringkasan: string;
  isi: string[];
  kategori: KategoriPengumuman;
  tanggal: string;
  penerbit: string;
  penting?: boolean;
};

export const pengumuman: Pengumuman[] = [
  {
    slug: "pemutakhiran-data-kk-2026",
    judul: "Pemutakhiran Data Kartu Keluarga Tahap II",
    ringkasan:
      "Warga yang mengalami perubahan anggota keluarga pada 2025–2026 diminta memperbarui data di balai desa sebelum 30 September 2026.",
    isi: [
      "Pemerintah Desa Tegalrejo membuka pemutakhiran data Kartu Keluarga tahap II mulai 10 Agustus hingga 30 September 2026. Hal ini dilakukan untuk keluarga yang mengalami perubahan susunan anggota sepanjang 2025 sampai 2026, baik karena kelahiran, kematian, perkawinan, hingga perpindahan tempat tinggal.",
      "Data tersebut digunakan untuk menentukan ketepatan penyaluran bantuan sosial, penentuan sasaran program kesehatan, dan perhitungan kebutuhan layanan tiap dusun. Pembaruan data dilakukan untuk melihat selisih data yang membuat sejumlah keluarga terlewat dari program yang seharusnya mereka terima.",
      "Warga cukup membawa Kartu Keluarga asli, KTP kepala keluarga, dan dokumen pendukung perubahan seperti akta kelahiran, akta kematian, buku nikah, atau surat pindah. Petugas melayani di ruang pelayanan balai desa pada hari kerja pukul 08.00 sampai 15.00 WIB.",
      "Bagi warga yang mengalami kendala atau lanjut usia, dapat mengajukan layanan jemput berkas pada kader RT.",
    ],
    kategori: "Administrasi",
    tanggal: "2026-08-04",
    penerbit: "Sekretariat Desa",
    penting: true,
  },
  {
    slug: "jadwal-posyandu-agustus",
    judul: "Jadwal Posyandu Balita dan Lansia",
    ringkasan:
      "Enam posyandu sedang beroperasi secara bergilir pada bulan Agustus.",
    isi: [
      "Seluruh posyandu di desa kembali beroperasi pada bulan Agustus 2026 dengan jadwal bergilir yang sudah ditentukan. Setiap sesi mencakup penimbangan, pengukuran tinggi badan, pemeriksaan tekanan darah untuk lansia, serta konsultasi gizi.",
    ],
    kategori: "Kesehatan",
    tanggal: "2026-07-30",
    penerbit: "Bidan Desa & Kader Posyandu",
  },
  {
    slug: "perubahan-jadwal-angkut-sampah",
    judul: "Perubahan Jadwal Angkut Sampah Dusun Banjaran",
    ringkasan:
      "Dimulai 11 Agustus 2026, pengangkutan sampah RT 11 dan RT 12 bergeser dari hari Rabu ke Selasa dan Jumat.",
    isi: [
      "Dikarenakan ada penambahan satu armada pengangkut sampah, jadwal untuk RT 11 dan RT 12 Dusun Banjaran bergeser dari seminggu sekali menjadi seminggu dua kali pada hari Selasa dan Jumat, dimulai 11 Agustus 2026.",
      "Dimohon untuk warga menempatkan sampah yang sudah terpilah di titik kumpul sebelum pukul 06.30 WIB.",
    ],
    kategori: "Lingkungan",
    tanggal: "2026-08-02",
    penerbit: "Seksi Kesejahteraan",
    penting: true,
  },
  {
    slug: "pelatihan-pengemasan-produk-umkm",
    judul: "Pelatihan Pengemasan dan Foto Produk untuk Pelaku UMKM",
    ringkasan:
      "Pelatihan gratis dua hari untuk warga yang ingin membuka lapak usaha. Membahas desain kemasan, label, dan pemotretan produk.",
    isi: [
      "Pemerintah desa bekerja sama dengan pendamping UMKM kecamatan untuk menyelenggarakan pelatihan membangun lapak usaha pada 19–20 Agustus 2026 di aula balai desa. Pelatihan bersifat terbuka dan tidak dipungut biaya.",
      "Materi mencakup pemilihan bahan kemasan yang sesuai jenis produk, penyusunan informasi wajib pada label, pembuatan komposisi foto sederhana menggunakan cahaya alami, serta penulisan deskripsi produk yang jelas untuk lapak daring.",
    ],
    kategori: "Ekonomi",
    tanggal: "2026-07-28",
    penerbit: "Seksi Pemberdayaan Masyarakat",
  },
  {
    slug: "kerja-bakti-normalisasi-saluran",
    judul: "Kerja Bakti Membersihkan Saluran Irigasi Sebelum Musim Hujan Tiba",
    ringkasan:
      "Seluruh dusun dijadwalkan gotong royong membersihkan saluran irigasi pada Minggu, 23 Agustus 2026.",
    isi: [
      "Sebelum musim hujan tiba, pemerintah desa mengajak seluruh warga untuk bergotong royong membersihkan saluran irigasi pada Minggu, 23 Agustus 2026, dimulai pukul 06.30 WIB. Titik kumpul sesuai pos ronda masing-masing RT.",
      "Kegiatan ini ditekankan bagi dusun yang sering mengalami banjir akibat tumpukan sampah dan endapan lumpur pada saluran irigasi yang tidak pernah dibersihkan.",
      "Warga diminta untuk membawa peralatan seperti cangkul, sabit, dan karung. Konsumsi disediakan oleh kelompok PKK masing-masing dusun.",
    ],
    kategori: "Kegiatan",
    tanggal: "2026-08-05",
    penerbit: "Kepala Desa",
  },
  {
    slug: "bantuan-bibit-tanaman-pekarangan",
    judul: "Pembagian Bibit Tanaman untuk Pekarangan Rumah",
    ringkasan:
      "Setiap kepala keluarga berhak menerima lima bibit tanaman selama persediaan masih ada.",
    isi: [
      "Program pemanfaatan pekarangan kembali berjalan. Setiap kepala keluarga berhak mengambil lima bibit tanaman dan dapat memilih jenis bibit sesuai keinginan selama persediaan masih ada.",
      "Pengambilan dilayani di gudang belakang balai desa setiap Selasa dan Kamis pukul 08.00 sampai 12.00 WIB selama bulan Agustus atau sampai persediaan habis.",
    ],
    kategori: "Lingkungan",
    tanggal: "2026-07-24",
    penerbit: "Seksi Kesejahteraan",
  },
];

export const kategoriPengumuman: KategoriPengumuman[] = [
  "Administrasi",
  "Kesehatan",
  "Lingkungan",
  "Ekonomi",
  "Kegiatan",
];

export function ambilPengumuman(slug: string) {
  return pengumuman.find((p) => p.slug === slug);
}

export const pengumumanTerbaru = [...pengumuman]
  .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
  .slice(0, 3);

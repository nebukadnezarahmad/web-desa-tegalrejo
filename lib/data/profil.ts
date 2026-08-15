export type Perangkat = {
  nama: string;
  jabatan: string;
  wilayah?: string;
  sejak: string;
};

export const perangkatDesa: Perangkat[] = [
  { nama: "Hartono Wijaya", jabatan: "Kepala Desa", sejak: "2022" },
  { nama: "Dwi Astuti", jabatan: "Sekretaris Desa", sejak: "2019" },
  { nama: "Rusdianto", jabatan: "Kepala Urusan Keuangan", sejak: "2020" },
  { nama: "Lestari Handayani", jabatan: "Kepala Urusan Umum", sejak: "2021" },
  { nama: "Joko Purnomo", jabatan: "Kepala Seksi Pemerintahan", sejak: "2018" },
  { nama: "Ratna Kusuma", jabatan: "Kepala Seksi Kesejahteraan", sejak: "2022" },
  {
    nama: "Adi Nugroho",
    jabatan: "Kepala Seksi Pelayanan",
    sejak: "2023",
  },
  { nama: "Suparjo", jabatan: "Kepala Dusun", wilayah: "Krajan", sejak: "2017" },
  {
    nama: "Wahyudi",
    jabatan: "Kepala Dusun",
    wilayah: "Jumprit",
    sejak: "2020",
  },
  {
    nama: "Siti Aminah",
    jabatan: "Kepala Dusun",
    wilayah: "Tegalsari",
    sejak: "2021",
  },
  {
    nama: "Darmawan",
    jabatan: "Kepala Dusun",
    wilayah: "Tegalsari",
    sejak: "2019",
  },
  {
    nama: "Nurhasan",
    jabatan: "Kepala Dusun",
    wilayah: "Banjaran",
    sejak: "2022",
  },
];

export type Layanan = {
  nama: string;
  keterangan: string;
  syarat: string[];
  alur: string[];
  estimasi: string;
  biaya: string;
};

export const layananAdministrasi: Layanan[] = [
  {
    nama: "Surat Pengantar KTP Elektronik",
    keterangan:
      "Diperlukan untuk perekaman KTP pertama kali maupun penggantian karena hilang, rusak, atau perubahan data.",
    syarat: [
      "Kartu Keluarga asli dan satu lembar fotokopi",
      "Surat kehilangan dari kepolisian bila KTP hilang",
      "KTP lama bila mengganti karena rusak atau ubah data",
      "Akta kelahiran bagi pemohon baru",
    ],
    alur: [
      "Datang ke loket pelayanan balai desa pada hari kerja",
      "Serahkan berkas kepada petugas untuk diperiksa kelengkapannya",
      "Petugas menerbitkan surat pengantar dan meminta tanda tangan kepala desa",
      "Bawa surat pengantar ke kantor kecamatan untuk perekaman",
    ],
    estimasi: "Selesai hari yang sama, sekitar 30 menit",
    biaya: "Tidak dipungut biaya",
  },
  {
    nama: "Surat Keterangan Domisili",
    keterangan:
      "Menerangkan tempat tinggal warga, umumnya diminta untuk keperluan sekolah, pekerjaan, atau pengajuan kredit.",
    syarat: [
      "Kartu Keluarga asli dan satu lembar fotokopi",
      "KTP pemohon asli dan satu lembar fotokopi",
      "Surat pengantar dari ketua RT dan ketua RW",
    ],
    alur: [
      "Minta surat pengantar kepada ketua RT, lalu mintakan tanda tangan ketua RW",
      "Bawa berkas ke loket pelayanan balai desa",
      "Petugas mencetak surat keterangan dan meminta tanda tangan kepala desa",
      "Ambil surat setelah dibubuhi stempel desa",
    ],
    estimasi: "Selesai hari yang sama, sekitar 20 menit",
    biaya: "Tidak dipungut biaya",
  },
  {
    nama: "Surat Keterangan Tidak Mampu",
    keterangan:
      "Digunakan untuk pengajuan keringanan biaya sekolah, layanan kesehatan, atau bantuan sosial.",
    syarat: [
      "Kartu Keluarga asli dan satu lembar fotokopi",
      "KTP pemohon asli dan satu lembar fotokopi",
      "Surat pengantar dari ketua RT dan ketua RW",
      "Keterangan penggunaan surat, misalnya dari pihak sekolah atau rumah sakit",
    ],
    alur: [
      "Ajukan surat pengantar ke ketua RT dan ketua RW",
      "Serahkan berkas ke loket pelayanan balai desa",
      "Petugas memverifikasi kondisi ekonomi berdasarkan data desa dan keterangan kepala dusun",
      "Surat diterbitkan setelah ditandatangani kepala desa",
    ],
    estimasi: "Satu sampai dua hari kerja",
    biaya: "Tidak dipungut biaya",
  },
  {
    nama: "Surat Keterangan Usaha",
    keterangan:
      "Menerangkan bahwa warga menjalankan usaha di wilayah desa. Diperlukan untuk pengajuan izin usaha mikro, pinjaman modal, atau pendaftaran lapak UMKM desa.",
    syarat: [
      "Kartu Keluarga dan KTP pemilik usaha",
      "Surat pengantar dari ketua RT dan ketua RW",
      "Foto tempat usaha",
      "Keterangan jenis usaha dan lama menjalankan",
    ],
    alur: [
      "Ajukan surat pengantar ke ketua RT dan ketua RW",
      "Serahkan berkas ke loket pelayanan balai desa",
      "Petugas melakukan pengecekan lapangan bila usaha belum terdata",
      "Surat diterbitkan dan usaha didaftarkan pada basis data UMKM desa",
    ],
    estimasi: "Dua sampai tiga hari kerja",
    biaya: "Tidak dipungut biaya",
  },
  {
    nama: "Surat Pengantar Nikah",
    keterangan:
      "Berkas awal sebelum pendaftaran pernikahan di Kantor Urusan Agama kecamatan.",
    syarat: [
      "Kartu Keluarga dan KTP calon pengantin",
      "Akta kelahiran calon pengantin",
      "Surat pengantar dari ketua RT dan ketua RW",
      "Pas foto berlatar biru ukuran 2x3 sebanyak empat lembar",
      "Akta cerai atau surat kematian pasangan bila pernah menikah",
    ],
    alur: [
      "Lengkapi berkas dan minta surat pengantar dari ketua RT dan ketua RW",
      "Serahkan berkas ke loket pelayanan balai desa",
      "Petugas menerbitkan formulir N1 sampai N4 sesuai kebutuhan",
      "Bawa berkas ke Kantor Urusan Agama kecamatan",
    ],
    estimasi: "Satu hari kerja",
    biaya: "Tidak dipungut biaya",
  },
  {
    nama: "Surat Keterangan Kelahiran",
    keterangan:
      "Dasar penerbitan akta kelahiran di dinas kependudukan kabupaten.",
    syarat: [
      "Surat keterangan lahir dari bidan, puskesmas, atau rumah sakit",
      "Kartu Keluarga dan KTP kedua orang tua",
      "Buku nikah atau akta perkawinan orang tua",
      "Nama dan data dua orang saksi",
    ],
    alur: [
      "Ambil surat keterangan lahir dari penolong persalinan",
      "Serahkan berkas ke loket pelayanan balai desa",
      "Petugas menerbitkan surat keterangan kelahiran desa",
      "Lanjutkan pengurusan akta ke dinas kependudukan kabupaten",
    ],
    estimasi: "Selesai hari yang sama",
    biaya: "Tidak dipungut biaya",
  },
];

export const visiMisi = {
  visi: "Terwujudnya Desa Tegalrejo yang mandiri secara ekonomi, sehat warganya, dan lestari lingkungannya.",
  misi: [
    "Menguatkan usaha mikro warga melalui pendampingan, pelatihan, dan pembukaan akses pemasaran.",
    "Menurunkan angka perawakan pendek pada balita lewat pemantauan pertumbuhan yang tertib di seluruh posyandu.",
    "Menata pengelolaan sampah dari tingkat rumah tangga hingga bank sampah desa.",
    "Menyelenggarakan pelayanan administrasi yang jelas syaratnya, pasti waktunya, dan tanpa pungutan.",
    "Merawat kebiasaan bermusyawarah dan bergotong royong sebagai cara desa mengambil keputusan.",
  ],
};

export const sejarahDesa = [
  "Desa Tegalrejo berada di lereng Gunung Sindoro, pada ketinggian sekitar 1.300 meter di atas permukaan laut. Namanya berasal dari bahasa Jawa, tegal dan rejo, yang berarti ladang yang ramai, gambaran wilayah yang sejak lama hidup dari mengolah tanah.",
  "Wilayahnya seluas 891 hektar dan terbagi dalam empat dusun: Krajan, Banjaran, Jumprit, dan Tegalsari. Hanya sekitar 20 hektar berupa sawah; sisanya tegalan dan kebun yang mengikuti kontur lereng.",
  "Di wilayah desa terdapat Umbul Jumprit, mata air di kaki Gunung Sindoro yang menjadi hulu Sungai Progo dan tidak pernah kering meski kemarau panjang. Setiap tahun airnya diambil untuk prosesi menjelang Waisak, lalu dikirim ke Candi Mendut dan Borobudur.",
  "Seperti umumnya desa di lereng Sindoro, tembakau, kopi, dan sayuran dataran tinggi menjadi tumpuan utama warga. Sejak awal 2010-an, kelompok perempuan desa mulai mengolah hasil kebun menjadi produk kemasan, yang tumbuh menjadi puluhan usaha mikro yang kini terdaftar di lapak UMKM desa.",
];

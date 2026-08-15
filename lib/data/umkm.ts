export type KategoriUmkm = "Makanan" | "Kerajinan" | "Pertanian" | "Jasa";

export type Produk = {
  slug: string;
  nama: string;
  kategori: KategoriUmkm;
  harga: number;
  satuan: string;
  deskripsi: string;
  detail: string[];
  pemilik: string;
  usaha: string;
  rt: string;
  dusun: string;
  whatsapp: string;
  unggulan?: boolean;
  /**
   * Nama berkas di public/foto. Kosongkan bila belum ada foto yang benar-benar
   * menggambarkan produknya. ProdukThumb akan memakai ilustrasi kategori.
   * Lebih baik ilustrasi daripada foto yang salah barang.
   */
  foto?: string;
};

export const produkUmkm: Produk[] = [
  {
    slug: "keripik-tempe-bu-marni",
    foto: "keripik-tempe.jpg",
    nama: "Keripik Tempe Rempah",
    kategori: "Makanan",
    harga: 18000,
    satuan: "bungkus 250 g",
    deskripsi:
      "Keripik tempe renyah, bumbu ketumbar dan daun jeruk. Tanpa pengawet.",
    detail: [
      "Dibuat dari tempe kedelai yang difermentasi sendiri selama dua hari, lalu diiris tipis dan dibalut adonan tepung beras berbumbu ketumbar, bawang putih, dan daun jeruk.",
      "Digoreng dua kali agar kadar minyak berkurang dan tekstur tetap renyah sampai dua minggu setelah pengemasan.",
      "Tersedia varian original dan pedas. Pemesanan di atas 20 bungkus dilayani dengan pemberitahuan dua hari sebelumnya.",
    ],
    pemilik: "Marni Suryati",
    usaha: "Dapur Tempe Krajan",
    rt: "RT 02",
    dusun: "Krajan",
    whatsapp: "081234567801",
    unggulan: true,
  },
  {
    slug: "gula-semut-aren",
    foto: "gula-semut-aren.jpg",
    nama: "Gula Semut Aren Murni",
    kategori: "Makanan",
    harga: 32000,
    satuan: "toples 500 g",
    deskripsi:
      "Gula aren kristal murni, disadap sendiri dari pohon aren di lereng timur desa, tanpa campuran gula pasir sama sekali. Warna dan aromanya asli dari nira.",
    detail: [
      "Nira aren disadap setiap pagi dan sore, lalu dimasak hari itu juga tanpa jeda agar tidak berubah asam. Proses pengkristalan dilakukan manual dengan pengadukan tangan.",
      "Tidak menggunakan campuran gula pasir maupun pemutih. Warna cokelat pekat dan aroma karamel yang kuat berasal murni dari nira.",
      "Cocok untuk minuman, kue, maupun campuran jamu. Simpan di wadah tertutup pada suhu ruang.",
    ],
    pemilik: "Sukirno",
    usaha: "Aren Lestari",
    rt: "RT 11",
    dusun: "Banjaran",
    whatsapp: "081234567802",
    unggulan: true,
  },
  {
    slug: "anyaman-bambu-serbaguna",
    foto: "anyaman-bambu.jpg",
    nama: "Anyaman Bambu Serbaguna",
    kategori: "Kerajinan",
    harga: 65000,
    satuan: "buah",
    deskripsi: "Keranjang bambu, tiga ukuran.",
    detail: [
      "Menggunakan bambu apus berumur tiga tahun yang direndam dua minggu agar tahan rayap, kemudian dijemur dan dianyam tangan dengan pola anyaman rapat.",
      "Tersedia ukuran kecil, sedang, dan besar. Bagian bibir keranjang diperkuat rotan agar tidak mudah melengkung saat dipakai membawa beban.",
      "Dapat dipesan dengan pewarnaan alami dari kulit jengkol atau tanpa pewarna sama sekali.",
    ],
    pemilik: "Warsito",
    usaha: "Bambu Jumprit",
    rt: "RT 05",
    dusun: "Jumprit",
    whatsapp: "081234567803",
  },
  {
    slug: "batik-tulis-motif-padi",
    foto: "batik-tulis-padi.jpg",
    nama: "Batik Tulis Motif Padi Tegalrejo",
    kategori: "Kerajinan",
    harga: 285000,
    satuan: "lembar 2 m",
    deskripsi:
      "Batik tulis motif bulir padi dan garis kontur sawah, dikerjakan penuh dengan canting tangan oleh kelompok perajin ibu-ibu desa, bukan cap dan bukan printing. Satu lembar butuh sekitar sepuluh hari kerja.",
    detail: [
      "Motif dikembangkan kelompok perajin desa dengan mengambil bentuk bulir padi dan garis kontur persawahan sebagai penanda identitas Tegalrejo.",
      "Seluruh proses dikerjakan dengan canting tangan di atas kain katun primisima, membutuhkan waktu sekitar sepuluh hari per lembar.",
      "Pewarnaan menggunakan kombinasi pewarna alam dari kulit mahoni dan indigo. Setiap lembar memiliki perbedaan kecil karena dikerjakan manual.",
    ],
    pemilik: "Siti Rahayu",
    usaha: "Batik Sekar Tani",
    rt: "RT 04",
    dusun: "Jumprit",
    whatsapp: "081234567804",
    unggulan: true,
  },
  {
    slug: "beras-merah-organik",
    foto: "beras-merah.jpg",
    nama: "Beras Merah Organik",
    kategori: "Pertanian",
    harga: 24000,
    satuan: "kg",
    deskripsi: "Beras merah, tanpa pupuk kimia sejak 2021.",
    detail: [
      "Ditanam di lahan seluas dua hektar di Dusun Tegalsari yang telah dikelola tanpa pupuk dan pestisida kimia selama lima musim tanam berturut-turut.",
      "Penggilingan dilakukan setelah ada pesanan agar kandungan minyak pada lapisan bekatul tidak cepat tengik.",
      "Tekstur lebih pera dibanding beras putih, membutuhkan air lebih banyak dan waktu tanak sekitar sepuluh menit lebih lama.",
    ],
    pemilik: "Slamet Widodo",
    usaha: "Tani Makmur Tegalsari",
    rt: "RT 09",
    dusun: "Tegalsari",
    whatsapp: "081234567805",
  },
  {
    slug: "madu-hutan-klanceng",
    foto: "madu-klanceng.jpg",
    nama: "Madu Klanceng Hutan",
    kategori: "Pertanian",
    harga: 145000,
    satuan: "botol 250 ml",
    deskripsi:
      "Madu klanceng dari kebun campur, rasa asam manis khas, dipanen tanpa merusak sarang.",
    detail: [
      "Dipanen dari koloni lebah tanpa sengat jenis klanceng yang dibudidayakan di kebun campur berisi kelapa, kopi, dan tanaman berbunga liar.",
      "Panen dilakukan tiga hingga empat bulan sekali dengan menyedot langsung dari kantong madu, tanpa pemerasan sarang, sehingga koloni tetap utuh.",
      "Rasa cenderung asam manis dengan tekstur lebih encer dibanding madu lebah biasa. Simpan di tempat sejuk dan hindari sinar matahari langsung.",
    ],
    pemilik: "Bambang Prasetyo",
    usaha: "Klanceng Tegalsari",
    rt: "RT 07",
    dusun: "Tegalsari",
    whatsapp: "081234567806",
  },
  {
    slug: "jasa-servis-mesin-pertanian",
    foto: "servis-mesin.jpg",
    nama: "Servis Mesin Pertanian",
    kategori: "Jasa",
    harga: 75000,
    satuan: "kunjungan",
    deskripsi:
      "Servis traktor tangan, pompa air, dan mesin perontok padi. Teknisi datang langsung ke rumah, termasuk panggilan darurat saat musim tanam dan panen sedang ramai-ramainya.",
    detail: [
      "Melayani perbaikan traktor tangan, pompa air, mesin perontok padi, dan mesin pemotong rumput. Teknisi datang ke lokasi di seluruh wilayah desa.",
      "Tarif kunjungan sudah termasuk pemeriksaan menyeluruh dan penyetelan ringan. Biaya suku cadang dihitung terpisah dan disampaikan sebelum penggantian.",
      "Menerima panggilan darurat di masa tanam dan panen. Hubungi lewat WhatsApp untuk memastikan ketersediaan jadwal.",
    ],
    pemilik: "Agus Setiawan",
    usaha: "Bengkel Tani Tegalrejo",
    rt: "RT 06",
    dusun: "Jumprit",
    whatsapp: "081234567807",
  },
  {
    slug: "jahit-permak-pakaian",
    foto: "jahit-permak.jpg",
    nama: "Jahit dan Permak Pakaian",
    kategori: "Jasa",
    harga: 25000,
    satuan: "potong",
    deskripsi: "Jahit & permak, 2–4 hari kerja.",
    detail: [
      "Melayani jahit baju harian, seragam sekolah, kebaya, serta permak ukuran seperti pengecilan pinggang, pemendekan lengan, dan penggantian resleting.",
      "Waktu pengerjaan dua sampai empat hari kerja tergantung antrean. Musim ajaran baru biasanya lebih padat, disarankan memesan lebih awal.",
      "Kain dapat dibawa sendiri atau dipilihkan dari koleksi yang tersedia di tempat.",
    ],
    pemilik: "Endang Puspitasari",
    usaha: "Jahit Endang",
    rt: "RT 03",
    dusun: "Krajan",
    whatsapp: "081234567808",
  },
  {
    slug: "peyek-kacang-renyah",
    foto: "peyek-kacang.jpg",
    nama: "Peyek Kacang dan Rebon",
    kategori: "Makanan",
    harga: 15000,
    satuan: "bungkus 200 g",
    deskripsi:
      "Peyek kacang atau rebon, digoreng tipis setiap hari, tidak pernah nginep.",
    detail: [
      "Adonan tepung beras dicampur santan dan bumbu kemiri, digoreng tipis sehingga renyah tanpa terasa berminyak.",
      "Tersedia varian kacang tanah dan udang rebon. Digoreng setiap hari sehingga selalu dikirim dalam keadaan baru.",
      "Menerima pesanan untuk hajatan dengan pemberitahuan tiga hari sebelumnya.",
    ],
    pemilik: "Tuminah",
    usaha: "Peyek Bu Tum",
    rt: "RT 08",
    dusun: "Tegalsari",
    whatsapp: "081234567809",
  },
  {
    slug: "sapu-ijuk-aren",
    foto: "sapu-ijuk.jpg",
    nama: "Sapu Ijuk Aren",
    kategori: "Kerajinan",
    harga: 45000,
    satuan: "buah",
    deskripsi: "Sapu ijuk, awet bertahun-tahun.",
    detail: [
      "Serat ijuk diambil dari pohon aren yang sama dengan penyadapan nira, sehingga tidak ada bagian pohon yang terbuang.",
      "Ikatan menggunakan kawat berlapis dan tali ijuk berlapis ganda agar tidak mudah lepas saat dipakai menyapu halaman berbatu.",
      "Gagang dari kayu sengon yang diamplas halus. Umur pakai rata-rata dua sampai tiga tahun untuk pemakaian harian.",
    ],
    pemilik: "Sukirno",
    usaha: "Aren Lestari",
    rt: "RT 11",
    dusun: "Banjaran",
    whatsapp: "081234567802",
  },
  {
    slug: "kopi-robusta-bubuk",
    foto: "kopi-robusta.jpg",
    unggulan: true,
    nama: "Kopi Robusta Bubuk",
    kategori: "Pertanian",
    harga: 38000,
    satuan: "bungkus 250 g",
    deskripsi:
      "Robusta petik merah dari lereng desa, dijemur dua minggu, baru digiling setelah pesanan masuk supaya aromanya tidak keburu hilang.",
    detail: [
      "Buah kopi dipetik merah dari kebun di lereng Dusun Banjaran pada ketinggian sekitar 600 meter, lalu diolah kering di bawah sinar matahari selama dua minggu.",
      "Disangrai dengan tingkat sedang untuk menahan rasa cokelat dan mengurangi rasa gosong, kemudian digiling setelah pesanan masuk.",
      "Tersedia pilihan gilingan kasar untuk tubruk maupun halus untuk saringan kain.",
    ],
    pemilik: "Bambang Prasetyo",
    usaha: "Klanceng Tegalsari",
    rt: "RT 07",
    dusun: "Tegalsari",
    whatsapp: "081234567806",
  },
  {
    slug: "catering-hajatan-desa",
    foto: "katering.jpg",
    nama: "Katering Hajatan dan Rapat",
    kategori: "Jasa",
    harga: 22000,
    satuan: "porsi",
    deskripsi: "Nasi kotak & prasmanan, minimal 30 porsi.",
    detail: [
      "Menyediakan nasi kotak dan prasmanan dengan menu masakan rumahan seperti ayam bakar, gudeg, sayur lodeh, dan urap, disesuaikan permintaan.",
      "Pesanan minimal 30 porsi dengan pemberitahuan paling lambat dua hari sebelum acara. Untuk hajatan besar di atas 200 porsi disarankan memesan satu minggu sebelumnya.",
      "Termasuk peralatan saji untuk prasmanan. Pengantaran gratis di dalam wilayah desa.",
    ],
    pemilik: "Endang Puspitasari",
    usaha: "Dapur Endang",
    rt: "RT 03",
    dusun: "Krajan",
    whatsapp: "081234567808",
  },
];

export const kategoriUmkm: KategoriUmkm[] = [
  "Makanan",
  "Kerajinan",
  "Pertanian",
  "Jasa",
];

export function ambilProduk(slug: string) {
  return produkUmkm.find((p) => p.slug === slug);
}

export function produkLainDariPenjual(usaha: string, kecualiSlug: string) {
  return produkUmkm.filter((p) => p.usaha === usaha && p.slug !== kecualiSlug);
}

export const produkUnggulan = produkUmkm.filter((p) => p.unggulan).slice(0, 4);

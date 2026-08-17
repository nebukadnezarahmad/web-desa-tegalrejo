-- ============================================================
-- Balai: skema Supabase
--
-- Jalankan seluruh berkas ini sekali saja di SQL Editor Supabase.
-- Aman diulang: semua pembuatan memakai "if not exists" dan pengisian
-- awal memakai "on conflict do nothing".
--
-- Tabel laporan_warga beserta fungsi cek_status_laporan() dan
-- daftar_laporan_publik() sudah ada lebih dulu dan tidak disentuh di sini.
-- ============================================================


-- ------------------------------------------------------------
-- 1. Pengumuman
-- ------------------------------------------------------------

create table if not exists public.pengumuman (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  judul        text not null,
  ringkasan    text not null,
  isi          text[] not null default '{}',
  kategori     text not null
               check (kategori in ('Administrasi','Kesehatan','Lingkungan','Ekonomi','Kegiatan')),
  tanggal      date not null,
  penerbit     text not null,
  penting      boolean not null default false,
  dibuat_pada  timestamptz not null default now()
);

create index if not exists pengumuman_tanggal_idx on public.pengumuman (tanggal desc);

alter table public.pengumuman enable row level security;

-- Pengumuman memang untuk dibaca siapa saja.
drop policy if exists "pengumuman dibaca publik" on public.pengumuman;
create policy "pengumuman dibaca publik"
  on public.pengumuman for select
  to anon, authenticated
  using (true);

-- Menulis hanya lewat service_role dari panel petugas. Tidak ada policy
-- insert/update/delete untuk anon, jadi peran itu tertutup dengan sendirinya.


-- ------------------------------------------------------------
-- 2. Produk UMKM
--
-- Satu tabel menampung produk yang sudah tayang sekaligus usulan warga
-- yang belum ditinjau. Memisahkannya jadi dua tabel akan memaksa
-- penyalinan baris saat disetujui, dan itu sumber data ganda.
-- ------------------------------------------------------------

create table if not exists public.produk_umkm (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  nama            text not null,
  kategori        text not null
                  check (kategori in ('Makanan','Kerajinan','Pertanian','Jasa')),
  harga           integer not null check (harga >= 0),
  satuan          text not null,
  deskripsi       text not null,
  detail          text[] not null default '{}',
  pemilik         text not null,
  usaha           text not null,
  rt              text not null,
  dusun           text not null,
  whatsapp        text not null,
  unggulan        boolean not null default false,
  foto            text,
  status          text not null default 'menunggu'
                  check (status in ('menunggu','terbit','ditolak')),
  catatan_admin   text,
  dibuat_pada     timestamptz not null default now(),
  diperbarui_pada timestamptz not null default now()
);

create index if not exists produk_umkm_status_idx on public.produk_umkm (status);

alter table public.produk_umkm enable row level security;

-- Publik hanya boleh melihat yang sudah ditinjau dan diterima. Usulan yang
-- masih menunggu memuat nomor WhatsApp warga yang belum diverifikasi.
drop policy if exists "produk terbit dibaca publik" on public.produk_umkm;
create policy "produk terbit dibaca publik"
  on public.produk_umkm for select
  to anon, authenticated
  using (status = 'terbit');

-- Warga boleh mengusulkan, tapi tidak boleh menentukan statusnya sendiri
-- maupun menandai produknya sebagai unggulan.
drop policy if exists "warga boleh mengusulkan produk" on public.produk_umkm;
create policy "warga boleh mengusulkan produk"
  on public.produk_umkm for insert
  to anon, authenticated
  with check (status = 'menunggu' and unggulan = false);

-- Sentuh diperbarui_pada setiap kali baris berubah.
create or replace function public.sentuh_diperbarui_pada()
returns trigger
language plpgsql
as $$
begin
  new.diperbarui_pada := now();
  return new;
end;
$$;

drop trigger if exists produk_umkm_sentuh on public.produk_umkm;
create trigger produk_umkm_sentuh
  before update on public.produk_umkm
  for each row execute function public.sentuh_diperbarui_pada();


-- ------------------------------------------------------------
-- 3. Penyimpanan foto produk
--
-- Bucket publik supaya <Image> bisa memuatnya tanpa URL bertanda tangan.
-- Batas 3 MB dan hanya tipe gambar: unggahan anonim tanpa batas adalah
-- undangan penyalahgunaan.
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'produk-umkm',
  'produk-umkm',
  true,
  3145728,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "foto produk dibaca publik" on storage.objects;
create policy "foto produk dibaca publik"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'produk-umkm');

drop policy if exists "warga boleh mengunggah foto usulan" on storage.objects;
create policy "warga boleh mengunggah foto usulan"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'produk-umkm');


-- ------------------------------------------------------------
-- 4. Isi awal, dipindahkan dari lib/data/
-- ------------------------------------------------------------

-- Isi awal: 6 pengumuman yang sebelumnya ada di lib/data/pengumuman.ts
insert into public.pengumuman (slug, judul, ringkasan, isi, kategori, tanggal, penerbit, penting) values
  ('pemutakhiran-data-kk-2026', 'Pemutakhiran Data Kartu Keluarga Tahap II', 'Warga yang mengalami perubahan anggota keluarga pada 2025–2026 diminta memperbarui data di balai desa sebelum 30 September 2026.', ARRAY['Pemerintah Desa Tegalrejo membuka pemutakhiran data Kartu Keluarga tahap II mulai 10 Agustus hingga 30 September 2026. Hal ini dilakukan untuk keluarga yang mengalami perubahan susunan anggota sepanjang 2025 sampai 2026, baik karena kelahiran, kematian, perkawinan, hingga perpindahan tempat tinggal.',
    'Data tersebut digunakan untuk menentukan ketepatan penyaluran bantuan sosial, penentuan sasaran program kesehatan, dan perhitungan kebutuhan layanan tiap dusun. Pembaruan data dilakukan untuk melihat selisih data yang membuat sejumlah keluarga terlewat dari program yang seharusnya mereka terima.',
    'Warga cukup membawa Kartu Keluarga asli, KTP kepala keluarga, dan dokumen pendukung perubahan seperti akta kelahiran, akta kematian, buku nikah, atau surat pindah. Petugas melayani di ruang pelayanan balai desa pada hari kerja pukul 08.00 sampai 15.00 WIB.',
    'Bagi warga yang mengalami kendala atau lanjut usia, dapat mengajukan layanan jemput berkas pada kader RT.']::text[], 'Administrasi', '2026-08-04', 'Sekretariat Desa', true),
  ('jadwal-posyandu-agustus', 'Jadwal Posyandu Balita dan Lansia', 'Enam posyandu sedang beroperasi secara bergilir pada bulan Agustus.', ARRAY['Seluruh posyandu di desa kembali beroperasi pada bulan Agustus 2026 dengan jadwal bergilir yang sudah ditentukan. Setiap sesi mencakup penimbangan, pengukuran tinggi badan, pemeriksaan tekanan darah untuk lansia, serta konsultasi gizi.']::text[], 'Kesehatan', '2026-07-30', 'Bidan Desa & Kader Posyandu', false),
  ('perubahan-jadwal-angkut-sampah', 'Perubahan Jadwal Angkut Sampah Dusun Banjaran', 'Dimulai 11 Agustus 2026, pengangkutan sampah RT 11 dan RT 12 bergeser dari hari Rabu ke Selasa dan Jumat.', ARRAY['Dikarenakan ada penambahan satu armada pengangkut sampah, jadwal untuk RT 11 dan RT 12 Dusun Banjaran bergeser dari seminggu sekali menjadi seminggu dua kali pada hari Selasa dan Jumat, dimulai 11 Agustus 2026.',
    'Dimohon untuk warga menempatkan sampah yang sudah terpilah di titik kumpul sebelum pukul 06.30 WIB.']::text[], 'Lingkungan', '2026-08-02', 'Seksi Kesejahteraan', true),
  ('pelatihan-pengemasan-produk-umkm', 'Pelatihan Pengemasan dan Foto Produk untuk Pelaku UMKM', 'Pelatihan gratis dua hari untuk warga yang ingin membuka lapak usaha. Membahas desain kemasan, label, dan pemotretan produk.', ARRAY['Pemerintah desa bekerja sama dengan pendamping UMKM kecamatan untuk menyelenggarakan pelatihan membangun lapak usaha pada 19–20 Agustus 2026 di aula balai desa. Pelatihan bersifat terbuka dan tidak dipungut biaya.',
    'Materi mencakup pemilihan bahan kemasan yang sesuai jenis produk, penyusunan informasi wajib pada label, pembuatan komposisi foto sederhana menggunakan cahaya alami, serta penulisan deskripsi produk yang jelas untuk lapak daring.']::text[], 'Ekonomi', '2026-07-28', 'Seksi Pemberdayaan Masyarakat', false),
  ('kerja-bakti-normalisasi-saluran', 'Kerja Bakti Membersihkan Saluran Irigasi Sebelum Musim Hujan Tiba', 'Seluruh dusun dijadwalkan gotong royong membersihkan saluran irigasi pada Minggu, 23 Agustus 2026.', ARRAY['Sebelum musim hujan tiba, pemerintah desa mengajak seluruh warga untuk bergotong royong membersihkan saluran irigasi pada Minggu, 23 Agustus 2026, dimulai pukul 06.30 WIB. Titik kumpul sesuai pos ronda masing-masing RT.',
    'Kegiatan ini ditekankan bagi dusun yang sering mengalami banjir akibat tumpukan sampah dan endapan lumpur pada saluran irigasi yang tidak pernah dibersihkan.',
    'Warga diminta untuk membawa peralatan seperti cangkul, sabit, dan karung. Konsumsi disediakan oleh kelompok PKK masing-masing dusun.']::text[], 'Kegiatan', '2026-08-05', 'Kepala Desa', false),
  ('bantuan-bibit-tanaman-pekarangan', 'Pembagian Bibit Tanaman untuk Pekarangan Rumah', 'Setiap kepala keluarga berhak menerima lima bibit tanaman selama persediaan masih ada.', ARRAY['Program pemanfaatan pekarangan kembali berjalan. Setiap kepala keluarga berhak mengambil lima bibit tanaman dan dapat memilih jenis bibit sesuai keinginan selama persediaan masih ada.',
    'Pengambilan dilayani di gudang belakang balai desa setiap Selasa dan Kamis pukul 08.00 sampai 12.00 WIB selama bulan Agustus atau sampai persediaan habis.']::text[], 'Lingkungan', '2026-07-24', 'Seksi Kesejahteraan', false)
on conflict (slug) do nothing;

-- Isi awal: 12 produk yang sebelumnya ada di lib/data/umkm.ts
insert into public.produk_umkm (slug, nama, kategori, harga, satuan, deskripsi, detail, pemilik, usaha, rt, dusun, whatsapp, unggulan, foto, status) values
  ('keripik-tempe-bu-marni', 'Keripik Tempe Rempah', 'Makanan', 18000, 'bungkus 250 g', 'Keripik tempe renyah, bumbu ketumbar dan daun jeruk. Tanpa pengawet.', ARRAY['Dibuat dari tempe kedelai yang difermentasi sendiri selama dua hari, lalu diiris tipis dan dibalut adonan tepung beras berbumbu ketumbar, bawang putih, dan daun jeruk.',
    'Digoreng dua kali agar kadar minyak berkurang dan tekstur tetap renyah sampai dua minggu setelah pengemasan.',
    'Tersedia varian original dan pedas. Pemesanan di atas 20 bungkus dilayani dengan pemberitahuan dua hari sebelumnya.']::text[], 'Marni Suryati', 'Dapur Tempe Krajan', 'RT 02', 'Krajan', '081234567801', true, 'keripik-tempe.jpg', 'terbit'),
  ('gula-semut-aren', 'Gula Semut Aren Murni', 'Makanan', 32000, 'toples 500 g', 'Gula aren kristal murni, disadap sendiri dari pohon aren di lereng timur desa, tanpa campuran gula pasir sama sekali. Warna dan aromanya asli dari nira.', ARRAY['Nira aren disadap setiap pagi dan sore, lalu dimasak hari itu juga tanpa jeda agar tidak berubah asam. Proses pengkristalan dilakukan manual dengan pengadukan tangan.',
    'Tidak menggunakan campuran gula pasir maupun pemutih. Warna cokelat pekat dan aroma karamel yang kuat berasal murni dari nira.',
    'Cocok untuk minuman, kue, maupun campuran jamu. Simpan di wadah tertutup pada suhu ruang.']::text[], 'Sukirno', 'Aren Lestari', 'RT 11', 'Banjaran', '081234567802', true, 'gula-semut-aren.jpg', 'terbit'),
  ('anyaman-bambu-serbaguna', 'Anyaman Bambu Serbaguna', 'Kerajinan', 65000, 'buah', 'Keranjang bambu, tiga ukuran.', ARRAY['Menggunakan bambu apus berumur tiga tahun yang direndam dua minggu agar tahan rayap, kemudian dijemur dan dianyam tangan dengan pola anyaman rapat.',
    'Tersedia ukuran kecil, sedang, dan besar. Bagian bibir keranjang diperkuat rotan agar tidak mudah melengkung saat dipakai membawa beban.',
    'Dapat dipesan dengan pewarnaan alami dari kulit jengkol atau tanpa pewarna sama sekali.']::text[], 'Warsito', 'Bambu Jumprit', 'RT 05', 'Jumprit', '081234567803', false, 'anyaman-bambu.jpg', 'terbit'),
  ('batik-tulis-motif-padi', 'Batik Tulis Motif Padi Tegalrejo', 'Kerajinan', 285000, 'lembar 2 m', 'Batik tulis motif bulir padi dan garis kontur sawah, dikerjakan penuh dengan canting tangan oleh kelompok perajin ibu-ibu desa, bukan cap dan bukan printing. Satu lembar butuh sekitar sepuluh hari kerja.', ARRAY['Motif dikembangkan kelompok perajin desa dengan mengambil bentuk bulir padi dan garis kontur persawahan sebagai penanda identitas Tegalrejo.',
    'Seluruh proses dikerjakan dengan canting tangan di atas kain katun primisima, membutuhkan waktu sekitar sepuluh hari per lembar.',
    'Pewarnaan menggunakan kombinasi pewarna alam dari kulit mahoni dan indigo. Setiap lembar memiliki perbedaan kecil karena dikerjakan manual.']::text[], 'Siti Rahayu', 'Batik Sekar Tani', 'RT 04', 'Jumprit', '081234567804', true, 'batik-tulis-padi.jpg', 'terbit'),
  ('beras-merah-organik', 'Beras Merah Organik', 'Pertanian', 24000, 'kg', 'Beras merah, tanpa pupuk kimia sejak 2021.', ARRAY['Ditanam di lahan seluas dua hektar di Dusun Tegalsari yang telah dikelola tanpa pupuk dan pestisida kimia selama lima musim tanam berturut-turut.',
    'Penggilingan dilakukan setelah ada pesanan agar kandungan minyak pada lapisan bekatul tidak cepat tengik.',
    'Tekstur lebih pera dibanding beras putih, membutuhkan air lebih banyak dan waktu tanak sekitar sepuluh menit lebih lama.']::text[], 'Slamet Widodo', 'Tani Makmur Tegalsari', 'RT 09', 'Tegalsari', '081234567805', false, 'beras-merah.jpg', 'terbit'),
  ('madu-hutan-klanceng', 'Madu Klanceng Hutan', 'Pertanian', 145000, 'botol 250 ml', 'Madu klanceng dari kebun campur, rasa asam manis khas, dipanen tanpa merusak sarang.', ARRAY['Dipanen dari koloni lebah tanpa sengat jenis klanceng yang dibudidayakan di kebun campur berisi kelapa, kopi, dan tanaman berbunga liar.',
    'Panen dilakukan tiga hingga empat bulan sekali dengan menyedot langsung dari kantong madu, tanpa pemerasan sarang, sehingga koloni tetap utuh.',
    'Rasa cenderung asam manis dengan tekstur lebih encer dibanding madu lebah biasa. Simpan di tempat sejuk dan hindari sinar matahari langsung.']::text[], 'Bambang Prasetyo', 'Klanceng Tegalsari', 'RT 07', 'Tegalsari', '081234567806', false, 'madu-klanceng.jpg', 'terbit'),
  ('jasa-servis-mesin-pertanian', 'Servis Mesin Pertanian', 'Jasa', 75000, 'kunjungan', 'Servis traktor tangan, pompa air, dan mesin perontok padi. Teknisi datang langsung ke rumah, termasuk panggilan darurat saat musim tanam dan panen sedang ramai-ramainya.', ARRAY['Melayani perbaikan traktor tangan, pompa air, mesin perontok padi, dan mesin pemotong rumput. Teknisi datang ke lokasi di seluruh wilayah desa.',
    'Tarif kunjungan sudah termasuk pemeriksaan menyeluruh dan penyetelan ringan. Biaya suku cadang dihitung terpisah dan disampaikan sebelum penggantian.',
    'Menerima panggilan darurat di masa tanam dan panen. Hubungi lewat WhatsApp untuk memastikan ketersediaan jadwal.']::text[], 'Agus Setiawan', 'Bengkel Tani Tegalrejo', 'RT 06', 'Jumprit', '081234567807', false, 'servis-mesin.jpg', 'terbit'),
  ('jahit-permak-pakaian', 'Jahit dan Permak Pakaian', 'Jasa', 25000, 'potong', 'Jahit & permak, 2–4 hari kerja.', ARRAY['Melayani jahit baju harian, seragam sekolah, kebaya, serta permak ukuran seperti pengecilan pinggang, pemendekan lengan, dan penggantian resleting.',
    'Waktu pengerjaan dua sampai empat hari kerja tergantung antrean. Musim ajaran baru biasanya lebih padat, disarankan memesan lebih awal.',
    'Kain dapat dibawa sendiri atau dipilihkan dari koleksi yang tersedia di tempat.']::text[], 'Endang Puspitasari', 'Jahit Endang', 'RT 03', 'Krajan', '081234567808', false, 'jahit-permak.jpg', 'terbit'),
  ('peyek-kacang-renyah', 'Peyek Kacang dan Rebon', 'Makanan', 15000, 'bungkus 200 g', 'Peyek kacang atau rebon, digoreng tipis setiap hari, tidak pernah nginep.', ARRAY['Adonan tepung beras dicampur santan dan bumbu kemiri, digoreng tipis sehingga renyah tanpa terasa berminyak.',
    'Tersedia varian kacang tanah dan udang rebon. Digoreng setiap hari sehingga selalu dikirim dalam keadaan baru.',
    'Menerima pesanan untuk hajatan dengan pemberitahuan tiga hari sebelumnya.']::text[], 'Tuminah', 'Peyek Bu Tum', 'RT 08', 'Tegalsari', '081234567809', false, 'peyek-kacang.jpg', 'terbit'),
  ('sapu-ijuk-aren', 'Sapu Ijuk Aren', 'Kerajinan', 45000, 'buah', 'Sapu ijuk, awet bertahun-tahun.', ARRAY['Serat ijuk diambil dari pohon aren yang sama dengan penyadapan nira, sehingga tidak ada bagian pohon yang terbuang.',
    'Ikatan menggunakan kawat berlapis dan tali ijuk berlapis ganda agar tidak mudah lepas saat dipakai menyapu halaman berbatu.',
    'Gagang dari kayu sengon yang diamplas halus. Umur pakai rata-rata dua sampai tiga tahun untuk pemakaian harian.']::text[], 'Sukirno', 'Aren Lestari', 'RT 11', 'Banjaran', '081234567802', false, 'sapu-ijuk.jpg', 'terbit'),
  ('kopi-robusta-bubuk', 'Kopi Robusta Bubuk', 'Pertanian', 38000, 'bungkus 250 g', 'Robusta petik merah dari lereng desa, dijemur dua minggu, baru digiling setelah pesanan masuk supaya aromanya tidak keburu hilang.', ARRAY['Buah kopi dipetik merah dari kebun di lereng Dusun Banjaran pada ketinggian sekitar 600 meter, lalu diolah kering di bawah sinar matahari selama dua minggu.',
    'Disangrai dengan tingkat sedang untuk menahan rasa cokelat dan mengurangi rasa gosong, kemudian digiling setelah pesanan masuk.',
    'Tersedia pilihan gilingan kasar untuk tubruk maupun halus untuk saringan kain.']::text[], 'Bambang Prasetyo', 'Klanceng Tegalsari', 'RT 07', 'Tegalsari', '081234567806', true, 'kopi-robusta.jpg', 'terbit'),
  ('catering-hajatan-desa', 'Katering Hajatan dan Rapat', 'Jasa', 22000, 'porsi', 'Nasi kotak & prasmanan, minimal 30 porsi.', ARRAY['Menyediakan nasi kotak dan prasmanan dengan menu masakan rumahan seperti ayam bakar, gudeg, sayur lodeh, dan urap, disesuaikan permintaan.',
    'Pesanan minimal 30 porsi dengan pemberitahuan paling lambat dua hari sebelum acara. Untuk hajatan besar di atas 200 porsi disarankan memesan satu minggu sebelumnya.',
    'Termasuk peralatan saji untuk prasmanan. Pengantaran gratis di dalam wilayah desa.']::text[], 'Endang Puspitasari', 'Dapur Endang', 'RT 03', 'Krajan', '081234567808', false, 'katering.jpg', 'terbit')
on conflict (slug) do nothing;

-- Selesai. Periksa: select count(*) from public.pengumuman;  -- harus 6
--                  select count(*) from public.produk_umkm; -- harus 12

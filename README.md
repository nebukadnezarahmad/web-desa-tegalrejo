# BALAI : Satu Pintu Layanan dan Informasi Warga Desa

## Instansi

Institut Teknologi PLN (ITPLN)

## Anggota Tim

- Ketua      : Muh. Raihan Huda Negara
  - Anggota 1: Nebukadnezar Ahmad
  - Anggota 2: Naufal Muttaqin

## Deskripsi Karya

Di banyak desa, informasi mengalir satu arah: pengumuman turun dari balai desa,
warga tinggal membaca. Keluhan warga sendiri sering berhenti di obrolan warung
atau grup WhatsApp RT, tidak pernah sampai tertangani secara tercatat. Warga
yang ingin membuka usaha kecil tidak tahu ke mana harus menawarkan produknya
selain dari mulut ke mulut. Orang tua balita bergantung penuh pada jadwal
posyandu bulanan untuk tahu apakah tumbuh kembang anaknya baik-baik saja.

Balai dibangun untuk membalik arah itu. Website ini bukan etalase desa yang
berisi sambutan kepala desa dan struktur organisasi yang jarang dibuka warga,
melainkan alat kerja sehari-hari untuk hidup bertetangga: tempat warga melapor
dan tahu laporannya ditindaklanjuti, tempat usaha rumahan tetangga bisa
ditemukan, tempat jadwal kerja bakti dan posyandu terlihat oleh semua orang
tanpa harus menunggu selebaran ditempel di pos ronda.

Tujuan utamanya adalah memindahkan urusan yang paling sering ditanyakan warga
ke tempat yang bisa mereka buka kapan saja, lalu membuka jalur balik agar suara
warga sampai ke pengurus dan bisa dilacak tindak lanjutnya. Manfaatnya berlapis:
warga hemat perjalanan ke balai desa, petugas terbantu karena pertanyaan
berulang sudah terjawab di situs, dan pelaku usaha rumahan mendapat etalase
tanpa biaya maupun perantara.

Fitur intinya adalah **Lapor Warga**: warga melaporkan masalah lingkungan
(lampu jalan mati, saluran mampet, dan sejenisnya), petugas desa menanggapi dan
memperbarui statusnya, dan warga bisa memantau tindak lanjutnya secara terbuka.
Laporan boleh dikirim tanpa nama, dan tiap laporan mendapat kode lacak.

Di sinilah alasan pemilihan subtema **Hubungan Sosial** dalam tema Humanity OS
terletak. Sebuah sistem operasi kemanusiaan tidak diukur dari banyaknya
informasi yang ia tampilkan, melainkan dari apakah ia memulihkan hubungan
antarmanusia yang selama ini terputus. Yang dibenahi Balai bukan sekadar
ketersediaan informasi, melainkan hubungan dua arah antara warga dan pengurus
lingkungannya: warga punya tempat bersuara yang tercatat, pengurus punya
tempat menjawab yang terlihat, dan tetangga saling menemukan usahanya. Teknologi
di sini menempati posisi perantara, bukan pengganti kehidupan bertetangga.

Di luar itu, Balai menghadirkan lapak UMKM warga yang kini bisa diisi sendiri
oleh pelaku usaha lewat pengajuan yang ditinjau petugas, kalkulator status gizi
anak berbasis Standar Antropometri Anak WHO (Permenkes No. 2 Tahun 2020) untuk
mendukung pemantauan dini terhadap risiko stunting, jadwal pengelolaan sampah
per RT, serta layanan administrasi yang jelas syarat dan estimasi waktunya.

Seluruh data pada situs ini bersifat fiktif dan dibuat untuk keperluan purwarupa
lomba. Nama desa, warga, dan perangkat desa yang ditampilkan tidak merujuk pada
individu atau instansi nyata.

## Tautan / Link Deploy Website

https://web-desa-tegalrejo.vercel.app

---

## Menjalankan Secara Lokal

Butuh Node.js versi 20 atau lebih baru.

```bash
npm install
npm run dev
```

Buka http://localhost:3000

Perintah lain:

```bash
npm run build     # build produksi
npm run start     # jalankan hasil build
npm run lint      # pemeriksaan ESLint
```

Catatan untuk klon baru: `npx tsc --noEmit` akan mengeluh soal `PageProps` dan
`LayoutProps` sebelum proyek pernah dibuild sekali. Tipe itu dihasilkan Next.js
saat build. Jalankan `npm run build` lebih dulu, baru pemeriksaan tipe bersih.

## Konfigurasi Basis Data

Pengumuman, produk UMKM, dan laporan warga disimpan di Supabase. Halaman lain
berjalan tanpa konfigurasi apa pun.

```bash
cp .env.example .env.local
```

Isi nilainya dengan kredensial proyek Supabase sendiri, lalu jalankan seluruh
isi `supabase/skema.sql` di SQL Editor Supabase. Berkas itu membuat tabel,
kebijakan keamanan baris, bucket penyimpanan foto, dan mengisi data awal.

Berkas `.env.local` sengaja tidak disertakan dalam arsip ini karena memuat
kunci akses. Situs yang sudah ter-deploy pada tautan di atas berjalan lengkap,
jadi seluruh fitur bisa langsung dicoba di sana tanpa konfigurasi.

## Tumpukan Teknologi

| Bagian | Pilihan |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Bahasa | TypeScript |
| Gaya | Tailwind CSS v4 |
| Komponen | Radix UI |
| Ikon | Phosphor Icons |
| Grafik | Recharts |
| Basis data | Supabase (Postgres + Storage) |
| Huruf | Plus Jakarta Sans dan Bricolage Grotesque |
| Hosting | Vercel |

## Struktur Proyek

```
app/                Rute (App Router)
  umkm/             Lapak UMKM, detail produk, pengajuan produk warga
  kesehatan/        Kalkulator gizi, grafik tumbuh, jadwal posyandu
  lingkungan/       Jadwal sampah per RT, panduan pilah, bank sampah
  profil/           Sejarah, visi misi, perangkat, layanan administrasi
  pengumuman/       Daftar dan halaman detail pengumuman
  lapor/            Formulir lapor warga dan pelacak status
  admin/            Panel petugas: laporan, usulan UMKM, terbitkan pengumuman

components/         Komponen antarmuka, dikelompokkan per halaman
lib/
  data/             Definisi tipe dan daftar kategori
  pengumuman/       Pembacaan pengumuman dari basis data
  umkm/             Pembacaan produk dari basis data
  gizi.ts           Perhitungan status gizi WHO
  supabase/         Klien anon dan service role
supabase/
  skema.sql         Tabel, kebijakan keamanan, bucket, dan data awal
```

## Kalkulator Status Gizi

Perhitungan pada `lib/gizi.ts` memakai metode LMS dari Standar Antropometri Anak
WHO (Permenkes No. 2 Tahun 2020), bukan angka perkiraan. Skor Z dihitung untuk
dua indeks: TB/U untuk menapis perawakan pendek, dan BB/U untuk menapis berat
badan kurang.

Rumusnya `z = ((X/M)^L - 1) / (L*S)` dengan parameter LMS diinterpolasi linear
menurut umur, berlaku untuk usia 0 sampai 60 bulan. Seluruh perhitungan
dilakukan di peramban, sehingga data anak tidak dikirim ke mana pun.

## Alur Moderasi

Laporan warga masuk berstatus menunggu dan belum tayang. Petugas mengubahnya ke
diterima, diproses, atau selesai agar muncul di daftar publik. Status ditolak
tetap tersembunyi.

Pengajuan produk UMKM mengikuti pola yang sama: usulan warga masuk berstatus
menunggu dan tidak terbaca publik, karena memuat nomor kontak yang belum
diverifikasi. Aturan ini ditegakkan kebijakan keamanan baris di sisi basis data,
bukan hanya oleh penyaringan di kode.

## Catatan Aksesibilitas

- Kontras teks minimal 4.5:1 pada semua pasangan warna (WCAG AA)
- Ukuran teks minimal 12 piksel di seluruh halaman, termasuk layar 320 piksel
- Cincin fokus keyboard terlihat pada seluruh kontrol
- Target sentuh minimal 44 piksel
- Pengaturan `prefers-reduced-motion` dihormati di seluruh animasi
- Isi halaman tetap tampil ketika JavaScript tidak aktif
- Satu `<h1>` per halaman dan tautan lompat ke konten utama

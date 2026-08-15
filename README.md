# Balai

Portal desa untuk Desa Tegalrejo, Kecamatan Ngadirejo, Kabupaten Temanggung.
Isinya pengumuman, agenda warga, lapak UMKM, kalkulator gizi balita, jadwal
sampah, dan kanal lapor warga.

Ini purwarupa untuk lomba web design. Data desanya sebagian nyata (lihat
catatan di bawah), sisanya karangan.

Situs langsung: https://web-desa-lomba.vercel.app

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000

Perintah lain:

```bash
npm run build     # build produksi
npm run start     # jalankan hasil build
npm run lint      # ESLint
npx tsc --noEmit  # pemeriksaan tipe
```

Catatan untuk klon baru: `npx tsc --noEmit` akan mengeluh soal `PageProps` dan
`LayoutProps` sebelum pernah dibuild sekali. Tipe itu dihasilkan Next.js waktu
build. Jalankan `npm run build` atau `npx next typegen` dulu, baru tsc bersih.

Fitur Lapor Warga butuh koneksi Supabase. Salin `.env.example` jadi
`.env.local`, lalu isi nilainya:

```bash
cp .env.example .env.local
```

Tanpa berkas itu halaman lain tetap jalan, hanya `/lapor` dan `/admin` yang
tidak berfungsi.

## Tumpukan teknologi

| Bagian | Pilihan |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Bahasa | TypeScript |
| Gaya | Tailwind CSS v4, token di `app/globals.css` |
| Komponen | Radix UI, disusun sendiri mengikuti pola shadcn |
| Ikon | Phosphor Icons |
| Grafik | Recharts |
| Basis data | Supabase (khusus fitur Lapor Warga) |
| Huruf | Plus Jakarta Sans dan Bricolage Grotesque |

## Struktur

```
app/                Rute (App Router)
  page.tsx          Beranda
  umkm/             Lapak UMKM dan halaman detail produk
  kesehatan/        Kalkulator gizi, grafik tumbuh, jadwal posyandu
  lingkungan/       Jadwal sampah per RT, panduan pilah, bank sampah
  profil/           Sejarah, visi misi, perangkat, layanan administrasi
  pengumuman/       Daftar dan halaman detail pengumuman
  lapor/            Formulir lapor warga dan pelacak status
  admin/            Panel petugas untuk memoderasi laporan
  globals.css       Token warna, tipografi, gerak

components/
  layout/           Header, footer, navigasi bawah, logo
  shared/           Section, PageHeader, FotoDesa, Reveal
  ui/               Primitif (Button, Card, Badge, Accordion, Select, Input)
  home/ umkm/ kesehatan/ lingkungan/ profil/ pengumuman/ lapor/ admin/

lib/
  data/             Data statis situs
  supabase/         Klien anon dan service role
  gizi.ts           Perhitungan status gizi WHO
  utils.ts          Format rupiah, tanggal, tautan WhatsApp
```

Penamaan di kode pakai bahasa Indonesia (`daftarRt`, `kirimLaporan`,
`KartuLaporanAdmin`). Ikuti gaya yang sudah ada kalau menambah kode baru.

## Arah desain

Kanvas putih dominan. Hijau daun untuk tindakan dan pertumbuhan, biru cerah
untuk informasi dan layanan. Pembagian peran warna ini dipegang konsisten di
semua halaman, dan itu yang bikin tampilannya terbaca sebagai pilihan, bukan
sekadar warna-warni.

Penanda visualnya garis kontur peta, dipakai sebagai latar hero dan pembatas
antar bagian. Kontur mengacu ke peta, peta ke tanah, tanah ke desa. Di kartu
"Denyut Desa" di beranda, angka statistik disusun menaik seperti tegalan yang
menapak lereng, karena desa ini memang duduk di 1.300 mdpl di lereng Sindoro.

Tipografi memakai Plus Jakarta Sans, huruf identitas kota Jakarta rancangan
Tokotype. Judul besar pakai Bricolage Grotesque yang wataknya mirip huruf papan
pengumuman balai desa, tegas dan sedikit kaku.

Seluruh token warna ada di `app/globals.css` dan sudah dicek lolos WCAG AA
(kontras minimal 4.5:1 untuk teks).

## Kalkulator status gizi

Ada di `lib/gizi.ts`. Perhitungannya sungguhan, bukan angka karangan. Memakai
metode LMS dari Standar Antropometri Anak WHO (Permenkes No. 2 Tahun 2020),
menghitung skor Z untuk dua indeks:

- TB/U (tinggi badan menurut umur), untuk menapis perawakan pendek
- BB/U (berat badan menurut umur), untuk menapis berat badan kurang

Rumusnya `z = ((X/M)^L - 1) / (L*S)`, dengan parameter LMS diinterpolasi linear
menurut umur. Ambang klasifikasinya mengikuti Permenkes. Berlaku untuk usia 0
sampai 60 bulan. Semua dihitung di peramban, jadi data anak tidak dikirim ke
mana pun.

## Lapor warga

Warga bisa mengirim laporan tanpa login dan boleh anonim. Tiap laporan dapat
kode lacak untuk memeriksa tindak lanjutnya di `/lapor/status`.

Alur moderasinya: laporan masuk berstatus `menunggu` dan belum tayang. Petugas
mengubahnya ke `diterima`, `diproses`, atau `selesai` supaya muncul di daftar
publik. Status `ditolak` tetap tersembunyi.

Di sisi Supabase, tabel `laporan_warga` dijaga RLS (anon hanya boleh INSERT).
Pembacaan publik lewat fungsi `cek_status_laporan()` dan
`daftar_laporan_publik()` bertipe SECURITY DEFINER, yang hanya mengembalikan
kolom aman tanpa nama pelapor, kontak, atau kode lacak.

Panel petugas di `/admin` dijaga `proxy.ts` di akar proyek. Di Next.js 16
berkas ini menggantikan `middleware.ts` yang lama.

## Mengganti identitas desa

Semua identitas terpusat di `lib/data/desa.ts`: nama desa, kecamatan,
kabupaten, alamat, kontak, dan nama merek. Ubah di satu berkas itu saja, sisa
halaman ikut menyesuaikan.

## Data mana yang nyata

Yang terverifikasi: kecamatan, kabupaten, kode pos, alamat balai (Jln. Jumprit
KM.04), luas 891 hektar, 4 dusun, 7 RW, 28 RT, 2.958 jiwa, 897 KK, ketinggian
1.300 mdpl, dan keberadaan Umbul Jumprit sebagai hulu Sungai Progo.

Yang masih karangan: nama dusun, sebaran warga dan KK per RT, seluruh produk
UMKM beserta pemiliknya, semua pengumuman dan agenda, jumlah UMKM, jumlah
posyandu, serta nomor telepon dan surel balai desa. Jangan dikutip sebagai data
resmi.

## Catatan aksesibilitas

- Kontras teks minimal 4.5:1 di semua pasangan warna
- Cincin fokus keyboard terlihat di semua kontrol
- Target sentuh minimal 44px
- `prefers-reduced-motion` dihormati
- Satu `<h1>` per halaman, `lang="id"`, ada tautan lompat ke konten
- Tidak memakai emoji sebagai ikon

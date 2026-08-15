# Foto yang perlu diambil

Semua produk UMKM sudah punya foto. Yang masih kosong tinggal beberapa titik
lokasi di halaman Profil, Kesehatan, dan Lingkungan. Foto lokasi asli inilah
yang paling terasa bedanya: situs jadi terbaca sebagai tempat yang benar ada,
bukan sekadar contoh tampilan.

## Yang perlu difoto

Kamera HP biasa sudah cukup. Ambil siang hari, tidak usah diedit macam-macam.

1. **Gapura atau plang masuk RT/dusun**, untuk halaman Profil Desa
2. **Pos ronda atau gardu**, untuk halaman Profil Desa bagian sejarah
3. **Gang kampung** (jalan warga, bukan jalan raya), untuk hero atau profil
4. **Gedung balai desa**, untuk bagian Kontak di halaman Profil
5. **Kegiatan kerja bakti atau gotong royong**, kalau ada dokumentasinya,
   untuk halaman Lingkungan
6. **Posyandu atau kegiatan kesehatan**, untuk halaman Kesehatan. Minta izin
   dulu ke orang yang difoto.

## Cara pasang

1. Simpan berkasnya ke `public/foto/`. Nama bebas asal jelas, misalnya
   `gapura-rt.jpg` atau `balai-desa.jpg`.
2. Kompres dulu supaya halaman tidak berat. Usahakan di bawah 300 KB per foto.
   Squoosh atau TinyPNG cukup untuk ini.
3. Buka komponen `<FotoDesa />` yang mau diisi, lalu isi prop `src` dengan nama
   berkasnya:

   ```tsx
   <FotoDesa src="gapura-rt.jpg" alt="Gapura masuk RT 03 Dusun Krajan" />
   ```

Selama `src` masih kosong, `<FotoDesa />` menampilkan kotak putus-putus
bertuliskan "Foto belum ditambahkan". Ini disengaja, bukan ikon yang
berpura-pura jadi foto, supaya kelihatan bagian mana yang masih menunggu.

# Foto situs

Berkas di folder ini dipanggil lewat `FotoDesa`
(`components/shared/foto-desa.tsx`) dan `ProdukThumb`
(`components/umkm/produk-thumb.tsx`) dengan nama berkas saja, tanpa `/foto/`.

Untuk produk UMKM, isi kolom `foto` di `lib/data/umkm.ts`.

## Aturan

1. **Foto harus benar-benar menggambarkan barangnya.** Kalau belum ada yang
   cocok, kosongkan saja. `ProdukThumb` otomatis memakai ilustrasi ikon per
   kategori, dan ilustrasi yang jujur lebih baik daripada foto yang salah
   barang.
2. Foto bertanda Unsplash bebas dipakai termasuk untuk keperluan komersial,
   tanpa kewajiban mencantumkan atribusi. Foto bertanda "pemilik usaha"
   dikirim langsung oleh yang punya usaha lewat WhatsApp. Yang begini lebih
   diutamakan karena barangnya memang barang aslinya, bukan stok generik.
3. Ganti dengan foto asli dari pemilik usaha begitu tersedia.

## Daftar berkas

| Berkas | Sumber | Dipakai untuk |
|---|---|---|
| `sawah-terasering.jpg` | Unsplash `j_AtS4IY7gQ` | Halaman Profil, bagian Riwayat |
| `gula-semut-aren.jpg` | Pemilik usaha (WhatsApp) | Gula Semut Aren Murni |
| `anyaman-bambu.jpg` | Unsplash `DcFYhIgDrlw` | Anyaman Bambu Serbaguna |
| `madu-klanceng.jpg` | Unsplash `yQzrDgU-KAI` | Madu Klanceng Hutan |
| `jahit-permak.jpg` | Unsplash `hzdgFPz1V24` | Jahit dan Permak Pakaian |
| `kopi-robusta.jpg` | Unsplash `j_DqtxKL4xY` | Kopi Robusta Bubuk |
| `katering.jpg` | Unsplash `yvzzemH8-J0` | Katering Hajatan dan Rapat |
| `sapu-ijuk.jpg` | Pemilik usaha (WhatsApp) | Sapu Ijuk Aren |
| `peyek-kacang.jpg` | Pemilik usaha (WhatsApp) | Peyek Kacang dan Rebon |
| `beras-merah.jpg` | Pemilik usaha (WhatsApp) | Beras Merah Organik |
| `servis-mesin.jpg` | Pemilik usaha (WhatsApp) | Servis Mesin Pertanian |
| `keripik-tempe.jpg` | Unsplash `pbgzARiiHxM` | Keripik Tempe Rempah |
| `batik-tulis-padi.jpg` | Unsplash `kx-wXj7zoFM` | Batik Tulis Motif Padi Tegalrejo |

Tautan foto Unsplash: `https://unsplash.com/photos/<ID>`

## Catatan kecocokan

Semua produk sudah punya foto, jadi tidak ada lagi yang jatuh ke ilustrasi
ikon. Beberapa kandidat sempat ditolak dulu karena salah barang: tahu goreng
utuh untuk keripik tempe, dan sekam padi untuk beras merah.

Tiga foto di bawah ini tidak seratus persen pas dengan teks produknya, tapi
tetap dipakai karena masih jauh lebih baik daripada ilustrasi ikon:

- `peyek-kacang.jpg` cuma memperlihatkan kacang, rebonnya tidak kelihatan
  jelas, padahal nama produknya "Peyek Kacang dan Rebon".
- `servis-mesin.jpg` menampilkan montir sedang membetulkan alat berat, bukan
  mesin pertanian seperti traktor tangan atau pompa air.
- `batik-tulis-padi.jpg` adalah foto arsip kain batik tulis koleksi museum
  (motif Parang Rusak Barong, 1891, lisensi CC0). Kainnya memang batik tulis
  asli, tapi motifnya bukan bulir padi dan garis kontur sawah seperti yang
  ditulis di deskripsi produk. Dipilih karena warna coklat tua dan nila
  gelapnya paling dekat dengan deskripsi pewarna alam kulit mahoni dan indigo.

## Yang masih perlu difoto sendiri

- Gapura atau tetenger batas desa
- Gedung balai desa (bagian Kontak di halaman Profil)
- Kegiatan posyandu dan bank sampah

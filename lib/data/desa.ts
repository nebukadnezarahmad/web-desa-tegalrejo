/**
 * Identitas desa, sumber tunggal. Ganti di sini untuk rebrand; seluruh
 * halaman, metadata, dan data contoh ikut menyesuaikan.
 *
 * MANA YANG DATA ASLI, MANA YANG ISIAN SEMENTARA
 *
 * Asli (Desa Tegalrejo, Kec. Ngadirejo, Kab. Temanggung):
 *   nama, kecamatan, kabupaten, provinsi, kodePos (56255),
 *   alamatBalai (Jln. Jumprit KM.04), luasWilayah (891 ha),
 *   jumlahDusun (4), jumlahRw (7), jumlahRt (28), ketinggian (1.300 mdpl),
 *   dan statistikDesa jumlah warga (2.958) + kepala keluarga (897).
 *   Sumber: situs resmi desa, Wikipedia, dan data kecamatan.
 *
 * Isian sementara, JANGAN dikutip sebagai data resmi:
 *   telepon dan email sengaja diisi nomor/alamat karangan, bukan kontak
 *   asli perangkat desa, supaya warga tidak menghubungi petugas
 *   sungguhan soal pengumuman yang isinya masih contoh.
 *   Nama dusun, sebaran warga dan KK per RT di daftarRt, jumlah UMKM,
 *   dan jumlah posyandu juga masih karangan. Angka totalnya saja yang
 *   dicocokkan dengan data asli.
 */
export const desa = {
  merek: "Balai",
  tagline: "Satu pintu untuk warga desa.",
  nama: "Desa Tegalrejo",
  kecamatan: "Kecamatan Ngadirejo",
  kabupaten: "Kabupaten Temanggung",
  provinsi: "Jawa Tengah",
  kodePos: "56255",
  alamatBalai: "Jln. Jumprit KM.04",
  telepon: "(0293) 591234",
  email: "balaidesa.tegalrejo@contoh.id",
  jamLayanan: "Senin–Jumat, 08.00–15.00 WIB",
  luasWilayah: "891 hektar",
  jumlahDusun: 4,
  jumlahRw: 7,
  jumlahRt: 28,
  ketinggian: "1.300 mdpl",
} as const;

export const statistikDesa = [
  { label: "Jumlah warga", nilai: 2958, satuan: "jiwa" },
  { label: "Kepala keluarga", nilai: 897, satuan: "KK" },
  { label: "UMKM terdaftar", nilai: 63, satuan: "usaha" },
  { label: "Posyandu aktif", nilai: 6, satuan: "unit" },
] as const;

/**
 * Empat dusun, tujuh RW, dua puluh delapan RT. Jumlahnya mengikuti data
 * asli desa. Nama dusun serta sebaran warga dan KK per RT masih karangan;
 * totalnya saja yang pas dengan angka resmi (2.958 jiwa, 897 KK).
 */
export const daftarRt = [
  { rt: "RT 01", rw: "RW 01", dusun: "Krajan", kk: 36, warga: 118 },
  { rt: "RT 02", rw: "RW 01", dusun: "Krajan", kk: 32, warga: 104 },
  { rt: "RT 03", rw: "RW 01", dusun: "Krajan", kk: 29, warga: 96 },
  { rt: "RT 04", rw: "RW 01", dusun: "Krajan", kk: 40, warga: 131 },
  { rt: "RT 05", rw: "RW 02", dusun: "Krajan", kk: 33, warga: 109 },
  { rt: "RT 06", rw: "RW 02", dusun: "Krajan", kk: 26, warga: 87 },
  { rt: "RT 07", rw: "RW 02", dusun: "Krajan", kk: 37, warga: 122 },
  { rt: "RT 08", rw: "RW 02", dusun: "Krajan", kk: 30, warga: 99 },
  { rt: "RT 09", rw: "RW 03", dusun: "Banjaran", kk: 28, warga: 92 },
  { rt: "RT 10", rw: "RW 03", dusun: "Banjaran", kk: 35, warga: 115 },
  { rt: "RT 11", rw: "RW 03", dusun: "Banjaran", kk: 31, warga: 103 },
  { rt: "RT 12", rw: "RW 03", dusun: "Banjaran", kk: 27, warga: 88 },
  { rt: "RT 13", rw: "RW 03", dusun: "Banjaran", kk: 38, warga: 127 },
  { rt: "RT 14", rw: "RW 03", dusun: "Banjaran", kk: 29, warga: 96 },
  { rt: "RT 15", rw: "RW 04", dusun: "Jumprit", kk: 34, warga: 111 },
  { rt: "RT 16", rw: "RW 04", dusun: "Jumprit", kk: 28, warga: 94 },
  { rt: "RT 17", rw: "RW 04", dusun: "Jumprit", kk: 32, warga: 106 },
  { rt: "RT 18", rw: "RW 04", dusun: "Jumprit", kk: 37, warga: 123 },
  { rt: "RT 19", rw: "RW 05", dusun: "Jumprit", kk: 26, warga: 85 },
  { rt: "RT 20", rw: "RW 05", dusun: "Jumprit", kk: 35, warga: 117 },
  { rt: "RT 21", rw: "RW 05", dusun: "Jumprit", kk: 31, warga: 102 },
  { rt: "RT 22", rw: "RW 06", dusun: "Tegalsari", kk: 30, warga: 98 },
  { rt: "RT 23", rw: "RW 06", dusun: "Tegalsari", kk: 38, warga: 124 },
  { rt: "RT 24", rw: "RW 06", dusun: "Tegalsari", kk: 27, warga: 91 },
  { rt: "RT 25", rw: "RW 06", dusun: "Tegalsari", kk: 34, warga: 113 },
  { rt: "RT 26", rw: "RW 07", dusun: "Tegalsari", kk: 32, warga: 107 },
  { rt: "RT 27", rw: "RW 07", dusun: "Tegalsari", kk: 27, warga: 89 },
  { rt: "RT 28", rw: "RW 07", dusun: "Tegalsari", kk: 35, warga: 111 },
] as const;

export const navigasi = [
  { label: "Beranda", href: "/" },
  { label: "Lapor", href: "/lapor" },
  { label: "UMKM", href: "/umkm" },
  { label: "Kesehatan", href: "/kesehatan" },
  { label: "Lingkungan", href: "/lingkungan" },
  { label: "Profil Desa", href: "/profil" },
] as const;

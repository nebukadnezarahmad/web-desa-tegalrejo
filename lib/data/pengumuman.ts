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

/**
 * Isinya sekarang tinggal di Supabase, tabel `pengumuman`. Berkas ini
 * menyisakan bentuk datanya saja. Untuk membacanya pakai
 * `lib/pengumuman/queries.ts`; petugas menambah lewat panel admin.
 */

export const kategoriPengumuman: KategoriPengumuman[] = [
  "Administrasi",
  "Kesehatan",
  "Lingkungan",
  "Ekonomi",
  "Kegiatan",
];

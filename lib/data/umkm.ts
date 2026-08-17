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

/**
 * Isinya sekarang tinggal di Supabase, tabel `produk_umkm`. Berkas ini
 * menyisakan bentuk datanya saja. Untuk membacanya pakai
 * `lib/umkm/queries.ts`; usulan warga masuk berstatus "menunggu" dan baru
 * tampil setelah petugas menerimanya.
 */

export const kategoriUmkm: KategoriUmkm[] = [
  "Makanan",
  "Kerajinan",
  "Pertanian",
  "Jasa",
];

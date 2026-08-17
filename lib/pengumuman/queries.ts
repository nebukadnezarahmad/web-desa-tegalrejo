import { klienAnon } from "@/lib/supabase/anon";
import type { Pengumuman } from "@/lib/data/pengumuman";

/**
 * Pembacaan pengumuman dari Supabase.
 *
 * Halaman yang memanggil fungsi di sini WAJIB memakai
 * `export const dynamic = "force-dynamic"`. Tanpa itu Next memprerender
 * hasilnya sekali saat build, dan pengumuman yang baru ditambahkan petugas
 * tidak akan pernah muncul sampai ada build ulang.
 *
 * Kegagalan koneksi dikembalikan sebagai daftar kosong, bukan lemparan
 * galat. Satu tabel yang sedang bermasalah tidak sepatutnya merobohkan
 * seluruh halaman.
 */

const KOLOM = "slug, judul, ringkasan, isi, kategori, tanggal, penerbit, penting";

export async function ambilSemuaPengumuman(): Promise<Pengumuman[]> {
  const { data, error } = await klienAnon()
    .from("pengumuman")
    .select(KOLOM)
    .order("tanggal", { ascending: false });

  if (error) {
    console.error("Gagal membaca pengumuman:", error.message);
    return [];
  }

  return (data ?? []) as Pengumuman[];
}

export async function ambilPengumumanTerbaru(batas = 3): Promise<Pengumuman[]> {
  const semua = await ambilSemuaPengumuman();
  return semua.slice(0, batas);
}

export async function ambilPengumuman(
  slug: string,
): Promise<Pengumuman | undefined> {
  const { data, error } = await klienAnon()
    .from("pengumuman")
    .select(KOLOM)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Gagal membaca pengumuman:", error.message);
    return undefined;
  }

  return (data as Pengumuman | null) ?? undefined;
}

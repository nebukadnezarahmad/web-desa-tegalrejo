import { klienAnon } from "@/lib/supabase/anon";
import type { Produk } from "@/lib/data/umkm";

/**
 * Pembacaan produk UMKM dari Supabase.
 *
 * Hanya baris berstatus "terbit" yang terbaca lewat kunci anon; kebijakan
 * RLS di Supabase yang menegakkannya, bukan filter di sini. Usulan warga
 * yang belum ditinjau memuat nomor WhatsApp yang belum diverifikasi, jadi
 * penyaringannya harus di sisi basis data.
 *
 * Halaman pemanggil wajib `export const dynamic = "force-dynamic"`.
 */

const KOLOM =
  "slug, nama, kategori, harga, satuan, deskripsi, detail, pemilik, usaha, rt, dusun, whatsapp, unggulan, foto";

export async function ambilSemuaProduk(): Promise<Produk[]> {
  const { data, error } = await klienAnon()
    .from("produk_umkm")
    .select(KOLOM)
    .eq("status", "terbit")
    .order("dibuat_pada", { ascending: true });

  if (error) {
    console.error("Gagal membaca produk UMKM:", error.message);
    return [];
  }

  return (data ?? []) as Produk[];
}

export async function ambilProduk(slug: string): Promise<Produk | undefined> {
  const { data, error } = await klienAnon()
    .from("produk_umkm")
    .select(KOLOM)
    .eq("slug", slug)
    .eq("status", "terbit")
    .maybeSingle();

  if (error) {
    console.error("Gagal membaca produk UMKM:", error.message);
    return undefined;
  }

  return (data as Produk | null) ?? undefined;
}

export async function ambilProdukUnggulan(batas = 4): Promise<Produk[]> {
  const semua = await ambilSemuaProduk();
  return semua.filter((p) => p.unggulan).slice(0, batas);
}

export async function produkLainDariPenjual(
  usaha: string,
  kecualiSlug: string,
): Promise<Produk[]> {
  const semua = await ambilSemuaProduk();
  return semua.filter((p) => p.usaha === usaha && p.slug !== kecualiSlug);
}

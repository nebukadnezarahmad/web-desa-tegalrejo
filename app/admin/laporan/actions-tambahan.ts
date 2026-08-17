"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { klienService } from "@/lib/supabase/service";
import { NAMA_COOKIE, tokenSesiValid } from "@/lib/admin/sesi";
import { kategoriPengumuman } from "@/lib/data/pengumuman";

export type HasilAksi = { berhasil: boolean; pesan: string } | null;

async function sesiAdminValid(): Promise<boolean> {
  const jar = await cookies();
  return tokenSesiValid(jar.get(NAMA_COOKIE)?.value);
}

/** Ubah judul jadi slug: huruf kecil, tanpa tanda baca, dipisah tanda hubung. */
function jadikanSlug(teks: string): string {
  return teks
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

// ------------------------------------------------------------------
// Menambah pengumuman
// ------------------------------------------------------------------

const SkemaPengumuman = z.object({
  judul: z.string().trim().min(8, "Judul minimal 8 karakter.").max(160),
  ringkasan: z.string().trim().min(20, "Ringkasan minimal 20 karakter.").max(400),
  isi: z.string().trim().min(40, "Isi pengumuman terlalu pendek."),
  kategori: z.enum(kategoriPengumuman as [string, ...string[]]),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal tidak valid."),
  penerbit: z.string().trim().min(3, "Penerbit wajib diisi.").max(120),
  penting: z.boolean(),
});

export async function tambahPengumuman(
  _sebelumnya: HasilAksi,
  formData: FormData,
): Promise<HasilAksi> {
  if (!(await sesiAdminValid())) {
    return { berhasil: false, pesan: "Sesi berakhir. Masuk kembali." };
  }

  const parsed = SkemaPengumuman.safeParse({
    judul: formData.get("judul"),
    ringkasan: formData.get("ringkasan"),
    isi: formData.get("isi"),
    kategori: formData.get("kategori"),
    tanggal: formData.get("tanggal"),
    penerbit: formData.get("penerbit"),
    penting: formData.get("penting") === "on",
  });

  if (!parsed.success) {
    return {
      berhasil: false,
      pesan: parsed.error.issues[0]?.message ?? "Data tidak valid.",
    };
  }

  const d = parsed.data;

  /* Satu baris kosong memisahkan paragraf. Kolomnya text[], jadi
     pemenggalan dilakukan di sini, bukan saat menampilkan. */
  const paragraf = d.isi
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  /* Slug harus unik. Kalau judulnya kebetulan sama dengan yang sudah ada,
     tanggal ditempelkan supaya tidak bentrok. */
  const dasar = jadikanSlug(d.judul);
  const supabase = klienService();
  const { data: bentrok } = await supabase
    .from("pengumuman")
    .select("slug")
    .eq("slug", dasar)
    .maybeSingle();

  const slug = bentrok ? `${dasar}-${d.tanggal}` : dasar;

  const { error } = await supabase.from("pengumuman").insert({
    slug,
    judul: d.judul,
    ringkasan: d.ringkasan,
    isi: paragraf,
    kategori: d.kategori,
    tanggal: d.tanggal,
    penerbit: d.penerbit,
    penting: d.penting,
  });

  if (error) {
    return { berhasil: false, pesan: `Gagal menyimpan: ${error.message}` };
  }

  revalidatePath("/pengumuman");
  revalidatePath("/");
  revalidatePath("/admin/laporan");

  return { berhasil: true, pesan: `Pengumuman "${d.judul}" sudah tayang.` };
}

// ------------------------------------------------------------------
// Meninjau usulan produk UMKM
// ------------------------------------------------------------------

const SkemaTinjau = z.object({
  id: z.string().uuid(),
  keputusan: z.enum(["terbit", "ditolak"]),
  catatanAdmin: z.string().trim().max(1000).optional(),
});

export async function tinjauUsulanProduk(
  _sebelumnya: HasilAksi,
  formData: FormData,
): Promise<HasilAksi> {
  if (!(await sesiAdminValid())) {
    return { berhasil: false, pesan: "Sesi berakhir. Masuk kembali." };
  }

  const parsed = SkemaTinjau.safeParse({
    id: formData.get("id"),
    keputusan: formData.get("keputusan"),
    catatanAdmin: formData.get("catatanAdmin") || undefined,
  });

  if (!parsed.success) {
    return { berhasil: false, pesan: "Data tidak valid." };
  }

  const { id, keputusan, catatanAdmin } = parsed.data;

  const { error } = await klienService()
    .from("produk_umkm")
    .update({ status: keputusan, catatan_admin: catatanAdmin ?? null })
    .eq("id", id);

  if (error) {
    return { berhasil: false, pesan: `Gagal menyimpan: ${error.message}` };
  }

  revalidatePath("/umkm");
  revalidatePath("/");
  revalidatePath("/admin/laporan");

  return {
    berhasil: true,
    pesan: keputusan === "terbit" ? "Produk sudah tayang." : "Usulan ditolak.",
  };
}

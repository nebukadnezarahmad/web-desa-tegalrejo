"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { klienService } from "@/lib/supabase/service";
import { kategoriUmkm } from "@/lib/data/umkm";

export type HasilUsulan = {
  berhasil: boolean;
  pesan: string;
  galat?: Record<string, string>;
} | null;

const BATAS_FOTO = 3 * 1024 * 1024; // 3 MB, sama dengan batas bucket
const TIPE_FOTO = ["image/jpeg", "image/png", "image/webp"];

const SkemaUsulan = z.object({
  nama: z.string().trim().min(3, "Nama produk minimal 3 karakter.").max(120),
  kategori: z.enum(kategoriUmkm as [string, ...string[]]),
  harga: z.coerce.number().int().min(0, "Harga tidak boleh negatif.").max(100_000_000),
  satuan: z.string().trim().min(1, "Satuan wajib diisi.").max(60),
  deskripsi: z.string().trim().min(20, "Deskripsi minimal 20 karakter.").max(400),
  detail: z.string().trim().max(2000).optional(),
  pemilik: z.string().trim().min(3, "Nama pemilik wajib diisi.").max(120),
  usaha: z.string().trim().min(3, "Nama usaha wajib diisi.").max(120),
  rt: z.string().trim().min(1, "RT wajib diisi.").max(20),
  dusun: z.string().trim().min(2, "Dusun wajib diisi.").max(60),
  whatsapp: z
    .string()
    .trim()
    .regex(/^0\d{8,14}$/, "Nomor WhatsApp diawali 0, panjang 9 sampai 15 angka."),
});

function jadikanSlug(teks: string): string {
  return teks
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Usulan produk dari warga. Selalu masuk berstatus "menunggu"; hanya
 * petugas yang bisa menerbitkannya. Kolom `unggulan` sengaja tidak
 * diterima dari formulir sama sekali.
 */
export async function usulkanProduk(
  _sebelumnya: HasilUsulan,
  formData: FormData,
): Promise<HasilUsulan> {
  const parsed = SkemaUsulan.safeParse({
    nama: formData.get("nama"),
    kategori: formData.get("kategori"),
    harga: formData.get("harga"),
    satuan: formData.get("satuan"),
    deskripsi: formData.get("deskripsi"),
    detail: formData.get("detail") || undefined,
    pemilik: formData.get("pemilik"),
    usaha: formData.get("usaha"),
    rt: formData.get("rt"),
    dusun: formData.get("dusun"),
    whatsapp: formData.get("whatsapp"),
  });

  if (!parsed.success) {
    const galat: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const kunci = String(i.path[0] ?? "");
      if (kunci && !galat[kunci]) galat[kunci] = i.message;
    }
    return { berhasil: false, pesan: "Periksa kembali isian yang ditandai.", galat };
  }

  const d = parsed.data;
  const supabase = klienService();

  /* Foto diperiksa di sini, bukan hanya mengandalkan batas bucket.
     Penolakan dari Storage datang belakangan dan pesannya tidak ramah. */
  let namaFoto: string | null = null;
  const foto = formData.get("foto");

  if (foto instanceof File && foto.size > 0) {
    if (!TIPE_FOTO.includes(foto.type)) {
      return {
        berhasil: false,
        pesan: "Foto harus berformat JPG, PNG, atau WebP.",
        galat: { foto: "Format tidak didukung." },
      };
    }
    if (foto.size > BATAS_FOTO) {
      return {
        berhasil: false,
        pesan: "Ukuran foto melebihi 3 MB.",
        galat: { foto: "Perkecil dulu fotonya." },
      };
    }

    const ekstensi = foto.type.split("/")[1].replace("jpeg", "jpg");
    const berkas = `${jadikanSlug(d.usaha)}-${Date.now()}.${ekstensi}`;

    const { error: galatUnggah } = await supabase.storage
      .from("produk-umkm")
      .upload(berkas, foto, { contentType: foto.type, upsert: false });

    if (galatUnggah) {
      return {
        berhasil: false,
        pesan: `Foto gagal diunggah: ${galatUnggah.message}`,
      };
    }

    namaFoto = berkas;
  }

  const dasar = jadikanSlug(d.nama);
  const { data: bentrok } = await supabase
    .from("produk_umkm")
    .select("slug")
    .eq("slug", dasar)
    .maybeSingle();

  const slug = bentrok ? `${dasar}-${Date.now().toString(36)}` : dasar;

  const detail = (d.detail ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const { error } = await supabase.from("produk_umkm").insert({
    slug,
    nama: d.nama,
    kategori: d.kategori,
    harga: d.harga,
    satuan: d.satuan,
    deskripsi: d.deskripsi,
    detail,
    pemilik: d.pemilik,
    usaha: d.usaha,
    rt: d.rt,
    dusun: d.dusun,
    whatsapp: d.whatsapp,
    foto: namaFoto,
    unggulan: false,
    status: "menunggu",
  });

  if (error) {
    return { berhasil: false, pesan: `Gagal mengirim usulan: ${error.message}` };
  }

  revalidatePath("/admin/laporan");

  return {
    berhasil: true,
    pesan:
      "Usulan terkirim. Petugas desa akan meninjau dan menghubungi lewat WhatsApp bila ada yang perlu dipastikan.",
  };
}

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { klienService } from "@/lib/supabase/service";
import { kategoriUmkm } from "@/lib/data/umkm";
import { buatKodeLacak, normalisasiKodeLacak } from "@/lib/lapor/kode-lacak";

export type HasilUsulan = {
  berhasil: boolean;
  pesan: string;
  kodeLacak?: string;
  galat?: Record<string, string>;
} | null;

export type StatusUsulan = {
  nama: string;
  kategori: string;
  status: "menunggu" | "terbit" | "ditolak";
  catatan_admin: string | null;
  dibuat_pada: string;
  diperbarui_pada: string;
};

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

    /* Disimpan sebagai URL penuh, bukan nama berkas. Foto bawaan ada di
       public/foto sedangkan unggahan warga ada di bucket Storage; tanpa
       pembeda, perangkai jalur akan menunjuk ke tempat yang salah. */
    const { data: pub } = supabase.storage.from("produk-umkm").getPublicUrl(berkas);
    namaFoto = pub.publicUrl;
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

  const kodeLacak = buatKodeLacak();

  const { error } = await supabase.from("produk_umkm").insert({
    slug,
    kode_lacak: kodeLacak,
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
    kodeLacak,
    pesan:
      "Petugas desa akan meninjau usulan ini. Simpan kode di bawah untuk memantau hasilnya.",
  };
}

/**
 * Pengecekan status usulan oleh warga.
 *
 * Memanggil fungsi SECURITY DEFINER di Supabase, bukan SELECT langsung:
 * kebijakan RLS hanya membuka baris berstatus terbit untuk peran anon,
 * padahal yang justru perlu dicek adalah usulan yang masih menunggu.
 * Fungsi itu hanya mengembalikan kolom aman, tanpa nomor WhatsApp maupun
 * nama pemilik.
 */
export async function cekStatusUsulan(
  _sebelumnya: { hasil?: StatusUsulan; pesan?: string } | null,
  formData: FormData,
): Promise<{ hasil?: StatusUsulan; pesan?: string } | null> {
  const kode = normalisasiKodeLacak(String(formData.get("kode") ?? ""));

  if (kode.length !== 9) {
    return { pesan: "Kode lacak terdiri dari 8 karakter, contoh 7ULP-AMZ6." };
  }

  const { data, error } = await klienService().rpc("cek_status_usulan", { kode });

  if (error) return { pesan: `Gagal memeriksa: ${error.message}` };

  const baris = (data as StatusUsulan[] | null)?.[0];
  if (!baris) return { pesan: "Kode itu tidak ditemukan. Periksa kembali." };

  return { hasil: baris };
}

"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { klienService } from "@/lib/supabase/service";
import { NAMA_COOKIE, tokenSesiValid } from "@/lib/admin/sesi";
import { kategoriPengumuman } from "@/lib/data/pengumuman";
import { catatRiwayat } from "@/lib/admin/riwayat";

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

  await catatRiwayat({
    entitas: "pengumuman", entitasId: slug, judul: d.judul,
    tindakan: "diterbitkan",
  });

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

  const { data: p } = await klienService()
    .from("produk_umkm").select("nama").eq("id", id).maybeSingle();

  await catatRiwayat({
    entitas: "produk", entitasId: id, judul: p?.nama ?? "Produk",
    tindakan: keputusan === "terbit" ? "usulan diterima" : "usulan ditolak",
    keterangan: catatanAdmin ?? null,
  });

  revalidatePath("/umkm");
  revalidatePath("/");
  revalidatePath("/admin/laporan");

  return {
    berhasil: true,
    pesan: keputusan === "terbit" ? "Produk sudah tayang." : "Usulan ditolak.",
  };
}

// ------------------------------------------------------------------
// Mengelola isi yang sudah terbit
// ------------------------------------------------------------------

const SkemaHapusPengumuman = z.object({ slug: z.string().min(1) });

export async function hapusPengumuman(
  _sebelumnya: HasilAksi,
  formData: FormData,
): Promise<HasilAksi> {
  if (!(await sesiAdminValid())) {
    return { berhasil: false, pesan: "Sesi berakhir. Masuk kembali." };
  }

  const parsed = SkemaHapusPengumuman.safeParse({ slug: formData.get("slug") });
  if (!parsed.success) return { berhasil: false, pesan: "Data tidak valid." };

  const supabase = klienService();
  const { data: lama } = await supabase
    .from("pengumuman").select("judul").eq("slug", parsed.data.slug).maybeSingle();

  const { error } = await supabase
    .from("pengumuman")
    .delete()
    .eq("slug", parsed.data.slug);

  if (error) return { berhasil: false, pesan: `Gagal menghapus: ${error.message}` };

  await catatRiwayat({
    entitas: "pengumuman", entitasId: parsed.data.slug,
    judul: lama?.judul ?? parsed.data.slug, tindakan: "dihapus",
  });

  revalidatePath("/pengumuman");
  revalidatePath("/");
  revalidatePath("/admin/laporan");
  return { berhasil: true, pesan: "Pengumuman dihapus." };
}

const SkemaKelolaProduk = z.object({
  id: z.string().uuid(),
  /* "tarik" mengembalikan produk ke antrean tinjauan, bukan menghapusnya.
     Menghapus akan melenyapkan data usaha warga yang mungkin masih dipakai. */
  tindakan: z.enum(["tarik", "hapus"]),
});

export async function kelolaProdukTerbit(
  _sebelumnya: HasilAksi,
  formData: FormData,
): Promise<HasilAksi> {
  if (!(await sesiAdminValid())) {
    return { berhasil: false, pesan: "Sesi berakhir. Masuk kembali." };
  }

  const parsed = SkemaKelolaProduk.safeParse({
    id: formData.get("id"),
    tindakan: formData.get("tindakan"),
  });
  if (!parsed.success) return { berhasil: false, pesan: "Data tidak valid." };

  const supabase = klienService();
  const { id, tindakan } = parsed.data;

  /* Nama dibaca sebelum tindakan dijalankan: kalau produknya dihapus,
     setelah itu tidak ada lagi yang bisa dibaca untuk riwayat. */
  const { data: lamaP } = await supabase
    .from("produk_umkm").select("nama").eq("id", id).maybeSingle();
  const nama = lamaP?.nama ?? "Produk";

  const { error } =
    tindakan === "hapus"
      ? await supabase.from("produk_umkm").delete().eq("id", id)
      : await supabase
          .from("produk_umkm")
          .update({ status: "menunggu" })
          .eq("id", id);

  if (error) return { berhasil: false, pesan: `Gagal: ${error.message}` };

  await catatRiwayat({
    entitas: "produk", entitasId: id, judul: nama,
    tindakan: tindakan === "hapus" ? "dihapus" : "ditarik dari lapak",
  });

  revalidatePath("/umkm");
  revalidatePath("/");
  revalidatePath("/admin/laporan");
  return {
    berhasil: true,
    pesan:
      tindakan === "hapus"
        ? "Produk dihapus."
        : "Produk ditarik dari lapak, kembali ke antrean tinjauan.",
  };
}

const SkemaSuntingProduk = z.object({
  id: z.string().uuid(),
  nama: z.string().trim().min(3, "Nama produk minimal 3 karakter.").max(120),
  kategori: z.enum(["Makanan", "Kerajinan", "Pertanian", "Jasa"]),
  harga: z.coerce.number().int().min(0, "Harga tidak boleh negatif.").max(100_000_000),
  satuan: z.string().trim().min(1, "Satuan wajib diisi.").max(60),
  deskripsi: z.string().trim().min(20, "Deskripsi minimal 20 karakter.").max(400),
  usaha: z.string().trim().min(3, "Nama usaha wajib diisi.").max(120),
  pemilik: z.string().trim().min(3, "Nama pemilik wajib diisi.").max(120),
  whatsapp: z
    .string()
    .trim()
    .regex(/^0\d{8,14}$/, "Nomor WhatsApp diawali 0, panjang 9 sampai 15 angka."),
  unggulan: z.boolean(),
});

/**
 * Penyuntingan produk oleh petugas.
 *
 * Slug sengaja tidak ikut berubah walau namanya diganti. Tautan produk
 * mungkin sudah tersebar di grup warga, dan mengubah slug akan mematikan
 * tautan itu tanpa pemberitahuan.
 */
export async function suntingProduk(
  _sebelumnya: HasilAksi,
  formData: FormData,
): Promise<HasilAksi> {
  if (!(await sesiAdminValid())) {
    return { berhasil: false, pesan: "Sesi berakhir. Masuk kembali." };
  }

  const parsed = SkemaSuntingProduk.safeParse({
    id: formData.get("id"),
    nama: formData.get("nama"),
    kategori: formData.get("kategori"),
    harga: formData.get("harga"),
    satuan: formData.get("satuan"),
    deskripsi: formData.get("deskripsi"),
    usaha: formData.get("usaha"),
    pemilik: formData.get("pemilik"),
    whatsapp: formData.get("whatsapp"),
    unggulan: formData.get("unggulan") === "on",
  });

  if (!parsed.success) {
    return {
      berhasil: false,
      pesan: parsed.error.issues[0]?.message ?? "Data tidak valid.",
    };
  }

  const { id, ...isi } = parsed.data;

  const { error } = await klienService()
    .from("produk_umkm")
    .update(isi)
    .eq("id", id);

  if (error) return { berhasil: false, pesan: `Gagal menyimpan: ${error.message}` };

  await catatRiwayat({
    entitas: "produk", entitasId: id, judul: isi.nama, tindakan: "disunting",
  });

  revalidatePath("/umkm");
  revalidatePath("/");
  revalidatePath("/admin/laporan");
  return { berhasil: true, pesan: "Perubahan tersimpan." };
}

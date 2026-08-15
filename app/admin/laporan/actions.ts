"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { klienService } from "@/lib/supabase/service";
import { NAMA_COOKIE, tokenSesiValid } from "@/lib/admin/sesi";
import { daftarStatusLaporan } from "@/lib/lapor/types";

const SkemaUbahStatus = z.object({
  id: z.string().uuid(),
  status: z.enum(daftarStatusLaporan as [string, ...string[]]),
  catatanAdmin: z.string().trim().max(1000).optional(),
});

export type HasilUbahStatus = { berhasil: boolean; pesan: string } | null;

async function sesiAdminValid(): Promise<boolean> {
  const jar = await cookies();
  return tokenSesiValid(jar.get(NAMA_COOKIE)?.value);
}

export async function ubahStatusLaporan(
  _sebelumnya: HasilUbahStatus,
  formData: FormData,
): Promise<HasilUbahStatus> {
  // Diverifikasi ulang di sini (bukan cuma di proxy.ts). Pertahanan
  // berlapis kalau suatu saat action ini dipanggil dari jalur lain.
  if (!(await sesiAdminValid())) {
    return { berhasil: false, pesan: "Sesi berakhir. Masuk kembali." };
  }

  const parsed = SkemaUbahStatus.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    catatanAdmin: formData.get("catatanAdmin") || undefined,
  });

  if (!parsed.success) {
    return { berhasil: false, pesan: "Data tidak valid." };
  }

  const supabase = klienService();
  const { error } = await supabase
    .from("laporan_warga")
    .update({
      status: parsed.data.status,
      catatan_admin: parsed.data.catatanAdmin || null,
    })
    .eq("id", parsed.data.id);

  if (error) {
    return { berhasil: false, pesan: "Gagal menyimpan. Coba lagi." };
  }

  revalidatePath("/admin/laporan");
  return { berhasil: true, pesan: "Tersimpan." };
}

const SkemaHapus = z.object({ id: z.string().uuid() });

export type HasilHapus = { berhasil: boolean; pesan: string } | null;

export async function hapusLaporan(
  _sebelumnya: HasilHapus,
  formData: FormData,
): Promise<HasilHapus> {
  if (!(await sesiAdminValid())) {
    return { berhasil: false, pesan: "Sesi berakhir. Masuk kembali." };
  }

  const parsed = SkemaHapus.safeParse({ id: formData.get("id") });
  if (!parsed.success) {
    return { berhasil: false, pesan: "Data tidak valid." };
  }

  const supabase = klienService();
  const { error } = await supabase
    .from("laporan_warga")
    .delete()
    .eq("id", parsed.data.id);

  if (error) {
    return { berhasil: false, pesan: "Gagal menghapus. Coba lagi." };
  }

  revalidatePath("/admin/laporan");
  return { berhasil: true, pesan: "Laporan dihapus." };
}

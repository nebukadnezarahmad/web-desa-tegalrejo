"use server";

import { z } from "zod";
import { klienAnon } from "@/lib/supabase/anon";
import { buatKodeLacak, normalisasiKodeLacak } from "@/lib/lapor/kode-lacak";
import { daftarKategoriLaporan } from "@/lib/lapor/types";
import type { StatusLaporanPublik } from "@/lib/lapor/types";

const SkemaLaporan = z.object({
  kategori: z.enum(daftarKategoriLaporan as [string, ...string[]]),
  lokasi: z.string().trim().min(5, "Lokasi terlalu singkat").max(200),
  deskripsi: z.string().trim().min(10, "Ceritakan sedikit lebih detail").max(2000),
  namaPelapor: z.string().trim().max(100).optional(),
  kontak: z.string().trim().max(30).optional(),
});

export type HasilKirimLaporan =
  | { berhasil: true; kodeLacak: string }
  | { berhasil: false; pesan: string };

export async function kirimLaporan(
  _sebelumnya: HasilKirimLaporan | null,
  formData: FormData,
): Promise<HasilKirimLaporan> {
  const parsed = SkemaLaporan.safeParse({
    kategori: formData.get("kategori"),
    lokasi: formData.get("lokasi"),
    deskripsi: formData.get("deskripsi"),
    namaPelapor: formData.get("namaPelapor") || undefined,
    kontak: formData.get("kontak") || undefined,
  });

  if (!parsed.success) {
    const pesanPertama = parsed.error.issues[0]?.message ?? "Data belum lengkap.";
    return { berhasil: false, pesan: pesanPertama };
  }

  const { kategori, lokasi, deskripsi, namaPelapor, kontak } = parsed.data;
  const supabase = klienAnon();

  // Coba sampai 3x kalau kode lacak kebetulan bentrok (peluangnya sangat kecil).
  for (let percobaan = 0; percobaan < 3; percobaan++) {
    const kodeLacak = buatKodeLacak();
    const { error } = await supabase.from("laporan_warga").insert({
      kode_lacak: kodeLacak,
      kategori,
      lokasi,
      deskripsi,
      nama_pelapor: namaPelapor || null,
      kontak: kontak || null,
    });

    if (!error) return { berhasil: true, kodeLacak };
    if (error.code !== "23505") {
      // Bukan pelanggaran unique constraint, jadi tidak ada gunanya diulang.
      return {
        berhasil: false,
        pesan: "Laporan gagal dikirim. Coba lagi sebentar lagi.",
      };
    }
  }

  return {
    berhasil: false,
    pesan: "Terjadi kendala teknis. Coba kirim ulang laporannya.",
  };
}

export type HasilCekStatus =
  | { ditemukan: true; laporan: StatusLaporanPublik }
  | { ditemukan: false };

export async function cekStatusLaporan(kodeInput: string): Promise<HasilCekStatus> {
  const kode = normalisasiKodeLacak(kodeInput);
  if (kode.length !== 9) return { ditemukan: false };

  const supabase = klienAnon();
  const { data, error } = await supabase
    .rpc("cek_status_laporan", { input_kode: kode })
    .single();

  if (error || !data) return { ditemukan: false };
  return { ditemukan: true, laporan: data as StatusLaporanPublik };
}

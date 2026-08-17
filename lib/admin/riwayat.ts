import { klienService } from "@/lib/supabase/service";

export type EntitasRiwayat = "produk" | "pengumuman" | "laporan";

/**
 * Mencatat tindakan petugas.
 *
 * Judul disimpan sebagai teks, bukan kunci asing ke baris aslinya.
 * Tindakan yang paling perlu dilacak justru penghapusan, dan kunci asing
 * akan ikut lenyap bersama barisnya sehingga riwayatnya jadi kosong.
 *
 * Kegagalan pencatatan sengaja tidak dilemparkan. Riwayat itu catatan
 * pendamping; kalau ia gagal, tindakan utamanya tetap sudah berhasil dan
 * tidak sepatutnya dibatalkan atau dilaporkan gagal kepada petugas.
 */
export async function catatRiwayat(isi: {
  entitas: EntitasRiwayat;
  entitasId?: string | null;
  judul: string;
  tindakan: string;
  keterangan?: string | null;
}): Promise<void> {
  const { error } = await klienService().from("riwayat_admin").insert({
    entitas: isi.entitas,
    entitas_id: isi.entitasId ?? null,
    judul: isi.judul,
    tindakan: isi.tindakan,
    keterangan: isi.keterangan ?? null,
  });

  if (error) console.error("Gagal mencatat riwayat:", error.message);
}

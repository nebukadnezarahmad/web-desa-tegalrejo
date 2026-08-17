"use client";

import { useActionState } from "react";
import { MagnifyingGlassIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cekStatusUsulan } from "@/app/umkm/actions";
import { formatTanggal } from "@/lib/utils";

const gaya = {
  menunggu: { label: "Menunggu tinjauan", ikon: ClockIcon, kelas: "border-warn/30 bg-warn-soft text-warn" },
  terbit: { label: "Diterima dan tayang", ikon: CheckCircleIcon, kelas: "border-green/30 bg-green-soft text-green-deep" },
  ditolak: { label: "Belum bisa ditayangkan", ikon: XCircleIcon, kelas: "border-danger/30 bg-danger-soft text-danger" },
} as const;

/**
 * Pengecekan status usulan produk oleh warga.
 *
 * Sengaja tidak memerlukan login. Warga desa yang mengajukan produk tidak
 * punya akun, dan kode lacak sudah cukup sebagai penanda kepemilikan
 * selama data yang dikembalikan tidak memuat kontak siapa pun.
 */
export function CekStatusUsulan() {
  const [hasil, kirim, memeriksa] = useActionState(cekStatusUsulan, null);
  const s = hasil?.hasil;
  const g = s ? gaya[s.status] : null;

  return (
    <div className="mt-5 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6">
      <form action={kirim} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="kode-usulan" className="text-[0.875rem] font-semibold text-ink">
            Sudah pernah mengajukan? Cek statusnya
          </label>
          <Input
            id="kode-usulan"
            name="kode"
            placeholder="Contoh: 7ULP-AMZ6"
            className="mt-1.5 font-mono uppercase"
          />
        </div>
        <Button type="submit" variant="outline" disabled={memeriksa}>
          <MagnifyingGlassIcon size={17} weight="bold" />
          {memeriksa ? "Memeriksa…" : "Cek"}
        </Button>
      </form>

      {hasil?.pesan && (
        <p role="alert" className="mt-3 text-[0.875rem] text-danger">
          {hasil.pesan}
        </p>
      )}

      {s && g && (
        <div className={`mt-4 rounded-[var(--radius-card)] border p-4 ${g.kelas}`}>
          <p className="flex items-center gap-2 font-bold">
            <g.ikon size={19} weight="duotone" />
            {g.label}
          </p>
          <p className="mt-2 text-[0.9375rem] text-ink">
            {s.nama} <span className="text-ink-muted">· {s.kategori}</span>
          </p>
          {s.catatan_admin && (
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ink">
              Catatan petugas: {s.catatan_admin}
            </p>
          )}
          <p className="mt-2 text-[0.8125rem] text-ink-muted">
            Diajukan {formatTanggal(s.dibuat_pada.slice(0, 10))} · terakhir
            diperbarui {formatTanggal(s.diperbarui_pada.slice(0, 10))}
          </p>
        </div>
      )}
    </div>
  );
}

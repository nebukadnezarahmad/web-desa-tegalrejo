"use client";

import { useActionState, useEffect, useState } from "react";
import {
  MapPinIcon,
  CalendarBlankIcon,
  UserIcon,
  PhoneIcon,
  FloppyDiskIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ubahStatusLaporan, hapusLaporan } from "@/app/admin/laporan/actions";
import { formatTanggal } from "@/lib/utils";
import type { Laporan, StatusLaporan } from "@/lib/lapor/types";
import { daftarStatusLaporan } from "@/lib/lapor/types";

const labelStatus: Record<StatusLaporan, string> = {
  menunggu: "Menunggu Tinjauan",
  diterima: "Diterima",
  diproses: "Sedang Diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

const toneStatus: Record<StatusLaporan, "blue" | "warn" | "green" | "danger" | "netral"> = {
  menunggu: "netral",
  diterima: "blue",
  diproses: "warn",
  selesai: "green",
  ditolak: "danger",
};

export function KartuLaporanAdmin({ laporan }: { laporan: Laporan }) {
  const [hasil, kirim, mengirim] = useActionState(ubahStatusLaporan, null);
  const [hasilHapus, kirimHapus, menghapus] = useActionState(hapusLaporan, null);
  const [konfirmHapus, setKonfirmHapus] = useState(false);

  // Status & catatan dikontrol manual (bukan defaultValue) supaya tampilan
  // ikut memperbarui diri setelah simpan berhasil. React mereset field
  // form yang tak terkontrol begitu sebuah form action selesai.
  const [status, setStatus] = useState<StatusLaporan>(laporan.status);
  const [catatan, setCatatan] = useState(laporan.catatan_admin ?? "");

  useEffect(() => {
    setStatus(laporan.status);
    setCatatan(laporan.catatan_admin ?? "");
  }, [laporan.status, laporan.catatan_admin]);

  return (
    <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge tone={toneStatus[laporan.status]}>
            {labelStatus[laporan.status]}
          </Badge>
          <h3 className="mt-3 text-lg font-bold text-ink">{laporan.kategori}</h3>
        </div>
        <span className="rounded-full bg-surface-soft px-3 py-1 font-mono text-xs text-ink-muted">
          {laporan.kode_lacak}
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-2 text-[0.9375rem] text-ink-muted">
        <li className="flex gap-2.5">
          <MapPinIcon size={18} weight="duotone" className="mt-0.5 shrink-0 text-blue-strong" />
          {laporan.lokasi}
        </li>
        {laporan.nama_pelapor && (
          <li className="flex gap-2.5">
            <UserIcon size={18} weight="duotone" className="mt-0.5 shrink-0 text-blue-strong" />
            {laporan.nama_pelapor}
          </li>
        )}
        {laporan.kontak && (
          <li className="flex gap-2.5">
            <PhoneIcon size={18} weight="duotone" className="mt-0.5 shrink-0 text-blue-strong" />
            {laporan.kontak}
          </li>
        )}
        <li className="flex gap-2.5">
          <CalendarBlankIcon size={18} weight="duotone" className="mt-0.5 shrink-0 text-blue-strong" />
          Dikirim {formatTanggal(laporan.created_at.slice(0, 10))}
        </li>
      </ul>

      <p className="mt-4 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink">
        {laporan.deskripsi}
      </p>

      <form action={kirim} className="mt-6 flex flex-col gap-4 border-t border-line pt-6">
        <input type="hidden" name="id" value={laporan.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">
              Status
            </label>
            <Select name="status" value={status} onValueChange={(v) => setStatus(v as StatusLaporan)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {daftarStatusLaporan.map((status) => (
                  <SelectItem key={status} value={status}>
                    {labelStatus[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Catatan untuk warga (opsional)
          </label>
          <Textarea
            name="catatanAdmin"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            rows={3}
            placeholder="Contoh: sudah dijadwalkan perbaikan minggu depan."
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="info" disabled={mengirim}>
            <FloppyDiskIcon size={18} weight="bold" />
            {mengirim ? "Menyimpan…" : "Simpan perubahan"}
          </Button>
          {hasil && (
            <span
              className={hasil.berhasil ? "text-sm text-green-strong" : "text-sm text-danger"}
            >
              {hasil.pesan}
            </span>
          )}
        </div>
      </form>

      <div className="mt-5 border-t border-line pt-5">
        {konfirmHapus ? (
          <form action={kirimHapus} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="id" value={laporan.id} />
            <span className="text-sm text-danger">
              Hapus permanen laporan ini? Tidak bisa dibatalkan.
            </span>
            <Button type="submit" variant="outline" size="sm" disabled={menghapus} className="border-danger/40 text-danger hover:border-danger hover:text-danger">
              {menghapus ? "Menghapus…" : "Ya, hapus"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setKonfirmHapus(false)}
            >
              Batal
            </Button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setKonfirmHapus(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-ink-faint transition-colors hover:text-danger"
          >
            <TrashIcon size={16} weight="bold" />
            Hapus laporan
          </button>
        )}
        {hasilHapus && !hasilHapus.berhasil && (
          <p className="mt-2 text-sm text-danger">{hasilHapus.pesan}</p>
        )}
      </div>
    </div>
  );
}

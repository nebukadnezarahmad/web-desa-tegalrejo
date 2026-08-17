"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  MapPinIcon,
  CalendarBlankIcon,
  PencilSimpleIcon,
  CheckCircleIcon,
  WarningIcon,
  UserIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import {
  ubahStatusLaporan,
  type HasilUbahStatus,
} from "@/app/admin/laporan/actions";
import { daftarStatusLaporan } from "@/lib/lapor/types";
import type { Laporan, StatusLaporan } from "@/lib/lapor/types";
import { formatTanggal } from "@/lib/utils";

const gayaStatus: Record<
  StatusLaporan,
  { label: string; tone: "green" | "blue" | "warn" | "danger" | "netral" }
> = {
  menunggu: { label: "Menunggu", tone: "netral" },
  diterima: { label: "Diterima", tone: "blue" },
  diproses: { label: "Diproses", tone: "warn" },
  selesai: { label: "Selesai", tone: "green" },
  ditolak: { label: "Ditolak", tone: "danger" },
};

const awal: HasilUbahStatus = null;

/**
 * Kartu ringkas satu laporan.
 *
 * Formulir penyuntingan sengaja tidak ikut tampil di kartu. Dengan lima
 * laporan saja, lima select dan lima kotak catatan yang terbuka sekaligus
 * membuat halaman panjang dan sulit dipindai; petugas kehilangan gambaran
 * menyeluruh atas antrean. Kartu menampilkan yang perlu dibaca sekilas,
 * penyuntingan pindah ke pop-out.
 */
export function KartuLaporanAdmin({ laporan }: { laporan: Laporan }) {
  const gaya = gayaStatus[laporan.status];

  return (
    <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <Badge tone={gaya.tone}>{gaya.label}</Badge>
        <span className="shrink-0 rounded-full bg-surface-soft px-2.5 py-1 font-mono text-[0.75rem] tracking-tight text-ink-faint">
          {laporan.kode_lacak}
        </span>
      </div>

      <h3 className="mt-3 text-[1.0625rem] font-bold text-ink">
        {laporan.kategori}
      </h3>

      <dl className="mt-2.5 flex flex-col gap-1.5 text-[0.875rem] text-ink-muted">
        <div className="flex items-start gap-2">
          <dt className="sr-only">Lokasi</dt>
          <MapPinIcon size={16} weight="duotone" className="mt-0.5 shrink-0 text-blue-strong" />
          <dd>{laporan.lokasi}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="sr-only">Dikirim</dt>
          <CalendarBlankIcon size={16} weight="duotone" className="mt-0.5 shrink-0 text-ink-faint" />
          <dd>Dikirim {formatTanggal(laporan.created_at.slice(0, 10))}</dd>
        </div>
      </dl>

      <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink">
        {laporan.deskripsi}
      </p>

      {laporan.catatan_admin && (
        <p className="mt-3 rounded-[var(--radius-chip)] bg-blue-soft/60 px-3 py-2 text-[0.8125rem] leading-relaxed text-blue-deep">
          {laporan.catatan_admin}
        </p>
      )}

      {/* mt-auto menempelkan tombol ke dasar kartu supaya seluruh kartu
          dalam satu baris grid punya tepi bawah yang sejajar. */}
      <div className="mt-auto pt-4">
        <DialogTinjau laporan={laporan} />
      </div>
    </article>
  );
}

function DialogTinjau({ laporan }: { laporan: Laporan }) {
  /* Sama seperti dialog usulan warga: state useActionState hidup di atas
     DialogContent, jadi tidak ikut lenyap saat Radix melepas isinya. Tanpa
     pemasangan ulang, petugas yang membuka kembali laporan yang sama akan
     langsung melihat pesan "Tersimpan" lama sebelum menyentuh apa pun. */
  const [sesi, setSesi] = React.useState(0);
  const [terbuka, setTerbuka] = React.useState(false);

  return (
    <Dialog
      open={terbuka}
      onOpenChange={(buka) => {
        setTerbuka(buka);
        if (!buka) setSesi((n) => n + 1);
      }}
    >
      <IsiDialogTinjau key={sesi} laporan={laporan} />
    </Dialog>
  );
}

function IsiDialogTinjau({ laporan }: { laporan: Laporan }) {
  const [hasil, kirim, menyimpan] = useActionState(ubahStatusLaporan, awal);

  return (
    <>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="w-full">
          <PencilSimpleIcon size={16} weight="bold" />
          Tinjau laporan
        </Button>
      </DialogTrigger>

      <DialogContent
        judul={laporan.kategori}
        deskripsi={`Kode lacak ${laporan.kode_lacak}`}
      >
        <dl className="flex flex-col gap-2.5 rounded-[var(--radius-card)] border border-line bg-surface-soft p-4 text-[0.875rem]">
          <Baris ikon={MapPinIcon} label="Lokasi" nilai={laporan.lokasi} />
          <Baris
            ikon={UserIcon}
            label="Pelapor"
            nilai={laporan.nama_pelapor ?? "Tanpa nama"}
          />
          {laporan.kontak && (
            <Baris ikon={PhoneIcon} label="Kontak" nilai={laporan.kontak} />
          )}
          <Baris
            ikon={CalendarBlankIcon}
            label="Dikirim"
            nilai={formatTanggal(laporan.created_at.slice(0, 10))}
          />
        </dl>

        <p className="mt-4 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink">
          {laporan.deskripsi}
        </p>

        <form action={kirim} className="mt-5 flex flex-col gap-4 border-t border-line pt-5">
          <input type="hidden" name="id" value={laporan.id} />

          <div>
            <Label htmlFor={`status-${laporan.id}`}>Status</Label>
            <select
              id={`status-${laporan.id}`}
              name="status"
              /* Radix melepas isi dialog saat ditutup, jadi select selalu
                 dipasang ulang dengan nilai terbaru dari basis data. Itu
                 sudah cukup; tidak perlu state yang disinkronkan efek. */
              defaultValue={laporan.status}
              className="mt-1.5 h-11 w-full cursor-pointer rounded-[var(--radius-chip)] border border-line-strong bg-surface px-3.5 text-[0.9375rem] text-ink transition-colors hover:border-blue focus:border-blue-strong"
            >
              {daftarStatusLaporan.map((s) => (
                <option key={s} value={s}>
                  {gayaStatus[s].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor={`catatan-${laporan.id}`}>
              Catatan untuk warga (opsional)
            </Label>
            <Textarea
              id={`catatan-${laporan.id}`}
              name="catatanAdmin"
              rows={3}
              defaultValue={laporan.catatan_admin ?? ""}
              className="mt-1.5"
              placeholder="Contoh: sudah dijadwalkan perbaikan minggu depan."
            />
          </div>

          {hasil && (
            <p
              role="status"
              className={
                hasil.berhasil
                  ? "flex items-start gap-2 text-[0.875rem] text-green-strong"
                  : "flex items-start gap-2 text-[0.875rem] text-danger"
              }
            >
              {hasil.berhasil ? (
                <CheckCircleIcon size={17} weight="duotone" className="mt-0.5 shrink-0" />
              ) : (
                <WarningIcon size={17} weight="duotone" className="mt-0.5 shrink-0" />
              )}
              {hasil.pesan}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                {hasil?.berhasil ? "Tutup" : "Batal"}
              </Button>
            </DialogClose>
            <Button type="submit" variant="info" disabled={menyimpan}>
              {menyimpan ? "Menyimpan…" : "Simpan perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </>
  );
}

function Baris({
  ikon: Ikon,
  label,
  nilai,
}: {
  ikon: typeof MapPinIcon;
  label: string;
  nilai: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Ikon size={16} weight="duotone" className="mt-0.5 shrink-0 text-blue-strong" />
      <dt className="sr-only">{label}</dt>
      <dd className="text-ink">{nilai}</dd>
    </div>
  );
}

"use client";

import * as React from "react";
import { useActionState } from "react";
import { CheckCircleIcon, WarningIcon, MegaphoneIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  tambahPengumuman,
  type HasilAksi,
} from "@/app/admin/laporan/actions-tambahan";
import { kategoriPengumuman } from "@/lib/data/pengumuman";

const awal: HasilAksi = null;

export function FormPengumuman({ hariIni }: { hariIni: string }) {
  const [hasil, kirim, mengirim] = useActionState(tambahPengumuman, awal);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (hasil?.berhasil) formRef.current?.reset();
  }, [hasil]);

  return (
    <form
      ref={formRef}
      action={kirim}
      className="rounded-[var(--radius-panel)] border border-line bg-surface p-5 sm:p-7"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-soft">
          <MegaphoneIcon size={22} weight="duotone" className="text-blue-strong" />
        </span>
        <div>
          <h3 className="font-bold text-ink">Tambah pengumuman</h3>
          <p className="text-[0.8125rem] text-ink-muted">
            Langsung tayang di halaman pengumuman setelah disimpan.
          </p>
        </div>
      </div>

      {hasil && (
        <p
          role="status"
          className={
            hasil.berhasil
              ? "mb-5 flex items-start gap-2.5 rounded-[var(--radius-card)] border border-green/30 bg-green-soft p-3.5 text-[0.875rem] text-green-deep"
              : "mb-5 flex items-start gap-2.5 rounded-[var(--radius-card)] border border-danger/30 bg-danger-soft p-3.5 text-[0.875rem] text-danger"
          }
        >
          {hasil.berhasil ? (
            <CheckCircleIcon size={18} weight="duotone" className="mt-0.5 shrink-0" />
          ) : (
            <WarningIcon size={18} weight="duotone" className="mt-0.5 shrink-0" />
          )}
          {hasil.pesan}
        </p>
      )}

      <div className="flex flex-col gap-5">
        <div>
          <Label htmlFor="judul">Judul</Label>
          <Input id="judul" name="judul" required className="mt-1.5"
            placeholder="Contoh: Pemutakhiran Data Kartu Keluarga Tahap II" />
        </div>

        <div>
          <Label htmlFor="ringkasan">Ringkasan</Label>
          <Textarea id="ringkasan" name="ringkasan" rows={2} required className="mt-1.5"
            placeholder="Satu kalimat yang tampil di daftar pengumuman." />
        </div>

        <div>
          <Label htmlFor="isi">Isi lengkap</Label>
          <Textarea id="isi" name="isi" rows={7} required className="mt-1.5"
            placeholder="Pisahkan tiap paragraf dengan satu baris kosong." />
          <p className="mt-1.5 text-[0.8125rem] text-ink-faint">
            Satu baris kosong memisahkan paragraf.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="kategori-pengumuman">Kategori</Label>
            <select
              id="kategori-pengumuman"
              name="kategori"
              required
              defaultValue=""
              className="mt-1.5 h-11 w-full cursor-pointer rounded-[var(--radius-chip)] border border-line-strong bg-surface px-3.5 text-[0.9375rem] text-ink transition-colors hover:border-blue focus:border-blue-strong"
            >
              <option value="" disabled>Pilih</option>
              {kategoriPengumuman.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input id="tanggal" name="tanggal" type="date" required
              defaultValue={hariIni} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="penerbit">Penerbit</Label>
            <Input id="penerbit" name="penerbit" required className="mt-1.5"
              placeholder="Sekretariat Desa" />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface-soft p-4">
          <input type="checkbox" name="penting"
            className="h-5 w-5 cursor-pointer accent-[var(--blue-strong)]" />
          <span className="text-[0.9375rem] text-ink">
            Tandai penting
            <span className="block text-[0.8125rem] text-ink-muted">
              Diberi penanda mencolok di daftar pengumuman.
            </span>
          </span>
        </label>

        <div className="flex justify-end">
          <Button type="submit" variant="info" disabled={mengirim}>
            {mengirim ? "Menyimpan…" : "Simpan dan tayangkan"}
          </Button>
        </div>
      </div>
    </form>
  );
}

"use client";

import * as React from "react";
import {
  TruckIcon,
  MapPinIcon,
  UsersThreeIcon,
  RecycleIcon,
} from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/input";
import { jadwalSampah } from "@/lib/data/sampah";
import { desa } from "@/lib/data/desa";
import { cn } from "@/lib/utils";

const semuaHari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export function JadwalSampah() {
  const [rt, setRt] = React.useState(jadwalSampah[0].rt);
  const terpilih = jadwalSampah.find((j) => j.rt === rt) ?? jadwalSampah[0];

  return (
    /* minmax(0,1fr) di layar kecil: tanpa itu kolom tunggal melebar
       mengikuti lebar isi baris chip dan konten meluber dari layar. */
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-10">
      <div className="min-w-0 rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-soft">
            <TruckIcon size={22} weight="duotone" className="text-green-strong" />
          </span>
          <div>
            <h3 className="font-bold text-ink">Pilih RT</h3>
            <p className="text-[0.8125rem] text-ink-muted">
              {desa.jumlahRt} RT, {desa.jumlahDusun} dusun
            </p>
          </div>
        </div>

        <Label htmlFor="pilih-rt">RT tempat tinggal</Label>
        <Select value={rt} onValueChange={setRt}>
          <SelectTrigger id="pilih-rt" aria-label="Pilih RT tempat tinggal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {jadwalSampah.map((j) => (
              <SelectItem key={j.rt} value={j.rt}>
                {j.rt}, Dusun {j.dusun}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="mt-6 border-t border-line pt-5 text-[0.8125rem] leading-relaxed text-ink-muted">
          Letakkan sampah yang sudah terpilah di titik kumpul sebelum pukul 06.30
          WIB pada hari angkut.
        </p>
      </div>

      <div aria-live="polite" className="min-w-0">
        <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
          <div className="mb-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-[1.75rem] font-extrabold text-ink">
              {terpilih.rt}
            </h3>
            <p className="text-[0.9375rem] text-ink-muted">
              Dusun {terpilih.dusun}
            </p>
          </div>

          {/* Hari angkut */}
          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-green-strong">
              Hari angkut
            </p>
            <ul className="baris-gulir">
              {semuaHari.map((h) => {
                const angkut = terpilih.hari.includes(h);
                return (
                  <li
                    key={h}
                    className={cn(
                      "flex h-11 items-center rounded-full border px-4 text-[0.9375rem] font-semibold",
                      angkut
                        ? "border-green-strong bg-green-strong text-white"
                        : "border-line bg-surface-soft text-ink-faint",
                    )}
                  >
                    {h}
                    {angkut && <span className="sr-only">, hari angkut</span>}
                  </li>
                );
              })}
            </ul>
          </div>

          <dl className="grid gap-5 border-t border-line pt-6 sm:grid-cols-3">
            <div className="flex gap-3">
              <MapPinIcon
                size={20}
                weight="duotone"
                className="mt-0.5 shrink-0 text-green-strong"
              />
              <div>
                <dt className="text-[0.8125rem] text-ink-faint">Titik kumpul</dt>
                <dd className="mt-0.5 text-[0.9375rem] font-semibold text-ink">
                  {terpilih.titikKumpul}
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <RecycleIcon
                size={20}
                weight="duotone"
                className="mt-0.5 shrink-0 text-green-strong"
              />
              <div>
                <dt className="text-[0.8125rem] text-ink-faint">
                  Jenis dilayani
                </dt>
                <dd className="mt-0.5 text-[0.9375rem] font-semibold text-ink">
                  {terpilih.jenis}
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <UsersThreeIcon
                size={20}
                weight="duotone"
                className="mt-0.5 shrink-0 text-blue-strong"
              />
              <div>
                <dt className="text-[0.8125rem] text-ink-faint">Petugas</dt>
                <dd className="mt-0.5 text-[0.9375rem] font-semibold text-ink">
                  {terpilih.petugas}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

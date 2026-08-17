"use client";

import * as React from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  TagIcon,
  FileTextIcon,
} from "@phosphor-icons/react";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Layanan } from "@/lib/data/profil";

/**
 * Kartu jenis surat di beranda, dibuka sebagai pop-out.
 *
 * Sebelumnya keenam kartu menaut ke /profil#layanan, sehingga warga yang
 * cuma ingin tahu berkas satu surat harus berpindah halaman lalu mencari
 * sendiri surat yang tadi diklik di antara enam akordeon. Isinya sama
 * persis dengan akordeon di halaman profil; yang berubah cuma cara
 * membukanya.
 */
export function KartuLayananSurat({ layanan }: { layanan: Layanan[] }) {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {layanan.map((l) => (
        <li key={l.nama}>
          <SatuKartu layanan={l} />
        </li>
      ))}
    </ul>
  );
}

function SatuKartu({ layanan }: { layanan: Layanan }) {
  const [terbuka, setTerbuka] = React.useState(false);

  return (
    <Dialog open={terbuka} onOpenChange={setTerbuka}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex h-full w-full cursor-pointer flex-col justify-between rounded-[var(--radius-card)] border border-line bg-surface p-4 text-left transition-[transform,border-color,box-shadow] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-blue/40 hover:shadow-lg hover:shadow-blue/8 active:scale-[0.99]"
        >
          <span className="text-[0.9375rem] font-semibold leading-snug text-ink">
            {layanan.nama}
          </span>
          <span className="mt-2 text-[0.8125rem] text-ink-faint">
            {layanan.estimasi}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent judul={layanan.nama} deskripsi={layanan.keterangan}>
        <div className="flex flex-wrap gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-soft px-3 py-1.5 text-[0.8125rem] font-semibold text-blue-deep">
            <ClockIcon size={15} weight="duotone" />
            {layanan.estimasi}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-soft px-3 py-1.5 text-[0.8125rem] font-semibold text-green-deep">
            <TagIcon size={15} weight="duotone" />
            {layanan.biaya}
          </span>
        </div>

        <section className="mt-6">
          <h3 className="flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-ink-faint">
            <FileTextIcon size={15} weight="duotone" />
            Berkas yang dibawa
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {layanan.syarat.map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink">
                <CheckCircleIcon
                  size={17}
                  weight="duotone"
                  className="mt-1 shrink-0 text-green-strong"
                />
                {s}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-ink-faint">
            Urutan langkah
          </h3>
          <ol className="mt-3 flex flex-col gap-2.5">
            {layanan.alur.map((a, i) => (
              <li key={a} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-soft text-[0.75rem] font-extrabold text-blue-deep"
                >
                  {i + 1}
                </span>
                {a}
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-6 border-t border-line pt-5">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full">
              Tutup
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

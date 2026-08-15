"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRightIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import {
  pengumuman,
  kategoriPengumuman,
  type KategoriPengumuman,
} from "@/lib/data/pengumuman";
import { cn, formatTanggal } from "@/lib/utils";

type Filter = KategoriPengumuman | "Semua";

const urut = [...pengumuman].sort((a, b) => b.tanggal.localeCompare(a.tanggal));

export function DaftarPengumuman() {
  const [kategori, setKategori] = React.useState<Filter>("Semua");

  const hasil =
    kategori === "Semua" ? urut : urut.filter((p) => p.kategori === kategori);

  return (
    <>
      <div
        role="group"
        aria-label="Saring menurut kategori"
        className="baris-gulir mb-8"
      >
        {(["Semua", ...kategoriPengumuman] as Filter[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKategori(k)}
            aria-pressed={kategori === k}
            className={cn(
              "h-11 cursor-pointer rounded-full border px-5 text-[0.9375rem] font-semibold transition-colors",
              kategori === k
                ? "border-blue-strong bg-blue-strong text-white"
                : "border-line-strong bg-surface text-ink-muted hover:border-blue hover:text-blue-strong",
            )}
          >
            {k}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mb-6 text-[0.9375rem] text-ink-muted">
        Menampilkan <span className="font-bold text-ink">{hasil.length}</span>{" "}
        pengumuman
      </p>

      {hasil.length === 0 ? (
        <div className="rounded-[var(--radius-panel)] border border-dashed border-line-strong bg-surface-soft px-6 py-16 text-center">
          <p className="text-lg font-bold text-ink">
            Belum ada pengumuman kategori ini
          </p>
          <p className="mt-2 text-[0.9375rem] text-ink-muted">
            Pilih kategori Semua untuk melihat seluruh pengumuman.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {hasil.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/pengumuman/${p.slug}`}
                className="group flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-[transform,border-color,box-shadow,color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] hover:border-blue/40 hover:shadow-lg hover:shadow-blue/5 sm:flex-row sm:items-start sm:gap-8"
              >
                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:w-40 sm:flex-col sm:items-start">
                  <Badge tone="blue">{p.kategori}</Badge>
                  <span className="text-[0.8125rem] text-ink-faint">
                    {formatTanggal(p.tanggal)}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-[1.125rem] font-bold leading-snug text-ink transition-colors group-hover:text-blue-strong">
                      {p.judul}
                    </h2>
                    {p.penting && (
                      <Badge tone="warn">
                        <WarningCircleIcon size={13} weight="bold" />
                        Perlu perhatian
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                    {p.ringkasan}
                  </p>
                  <p className="mt-4 text-[0.8125rem] text-ink-faint">
                    Diterbitkan oleh {p.penerbit}
                  </p>
                </div>

                <ArrowRightIcon
                  size={18}
                  weight="bold"
                  aria-hidden
                  className="hidden shrink-0 self-center text-blue-strong transition-transform duration-200 group-hover:translate-x-1 sm:block"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

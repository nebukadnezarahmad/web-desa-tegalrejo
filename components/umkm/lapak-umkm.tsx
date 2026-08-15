"use client";

import * as React from "react";
import Link from "next/link";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProdukThumb } from "@/components/umkm/produk-thumb";
import { produkUmkm, kategoriUmkm, type KategoriUmkm } from "@/lib/data/umkm";
import { cn, formatRupiah } from "@/lib/utils";

type Filter = KategoriUmkm | "Semua";

export function LapakUmkm() {
  const [kategori, setKategori] = React.useState<Filter>("Semua");
  const [cari, setCari] = React.useState("");

  const hasil = React.useMemo(() => {
    const kunci = cari.trim().toLowerCase();
    return produkUmkm.filter((p) => {
      const cocokKategori = kategori === "Semua" || p.kategori === kategori;
      if (!cocokKategori) return false;
      if (!kunci) return true;
      return (
        p.nama.toLowerCase().includes(kunci) ||
        p.usaha.toLowerCase().includes(kunci) ||
        p.pemilik.toLowerCase().includes(kunci) ||
        p.dusun.toLowerCase().includes(kunci) ||
        p.deskripsi.toLowerCase().includes(kunci)
      );
    });
  }, [kategori, cari]);

  const filterAktif = kategori !== "Semua" || cari.trim() !== "";

  return (
    <>
      {/* Kontrol saring */}
      <div className="mb-10 flex flex-col gap-5">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon
            size={18}
            weight="bold"
            aria-hidden
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <label htmlFor="cari-produk" className="sr-only">
            Cari produk, usaha, atau nama pemilik
          </label>
          <Input
            id="cari-produk"
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari produk, usaha, atau dusun…"
            className="pl-12"
          />
        </div>

        <div
          role="group"
          aria-label="Saring menurut kategori"
          className="baris-gulir"
        >
          {(["Semua", ...kategoriUmkm] as Filter[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKategori(k)}
              aria-pressed={kategori === k}
              className={cn(
                "h-11 cursor-pointer rounded-full border px-5 text-[0.9375rem] font-semibold transition-colors",
                kategori === k
                  ? "border-green-strong bg-green-strong text-white"
                  : "border-line-strong bg-surface text-ink-muted hover:border-green hover:text-green-strong",
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Jumlah hasil */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <p aria-live="polite" className="text-[0.9375rem] text-ink-muted">
          Menampilkan{" "}
          <span className="font-bold text-ink">{hasil.length}</span> dari{" "}
          {produkUmkm.length} produk
        </p>
        {filterAktif && (
          <button
            type="button"
            onClick={() => {
              setKategori("Semua");
              setCari("");
            }}
            className="inline-flex h-11 cursor-pointer items-center gap-1.5 text-sm font-semibold text-green-strong hover:text-green-deep"
          >
            <XIcon size={15} weight="bold" />
            Hapus saringan
          </button>
        )}
      </div>

      {/* Daftar produk */}
      {hasil.length === 0 ? (
        <div className="rounded-[var(--radius-panel)] border border-dashed border-line-strong bg-surface-soft px-6 py-20 text-center">
          <p className="text-lg font-bold text-ink">
            Tidak ada produk yang cocok
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] text-ink-muted">
            Coba kata kunci lain, atau pilih kategori Semua untuk melihat seluruh
            usaha warga.
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hasil.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/umkm/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface transition-[transform,border-color,box-shadow,color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-green/40 hover:shadow-lg hover:shadow-green/8"
              >
                <ProdukThumb
                  kategori={p.kategori}
                  foto={p.foto}
                  alt={`${p.nama}, ${p.usaha}`}
                />
                <div className="flex flex-1 flex-col p-5">
                  <Badge
                    tone={
                      p.kategori === "Makanan" || p.kategori === "Pertanian"
                        ? "green"
                        : "blue"
                    }
                    className="mb-3 self-start"
                  >
                    {p.kategori}
                  </Badge>

                  <h2 className="text-[1.0625rem] font-bold leading-snug text-ink transition-colors group-hover:text-green-strong">
                    {p.nama}
                  </h2>

                  <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-ink-muted">
                    {p.deskripsi}
                  </p>

                  <div className="mt-5 border-t border-line pt-4">
                    <p className="text-lg font-extrabold text-green-strong">
                      {formatRupiah(p.harga)}
                      <span className="ml-1 text-xs font-medium text-ink-faint">
                        / {p.satuan}
                      </span>
                    </p>
                    <p className="mt-1.5 text-[0.8125rem] text-ink-faint">
                      {p.usaha} · {p.rt} Dusun {p.dusun}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

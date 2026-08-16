"use client";

import * as React from "react";
import {
  RulerIcon,
  ArrowClockwiseIcon,
  CheckCircleIcon,
  WarningIcon,
  WarningOctagonIcon,
  InfoIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import {
  hitungStatusGizi,
  UMUR_MAKS_BULAN,
  type HasilGizi,
  type HasilIndeks,
  type JenisKelamin,
  type Tingkat,
} from "@/lib/gizi";
import { cn } from "@/lib/utils";

const gayaTingkat: Record<
  Tingkat,
  { kotak: string; label: string; ikon: typeof CheckCircleIcon; teks: string }
> = {
  normal: {
    kotak: "border-green/40 bg-green-soft",
    label: "text-green-deep",
    ikon: CheckCircleIcon,
    teks: "text-green-strong",
  },
  kurang: {
    kotak: "border-warn/40 bg-warn-soft",
    label: "text-warn",
    ikon: WarningIcon,
    teks: "text-warn",
  },
  buruk: {
    kotak: "border-danger/40 bg-danger-soft",
    label: "text-danger",
    ikon: WarningOctagonIcon,
    teks: "text-danger",
  },
  lebih: {
    kotak: "border-blue/40 bg-blue-soft",
    label: "text-blue-deep",
    ikon: InfoIcon,
    teks: "text-blue-strong",
  },
};

type Galat = Partial<Record<"umur" | "tinggi" | "berat", string>>;

export function KalkulatorGizi() {
  const [jenisKelamin, setJenisKelamin] = React.useState<JenisKelamin>("L");
  const [umur, setUmur] = React.useState("");
  const [tinggi, setTinggi] = React.useState("");
  const [berat, setBerat] = React.useState("");
  const [hasil, setHasil] = React.useState<HasilGizi | null>(null);
  const [galat, setGalat] = React.useState<Galat>({});

  const hasilRef = React.useRef<HTMLDivElement>(null);

  function periksa(): Galat {
    const g: Galat = {};
    const u = Number(umur);
    const t = Number(tinggi);
    const b = Number(berat);

    if (!umur.trim() || Number.isNaN(u))
      g.umur = "Isi usia anak dalam bulan.";
    else if (u < 0 || u > UMUR_MAKS_BULAN)
      g.umur = `Kalkulator ini berlaku untuk usia 0 sampai ${UMUR_MAKS_BULAN} bulan.`;

    if (!tinggi.trim() || Number.isNaN(t))
      g.tinggi = "Isi tinggi atau panjang badan dalam sentimeter.";
    else if (t < 30 || t > 140)
      g.tinggi = "Tinggi badan wajar untuk balita antara 30 dan 140 cm.";

    if (!berat.trim() || Number.isNaN(b))
      g.berat = "Isi berat badan dalam kilogram.";
    else if (b < 1 || b > 40)
      g.berat = "Berat badan wajar untuk balita antara 1 dan 40 kg.";

    return g;
  }

  function kirim(e: React.FormEvent) {
    e.preventDefault();
    const g = periksa();
    setGalat(g);
    if (Object.keys(g).length > 0) {
      setHasil(null);
      return;
    }

    setHasil(
      hitungStatusGizi({
        umurBulan: Number(umur),
        jenisKelamin,
        tinggiCm: Number(tinggi),
        beratKg: Number(berat),
      }),
    );

    requestAnimationFrame(() => {
      /* `behavior` yang ditulis eksplisit mengalahkan properti CSS
         scroll-behavior, termasuk penimpaan !important di blok
         prefers-reduced-motion. Preferensinya harus dibaca di sini. */
      const kurangiGerak = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      hasilRef.current?.scrollIntoView({
        behavior: kurangiGerak ? "auto" : "smooth",
        block: "nearest",
      });
    });
  }

  function ulangi() {
    setUmur("");
    setTinggi("");
    setBerat("");
    setJenisKelamin("L");
    setHasil(null);
    setGalat({});
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-10">
      {/* Formulir */}
      <form
        onSubmit={kirim}
        noValidate
        className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-7"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-soft">
            <RulerIcon size={22} weight="duotone" className="text-green-strong" />
          </span>
          <div>
            <h3 className="font-bold text-ink">Data anak</h3>
            <p className="text-[0.8125rem] text-ink-muted">
              Usia 0 – {UMUR_MAKS_BULAN} bulan
            </p>
          </div>
        </div>

        <fieldset className="mb-5">
          <legend className="mb-1.5 block text-sm font-semibold text-ink">
            Jenis kelamin
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { nilai: "L", label: "Laki-laki" },
                { nilai: "P", label: "Perempuan" },
              ] as const
            ).map((o) => (
              <button
                key={o.nilai}
                type="button"
                onClick={() => setJenisKelamin(o.nilai)}
                aria-pressed={jenisKelamin === o.nilai}
                className={cn(
                  "h-11 cursor-pointer rounded-full border text-[0.9375rem] font-semibold transition-[transform,background-color,border-color,color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] active:scale-[0.98]",
                  jenisKelamin === o.nilai
                    ? "border-green-strong bg-green-strong text-white"
                    : "border-line-strong bg-surface text-ink-muted hover:border-green",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mb-5">
          <Label htmlFor="umur">Usia (bulan)</Label>
          <Input
            id="umur"
            inputMode="numeric"
            value={umur}
            onChange={(e) => setUmur(e.target.value)}
            placeholder="Contoh: 24"
            aria-invalid={Boolean(galat.umur)}
            aria-describedby={galat.umur ? "galat-umur" : undefined}
            className={galat.umur ? "border-danger" : undefined}
          />
          {galat.umur && (
            <p id="galat-umur" className="mt-1.5 text-[0.8125rem] text-danger">
              {galat.umur}
            </p>
          )}
        </div>

        <div className="mb-5">
          <Label htmlFor="tinggi">Tinggi / panjang badan (cm)</Label>
          <Input
            id="tinggi"
            inputMode="decimal"
            value={tinggi}
            onChange={(e) => setTinggi(e.target.value)}
            placeholder="Contoh: 84.5"
            aria-invalid={Boolean(galat.tinggi)}
            aria-describedby={galat.tinggi ? "galat-tinggi" : undefined}
            className={galat.tinggi ? "border-danger" : undefined}
          />
          {galat.tinggi && (
            <p id="galat-tinggi" className="mt-1.5 text-[0.8125rem] text-danger">
              {galat.tinggi}
            </p>
          )}
        </div>

        <div className="mb-7">
          <Label htmlFor="berat">Berat badan (kg)</Label>
          <Input
            id="berat"
            inputMode="decimal"
            value={berat}
            onChange={(e) => setBerat(e.target.value)}
            placeholder="Contoh: 11.2"
            aria-invalid={Boolean(galat.berat)}
            aria-describedby={galat.berat ? "galat-berat" : undefined}
            className={galat.berat ? "border-danger" : undefined}
          />
          {galat.berat && (
            <p id="galat-berat" className="mt-1.5 text-[0.8125rem] text-danger">
              {galat.berat}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full">
          Hitung status gizi
        </Button>

        {hasil && (
          <Button
            type="button"
            variant="ghost"
            onClick={ulangi}
            className="mt-2 w-full"
          >
            <ArrowClockwiseIcon size={17} weight="bold" />
            Hitung ulang
          </Button>
        )}
      </form>

      {/* Hasil */}
      <div ref={hasilRef}>
        {!hasil ? (
          <div className="flex h-full min-h-[22rem] flex-col justify-center rounded-[var(--radius-panel)] border border-dashed border-line-strong bg-surface-soft p-8 text-center">
            <h3 className="text-lg font-bold text-ink">
              Hasil muncul di sini
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-ink-muted">
              Isi data anak di sebelah, lalu tekan Hitung status gizi. Perhitungan
              memakai Standar Antropometri Anak dari WHO yang juga dipakai kader
              posyandu.
            </p>
          </div>
        ) : (
          <div aria-live="polite" className="flex flex-col gap-4">
            {/* Ringkasan */}
            <div
              className={cn(
                "rounded-[var(--radius-panel)] border p-6 sm:p-7",
                gayaTingkat[hasil.tingkatTertinggi].kotak,
              )}
            >
              <div className="flex items-start gap-3.5">
                {React.createElement(gayaTingkat[hasil.tingkatTertinggi].ikon, {
                  size: 26,
                  weight: "fill",
                  className: cn(
                    "shrink-0",
                    gayaTingkat[hasil.tingkatTertinggi].teks,
                  ),
                })}
                <div>
                  <h3
                    className={cn(
                      "text-lg font-extrabold",
                      gayaTingkat[hasil.tingkatTertinggi].label,
                    )}
                  >
                    Ringkasan hasil
                  </h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink">
                    {hasil.ringkasan}
                  </p>
                </div>
              </div>
            </div>

            {/* Dua indeks */}
            <div className="grid gap-4 sm:grid-cols-2">
              <KartuIndeks hasil={hasil.tbu} />
              <KartuIndeks hasil={hasil.bbu} />
            </div>

            {/* Rekomendasi */}
            <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-7">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-green-strong">
                Yang sebaiknya dilakukan
              </h3>
              <ul className="flex flex-col gap-3">
                {hasil.rekomendasi.map((r, i) => (
                  <li key={i} className="flex gap-2.5">
                    <CaretRightIcon
                      size={16}
                      weight="bold"
                      aria-hidden
                      className="mt-1 shrink-0 text-green-strong"
                    />
                    <span className="text-[0.9375rem] leading-relaxed text-ink-muted">
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="rounded-[var(--radius-card)] border border-line bg-surface-soft px-5 py-4 text-[0.8125rem] leading-relaxed text-ink-muted">
              Hasil ini adalah penapisan awal, bukan diagnosis. Keputusan
              penanganan tetap ada pada bidan desa atau petugas puskesmas setelah
              pemeriksaan langsung.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function KartuIndeks({ hasil }: { hasil: HasilIndeks }) {
  const gaya = gayaTingkat[hasil.tingkat];
  const selisih = hasil.zScore;

  return (
    <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-6">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-faint">
        {hasil.kode}
      </p>
      <h4 className="mt-1 text-[0.9375rem] font-semibold text-ink-muted">
        {hasil.nama}
      </h4>

      <p className={cn("mt-4 text-xl font-extrabold", gaya.label)}>
        {hasil.kategori}
        {hasil.waspada && hasil.tingkat === "normal" && (
          <span className="ml-2 align-middle text-xs font-bold text-warn">
            perlu dipantau
          </span>
        )}
      </p>

      {/* Posisi pada skala z-score */}
      <div className="mt-5">
        <div
          className="relative h-2 overflow-hidden rounded-full bg-surface-soft"
          role="img"
          aria-label={`Skor Z ${selisih.toFixed(2)} simpangan baku dari median`}
        >
          <div className="absolute inset-y-0 left-0 w-1/3 bg-danger/25" />
          <div className="absolute inset-y-0 left-1/3 w-1/3 bg-green/30" />
          <div className="absolute inset-y-0 left-2/3 w-1/3 bg-blue/25" />
          <span
            className={cn(
              "absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full",
              hasil.tingkat === "normal" ? "bg-green-deep" : "bg-ink",
            )}
            style={{
              left: `${Math.min(Math.max((selisih + 4) / 8, 0.02), 0.98) * 100}%`,
            }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[0.6875rem] font-medium text-ink-faint">
          <span>−4 SD</span>
          <span>median</span>
          <span>+4 SD</span>
        </div>
      </div>

      <dl className="mt-5 flex gap-6 border-t border-line pt-4 text-[0.8125rem]">
        <div>
          <dt className="text-ink-faint">Skor Z</dt>
          <dd className="mt-0.5 font-bold text-ink">{selisih.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-ink-faint">Median seusia</dt>
          <dd className="mt-0.5 font-bold text-ink">
            {hasil.median.toFixed(1)} {hasil.satuan}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-muted">
        {hasil.penjelasan}
      </p>
    </div>
  );
}

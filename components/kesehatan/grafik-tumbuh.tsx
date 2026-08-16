"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { kurvaMedianTinggi } from "@/lib/gizi";
import { contohPertumbuhan } from "@/lib/data/posyandu";
import { useLayarSempit } from "@/lib/use-layar-sempit";
import { cn } from "@/lib/utils";

const keterangan = [
  { label: "Rentang normal", warna: "bg-green/25" },
  { label: "Median WHO", warna: "bg-green-strong" },
  { label: "Contoh anak", warna: "bg-blue-strong" },
];

export function GrafikTumbuh() {
  const [jenisKelamin, setJenisKelamin] = React.useState<"L" | "P">("L");
  const sempit = useLayarSempit();

  const data = React.useMemo(() => {
    const kurva = kurvaMedianTinggi(jenisKelamin);
    return kurva.map((k) => {
      const ukur = contohPertumbuhan.find((c) => c.umur === k.umur);
      return {
        umur: k.umur,
        // Area rentang: tuple [batas bawah, batas atas] supaya domain
        // sumbu Y tidak ikut ditarik ke nol seperti pada area bertumpuk.
        pitaNormal: [k.minus2sd, k.plus2sd] as [number, number],
        median: k.median,
        anak: ukur ? ukur.tinggi : null,
      };
    });
  }, [jenisKelamin]);

  return (
    <div>
      <div
        role="group"
        aria-label="Pilih jenis kelamin untuk kurva rujukan"
        className="mb-6 flex gap-2"
      >
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
              "h-11 cursor-pointer rounded-full border px-5 text-[0.9375rem] font-semibold transition-[transform,background-color,border-color,color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] active:scale-[0.98]",
              jenisKelamin === o.nilai
                ? "border-green-strong bg-green-strong text-white"
                : "border-line-strong bg-surface text-ink-muted hover:border-green",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-3 sm:p-6">
        {/* Di layar sempit: legenda diganti keterangan sendiri di bawah,
            tick dijarangkan, dan margin dirapatkan supaya kurva tidak terjepit. */}
        <div className="h-[16rem] w-full sm:h-[22rem]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={
                sempit
                  ? { top: 6, right: 10, bottom: 18, left: 0 }
                  : { top: 8, right: 8, bottom: 24, left: 0 }
              }
            >
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis
                dataKey="umur"
                tick={{ fill: "var(--ink-muted)", fontSize: sempit ? 10 : 12 }}
                stroke="var(--line-strong)"
                tickLine={false}
                ticks={sempit ? [0, 12, 24, 36, 48, 60] : undefined}
                label={
                  sempit
                    ? undefined
                    : {
                        value: "Usia (bulan)",
                        position: "insideBottom",
                        offset: -14,
                        fill: "var(--ink-muted)",
                        fontSize: 12,
                      }
                }
              />
              <YAxis
                domain={[40, 125]}
                tick={{ fill: "var(--ink-muted)", fontSize: sempit ? 10 : 12 }}
                stroke="var(--line-strong)"
                tickLine={false}
                width={sempit ? 40 : 56}
                tickFormatter={(v) => (sempit ? `${v}` : `${v} cm`)}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "0.75rem",
                  fontSize: "0.8125rem",
                }}
                labelFormatter={(v) => `Usia ${v} bulan`}
                formatter={(nilai, nama) => {
                  if (Array.isArray(nilai))
                    return [`${nilai[0]} – ${nilai[1]} cm`, nama];
                  return [`${nilai} cm`, nama];
                }}
              />
              {!sempit && (
                <Legend
                  verticalAlign="top"
                  height={40}
                  wrapperStyle={{ fontSize: "0.8125rem" }}
                />
              )}

              <Area
                dataKey="pitaNormal"
                stroke="none"
                fill="var(--green)"
                fillOpacity={0.14}
                name="Rentang normal"
              />

              <Line
                dataKey="median"
                stroke="var(--green-strong)"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                name="Median WHO"
              />
              <Line
                dataKey="anak"
                stroke="var(--blue-strong)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "var(--blue-strong)", strokeWidth: 0 }}
                connectNulls
                name="Contoh anak"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Keterangan buatan sendiri di layar sempit, lebih ringkas
            daripada legenda bawaan yang melipat jadi dua baris. */}
        {sempit && (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-3">
            {keterangan.map((k) => (
              <li
                key={k.label}
                className="flex items-center gap-1.5 text-[0.75rem] text-ink-muted"
              >
                <span
                  aria-hidden
                  className={cn("h-2.5 w-2.5 rounded-full", k.warna)}
                />
                {k.label}
              </li>
            ))}
            <li className="w-full text-[0.6875rem] text-ink-faint">
              Sumbu mendatar: usia dalam bulan · Sumbu tegak: tinggi dalam cm
            </li>
          </ul>
        )}
      </div>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-muted">
        Pita hijau adalah rentang tinggi badan normal, yaitu antara −2 dan +2
        simpangan baku dari median WHO. Garis biru adalah contoh riwayat
        pengukuran seorang anak. Selama garis anak berada di dalam pita hijau dan
        arahnya menanjak sejajar, pertumbuhannya sesuai standar.
      </p>
    </div>
  );
}

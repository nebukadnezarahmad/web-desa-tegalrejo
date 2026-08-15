import * as React from "react";
import { cn } from "@/lib/utils";

type Latar = "putih" | "lembut" | "biru";
type Ritme = "rapat" | "normal" | "lega";

const latarKelas: Record<Latar, string> = {
  putih: "bg-surface",
  lembut: "bg-surface-soft",
  biru: "bg-surface-tint",
};

/**
 * Ritme vertikal sengaja tidak seragam. Halaman dengan jarak antar-seksi
 * yang persis sama terbaca seperti daftar kotak; variasi memberi tekanan
 * pada seksi yang memang lebih penting.
 */
const ritmeKelas: Record<Ritme, string> = {
  rapat: "py-[var(--ritme-rapat)]",
  normal: "py-[var(--ritme-normal)]",
  lega: "py-[var(--ritme-lega)]",
};

export function Section({
  latar = "putih",
  ritme = "normal",
  batas = false,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  latar?: Latar;
  ritme?: Ritme;
  /** Garis kontur melintang di atas seksi. Perubahan seksi dibaca
   *  sebagai perubahan ketinggian, bukan sekadar garis pemisah. */
  batas?: boolean;
}) {
  return (
    <section
      className={cn("relative", ritmeKelas[ritme], latarKelas[latar], className)}
      {...props}
    >
      {batas && (
        <div
          aria-hidden
          className="batas-kontur pointer-events-none absolute inset-x-0 top-0"
        />
      )}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  kicker,
  judul,
  deskripsi,
  tone = "green",
  aksi,
  className,
}: {
  kicker?: string;
  judul: string;
  deskripsi?: string;
  tone?: "green" | "blue";
  aksi?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:mb-10 sm:gap-5 md:mb-14 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {kicker && (
          <p
            className={cn(
              "kicker mb-2.5 sm:mb-3",
              tone === "green" ? "text-green-strong" : "text-blue-strong",
            )}
          >
            {kicker}
          </p>
        )}
        <h2 className="judul-display text-[1.625rem] text-ink sm:text-[2rem] md:text-[2.375rem]">
          {judul}
        </h2>
        {deskripsi && (
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted sm:mt-4 sm:text-base md:text-[1.0625rem]">
            {deskripsi}
          </p>
        )}
      </div>
      {aksi && <div className="shrink-0">{aksi}</div>}
    </div>
  );
}

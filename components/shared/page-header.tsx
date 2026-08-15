import * as React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  kicker,
  judul,
  deskripsi,
  tone = "green",
  children,
}: {
  kicker: string;
  judul: string;
  deskripsi: string;
  tone?: "green" | "blue";
  children?: React.ReactNode;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-line",
        tone === "green" ? "bg-surface-soft" : "bg-surface-tint",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          tone === "green" ? "kontur" : "kontur-biru",
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface"
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 md:py-18 lg:px-8">
        <p
          className={cn(
            "kicker mb-3 sm:mb-4",
            tone === "green" ? "text-green-strong" : "text-blue-strong",
          )}
        >
          {kicker}
        </p>
        <h1 className="judul-display max-w-3xl text-[2rem] text-ink sm:text-[2.75rem] md:text-[3.5rem]">
          {judul}
        </h1>
        <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-muted sm:mt-5 sm:text-[1.0625rem]">
          {deskripsi}
        </p>
        {children && <div className="mt-6 sm:mt-8">{children}</div>}
      </div>
    </header>
  );
}

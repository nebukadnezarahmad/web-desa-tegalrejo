"use client";

import { useEffect } from "react";
import { WarningIcon, ArrowClockwiseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

/** Batas galat tingkat rute. Wajib client component menurut Next.js. */
export default function HalamanGalat({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Galat halaman:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center bg-surface-soft">
      <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
        <WarningIcon
          size={40}
          weight="duotone"
          className="mx-auto text-warn"
        />
        <h1 className="judul-display mt-4 text-[1.75rem] text-ink sm:text-[2.25rem]">
          Ada yang bermasalah di sisi kami
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted sm:text-[1.0625rem]">
          Halaman ini gagal dimuat. Coba muat ulang; kalau masih sama,
          laporkan ke petugas balai desa.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-[0.8125rem] text-ink-faint">
            Kode galat: {error.digest}
          </p>
        )}
        <div className="mt-8">
          <Button type="button" onClick={reset}>
            <ArrowClockwiseIcon size={18} weight="bold" />
            Coba muat ulang
          </Button>
        </div>
      </div>
    </div>
  );
}

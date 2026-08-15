import type { Metadata } from "next";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarBlankIcon,
  ChatCircleTextIcon,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cekStatusLaporan } from "@/app/lapor/actions";
import { normalisasiKodeLacak } from "@/lib/lapor/kode-lacak";
import { formatTanggal } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { StatusLaporan } from "@/lib/lapor/types";

export const metadata: Metadata = {
  title: "Cek Status Laporan",
  description: "Masukkan kode lacak untuk melihat status tindak lanjut laporan Anda.",
};

const gayaStatus: Record<StatusLaporan, { label: string; tone: "green" | "blue" | "warn" | "danger" | "netral" }> = {
  menunggu: { label: "Menunggu Ditinjau", tone: "netral" },
  diterima: { label: "Diterima", tone: "blue" },
  diproses: { label: "Sedang Diproses", tone: "warn" },
  selesai: { label: "Selesai", tone: "green" },
  ditolak: { label: "Ditolak", tone: "danger" },
};

export default async function HalamanStatusLaporan(
  props: PageProps<"/lapor/status">,
) {
  const params = await props.searchParams;
  const kodeMentah = typeof params.kode === "string" ? params.kode : "";
  const kode = kodeMentah ? normalisasiKodeLacak(kodeMentah) : "";

  const hasil = kode.length === 9 ? await cekStatusLaporan(kode) : null;

  return (
    <>
      <PageHeader
        kicker="Suara Warga"
        tone="blue"
        judul="Cek status laporan"
        deskripsi="Masukkan kode lacak yang Anda terima saat mengirim laporan."
      />

      <Section latar="putih">
        <div className="mx-auto max-w-xl">
          <form method="get" className="flex gap-2.5">
            <label htmlFor="kode" className="sr-only">
              Kode lacak
            </label>
            <input
              id="kode"
              name="kode"
              defaultValue={kodeMentah}
              placeholder="Contoh: AB3D-9KQZ"
              className="h-12 flex-1 rounded-full border border-line-strong bg-surface px-5 font-mono text-[0.9375rem] uppercase tracking-wider text-ink transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-faint hover:border-blue-strong/50 focus:border-blue-strong"
            />
            <Button type="submit" variant="info" size="lg">
              <MagnifyingGlassIcon size={18} weight="bold" />
              <span className="hidden sm:inline">Cek</span>
            </Button>
          </form>

          {kodeMentah && kode.length !== 9 && (
            <p className="mt-4 text-[0.9375rem] text-danger">
              Format kode tidak dikenali. Kode lacak terdiri dari 8 karakter,
              contoh: AB3D-9KQZ.
            </p>
          )}

          {hasil && !hasil.ditemukan && (
            <p className="mt-4 text-[0.9375rem] text-danger">
              Kode tidak ditemukan. Periksa kembali kode yang Anda terima saat
              mengirim laporan.
            </p>
          )}

          {hasil?.ditemukan && (
            <div
              aria-live="polite"
              className="mt-6 rounded-[var(--radius-panel)] border border-line bg-surface-soft p-6 sm:p-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge tone={gayaStatus[hasil.laporan.status].tone}>
                  {gayaStatus[hasil.laporan.status].label}
                </Badge>
                <span className="text-[0.8125rem] text-ink-faint">
                  Dikirim {formatTanggal(hasil.laporan.created_at.slice(0, 10))}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-bold text-ink">
                {hasil.laporan.kategori}
              </h2>

              <ul className="mt-4 flex flex-col gap-2.5 text-[0.9375rem] text-ink-muted">
                <li className="flex gap-2.5">
                  <MapPinIcon
                    size={18}
                    weight="duotone"
                    className="mt-0.5 shrink-0 text-blue-strong"
                  />
                  {hasil.laporan.lokasi}
                </li>
              </ul>

              <p className="mt-4 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink">
                {hasil.laporan.deskripsi}
              </p>

              {hasil.laporan.catatan_admin && (
                <div
                  className={cn(
                    "mt-5 flex gap-3 rounded-[var(--radius-card)] border border-blue/25 bg-blue-soft p-4",
                  )}
                >
                  <ChatCircleTextIcon
                    size={19}
                    weight="duotone"
                    className="mt-0.5 shrink-0 text-blue-strong"
                  />
                  <div>
                    <p className="text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-blue-deep">
                      Catatan petugas
                    </p>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink">
                      {hasil.laporan.catatan_admin}
                    </p>
                  </div>
                </div>
              )}

              <p className="mt-5 flex items-center gap-2 text-[0.8125rem] text-ink-faint">
                <CalendarBlankIcon size={15} weight="duotone" />
                Diperbarui {formatTanggal(hasil.laporan.updated_at.slice(0, 10))}
              </p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

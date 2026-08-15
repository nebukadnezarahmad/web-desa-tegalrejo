import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "@phosphor-icons/react/dist/ssr";
import { Hero } from "@/components/home/hero";
import { PengumumanTerbaru } from "@/components/home/pengumuman-terbaru";
import { BentoLayanan } from "@/components/home/bento-layanan";
import { AgendaWarga } from "@/components/home/agenda-warga";
import { UmkmPreview } from "@/components/home/umkm-preview";
import { Button } from "@/components/ui/button";
import { desa } from "@/lib/data/desa";
import { layananAdministrasi } from "@/lib/data/profil";

export default function Beranda() {
  return (
    <>
      <Hero />
      <PengumumanTerbaru />
      <BentoLayanan />
      <AgendaWarga />
      <UmkmPreview />

      {/* Ajakan penutup */}
      <section className="relative overflow-hidden border-t border-line bg-surface-tint">
        <div
          aria-hidden
          className="kontur-biru pointer-events-none absolute inset-0"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-blue-strong">
                Layanan Warga
              </p>
              <h2 className="max-w-lg text-[1.75rem] font-extrabold text-ink sm:text-[2.125rem]">
                Tahu syaratnya sebelum berangkat ke balai desa.
              </h2>
              <p className="mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-ink-muted">
                Enam jenis surat yang paling sering diurus warga, lengkap dengan
                daftar berkas, urutan langkah, dan perkiraan lama pengerjaan.
                Tidak ada yang dipungut biaya.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="info" size="lg">
                  <Link href="/profil#layanan">
                    Lihat syarat lengkap
                    <ArrowRightIcon size={19} weight="bold" />
                  </Link>
                </Button>
              </div>
              <p className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
                <ClockIcon
                  size={17}
                  weight="duotone"
                  className="text-blue-strong"
                />
                Loket pelayanan buka {desa.jamLayanan}
              </p>
            </div>

            <ul className="grid gap-2.5 sm:grid-cols-2">
              {layananAdministrasi.map((l) => (
                <li key={l.nama}>
                  <Link
                    href="/profil#layanan"
                    className="flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-line bg-surface p-4 transition-colors hover:border-blue/40"
                  >
                    <span className="text-[0.9375rem] font-semibold leading-snug text-ink">
                      {l.nama}
                    </span>
                    <span className="mt-2 text-[0.8125rem] text-ink-faint">
                      {l.estimasi}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

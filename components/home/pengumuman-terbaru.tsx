import Link from "next/link";
import { ArrowRightIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pengumumanTerbaru } from "@/lib/data/pengumuman";
import { formatTanggal } from "@/lib/utils";

export function PengumumanTerbaru() {
  // Ritme rapat, ini cuplikan tiga kabar, bukan bacaan panjang.
  return (
    <Section latar="putih" ritme="rapat">
      <SectionHeading
        kicker="Kabar Resmi"
        tone="blue"
        judul="Pengumuman terbaru"
        deskripsi="Keputusan dan pemberitahuan resmi dari pemerintah desa, diurutkan dari yang paling baru."
        aksi={
          <Button asChild variant="softInfo">
            <Link href="/pengumuman">
              Semua pengumuman
              <ArrowRightIcon size={17} weight="bold" />
            </Link>
          </Button>
        }
      />

      <ul className="grid gap-5 md:grid-cols-3">
        {pengumumanTerbaru.map((p, i) => (
          <Reveal as="li" key={p.slug} index={i}>
            <Link
              href={`/pengumuman/${p.slug}`}
              className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-[transform,border-color,box-shadow,color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-blue/40 hover:shadow-lg hover:shadow-blue/5"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge tone="blue">{p.kategori}</Badge>
                {p.penting && (
                  <Badge tone="warn">
                    <WarningCircleIcon size={13} weight="bold" />
                    Perlu perhatian
                  </Badge>
                )}
              </div>

              <h3 className="text-[1.0625rem] font-bold leading-snug text-ink transition-colors group-hover:text-blue-strong">
                {p.judul}
              </h3>

              <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                {p.ringkasan}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[0.8125rem] text-ink-faint">
                <span>{formatTanggal(p.tanggal)}</span>
                <ArrowRightIcon
                  size={16}
                  weight="bold"
                  className="text-blue-strong transition-transform duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] group-hover:translate-x-1"
                />
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  WarningCircleIcon,
  BuildingsIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import {
  ambilPengumuman,
  ambilSemuaPengumuman,
} from "@/lib/pengumuman/queries";
import { formatTanggal } from "@/lib/utils";

/** Wajib dinamis: isinya dibaca dari Supabase. generateStaticParams dilepas
 *  karena daftar slug kini berubah setiap petugas menambah atau menerima
 *  isian baru, dan tidak lagi diketahui saat build. */
export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/pengumuman/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const item = await ambilPengumuman(slug);
  if (!item) return { title: "Pengumuman tidak ditemukan" };
  return { title: item.judul, description: item.ringkasan };
}

export default async function HalamanDetailPengumuman(
  props: PageProps<"/pengumuman/[slug]">,
) {
  const { slug } = await props.params;
  const item = await ambilPengumuman(slug);
  if (!item) notFound();

  const lainnya = (await ambilSemuaPengumuman())
    .filter((p) => p.slug !== item.slug && p.kategori === item.kategori)
    .slice(0, 2);

  return (
    <>
      <div className="relative overflow-hidden border-b border-line bg-surface-tint">
        <div
          aria-hidden
          className="kontur-biru pointer-events-none absolute inset-0"
        />
        <div className="relative mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <Link
            href="/pengumuman"
            className="mb-8 inline-flex h-11 items-center gap-2 text-[0.9375rem] font-semibold text-ink-muted transition-colors hover:text-blue-strong"
          >
            <ArrowLeftIcon size={17} weight="bold" />
            Semua pengumuman
          </Link>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge tone="blue">{item.kategori}</Badge>
            {item.penting && (
              <Badge tone="warn">
                <WarningCircleIcon size={13} weight="bold" />
                Perlu perhatian
              </Badge>
            )}
          </div>

          <h1 className="text-[2rem] font-extrabold text-ink sm:text-[2.5rem]">
            {item.judul}
          </h1>

          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-muted">
            {item.ringkasan}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 text-[0.875rem] text-ink-muted">
            <time dateTime={item.tanggal}>{formatTanggal(item.tanggal)}</time>
            <span className="flex items-center gap-2">
              <BuildingsIcon
                size={16}
                weight="duotone"
                className="text-blue-strong"
              />
              {item.penerbit}
            </span>
          </div>
        </div>
      </div>

      <Section latar="putih">
        <article className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-5">
            {item.isi.map((paragraf, i) => (
              <p
                key={i}
                className="text-[1.0625rem] leading-[1.75] text-ink-muted"
              >
                {paragraf}
              </p>
            ))}
          </div>
        </article>

        {lainnya.length > 0 && (
          <div className="mx-auto mt-16 max-w-3xl border-t border-line pt-12">
            <h2 className="mb-6 text-[1.25rem] font-extrabold text-ink">
              Pengumuman lain kategori {item.kategori}
            </h2>
            <ul className="flex flex-col gap-3">
              {lainnya.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/pengumuman/${p.slug}`}
                    className="group flex items-center justify-between gap-6 rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-colors hover:border-blue/40"
                  >
                    <div>
                      <h3 className="text-[0.9375rem] font-bold text-ink transition-colors group-hover:text-blue-strong">
                        {p.judul}
                      </h3>
                      <p className="mt-1 text-[0.8125rem] text-ink-faint">
                        {formatTanggal(p.tanggal)}
                      </p>
                    </div>
                    <ArrowRightIcon
                      size={17}
                      weight="bold"
                      aria-hidden
                      className="shrink-0 text-blue-strong transition-transform duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>
    </>
  );
}

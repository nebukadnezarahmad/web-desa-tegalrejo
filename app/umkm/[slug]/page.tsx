import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  WhatsappLogoIcon,
  MapPinIcon,
  UserIcon,
  StorefrontIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProdukThumb } from "@/components/umkm/produk-thumb";
import {
  produkUmkm,
  ambilProduk,
  produkLainDariPenjual,
} from "@/lib/data/umkm";
import { formatRupiah, tautanWhatsApp } from "@/lib/utils";

export function generateStaticParams() {
  return produkUmkm.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/umkm/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const produk = ambilProduk(slug);
  if (!produk) return { title: "Produk tidak ditemukan" };
  return {
    title: produk.nama,
    description: produk.deskripsi,
  };
}

export default async function HalamanProduk(props: PageProps<"/umkm/[slug]">) {
  const { slug } = await props.params;
  const produk = ambilProduk(slug);
  if (!produk) notFound();

  const lainnya = produkLainDariPenjual(produk.usaha, produk.slug);
  const hijau =
    produk.kategori === "Makanan" || produk.kategori === "Pertanian";

  return (
    <Section latar="putih" className="pt-10 md:pt-14">
      <Link
        href="/umkm"
        className="mb-8 inline-flex h-11 items-center gap-2 text-[0.9375rem] font-semibold text-ink-muted transition-colors hover:text-green-strong"
      >
        <ArrowLeftIcon size={17} weight="bold" />
        Kembali ke lapak
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="overflow-hidden rounded-[var(--radius-panel)] border border-line">
          <ProdukThumb
            kategori={produk.kategori}
            foto={produk.foto}
            alt={`${produk.nama}, ${produk.usaha}`}
            ukuran="besar"
          />
        </div>

        <div>
          <Badge tone={hijau ? "green" : "blue"} className="mb-4">
            {produk.kategori}
          </Badge>

          <h1 className="text-[2rem] font-extrabold text-ink sm:text-[2.5rem]">
            {produk.nama}
          </h1>

          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-muted">
            {produk.deskripsi}
          </p>

          <p className="mt-7 text-[2rem] font-extrabold leading-none text-green-strong">
            {formatRupiah(produk.harga)}
            <span className="ml-2 text-sm font-medium text-ink-faint">
              per {produk.satuan}
            </span>
          </p>

          <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface-soft p-6">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-green-strong">
              Penjual
            </h2>
            <ul className="flex flex-col gap-3 text-[0.9375rem] text-ink">
              <li className="flex items-center gap-3">
                <StorefrontIcon
                  size={19}
                  weight="duotone"
                  className="shrink-0 text-green-strong"
                />
                <span className="font-semibold">{produk.usaha}</span>
              </li>
              <li className="flex items-center gap-3 text-ink-muted">
                <UserIcon
                  size={19}
                  weight="duotone"
                  className="shrink-0 text-green-strong"
                />
                {produk.pemilik}
              </li>
              <li className="flex items-center gap-3 text-ink-muted">
                <MapPinIcon
                  size={19}
                  weight="duotone"
                  className="shrink-0 text-green-strong"
                />
                {produk.rt}, Dusun {produk.dusun}
              </li>
            </ul>

            <Button asChild size="lg" className="mt-6 w-full">
              <a
                href={tautanWhatsApp(
                  produk.whatsapp,
                  `Halo ${produk.pemilik}, saya melihat ${produk.nama} di lapak UMKM Desa Tegalrejo. Apakah masih tersedia?`,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappLogoIcon size={20} weight="fill" />
                Hubungi lewat WhatsApp
              </a>
            </Button>
            <p className="mt-3 text-center text-[0.8125rem] text-ink-faint">
              Kesepakatan harga dan pengiriman langsung dengan pemilik usaha.
            </p>
          </div>
        </div>
      </div>

      {/* Rincian */}
      <div className="mt-16 max-w-3xl border-t border-line pt-12">
        <h2 className="text-[1.5rem] font-extrabold text-ink">Tentang produk</h2>
        <div className="mt-5 flex flex-col gap-4">
          {produk.detail.map((paragraf, i) => (
            <p key={i} className="text-[1.0625rem] leading-relaxed text-ink-muted">
              {paragraf}
            </p>
          ))}
        </div>
      </div>

      {/* Produk lain dari penjual yang sama */}
      {lainnya.length > 0 && (
        <div className="mt-16 border-t border-line pt-12">
          <h2 className="text-[1.5rem] font-extrabold text-ink">
            Produk lain dari {produk.usaha}
          </h2>
          <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lainnya.map((p) => (
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
                    <h3 className="text-[0.9375rem] font-bold text-ink transition-colors group-hover:text-green-strong">
                      {p.nama}
                    </h3>
                    <p className="mt-3 text-base font-extrabold text-green-strong">
                      {formatRupiah(p.harga)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}

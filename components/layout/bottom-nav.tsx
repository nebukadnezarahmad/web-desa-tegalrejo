"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HouseIcon,
  StorefrontIcon,
  HeartbeatIcon,
  RecycleIcon,
  BuildingsIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Navigasi bawah khusus layar kecil. Semua tujuan utama terjangkau
 * satu ketukan ibu jari, tanpa membuka menu dulu. Di layar besar
 * digantikan navigasi atas pada SiteHeader.
 *
 * Sengaja tetap 5 tujuan inti (bukan menambahkan Lapor di sini).
 * Di lebar layar HP, enam tujuan terasa sesak. Lapor tetap mudah
 * dijangkau lewat CTA utama di beranda dan menu atas versi desktop.
 */
const tab = [
  { label: "Beranda", href: "/", ikon: HouseIcon },
  { label: "UMKM", href: "/umkm", ikon: StorefrontIcon },
  { label: "Kesehatan", href: "/kesehatan", ikon: HeartbeatIcon },
  { label: "Lingkungan", href: "/lingkungan", ikon: RecycleIcon },
  { label: "Profil", href: "/profil", ikon: BuildingsIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  const aktif = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Navigasi utama"
      /* Latar pekat, bukan tembus 95 persen. Isi halaman menggulung tepat di
         bawah bilah ini, dan sisa lima persen sudah cukup membuat teks di
         belakangnya terbaca sebagai bayangan, paling terasa pada angka tebal
         kartu Denyut Desa. Blur latar tidak menutupinya karena yang tersisa
         adalah tembusan warna, bukan ketajaman. */
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {tab.map(({ label, href, ikon: Ikon }) => {
          const ini = aktif(href);
          return (
            /* min-w-0 wajib: tanpa itu lebar min-content label terpanjang
               memaksa tiap kolom melebar dan navigasi meluber dari layar. */
            <li key={href} className="min-w-0">
              <Link
                href={href}
                aria-current={ini ? "page" : undefined}
                className={cn(
                  "flex h-16 w-full flex-col items-center justify-center gap-1 px-0.5 transition-[transform,color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] active:scale-[0.96]",
                  ini ? "text-green-strong" : "text-ink-faint",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-12 items-center justify-center rounded-full transition-colors",
                    ini && "bg-green-soft",
                  )}
                >
                  <Ikon size={21} weight={ini ? "fill" : "regular"} />
                </span>
                <span
                  className={cn(
                    "w-full truncate text-center text-[0.75rem] leading-none",
                    ini ? "font-bold" : "font-medium",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

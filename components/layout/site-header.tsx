"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneIcon } from "@phosphor-icons/react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { navigasi, desa } from "@/lib/data/desa";
import { cn } from "@/lib/utils";

/**
 * Di layar besar: navigasi lengkap di atas.
 * Di layar kecil: hanya identitas + pintasan layanan. Navigasi utama
 * ditangani BottomNav supaya terjangkau ibu jari.
 */
export function SiteHeader() {
  const pathname = usePathname();

  const aktif = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-18 lg:px-8">
        <Link href="/" className="rounded-lg py-2" aria-label={`Beranda ${desa.merek}`}>
          <Logo />
        </Link>

        <nav aria-label="Navigasi halaman" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigasi.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={aktif(item.href) ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center rounded-full px-4 text-[0.9375rem] font-semibold transition-colors",
                    aktif(item.href)
                      ? "bg-green-soft text-green-deep"
                      : "text-ink-muted hover:bg-surface-soft hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Button asChild variant="primary" size="sm" className="px-4 lg:px-5">
          <Link href="/profil#layanan">
            <PhoneIcon size={17} weight="bold" />
            <span className="hidden sm:inline">Layanan Warga</span>
            <span className="sm:hidden">Layanan</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}

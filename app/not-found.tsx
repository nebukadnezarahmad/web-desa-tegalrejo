import Link from "next/link";
import { HouseIcon, MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

/** Halaman 404 berbahasa Indonesia. Bawaan Next.js polos dan berbahasa
 *  Inggris, janggal di situs yang seluruhnya berbahasa Indonesia. */
export default function TidakDitemukan() {
  return (
    <div className="relative flex min-h-[60vh] items-center overflow-hidden bg-surface-soft">
      <div aria-hidden className="kontur pointer-events-none absolute inset-0" />
      <div className="relative mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="kicker text-green-strong">Halaman tidak ada</p>
        <h1 className="judul-display mt-3 text-[2rem] text-ink sm:text-[2.75rem]">
          Alamat yang dituju tidak ditemukan
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted sm:text-[1.0625rem]">
          Mungkin tautannya salah ketik, atau halamannya sudah dipindahkan.
          Coba mulai dari beranda.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <HouseIcon size={18} weight="bold" />
              Kembali ke beranda
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/lapor/status">
              <MagnifyingGlassIcon size={18} weight="bold" />
              Cek status laporan
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

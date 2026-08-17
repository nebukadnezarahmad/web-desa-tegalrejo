import Link from "next/link";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeSimpleIcon,
  ClockIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/layout/logo";
import { desa, navigasi } from "@/lib/data/desa";

const tautanLain = [
  { label: "Daftar laporan warga", href: "/lapor#daftar" },
  { label: "Cek status laporan", href: "/lapor/status" },
  { label: "Pengumuman", href: "/pengumuman" },
  { label: "Layanan administrasi", href: "/profil#layanan" },
  { label: "Struktur perangkat", href: "/profil#perangkat" },
  { label: "Data RT / RW", href: "/profil#data-rt" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-soft">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-9 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo />
            <ul className="mt-4 flex flex-col gap-2 text-[0.9375rem] text-ink-muted sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-1.5">
              {/* Rata atas, bukan tengah. Alamat membungkus tiga baris di
                  ponsel, dan ikon yang dipusatkan melayang di tengah
                  paragraf alih-alih menandai awalnya. */}
              <li className="flex items-start gap-2 sm:items-center">
                <MapPinIcon
                  size={17}
                  weight="duotone"
                  className="mt-0.5 shrink-0 text-green-strong sm:mt-0"
                />
                <span>
                  {desa.alamatBalai}, {desa.nama}, {desa.kecamatan},{" "}
                  {desa.kabupaten} {desa.kodePos}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon
                  size={17}
                  weight="duotone"
                  className="shrink-0 text-green-strong"
                />
                <span>{desa.telepon}</span>
              </li>
              <li className="flex items-center gap-2">
                <EnvelopeSimpleIcon
                  size={17}
                  weight="duotone"
                  className="shrink-0 text-green-strong"
                />
                <span>{desa.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <ClockIcon
                  size={17}
                  weight="duotone"
                  className="shrink-0 text-blue-strong"
                />
                <span>{desa.jamLayanan}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
            <nav aria-label="Halaman utama">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-ink">
                Halaman
              </h2>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 sm:flex sm:flex-wrap sm:gap-y-1.5">
                {navigasi.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-block py-1 text-[0.9375rem] text-ink-muted transition-colors hover:text-green-strong"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Tautan lain">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-ink">
                Warga
              </h2>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 sm:flex sm:flex-wrap sm:gap-y-1.5">
                {tautanLain.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-block py-1 text-[0.9375rem] text-ink-muted transition-colors hover:text-green-strong"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-6 border-t border-line pt-4 text-sm text-ink-faint">
          <p>
            &copy; {new Date().getFullYear()} Pemerintah {desa.nama},{" "}
            {desa.kabupaten}.
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import {
  ArrowRightIcon,
  ClipboardTextIcon,
  MegaphoneIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { desa, statistikDesa } from "@/lib/data/desa";
import { formatAngka } from "@/lib/utils";

/**
 * Hanya tujuan yang TIDAK ada di menu atas. Kesehatan dan Lingkungan
 * sudah satu klik dari header, jadi mengulangnya di sini cuma menambah
 * baris yang pecah tanpa memberi jalan baru.
 */
const pintasan = [
  {
    label: "Lihat laporan warga",
    href: "/lapor#daftar",
    ikon: ClipboardTextIcon,
    tone: "blue",
  },
  {
    label: "Pengumuman desa",
    href: "/pengumuman",
    ikon: MegaphoneIcon,
    tone: "blue",
  },
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface-soft">
      <div aria-hidden className="kontur pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-surface"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-16 md:pb-28 md:pt-24 lg:px-8">
        <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-[1.15fr_1fr]">
          {/* min-w-0 mencegah kolom grid melebar mengikuti lebar isi */}
          <div className="min-w-0">
            <p className="kicker mb-3 text-green-strong sm:mb-5">
              {desa.kecamatan} · {desa.kabupaten}
            </p>

            <h1 className="judul-display max-w-2xl text-[2.125rem] text-ink sm:text-[3.25rem] lg:text-[3.875rem]">
              Sebelum tanya ke grup WA RT,{" "}
              <span className="text-green-strong">cek di sini dulu.</span>
            </h1>

            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
              Semua kumpulan informasi, program, dan layanan {desa.nama} berada
              di sini. Mulai jadwal posyandu, laporan dan kendala warga, jadwal
              angkutan sampah, sampai pembukaan lapak usaha warga.
            </p>

            <div className="mt-7 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:gap-3">
              <Button asChild size="lg">
                <Link href="/lapor">
                  Lapor Sekarang
                  <ArrowRightIcon size={19} weight="bold" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/kesehatan#kalkulator">Cek Status Gizi Anak</Link>
              </Button>
            </div>

            {/* Membungkus, bukan menggulung ke samping. Pintasan di sini
                cuma tiga dan semuanya setara pentingnya; baris bergulir
                menyembunyikan yang terakhir di balik tepi layar sehingga
                terbaca sebagai tombol terpotong, bukan tombol tersembunyi.
                Kelas .baris-gulir tetap dipakai untuk deretan penyaring
                yang isinya memang banyak dan tak tentu jumlahnya. */}
            <ul className="mt-7 flex flex-wrap gap-2 sm:mt-10">
              {pintasan.map(({ label, href, ikon: Ikon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group/chip flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-sm font-semibold text-ink-muted transition-[color,border-color,transform] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-blue hover:text-blue-strong"
                  >
                    <Ikon
                      size={17}
                      weight="duotone"
                      className="text-blue-strong"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Denyut Desa: penampang lereng.
              Angkanya data asli; yang dirancang adalah cara membacanya.
              Desa ini duduk di 1.300 mdpl di lereng Sindoro, jadi datanya
              disusun menaik seperti tegalan yang menapak kontur: warga di
              kaki lereng, posyandu di puncak. Ketinggian dicantumkan
              sebagai datum supaya pita ini terbaca sebagai tanah, bukan
              sekadar grafik hias. */}
          <figure className="relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface">
            <div aria-hidden className="pita-elevasi absolute inset-0" />
            <div aria-hidden className="garis-elevasi absolute inset-0" />

            <figcaption className="relative flex items-baseline justify-between gap-3 px-6 pt-6 sm:px-8 sm:pt-7">
              <span className="kicker text-green-deep">Denyut Desa</span>
              <span className="font-mono text-[0.75rem] tracking-tight text-green-strong">
                {desa.ketinggian}
              </span>
            </figcaption>

            <dl className="relative mt-6 flex flex-col-reverse">
              {statistikDesa.map((s, i) => (
                <div
                  key={s.label}
                  className="flex items-baseline justify-between gap-4 px-6 py-3.5 sm:px-8"
                  style={{ paddingInlineStart: `calc(1.5rem + ${i * 0.5}rem)` }}
                >
                  <dt className="text-[0.8125rem] font-medium text-ink-muted">
                    {s.label}
                  </dt>
                  <dd className="shrink-0 font-display text-[1.5rem] font-extrabold leading-none tracking-tight text-ink tabular-nums sm:text-[1.75rem]">
                    {formatAngka(s.nilai)}
                    <span className="ml-1.5 font-sans text-xs font-semibold text-ink-faint">
                      {s.satuan}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="relative mt-5 border-t border-green/15 px-6 py-5 text-[0.8125rem] leading-relaxed text-ink-muted sm:px-8">
              {desa.luasWilayah}, {desa.jumlahDusun} dusun, {desa.jumlahRt} RT.
              Hanya 20 hektar berupa sawah, sisanya tegalan dan kebun yang
              mengikuti kontur lereng.
            </p>
          </figure>
        </div>
      </div>
    </section>
  );
}

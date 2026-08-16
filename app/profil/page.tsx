import type { Metadata } from "next";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeSimpleIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/shared/page-header";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { LayananAkordeon } from "@/components/profil/layanan-akordeon";
import { FotoDesa } from "@/components/shared/foto-desa";
import { desa, daftarRt } from "@/lib/data/desa";
import { perangkatDesa, visiMisi, sejarahDesa } from "@/lib/data/profil";
import { cn, formatAngka } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Profil Desa & Layanan",
  description:
    "Sejarah, visi misi, struktur perangkat, data RT/RW, dan layanan administrasi Desa Tegalrejo beserta syarat dan estimasi waktunya.",
};

const totalKk = daftarRt.reduce((n, r) => n + r.kk, 0);
const totalWarga = daftarRt.reduce((n, r) => n + r.warga, 0);

/** Inisial untuk avatar, pengganti foto yang belum tersedia. */
function inisial(nama: string) {
  return nama
    .split(" ")
    .slice(0, 2)
    .map((k) => k[0])
    .join("")
    .toUpperCase();
}

export default function HalamanProfil() {
  return (
    <>
      <PageHeader
        kicker="Tentang Desa"
        tone="blue"
        judul={`Profil ${desa.nama}`}
        deskripsi={`${desa.luasWilayah} lahan, ${desa.jumlahDusun} dusun, ${desa.jumlahRt} RT, dan ${formatAngka(totalWarga)} warga di ${desa.kecamatan}, ${desa.kabupaten}, ${desa.provinsi}.`}
      />

      {/* Sejarah */}
      <Section latar="putih">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Foto memanjang mengisi sisa kolom, bukan mengunci rasio potret.
              Rasio tetap membuat kolom kiri lebih tinggi daripada teks di
              kanan, dan sisanya jadi ruang kosong. */}
          <div className="flex flex-col">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-blue-strong">
              Riwayat
            </p>
            <h2 className="text-[1.75rem] font-extrabold text-ink sm:text-[2.125rem]">
              Bagaimana desa ini terbentuk
            </h2>
            <FotoDesa
              src="sawah-terasering.jpg"
              alt="Hamparan sawah berteras dengan barisan pohon kelapa di kejauhan"
              rasio="lanskap"
              className="mt-6 rounded-[var(--radius-card)] lg:aspect-auto lg:min-h-[20rem] lg:flex-1"
            />
          </div>
          <div className="flex flex-col gap-5">
            {sejarahDesa.map((p, i) => (
              <p
                key={i}
                className="text-[1.0625rem] leading-relaxed text-ink-muted"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* Visi misi */}
      <Section latar="lembut">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-green-strong">
              Arah Pembangunan
            </p>
            <h2 className="text-[1.75rem] font-extrabold text-ink sm:text-[2.125rem]">
              Visi dan misi
            </h2>
            <p className="mt-6 rounded-[var(--radius-card)] border border-green/25 bg-green-soft p-6 text-[1.0625rem] font-semibold leading-relaxed text-green-deep">
              {visiMisi.visi}
            </p>
          </div>

          <ol className="flex flex-col gap-4">
            {visiMisi.misi.map((m, i) => (
              <Reveal as="li" key={m} index={i}>
                <div className="flex gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5">
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-soft text-sm font-extrabold text-green-deep"
                  >
                    {i + 1}
                  </span>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    {m}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Layanan administrasi */}
      <Section latar="putih" id="layanan" className="scroll-mt-20">
        <SectionHeading
          kicker="Layanan Warga"
          tone="blue"
          judul="Layanan administrasi"
          deskripsi="Buka salah satu untuk melihat berkas yang perlu dibawa, urutan langkahnya, dan berapa lama pengerjaannya. Seluruh layanan tidak dipungut biaya."
        />
        <LayananAkordeon />

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-[var(--radius-card)] border border-line bg-surface-tint p-6">
          <p className="flex items-center gap-2.5 text-[0.9375rem] text-ink">
            <ClockIcon
              size={19}
              weight="duotone"
              className="shrink-0 text-blue-strong"
            />
            Loket buka {desa.jamLayanan}
          </p>
          <p className="flex items-center gap-2.5 text-[0.9375rem] text-ink">
            <CheckCircleIcon
              size={19}
              weight="duotone"
              className="shrink-0 text-green-strong"
            />
            Semua layanan gratis, laporkan bila ada pungutan
          </p>
        </div>
      </Section>

      {/* Perangkat desa */}
      <Section latar="lembut" id="perangkat" className="scroll-mt-20">
        <SectionHeading
          kicker="Susunan Organisasi"
          judul="Perangkat desa"
          deskripsi="Pejabat dan staf yang melayani warga di balai desa serta kepala dusun di masing-masing wilayah."
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perangkatDesa.map((p, i) => (
            <Reveal as="li" key={p.nama} index={i}>
              <div className="flex h-full items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5">
                <span
                  aria-hidden
                  className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-green-soft text-base font-extrabold text-green-deep"
                >
                  {inisial(p.nama)}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-[0.9375rem] font-bold text-ink">
                    {p.nama}
                  </h3>
                  <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
                    {p.jabatan}
                    {p.wilayah && ` ${p.wilayah}`}
                  </p>
                  <p className="mt-1.5 text-[0.75rem] text-ink-faint">
                    Menjabat sejak {p.sejak}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Data RT */}
      <Section latar="putih" id="data-rt" className="scroll-mt-20">
        <SectionHeading
          kicker="Data Wilayah"
          judul="Sebaran RT dan RW"
          deskripsi={`${formatAngka(totalKk)} kepala keluarga tersebar di ${desa.jumlahRt} RT dan ${desa.jumlahRw} RW.`}
        />

        {/* Mobile: kartu per RT, tidak perlu geser samping */}
        <ul className="flex flex-col gap-2.5 lg:hidden">
          {daftarRt.map((r) => (
            <li
              key={r.rt}
              className="flex items-center justify-between gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-4"
            >
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-bold text-ink">
                  {r.rt} <span className="text-ink-faint">/ {r.rw}</span>
                </p>
                <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
                  Dusun {r.dusun}
                </p>
              </div>
              <dl className="flex shrink-0 gap-5 text-right">
                <div>
                  <dd className="text-base font-extrabold text-ink">{r.kk}</dd>
                  <dt className="text-[0.6875rem] text-ink-faint">KK</dt>
                </div>
                <div>
                  <dd className="text-base font-extrabold text-green-strong">
                    {formatAngka(r.warga)}
                  </dd>
                  <dt className="text-[0.6875rem] text-ink-faint">warga</dt>
                </div>
              </dl>
            </li>
          ))}
          <li className="flex items-center justify-between gap-4 rounded-[var(--radius-card)] border border-line-strong bg-surface-soft p-4">
            <p className="text-[0.9375rem] font-extrabold text-ink">Total</p>
            <dl className="flex shrink-0 gap-5 text-right">
              <div>
                <dd className="text-base font-extrabold text-ink">
                  {formatAngka(totalKk)}
                </dd>
                <dt className="text-[0.6875rem] text-ink-faint">KK</dt>
              </div>
              <div>
                <dd className="text-base font-extrabold text-green-strong">
                  {formatAngka(totalWarga)}
                </dd>
                <dt className="text-[0.6875rem] text-ink-faint">warga</dt>
              </div>
            </dl>
          </li>
        </ul>

        {/* Desktop: tabel penuh */}
        <div className="hidden overflow-x-auto rounded-[var(--radius-card)] border border-line lg:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Jumlah kepala keluarga dan warga per RT di {desa.nama}
            </caption>
            <thead>
              <tr className="bg-surface-soft">
                <th
                  scope="col"
                  className="px-5 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-ink-muted"
                >
                  RT
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-ink-muted"
                >
                  RW
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-ink-muted"
                >
                  Dusun
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-right text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-ink-muted"
                >
                  KK
                </th>
                <th
                  scope="col"
                  className="px-5 py-4 text-right text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-ink-muted"
                >
                  Warga
                </th>
              </tr>
            </thead>
            <tbody>
              {daftarRt.map((r) => (
                <tr key={r.rt} className="border-t border-line">
                  <th
                    scope="row"
                    className="px-5 py-3.5 text-[0.9375rem] font-bold text-ink"
                  >
                    {r.rt}
                  </th>
                  <td className="px-5 py-3.5 text-[0.9375rem] text-ink-muted">
                    {r.rw}
                  </td>
                  <td className="px-5 py-3.5 text-[0.9375rem] text-ink-muted">
                    {r.dusun}
                  </td>
                  <td className="px-5 py-3.5 text-right text-[0.9375rem] text-ink-muted">
                    {r.kk}
                  </td>
                  <td className="px-5 py-3.5 text-right text-[0.9375rem] text-ink-muted">
                    {formatAngka(r.warga)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-line-strong bg-surface-soft">
                <th
                  scope="row"
                  colSpan={3}
                  className="px-5 py-4 text-[0.9375rem] font-extrabold text-ink"
                >
                  Total
                </th>
                <td className="px-5 py-4 text-right text-[0.9375rem] font-extrabold text-ink">
                  {formatAngka(totalKk)}
                </td>
                <td className="px-5 py-4 text-right text-[0.9375rem] font-extrabold text-ink">
                  {formatAngka(totalWarga)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Section>

      {/* Kontak */}
      <Section latar="lembut" id="kontak" className="scroll-mt-20">
        <SectionHeading
          kicker="Hubungi Kami"
          tone="blue"
          judul="Balai Desa Tegalrejo"
          deskripsi="Datang langsung pada hari kerja, atau hubungi lebih dulu bila ingin memastikan berkas."
        />

        {/* Lima kolom, alamat mengambil dua. Dengan empat kolom sama lebar,
            alamat terpecah jadi empat baris sementara tiga kartu lain hanya
            satu baris, dan tinggi kartu yang diseragamkan grid menyisakan
            ruang kosong besar di bawah ketiganya. */}
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              ikon: MapPinIcon,
              label: "Alamat",
              isi: `${desa.alamatBalai}, ${desa.nama}, ${desa.kecamatan}, ${desa.kabupaten} ${desa.kodePos}`,
              lebar: "lg:col-span-2",
            },
            { ikon: PhoneIcon, label: "Telepon", isi: desa.telepon },
            { ikon: EnvelopeSimpleIcon, label: "Surel", isi: desa.email },
            { ikon: ClockIcon, label: "Jam layanan", isi: desa.jamLayanan },
          ].map(({ ikon: Ikon, label, isi, lebar }) => (
            <div
              key={label}
              /* `min-w-0`: butir grid bawaannya tidak mau menyusut di bawah
                 lebar kontennya, sehingga alamat surel yang tanpa spasi
                 meluber keluar kartu alih-alih dipatahkan. */
              className={cn(
                "flex min-w-0 flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6",
                lebar,
              )}
            >
              <Ikon
                size={24}
                weight="duotone"
                className="mb-3.5 text-blue-strong"
              />
              <dt className="text-[0.8125rem] font-semibold text-ink-faint">
                {label}
              </dt>
              <dd className="mt-1.5 break-words text-[0.9375rem] leading-relaxed text-ink">
                {isi}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <Badge tone="netral">
            Purwarupa: data pada halaman ini bersifat fiktif
          </Badge>
        </div>
      </Section>
    </>
  );
}

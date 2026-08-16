import type { Metadata } from "next";
import {
  CheckIcon,
  XIcon,
  MapPinIcon,
  CalendarBlankIcon,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/shared/page-header";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { JadwalSampah } from "@/components/lingkungan/jadwal-sampah";
import { GrafikSetoran } from "@/components/lingkungan/grafik-setoran";
import {
  panduanPilah,
  statistikLingkungan,
  programLingkungan,
} from "@/lib/data/sampah";
import { cn, formatAngka } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lingkungan & Persampahan",
  description:
    "Jadwal angkut sampah per RT, panduan memilah sampah rumah tangga, statistik bank sampah, dan program penghijauan Desa Tegalrejo.",
};

const warnaPilah = {
  hijau: {
    kotak: "border-green/40 bg-green-soft",
    judul: "text-green-deep",
    ikon: "text-green-strong",
  },
  biru: {
    kotak: "border-blue/40 bg-blue-soft",
    judul: "text-blue-deep",
    ikon: "text-blue-strong",
  },
  merah: {
    kotak: "border-danger/40 bg-danger-soft",
    judul: "text-danger",
    ikon: "text-danger",
  },
} as const;

export default function HalamanLingkungan() {
  return (
    <>
      <PageHeader
        judul="Yuk, jaga kelestarian lingkungan bersama"
        deskripsi="Pengelolaan sampah dimulai dari dapur masing-masing rumah. Halaman ini memuat jadwal angkut tiap RT, cara memilah yang benar, dan hasil kerja bank sampah desa sejauh ini."
      />

      {/* Statistik */}
      <Section latar="putih">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statistikLingkungan.map((s, i) => (
            <Reveal key={s.label} index={i}>
              <div className="rounded-[var(--radius-card)] border border-line bg-surface-soft p-6">
                <dd className="text-[2rem] font-extrabold leading-none tracking-tight text-ink">
                  {formatAngka(s.nilai)}
                  <span className="ml-1.5 text-sm font-semibold text-ink-faint">
                    {s.satuan}
                  </span>
                </dd>
                <dt className="mt-2.5 text-[0.9375rem] text-ink-muted">
                  {s.label}
                </dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </Section>

      {/* Jadwal angkut */}
      <Section latar="lembut" id="jadwal" className="scroll-mt-20">
        <SectionHeading
          kicker="Cek Cepat"
          judul="Jadwal angkut sampah RT Anda"
          deskripsi="Pilih RT tempat tinggal untuk melihat hari angkut, titik kumpul, dan petugas yang bertanggung jawab."
        />
        <JadwalSampah />
      </Section>

      {/* Panduan pilah */}
      <Section latar="putih">
        <SectionHeading
          kicker="Panduan Warga"
          judul="Memilah sampah rumah tangga"
          deskripsi="Tiga jenis, tiga perlakuan berbeda. Salah pilah membuat sampah yang sebenarnya masih bernilai jadi ikut terbuang."
        />

        <ul className="grid gap-5 lg:grid-cols-3">
          {panduanPilah.map((p, i) => {
            const w = warnaPilah[p.warna];
            return (
              <Reveal as="li" key={p.jenis} index={i}>
                <div
                  className={cn(
                    "flex h-full flex-col rounded-[var(--radius-panel)] border p-6 sm:p-7",
                    w.kotak,
                  )}
                >
                  <h3 className={cn("text-lg font-extrabold", w.judul)}>
                    {p.jenis}
                  </h3>

                  <div className="mt-5">
                    <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
                      Termasuk
                    </p>
                    <ul className="flex flex-col gap-2">
                      {p.masuk.map((m) => (
                        <li
                          key={m}
                          className="flex gap-2.5 text-[0.9375rem] text-ink"
                        >
                          <CheckIcon
                            size={17}
                            weight="bold"
                            aria-hidden
                            className={cn("mt-0.5 shrink-0", w.ikon)}
                          />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
                      Jangan dicampur
                    </p>
                    <ul className="flex flex-col gap-2">
                      {p.tidakMasuk.map((m) => (
                        <li
                          key={m}
                          className="flex gap-2.5 text-[0.9375rem] text-ink-muted"
                        >
                          <XIcon
                            size={17}
                            weight="bold"
                            aria-hidden
                            className="mt-0.5 shrink-0 text-ink-faint"
                          />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-6 flex-1 border-t border-ink/10 pt-4 text-[0.8125rem] leading-relaxed text-ink-muted">
                    {p.catatan}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      {/* Bank sampah */}
      <Section latar="lembut">
        <SectionHeading
          kicker="Bank Sampah"
          judul="Setoran warga enam bulan terakhir"
          deskripsi="Angka dalam kilogram, dihimpun dari catatan pos bank sampah dan komposter komunal tiap dusun."
        />
        <GrafikSetoran />
      </Section>

      {/* Program */}
      <Section latar="putih">
        <SectionHeading
          kicker="Program Berjalan"
          judul="Kegiatan lingkungan desa"
          deskripsi="Empat program yang berjalan sepanjang tahun, terbuka untuk seluruh warga."
        />

        <ul className="grid gap-5 md:grid-cols-2">
          {programLingkungan.map((p, i) => (
            <Reveal as="li" key={p.judul} index={i}>
              <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6">
                <h3 className="text-[1.0625rem] font-bold text-ink">
                  {p.judul}
                </h3>
                <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {p.deskripsi}
                </p>
                <ul className="mt-5 flex flex-col gap-2.5 border-t border-line pt-4 text-[0.8125rem] text-ink-muted">
                  <li className="flex gap-2.5">
                    <MapPinIcon
                      size={16}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-green-strong"
                    />
                    {p.lokasi}
                  </li>
                  <li className="flex gap-2.5">
                    <CalendarBlankIcon
                      size={16}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-blue-strong"
                    />
                    {p.jadwal}
                  </li>
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}

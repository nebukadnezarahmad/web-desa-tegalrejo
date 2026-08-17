import type { Metadata } from "next";
import {
  MapPinIcon,
  CalendarBlankIcon,
  ClockIcon,
  UserCircleIcon,
  BabyIcon,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/shared/page-header";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { KalkulatorGizi } from "@/components/kesehatan/kalkulator-gizi";
import { GrafikTumbuh } from "@/components/kesehatan/grafik-tumbuh";
import { posyandu, programKesehatan } from "@/lib/data/posyandu";

export const metadata: Metadata = {
  title: "Kesehatan & Posyandu",
  description:
    "Kalkulator status gizi anak berdasarkan Standar Antropometri WHO, jadwal enam posyandu Desa Tegalrejo, dan program kesehatan warga.",
};

export default function HalamanKesehatan() {
  return (
    <>
      <PageHeader
        judul="Pantau tumbuh kembang anak sejak dini"
        deskripsi="Perawakan pendek terbentuk perlahan dan paling mudah dicegah sebelum anak berusia dua tahun. Halaman ini membantu orang tua dan kader mengenali tandanya lebih awal, lalu tahu ke mana harus melangkah."
      />

      {/* Kalkulator, fitur unggulan */}
      <Section latar="putih" id="kalkulator" className="scroll-mt-20">
        {/* Ditulis lepas dari SectionHeading, bukan dengan menimpa kelasnya.
            Komponen itu menyejajarkan judul ke kiri dan menempelkan aksi di
            kanan pada layar lebar; memaksanya rata tengah berarti melawan
            tata letak bawaannya di dua tempat sekaligus. */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <h2 className="judul-display text-[1.625rem] text-ink sm:text-[2rem] md:text-[2.375rem]">
            Kalkulator status gizi anak
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted sm:mt-4 sm:text-base md:text-[1.0625rem]">
            Perhitungan memakai metode LMS dari Standar Antropometri Anak WHO,
            indeks yang sama yang dipakai kader posyandu. Hasilnya keluar
            seketika, tanpa data anak dikirim ke mana pun.
          </p>
        </div>
        <KalkulatorGizi />
      </Section>

      {/* Grafik pertumbuhan */}
      <Section latar="lembut">
        <SectionHeading
          kicker="Membaca Kurva"
          judul="Cara membaca grafik pertumbuhan"
          deskripsi="Satu kali pengukuran tidak cukup. Yang lebih penting adalah arah garisnya dari bulan ke bulan."
        />
        <GrafikTumbuh />
      </Section>

      {/* Jadwal posyandu */}
      <Section latar="putih" id="posyandu" className="scroll-mt-20">
        <SectionHeading
          kicker="Jadwal Layanan"
          judul="Enam posyandu, bergilir tiap dusun"
          deskripsi="Bawa buku Kesehatan Ibu dan Anak setiap datang. Pendaftaran balita baru dilayani di lokasi tanpa biaya."
        />

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posyandu.map((p, i) => (
            <Reveal as="li" key={p.nama} index={i}>
              <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[1.0625rem] font-bold text-ink">
                      {p.nama}
                    </h3>
                    <p className="mt-1 text-[0.8125rem] text-ink-faint">
                      Dusun {p.dusun} · {p.melayani}
                    </p>
                  </div>
                  <Badge tone="green" className="shrink-0">
                    <BabyIcon size={13} weight="bold" />
                    {p.balita}
                  </Badge>
                </div>

                <ul className="flex flex-1 flex-col gap-2.5 text-[0.9375rem] text-ink-muted">
                  <li className="flex gap-2.5">
                    <CalendarBlankIcon
                      size={17}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-green-strong"
                    />
                    {p.hari}
                  </li>
                  <li className="flex gap-2.5">
                    <ClockIcon
                      size={17}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-green-strong"
                    />
                    {p.waktu}
                  </li>
                  <li className="flex gap-2.5">
                    <MapPinIcon
                      size={17}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-green-strong"
                    />
                    {p.alamat}
                  </li>
                  <li className="flex gap-2.5">
                    <UserCircleIcon
                      size={17}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-blue-strong"
                    />
                    Kader: {p.kader}
                  </li>
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Program kesehatan */}
      <Section latar="lembut">
        <SectionHeading
          kicker="Program Berjalan"
          judul="Layanan kesehatan yang tersedia"
          deskripsi="Program yang berjalan rutin sepanjang tahun, terbuka untuk seluruh warga desa."
        />

        <ul className="grid gap-5 md:grid-cols-2">
          {programKesehatan.map((p, i) => (
            <Reveal as="li" key={p.judul} index={i}>
              <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6">
                <h3 className="text-[1.0625rem] font-bold text-ink">
                  {p.judul}
                </h3>
                <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {p.deskripsi}
                </p>
                <dl className="mt-5 grid gap-3 border-t border-line pt-4 text-[0.8125rem] sm:grid-cols-2">
                  <div>
                    <dt className="text-ink-faint">Sasaran</dt>
                    <dd className="mt-0.5 font-semibold text-ink">
                      {p.sasaran}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-faint">Jadwal</dt>
                    <dd className="mt-0.5 font-semibold text-ink">{p.jadwal}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}

import Link from "next/link";
import {
  StorefrontIcon,
  HeartbeatIcon,
  RecycleIcon,
  FileTextIcon,
  ArrowUpRightIcon,
  RulerIcon,
  MegaphoneIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

const kartu = [
  {
    href: "/kesehatan#kalkulator",
    judul: "Kalkulator Status Gizi Anak",
    deskripsi:
      "Masukkan usia, tinggi, dan berat badan balita. Hasilnya dihitung dengan Standar Antropometri Anak dari WHO, indeks yang sama yang dipakai kader posyandu untuk menapis perawakan pendek.",
    ikon: RulerIcon,
    tone: "green" as const,
    span: "sm:col-span-2 sm:row-span-2",
    utama: true,
  },
  {
    href: "/umkm",
    judul: "Lapak UMKM Warga",
    deskripsi: "63 usaha mikro warga, lengkap dengan kontak langsung pemiliknya.",
    ikon: StorefrontIcon,
    tone: "green" as const,
    span: "sm:col-span-2",
  },
  {
    href: "/lingkungan#jadwal",
    judul: "Jadwal Angkut Sampah",
    deskripsi: "Pilih RT, lihat hari angkut dan titik kumpulnya.",
    ikon: RecycleIcon,
    tone: "green" as const,
    span: "",
  },
  {
    href: "/kesehatan#posyandu",
    judul: "Jadwal Posyandu",
    deskripsi: "Enam posyandu, jadwal bergilir tiap dusun.",
    ikon: HeartbeatIcon,
    tone: "green" as const,
    span: "",
  },
  {
    href: "/lapor",
    judul: "Lapor Warga",
    deskripsi:
      "Jalan rusak, sampah menumpuk, atau masalah lain di lingkungan? Laporkan di sini, lacak tindak lanjutnya pakai kode yang dikirim otomatis.",
    ikon: MegaphoneIcon,
    tone: "blue" as const,
    span: "sm:col-span-2",
  },
  {
    href: "/profil#layanan",
    judul: "Layanan Administrasi",
    deskripsi:
      "Enam jenis surat dengan syarat, alur, dan estimasi waktu yang jelas. Semuanya tanpa pungutan.",
    ikon: FileTextIcon,
    tone: "blue" as const,
    span: "sm:col-span-2",
  },
];

/** Contoh keluaran kalkulator, mengisi kartu utama sekaligus memberi gambaran hasil. */
const contohStatus = [
  { label: "Normal", kelas: "bg-green-soft text-green-deep" },
  { label: "Pendek", kelas: "bg-warn-soft text-warn" },
  { label: "Sangat pendek", kelas: "bg-danger-soft text-danger" },
];

export function BentoLayanan() {
  // Seksi terpenting halaman ini: apa yang bisa warga kerjakan sendiri.
  // Diberi ruang paling lega dan ditandai garis kontur. Di sinilah
  // halaman berpindah dari "kabar" ke "tindakan".
  return (
    <Section latar="lembut" ritme="lega" batas>
      <SectionHeading
        kicker="Layanan Inti"
        judul="Yang bisa warga kerjakan di sini"
        deskripsi="Urusan yang paling sering ditanyakan warga, dibuat bisa diselesaikan sendiri tanpa harus datang ke balai desa dulu."
      />

      <div className="grid auto-rows-[minmax(11rem,auto)] grid-flow-dense gap-4 sm:grid-cols-4">
        {kartu.map((k, i) => {
          const Ikon = k.ikon;
          const hijau = k.tone === "green";
          return (
            <Reveal key={k.href} index={i} className={cn("h-full", k.span)}>
              <Link
                href={k.href}
                className={cn(
                  "group flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius-panel)] border p-6 transition-[transform,border-color,box-shadow,color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 sm:p-7",
                  hijau
                    ? "border-line bg-surface-soft hover:border-green/40 hover:shadow-lg hover:shadow-green/8"
                    : "border-line bg-surface-tint hover:border-blue/40 hover:shadow-lg hover:shadow-blue/8",
                  k.utama && "relative",
                )}
              >
                {k.utama && (
                  <div
                    aria-hidden
                    className="kontur pointer-events-none absolute inset-0 opacity-60"
                  />
                )}

                <div className="relative">
                  <span
                    className={cn(
                      "mb-5 flex h-12 w-12 items-center justify-center rounded-xl",
                      hijau ? "bg-surface" : "bg-surface",
                    )}
                  >
                    <Ikon
                      size={k.utama ? 26 : 24}
                      weight="duotone"
                      className={hijau ? "text-green-strong" : "text-blue-strong"}
                    />
                  </span>

                  <h3
                    className={cn(
                      "font-bold text-ink",
                      k.utama ? "text-xl sm:text-2xl" : "text-[1.0625rem]",
                    )}
                  >
                    {k.judul}
                  </h3>
                  <p
                    className={cn(
                      "mt-2.5 leading-relaxed text-ink-muted",
                      k.utama ? "max-w-md text-[0.9375rem]" : "text-sm",
                    )}
                  >
                    {k.deskripsi}
                  </p>

                  {k.utama && (
                    <ul className="mt-7 flex flex-wrap gap-2">
                      {contohStatus.map((s) => (
                        <li
                          key={s.label}
                          className={cn(
                            "rounded-full px-3.5 py-1.5 text-xs font-bold",
                            s.kelas,
                          )}
                        >
                          {s.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <span
                  className={cn(
                    "relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold",
                    hijau ? "text-green-strong" : "text-blue-strong",
                  )}
                >
                  Buka
                  <ArrowUpRightIcon
                    size={15}
                    weight="bold"
                    className="transition-transform duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

import Link from "next/link";
import {
  ClipboardTextIcon,
  StorefrontIcon,
  MegaphoneIcon,
  ClockCounterClockwiseIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export const daftarTabAdmin = ["laporan", "produk", "pengumuman", "riwayat"] as const;
export type TabAdmin = (typeof daftarTabAdmin)[number];

export function tabValid(nilai: unknown): nilai is TabAdmin {
  return (
    typeof nilai === "string" && (daftarTabAdmin as readonly string[]).includes(nilai)
  );
}

const isi: Record<
  TabAdmin,
  { label: string; ikon: typeof ClipboardTextIcon; hitungan?: boolean }
> = {
  laporan: { label: "Laporan warga", ikon: ClipboardTextIcon, hitungan: true },
  produk: { label: "Usulan produk", ikon: StorefrontIcon, hitungan: true },
  pengumuman: { label: "Pengumuman", ikon: MegaphoneIcon },
  riwayat: { label: "Riwayat", ikon: ClockCounterClockwiseIcon },
};

/**
 * Perpindahan antarbagian panel petugas.
 *
 * Dibuat sebagai tautan, bukan state di peramban, karena halamannya server
 * component yang membaca basis data. Dengan begitu bagian yang sedang dibuka
 * ikut tersimpan di URL, bisa dimuat ulang tanpa kehilangan tempat, dan
 * sejalan dengan penyaringan status yang sudah memakai ?status=.
 */
export function TabAdmin({
  aktif,
  jumlahLaporan,
  jumlahUsulan,
}: {
  aktif: TabAdmin;
  jumlahLaporan: number;
  jumlahUsulan: number;
}) {
  const angka: Record<TabAdmin, number | undefined> = {
    laporan: jumlahLaporan,
    produk: jumlahUsulan,
    pengumuman: undefined,
    riwayat: undefined,
  };

  return (
    <nav aria-label="Bagian panel petugas" className="border-b border-line bg-surface">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Empat tab tidak muat sebaris di ponsel: yang terakhir tersembunyi
            di balik tepi layar tanpa petunjuk apa pun bahwa masih ada
            lanjutannya. Di lebar sempit disusun dua kolom, dan penanda tab
            aktif berpindah dari garis bawah ke latar karena garis bawah
            tidak terbaca pada susunan bertingkat. */}
        <ul className="grid grid-cols-2 gap-1 py-2 sm:-mb-px sm:flex sm:py-0">
          {daftarTabAdmin.map((tab) => {
            const { label, ikon: Ikon } = isi[tab];
            const dipilih = tab === aktif;
            const n = angka[tab];

            return (
              <li key={tab} className="min-w-0 sm:shrink-0">
                <Link
                  href={`/admin/laporan?tab=${tab}`}
                  aria-current={dipilih ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-chip)] px-3 py-3 text-[0.875rem] font-semibold transition-[color,border-color,background-color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)]",
                    "sm:justify-start sm:rounded-none sm:border-b-2 sm:px-5 sm:py-3.5 sm:text-[0.9375rem]",
                    dipilih
                      ? "bg-blue-soft text-blue-strong sm:border-blue-strong sm:bg-transparent"
                      : "text-ink-muted hover:bg-surface-soft sm:border-transparent sm:bg-transparent sm:hover:border-line-strong sm:hover:text-ink",
                  )}
                >
                  <Ikon size={18} weight={dipilih ? "fill" : "duotone"} />
                  {label}
                  {typeof n === "number" && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[0.75rem] font-bold tabular-nums",
                        dipilih
                          ? "bg-blue-soft text-blue-deep"
                          : "bg-surface-soft text-ink-faint",
                      )}
                    >
                      {n}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

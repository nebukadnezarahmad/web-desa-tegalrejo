import Link from "next/link";
import {
  ClipboardTextIcon,
  StorefrontIcon,
  MegaphoneIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export const daftarTabAdmin = ["laporan", "produk", "pengumuman"] as const;
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
  };

  return (
    <nav aria-label="Bagian panel petugas" className="border-b border-line bg-surface">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Bisa digeser di layar sempit supaya tiga tab tidak berdesakan. */}
        <ul className="-mb-px flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {daftarTabAdmin.map((tab) => {
            const { label, ikon: Ikon } = isi[tab];
            const dipilih = tab === aktif;
            const n = angka[tab];

            return (
              <li key={tab} className="shrink-0">
                <Link
                  href={`/admin/laporan?tab=${tab}`}
                  aria-current={dipilih ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3.5 text-[0.9375rem] font-semibold transition-[color,border-color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] sm:px-5",
                    dipilih
                      ? "border-blue-strong text-blue-strong"
                      : "border-transparent text-ink-muted hover:border-line-strong hover:text-ink",
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

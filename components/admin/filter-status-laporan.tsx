import Link from "next/link";
import { cn } from "@/lib/utils";
import { daftarStatusLaporan } from "@/lib/lapor/types";
import type { StatusLaporan } from "@/lib/lapor/types";

const labelStatus: Record<StatusLaporan, string> = {
  menunggu: "Menunggu",
  diterima: "Diterima",
  diproses: "Diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

export function FilterStatusLaporan({
  aktif,
  jumlah,
}: {
  aktif: StatusLaporan | null;
  jumlah: Record<StatusLaporan | "semua", number>;
}) {
  const opsi: { value: StatusLaporan | null; label: string }[] = [
    { value: null, label: "Semua" },
    ...daftarStatusLaporan.map((status) => ({
      value: status,
      label: labelStatus[status],
    })),
  ];

  /* Kisi dua kolom di ponsel. Membungkus bebas membuat enam pil jatuh
     2-3-1 karena lebarnya berbeda-beda, dan baris terakhir yang berisi satu
     pil terbaca seperti sisa. Mulai layar sedang ruangnya cukup untuk satu
     baris, jadi kembali membungkus bebas. */
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {opsi.map((opsiItem) => {
        const isAktif = opsiItem.value === aktif;
        const hitung = jumlah[opsiItem.value ?? "semua"] ?? 0;
        return (
          <Link
            key={opsiItem.label}
            href={opsiItem.value ? `/admin/laporan?status=${opsiItem.value}` : "/admin/laporan"}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-semibold sm:justify-start transition-[transform,background-color,border-color,color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] active:scale-[0.98]",
              isAktif
                ? "border-blue-strong bg-blue-strong text-white"
                : "border-line-strong bg-surface text-ink-muted hover:border-blue-strong/50 hover:text-blue-strong",
            )}
          >
            {opsiItem.label}
            <span className={cn("text-xs", isAktif ? "text-white/80" : "text-ink-faint")}>
              {hitung}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

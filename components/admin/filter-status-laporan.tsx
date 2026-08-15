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

  return (
    <div className="flex flex-wrap gap-2">
      {opsi.map((opsiItem) => {
        const isAktif = opsiItem.value === aktif;
        const hitung = jumlah[opsiItem.value ?? "semua"] ?? 0;
        return (
          <Link
            key={opsiItem.label}
            href={opsiItem.value ? `/admin/laporan?status=${opsiItem.value}` : "/admin/laporan"}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors",
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

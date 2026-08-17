import {
  StorefrontIcon,
  MegaphoneIcon,
  ClipboardTextIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";

export type BarisRiwayat = {
  id: string;
  entitas: "produk" | "pengumuman" | "laporan";
  judul: string;
  tindakan: string;
  keterangan: string | null;
  dibuat_pada: string;
};

const ikon = {
  produk: StorefrontIcon,
  pengumuman: MegaphoneIcon,
  laporan: ClipboardTextIcon,
} as const;

/** Tindakan yang menghilangkan isi diberi penanda merah supaya menonjol
 *  saat petugas menelusuri apa yang berubah. */
const merah = ["dihapus", "usulan ditolak", "ditarik dari lapak"];

function waktu(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function DaftarRiwayat({ baris }: { baris: BarisRiwayat[] }) {
  if (baris.length === 0) {
    return (
      <p className="rounded-[var(--radius-card)] border border-line bg-surface p-6 text-center text-[0.9375rem] text-ink-muted">
        Belum ada tindakan yang tercatat.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {baris.map((r) => {
        const Ikon = ikon[r.entitas];
        return (
          <li
            key={r.id}
            className="flex items-start gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-4 sm:p-5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-soft">
              <Ikon size={19} weight="duotone" className="text-ink-muted" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={merah.includes(r.tindakan) ? "danger" : "green"}>
                  {r.tindakan}
                </Badge>
                <span className="text-[0.75rem] text-ink-faint">{r.entitas}</span>
              </div>
              <p className="mt-1.5 font-semibold text-ink">{r.judul}</p>
              {r.keterangan && (
                <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-muted">
                  {r.keterangan}
                </p>
              )}
            </div>

            <time
              dateTime={r.dibuat_pada}
              className="shrink-0 text-right text-[0.75rem] leading-relaxed text-ink-faint"
            >
              {waktu(r.dibuat_pada)}
            </time>
          </li>
        );
      })}
    </ol>
  );
}

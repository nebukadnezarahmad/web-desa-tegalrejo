import {
  MapPinIcon,
  CalendarBlankIcon,
  ChatCircleTextIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { klienAnon } from "@/lib/supabase/anon";
import { formatTanggal } from "@/lib/utils";
import type { StatusLaporan, StatusLaporanPublik } from "@/lib/lapor/types";

const gayaStatus: Record<
  StatusLaporan,
  { label: string; tone: "green" | "blue" | "warn" | "danger" | "netral" }
> = {
  menunggu: { label: "Menunggu Ditinjau", tone: "netral" },
  diterima: { label: "Diterima", tone: "blue" },
  diproses: { label: "Sedang Diproses", tone: "warn" },
  selesai: { label: "Selesai", tone: "green" },
  ditolak: { label: "Ditolak", tone: "danger" },
};

/**
 * Daftar laporan yang sudah ditinjau petugas. Fungsi daftar_laporan_publik()
 * di Supabase hanya mengembalikan kolom yang aman (tanpa nama pelapor,
 * kontak, maupun kode lacak) dan menyembunyikan laporan berstatus
 * "menunggu" serta "ditolak".
 *
 * Halaman yang memuat komponen ini wajib force-dynamic, kalau tidak querynya
 * cuma jalan sekali saat build.
 */
export async function DaftarLaporan() {
  const supabase = klienAnon();
  const { data } = await supabase.rpc("daftar_laporan_publik");
  const daftar = (data ?? []) as StatusLaporanPublik[];

  if (daftar.length === 0) {
    return (
      <p className="text-[0.9375rem] text-ink-muted">
        Belum ada laporan yang tayang di sini. Laporan baru tampil setelah
        ditinjau petugas.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {daftar.map((laporan, i) => (
        <article
          key={`${laporan.created_at}-${i}`}
          className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge tone={gayaStatus[laporan.status].tone}>
              {gayaStatus[laporan.status].label}
            </Badge>
            <span className="text-[0.8125rem] text-ink-faint">
              Dikirim {formatTanggal(laporan.created_at.slice(0, 10))}
            </span>
          </div>

          <h3 className="mt-4 text-lg font-bold text-ink">{laporan.kategori}</h3>

          <p className="mt-2 flex items-center gap-2 text-[0.9375rem] text-ink-muted">
            <MapPinIcon
              size={17}
              weight="duotone"
              className="shrink-0 text-blue-strong"
            />
            {laporan.lokasi}
          </p>

          <p className="mt-4 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink">
            {laporan.deskripsi}
          </p>

          {laporan.catatan_admin && (
            <div className="mt-5 flex gap-3 rounded-[var(--radius-card)] border border-blue/25 bg-blue-soft p-4">
              <ChatCircleTextIcon
                size={19}
                weight="duotone"
                className="mt-0.5 shrink-0 text-blue-strong"
              />
              <div>
                <p className="text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-blue-deep">
                  Catatan petugas
                </p>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink">
                  {laporan.catatan_admin}
                </p>
              </div>
            </div>
          )}

          <p className="mt-5 flex items-center gap-2 text-[0.8125rem] text-ink-faint">
            <CalendarBlankIcon size={15} weight="duotone" />
            Diperbarui {formatTanggal(laporan.updated_at.slice(0, 10))}
          </p>
        </article>
      ))}
    </div>
  );
}

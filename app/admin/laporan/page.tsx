import type { Metadata } from "next";
import { SignOutIcon } from "@phosphor-icons/react/dist/ssr";
import { klienService } from "@/lib/supabase/service";
import { logoutAdmin } from "@/app/admin/login/actions";
import { daftarStatusLaporan } from "@/lib/lapor/types";
import type { Laporan, StatusLaporan } from "@/lib/lapor/types";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { FilterStatusLaporan } from "@/components/admin/filter-status-laporan";
import { KartuLaporanAdmin } from "@/components/admin/kartu-laporan-admin";
import { desa } from "@/lib/data/desa";

export const metadata: Metadata = {
  title: "Kelola Laporan Warga",
  robots: { index: false, follow: false },
};

function statusValid(nilai: unknown): nilai is StatusLaporan {
  return typeof nilai === "string" && (daftarStatusLaporan as string[]).includes(nilai);
}

export default async function HalamanAdminLaporan(
  props: PageProps<"/admin/laporan">,
) {
  const params = await props.searchParams;
  const filterStatus = statusValid(params.status) ? params.status : null;

  const supabase = klienService();
  const { data } = await supabase
    .from("laporan_warga")
    .select("*")
    .order("created_at", { ascending: false });

  const semuaLaporan = (data ?? []) as Laporan[];
  const jumlah = {
    semua: semuaLaporan.length,
    menunggu: 0,
    diterima: 0,
    diproses: 0,
    selesai: 0,
    ditolak: 0,
  } satisfies Record<StatusLaporan | "semua", number>;
  for (const item of semuaLaporan) jumlah[item.status]++;

  const laporanTampil = filterStatus
    ? semuaLaporan.filter((item) => item.status === filterStatus)
    : semuaLaporan;

  return (
    <>
      <PageHeader
        kicker="Panel Petugas"
        tone="blue"
        judul="Kelola laporan warga"
        deskripsi={`Tinjau dan tindak lanjuti laporan yang masuk dari warga ${desa.nama}.`}
      >
        <form action={logoutAdmin}>
          <Button type="submit" variant="outline" size="sm">
            <SignOutIcon size={16} weight="bold" />
            Keluar
          </Button>
        </form>
      </PageHeader>

      <Section latar="putih">
        <FilterStatusLaporan aktif={filterStatus} jumlah={jumlah} />

        {laporanTampil.length === 0 ? (
          <p className="mt-8 text-[0.9375rem] text-ink-muted">
            Belum ada laporan{filterStatus ? " dengan status ini" : ""}.
          </p>
        ) : (
          <div className="mt-8 flex flex-col gap-5">
            {laporanTampil.map((laporan) => (
              <KartuLaporanAdmin key={laporan.id} laporan={laporan} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

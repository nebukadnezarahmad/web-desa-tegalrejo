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
import { FormPengumuman } from "@/components/admin/form-pengumuman";
import {
  KartuUsulanProduk,
  type UsulanProduk,
} from "@/components/admin/kartu-usulan-produk";
import { SectionHeading } from "@/components/shared/section";
import { TabAdmin, tabValid } from "@/components/admin/tab-admin";
import {
  DaftarPengumumanTerbit,
  DaftarProdukTerbit,
  type BarisPengumuman,
  type BarisProduk,
} from "@/components/admin/daftar-terbit";
import { desa } from "@/lib/data/desa";

export const metadata: Metadata = {
  title: "Kelola Laporan Warga",
  robots: { index: false, follow: false },
};

function statusValid(nilai: unknown): nilai is StatusLaporan {
  return typeof nilai === "string" && (daftarStatusLaporan as string[]).includes(nilai);
}

/** URL publik bucket foto usulan, dirakit sekali di server. */
function basisUrlFoto() {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/produk-umkm`;
}

export default async function HalamanAdminLaporan(
  props: PageProps<"/admin/laporan">,
) {
  const params = await props.searchParams;
  const filterStatus = statusValid(params.status) ? params.status : null;
  const tab = tabValid(params.tab) ? params.tab : "laporan";

  const supabase = klienService();
  const { data } = await supabase
    .from("laporan_warga")
    .select("*")
    .order("created_at", { ascending: false });

  const semuaLaporan = (data ?? []) as Laporan[];

  /* Usulan produk yang belum ditinjau. Dibaca dengan kunci service karena
     RLS menyembunyikan baris berstatus menunggu dari peran anon. */
  const { data: dataUsulan } = await supabase
    .from("produk_umkm")
    .select(
      "id, nama, kategori, harga, satuan, deskripsi, pemilik, usaha, rt, dusun, whatsapp, foto, dibuat_pada",
    )
    .eq("status", "menunggu")
    .order("dibuat_pada", { ascending: true });

  const usulan = (dataUsulan ?? []) as UsulanProduk[];

  /* Isi yang sudah tayang, untuk dikelola ulang oleh petugas. */
  const { data: dataProdukTerbit } = await supabase
    .from("produk_umkm")
    .select("id, slug, nama, kategori, harga, satuan, usaha, dusun")
    .eq("status", "terbit")
    .order("nama");

  const { data: dataPengumuman } = await supabase
    .from("pengumuman")
    .select("slug, judul, kategori, tanggal, penerbit, penting")
    .order("tanggal", { ascending: false });

  const produkTerbit = (dataProdukTerbit ?? []) as BarisProduk[];
  const pengumumanTerbit = (dataPengumuman ?? []) as BarisPengumuman[];
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

      <TabAdmin
        aktif={tab}
        jumlahLaporan={jumlah.semua}
        jumlahUsulan={usulan.length}
      />

      {tab === "laporan" && (
      <Section latar="putih">
        <FilterStatusLaporan aktif={filterStatus} jumlah={jumlah} />

        {laporanTampil.length === 0 ? (
          <p className="mt-8 text-[0.9375rem] text-ink-muted">
            Belum ada laporan{filterStatus ? " dengan status ini" : ""}.
          </p>
        ) : (
          <div className="mt-8 grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {laporanTampil.map((laporan) => (
              <KartuLaporanAdmin key={laporan.id} laporan={laporan} />
            ))}
          </div>
        )}
      </Section>
      )}

      {/* Usulan produk dari warga */}
      {tab === "produk" && (
      <Section latar="lembut" id="usulan-umkm" className="scroll-mt-20">
        <SectionHeading
          kicker="Lapak UMKM"
          judul="Usulan produk warga"
          deskripsi="Produk yang diajukan lewat halaman UMKM. Belum tayang sampai diterima di sini."
        />

        {usulan.length === 0 ? (
          <p className="rounded-[var(--radius-card)] border border-line bg-surface p-6 text-[0.9375rem] text-ink-muted">
            Belum ada usulan yang menunggu tinjauan.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {usulan.map((u) => (
              <KartuUsulanProduk key={u.id} usulan={u} urlFoto={basisUrlFoto()} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <SectionHeading
            kicker="Sudah Tayang"
            judul="Produk di lapak"
            deskripsi="Produk yang sedang tampil untuk warga. Tarik untuk mengembalikannya ke antrean tinjauan."
            className="mb-6 md:mb-7 md:flex-col md:items-start"
          />
          <DaftarProdukTerbit baris={produkTerbit} />
        </div>
      </Section>
      )}

      {/* Tambah pengumuman */}
      {tab === "pengumuman" && (
      <Section latar="putih" id="tambah-pengumuman" className="scroll-mt-20">
        <SectionHeading
          kicker="Kabar Resmi"
          tone="blue"
          judul="Terbitkan pengumuman"
          deskripsi="Isi yang disimpan di sini langsung tampil di halaman pengumuman dan beranda."
        />
        <FormPengumuman hariIni={new Date().toISOString().slice(0, 10)} />

        <div className="mt-12">
          <SectionHeading
            kicker="Sudah Tayang"
            tone="blue"
            judul="Pengumuman terbit"
            deskripsi="Seluruh pengumuman yang sedang tampil di situs."
            className="mb-6 md:mb-7 md:flex-col md:items-start"
          />
          <DaftarPengumumanTerbit baris={pengumumanTerbit} />
        </div>
      </Section>
      )}
    </>
  );
}

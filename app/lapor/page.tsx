import type { Metadata } from "next";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/shared/page-header";
import { Section, SectionHeading } from "@/components/shared/section";
import { FormLaporan } from "@/components/lapor/form-laporan";
import { DaftarLaporan } from "@/components/lapor/daftar-laporan";

export const metadata: Metadata = {
  title: "Lapor Warga",
  description:
    "Laporkan jalan rusak, sampah menumpuk, atau masalah lain di lingkungan Desa Tegalrejo. Laporan bisa dikirim tanpa nama dan dilacak lewat kode.",
};

/**
 * Wajib dinamis karena DaftarLaporan membaca data dari Supabase. Tanpa ini
 * Next.js memprerender halaman sebagai HTML statis: querynya cuma jalan
 * sekali saat build, sehingga laporan yang baru disetujui petugas tidak
 * pernah muncul sampai ada build ulang.
 */
export const dynamic = "force-dynamic";

export default function HalamanLapor() {
  return (
    <>
      <PageHeader
        kicker="Suara Warga"
        tone="blue"
        judul="Lapor, kami tindak lanjuti"
        deskripsi="Jalan berlubang, lampu jalan mati, sampah menumpuk, atau masalah lain di sekitar rumah, laporkan di sini. Tidak perlu login, boleh tanpa nama."
      >
        <Link
          href="/lapor/status"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-5 text-[0.9375rem] font-semibold text-ink-muted transition-colors hover:border-blue hover:text-blue-strong"
        >
          <MagnifyingGlassIcon size={17} weight="bold" />
          Sudah pernah lapor? Cek status
        </Link>
      </PageHeader>

      {/**
       * Formulir dan daftar laporan disandingkan dua kolom supaya keduanya
       * terlihat tanpa menggulung jauh. Kolom formulir dibuat lengket agar
       * tetap terjangkau selagi warga membaca laporan tetangga di sebelahnya.
       */}
      <Section latar="putih">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* `self-start` wajib: butir grid meregang penuh secara bawaan,
              dan sticky tidak bekerja pada elemen setinggi kolomnya. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <FormLaporan />
          </div>

          <div
            id="daftar"
            className="scroll-mt-24 rounded-[var(--radius-panel)] border border-line bg-surface-soft p-6 sm:p-8"
          >
            <SectionHeading
              kicker="Sudah Ditindaklanjuti"
              tone="blue"
              judul="Laporan warga lainnya"
              deskripsi="Laporan yang sudah ditinjau petugas, tanpa nama atau kontak pelapor. Laporan baru tampil setelah diperiksa."
              className="mb-7 md:mb-8 md:flex-col md:items-start"
            />
            <DaftarLaporan />
          </div>
        </div>
      </Section>
    </>
  );
}

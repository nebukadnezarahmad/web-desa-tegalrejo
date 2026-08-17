import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { DaftarPengumuman } from "@/components/pengumuman/daftar-pengumuman";
import { ambilSemuaPengumuman } from "@/lib/pengumuman/queries";

export const metadata: Metadata = {
  title: "Pengumuman Desa",
  description:
    "Seluruh pengumuman resmi Desa Tegalrejo, dari urusan administrasi, kesehatan, lingkungan, ekonomi, hingga kegiatan warga.",
};

/** Wajib dinamis: isinya dibaca dari Supabase. Tanpa ini Next memprerender
 *  hasilnya sekali saat build dan data baru tidak pernah muncul. */
export const dynamic = "force-dynamic";

export default async function HalamanPengumuman() {
  const pengumuman = await ambilSemuaPengumuman();

  return (
    <>
      <PageHeader
        kicker="Kabar Resmi"
        tone="blue"
        judul="Pengumuman desa"
        deskripsi="Semua pemberitahuan resmi dari pemerintah Desa Tegalrejo, diurutkan dari yang paling baru. Saring menurut kategori untuk menemukan yang Anda cari."
      />
      <Section latar="putih">
        <DaftarPengumuman pengumuman={pengumuman} />
      </Section>
    </>
  );
}

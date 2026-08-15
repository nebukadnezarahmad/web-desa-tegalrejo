import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { DaftarPengumuman } from "@/components/pengumuman/daftar-pengumuman";

export const metadata: Metadata = {
  title: "Pengumuman Desa",
  description:
    "Seluruh pengumuman resmi Desa Tegalrejo, dari urusan administrasi, kesehatan, lingkungan, ekonomi, hingga kegiatan warga.",
};

export default function HalamanPengumuman() {
  return (
    <>
      <PageHeader
        kicker="Kabar Resmi"
        tone="blue"
        judul="Pengumuman desa"
        deskripsi="Semua pemberitahuan resmi dari pemerintah Desa Tegalrejo, diurutkan dari yang paling baru. Saring menurut kategori untuk menemukan yang Anda cari."
      />
      <Section latar="putih">
        <DaftarPengumuman />
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { LapakUmkm } from "@/components/umkm/lapak-umkm";

export const metadata: Metadata = {
  title: "Lapak UMKM Warga",
  description:
    "Produk buatan warga Desa Tegalrejo: makanan olahan, kerajinan, hasil pertanian, dan jasa. Hubungi langsung pemiliknya tanpa perantara.",
};

export default function HalamanUmkm() {
  return (
    <>
      <PageHeader
        kicker="Ekonomi Warga"
        judul="Lapak UMKM warga desa"
        deskripsi="Semua yang tampil di sini dibuat atau dikerjakan sendiri oleh warga Desa Tegalrejo. Pilih produknya, hubungi langsung pemiliknya lewat WhatsApp, tanpa perantara dan tanpa potongan."
      />
      <Section latar="putih">
        <LapakUmkm />
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { LapakUmkm } from "@/components/umkm/lapak-umkm";
import { ambilSemuaProduk } from "@/lib/umkm/queries";
import { DialogUsulanProduk } from "@/components/umkm/dialog-usulan-produk";

export const metadata: Metadata = {
  title: "Lapak UMKM Warga",
  description:
    "Produk buatan warga Desa Tegalrejo: makanan olahan, kerajinan, hasil pertanian, dan jasa. Hubungi langsung pemiliknya tanpa perantara.",
};

/** Wajib dinamis: isinya dibaca dari Supabase. Tanpa ini Next memprerender
 *  hasilnya sekali saat build dan data baru tidak pernah muncul. */
export const dynamic = "force-dynamic";

export default async function HalamanUmkm() {
  const produkUmkm = await ambilSemuaProduk();

  return (
    <>
      <PageHeader
        judul="Lapak UMKM warga desa"
        deskripsi="Semua yang tampil di sini dibuat atau dikerjakan sendiri oleh warga Desa Tegalrejo. Pilih produknya, hubungi langsung pemiliknya lewat WhatsApp, tanpa perantara dan tanpa potongan."
      />
      <Section latar="putih">
        <LapakUmkm produkUmkm={produkUmkm} />

        {/* Ajakan mendaftar ditaruh sesudah lapak: pembaca melihat dulu
            seperti apa produk tetangganya tampil, baru diajak ikut. */}
        <div className="mt-10 sm:mt-12">
          <DialogUsulanProduk />
        </div>
      </Section>
    </>
  );
}

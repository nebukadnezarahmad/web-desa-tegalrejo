import type { MetadataRoute } from "next";
import { situs } from "@/lib/data/desa";
import { ambilSemuaPengumuman } from "@/lib/pengumuman/queries";
import { ambilSemuaProduk } from "@/lib/umkm/queries";

/** Dibangkitkan saat diminta, bukan saat build: daftar produk dan
 *  pengumuman berubah setiap petugas menerbitkan isi baru. */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tetap = [
    "", "/lapor", "/lapor/status", "/umkm", "/kesehatan",
    "/lingkungan", "/profil", "/pengumuman",
  ].map((r) => ({
    url: `${situs}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.8,
  }));

  const [produk, pengumuman] = await Promise.all([
    ambilSemuaProduk(),
    ambilSemuaPengumuman(),
  ]);

  return [
    ...tetap,
    ...produk.map((p) => ({
      url: `${situs}/umkm/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...pengumuman.map((p) => ({
      url: `${situs}/pengumuman/${p.slug}`,
      lastModified: new Date(p.tanggal),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

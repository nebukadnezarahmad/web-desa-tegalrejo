import type { MetadataRoute } from "next";
import { situs } from "@/lib/data/desa";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* Panel petugas tidak sepatutnya masuk hasil pencarian. Ini bukan
         pengaman: yang menjaganya tetap proxy.ts dan sesi. */
      disallow: ["/admin/"],
    },
    sitemap: `${situs}/sitemap.xml`,
  };
}

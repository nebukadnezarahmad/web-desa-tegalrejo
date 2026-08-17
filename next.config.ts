import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Foto produk yang diunggah warga tinggal di Supabase Storage, bukan di
     public/. next/image menolak host luar yang tidak didaftarkan. */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Matikan berkas panduan yang dibuat otomatis Next.js di akar proyek.
  agentRules: false,

  async redirects() {
    return [
      {
        // Daftar laporan dulu berdiri sebagai halaman sendiri, sekarang
        // menyatu di bawah formulir /lapor. Tautan lama tetap diarahkan.
        source: "/lapor/daftar",
        destination: "/lapor#daftar",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

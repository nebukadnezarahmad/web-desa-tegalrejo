import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { desa } from "@/lib/data/desa";
import "./globals.css";

// Plus Jakarta Sans, tipografi identitas kota Jakarta oleh Tokotype.
// Huruf sipil Indonesia untuk situs sipil Indonesia. Menangani seluruh
// teks isi, label, tombol, dan angka.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Bricolage Grotesque, grotesk utilitarian dengan sumbu optical size.
// Dipakai TERBATAS: hanya judul besar. Wataknya mirip huruf papan
// pengumuman balai desa: tegas dan sedikit kaku, bukan elegan. Itu yang
// membedakannya dari serif display yang jadi refleks di mana-mana.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${desa.merek} - ${desa.nama}`,
    template: `%s · ${desa.merek}`,
  },
  description: `${desa.tagline} Portal resmi ${desa.nama}, ${desa.kecamatan}, ${desa.kabupaten}. Pengumuman, agenda warga, lapak UMKM, layanan kesehatan, dan pengelolaan lingkungan.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${bricolage.variable} h-full`}
    >
      <head>
        {/* Menandai bahwa JavaScript hidup, dijalankan sebelum lukisan
            pertama supaya tidak ada kedipan. Animasi reveal menyembunyikan
            isinya lewat opacity:0 dan baru menampilkannya lewat
            IntersectionObserver; tanpa penanda ini, peramban tanpa JS akan
            menampilkan halaman dengan bagian yang hilang selamanya. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
      </head>
      {/* `overflow-x-clip`, bukan `hidden`. Keduanya sama-sama memotong
          luberan mendatar, tapi `hidden` menjadikan body wadah gulung
          sehingga `position: sticky` di dalamnya berhenti bekerja. */}
      <body className="flex min-h-full flex-col overflow-x-clip">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-green-strong focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Lompat ke konten utama
        </a>
        <SiteHeader />
        <main id="konten" className="w-full max-w-full flex-1">
          {children}
        </main>
        <SiteFooter />
        {/* Ruang supaya navigasi bawah tidak menutupi akhir halaman */}
        <div aria-hidden className="h-16 lg:hidden" />
        <BottomNav />
      </body>
    </html>
  );
}

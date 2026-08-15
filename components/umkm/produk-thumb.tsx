import Image from "next/image";
import {
  ForkKnifeIcon,
  BasketIcon,
  PlantIcon,
  WrenchIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { KategoriUmkm } from "@/lib/data/umkm";
import { cn } from "@/lib/utils";

const gaya: Record<
  KategoriUmkm,
  { ikon: typeof ForkKnifeIcon; latar: string; warna: string; kontur: string }
> = {
  Makanan: {
    ikon: ForkKnifeIcon,
    latar: "bg-green-soft",
    warna: "text-green-strong",
    kontur: "kontur",
  },
  Kerajinan: {
    ikon: BasketIcon,
    latar: "bg-blue-soft",
    warna: "text-blue-strong",
    kontur: "kontur-biru",
  },
  Pertanian: {
    ikon: PlantIcon,
    latar: "bg-green-soft",
    warna: "text-green-deep",
    kontur: "kontur",
  },
  Jasa: {
    ikon: WrenchIcon,
    latar: "bg-blue-soft",
    warna: "text-blue-deep",
    kontur: "kontur-biru",
  },
};

/**
 * Menampilkan foto produk bila tersedia. Kalau belum ada foto yang benar-benar
 * menggambarkan barangnya, jatuh ke ilustrasi ikon per kategori: lebih baik
 * ilustrasi yang jujur daripada foto stok yang salah barang.
 */
export function ProdukThumb({
  kategori,
  foto,
  alt,
  ukuran = "kartu",
  className,
}: {
  kategori: KategoriUmkm;
  foto?: string;
  alt?: string;
  ukuran?: "kartu" | "besar";
  className?: string;
}) {
  /**
   * "besar" dipakai berdampingan dengan kolom teks di halaman detail produk.
   * Di layar sempit (satu kolom) foto pakai rasio 16:10 tetap; di layar lebar
   * (lg:) tingginya mengikuti kolom teks di sebelahnya lewat grid stretch,
   * supaya tepi bawah foto sejajar dengan tepi bawah kartu penjual.
   */
  const rasio =
    ukuran === "kartu" ? "aspect-[4/3]" : "aspect-[16/10] lg:aspect-auto lg:h-full";

  if (foto) {
    return (
      <div className={cn("relative overflow-hidden", rasio, className)}>
        <Image
          src={`/foto/${foto}`}
          alt={alt ?? ""}
          fill
          sizes={ukuran === "besar" ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
          className="object-cover"
        />
      </div>
    );
  }

  const { ikon: Ikon, latar, warna, kontur } = gaya[kategori];

  return (
    <div
      aria-hidden
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        latar,
        rasio,
        className,
      )}
    >
      <div className={cn("absolute inset-0 opacity-70", kontur)} />
      <Ikon
        size={ukuran === "kartu" ? 56 : 88}
        weight="duotone"
        className={cn("relative", warna)}
      />
    </div>
  );
}

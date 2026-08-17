import Image from "next/image";
import { CameraIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type FotoDesaProps = {
  /** Path di dalam public/foto, mis. "gapura-rt.jpg". Kosongkan bila foto belum tersedia. */
  src?: string;
  alt: string;
  className?: string;
  rasio?: "persegi" | "lanskap" | "potret";
  prioritas?: boolean;
  /**
   * Keterangan kecil di bawah foto. Wajib diisi untuk foto stok yang bukan
   * diambil di desa ini, supaya pembaca tidak menyangka itu lokasi setempat.
   */
  keterangan?: string;
};

const rasioKelas: Record<NonNullable<FotoDesaProps["rasio"]>, string> = {
  persegi: "aspect-square",
  lanskap: "aspect-[4/3]",
  potret: "aspect-[3/4]",
};

/**
 * Slot foto sungguhan warga/lokasi desa, pengganti ilustrasi ikon.
 * Sengaja TIDAK menampilkan ikon dekoratif sebagai isian ketika src kosong:
 * kartu kosong dengan label jujur "Foto belum ditambahkan" lebih baik
 * daripada ilustrasi yang berpura-pura jadi foto. Lihat public/foto/README.md
 * untuk daftar foto yang perlu diambil.
 */
export function FotoDesa({
  src,
  alt,
  className,
  rasio = "lanskap",
  prioritas = false,
  keterangan,
}: FotoDesaProps) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={`${alt}, foto belum ditambahkan`}
        className={cn(
          "flex flex-col items-center justify-center gap-2 border border-dashed border-line-strong bg-surface-soft text-center",
          rasioKelas[rasio],
          className,
        )}
      >
        <CameraIcon size={26} weight="light" className="text-ink-faint" />
        <p className="max-w-[12rem] px-3 text-[0.75rem] leading-snug text-ink-faint">
          Foto belum ditambahkan
        </p>
      </div>
    );
  }

  const gambar = (
    <div className={cn("relative overflow-hidden", rasioKelas[rasio], className)}>
      <Image
        /* Foto bawaan tinggal di public/foto, sedangkan foto unggahan warga
           tinggal di bucket Storage dan sudah berupa URL penuh. Tanpa
           pembeda ini, unggahan warga dirangkai jadi /foto/https://... dan
           pasti gagal dimuat. Perlakuan yang sama sudah ada di ProdukThumb. */
        src={src.startsWith("http") ? src : `/foto/${src}`}
        alt={alt}
        fill
        priority={prioritas}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );

  if (!keterangan) return gambar;

  return (
    <figure>
      {gambar}
      <figcaption className="mt-2 text-[0.75rem] leading-snug text-ink-faint">
        {keterangan}
      </figcaption>
    </figure>
  );
}

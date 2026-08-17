import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProdukThumb } from "@/components/umkm/produk-thumb";
import { FotoDesa } from "@/components/shared/foto-desa";
import { ambilSemuaProduk } from "@/lib/umkm/queries";
import { formatRupiah } from "@/lib/utils";

// Produk Bu Marni yang sama disebut di headline beranda, sengaja ditautkan
// supaya klaim di hero terasa nyata, bukan angan-angan copywriting.
/* Utamakan produk unggulan yang sudah punya foto. Kartu sorotan ini paling
   besar di beranda, jadi paling terasa kalau isinya cuma ilustrasi ikon. */
export async function UmkmPreview() {
  const produkUmkm = await ambilSemuaProduk();

  /* Yang terbaru didahulukan. Produk yang baru diterima petugas paling
     layak tampil, sedangkan urutan basis data menaruhnya paling belakang. */
  const terbaru = [...produkUmkm].reverse();
  const unggulan = terbaru.filter((p) => p.unggulan);

  /* Utamakan produk unggulan yang sudah punya foto. Kartu sorotan ini paling
     besar di beranda, jadi paling terasa kalau isinya cuma ilustrasi ikon. */
  const sorotan = unggulan.find((p) => p.foto) ?? unggulan[0] ?? terbaru[0];

  /* Produk bertanda unggulan didahulukan, sisanya sekadar pengisi. Kolom ini
     dulu mengambil produk pertama apa adanya, sehingga menandai unggulan di
     panel petugas tidak berpengaruh apa pun terhadap beranda. Empat kartu,
     bukan tiga: kisinya memang menyediakan dua kolom kali dua baris di
     samping kartu sorotan, dan slot keempat sebelumnya dibiarkan kosong. */
  const lainnya = [
    ...unggulan.filter((p) => p.slug !== sorotan?.slug),
    ...terbaru.filter((p) => p.slug !== sorotan?.slug && !p.unggulan),
  ].slice(0, 4);

  /* Lapak kosong bukan galat: bisa jadi semua usulan masih menunggu tinjauan.
     Seksi ini dilewati saja daripada merobohkan beranda. */
  if (!sorotan) return null;

  const hijau = sorotan.kategori === "Makanan" || sorotan.kategori === "Pertanian";

  return (
    <Section latar="lembut">
      <SectionHeading
        kicker="Ekonomi Warga"
        judul="Dari dapur dan kebun tetangga"
        deskripsi="Produk yang dibuat sendiri oleh warga desa. Beli langsung dari pemiliknya, tanpa perantara."
        aksi={
          <Button asChild variant="soft">
            <Link href="/umkm">
              Lihat 63 usaha
              <ArrowRightIcon size={17} weight="bold" />
            </Link>
          </Button>
        }
      />

      {/* Bento tidak seragam: satu produk disorot besar dengan slot foto asli,
          bukan kartu berukuran sama seperti tiga lainnya. */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal
          index={0}
          className="sm:col-span-2 lg:col-span-2 lg:row-span-2"
        >
          <Link
            href={`/umkm/${sorotan.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface transition-[transform,border-color,box-shadow,color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-green/40 hover:shadow-lg hover:shadow-green/8"
          >
            <FotoDesa
              src={sorotan.foto}
              alt={`${sorotan.nama}, ${sorotan.usaha}`}
              rasio="lanskap"
            />
            <div className="flex flex-1 flex-col p-6">
              <Badge tone={hijau ? "green" : "blue"} className="mb-3 self-start">
                Produk Pilihan · {sorotan.kategori}
              </Badge>
              <h3 className="text-xl font-bold leading-snug text-ink transition-colors group-hover:text-green-strong">
                {sorotan.nama}
              </h3>
              <p className="mt-2 max-w-md text-[0.9375rem] leading-relaxed text-ink-muted">
                {sorotan.deskripsi}
              </p>
              <p className="mt-2 text-[0.8125rem] text-ink-faint">
                {sorotan.pemilik} · {sorotan.usaha} · {sorotan.rt}
              </p>
              <p className="mt-4 text-xl font-extrabold text-green-strong">
                {formatRupiah(sorotan.harga)}
                <span className="ml-1.5 text-sm font-medium text-ink-faint">
                  / {sorotan.satuan}
                </span>
              </p>
            </div>
          </Link>
        </Reveal>

        {lainnya.map((p, i) => (
          <Reveal key={p.slug} index={i + 1}>
            <Link
              href={`/umkm/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface transition-[transform,border-color,box-shadow,color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-green/40 hover:shadow-lg hover:shadow-green/8"
            >
              <ProdukThumb
                kategori={p.kategori}
                foto={p.foto}
                alt={`${p.nama}, ${p.usaha}`}
              />
              <div className="flex flex-1 flex-col p-5">
                <Badge
                  tone={
                    p.kategori === "Makanan" || p.kategori === "Pertanian"
                      ? "green"
                      : "blue"
                  }
                  className="mb-3 self-start"
                >
                  {p.kategori}
                </Badge>
                <h3 className="text-[0.9375rem] font-bold leading-snug text-ink transition-colors group-hover:text-green-strong">
                  {p.nama}
                </h3>
                <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
                  {p.usaha} · {p.rt}
                </p>
                <p className="mt-4 text-base font-extrabold text-green-strong">
                  {formatRupiah(p.harga)}
                  <span className="ml-1 text-xs font-medium text-ink-faint">
                    / {p.satuan}
                  </span>
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

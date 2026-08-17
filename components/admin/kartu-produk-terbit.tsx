"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  TrashIcon,
  ArrowUUpLeftIcon,
  ArrowSquareOutIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProdukThumb } from "@/components/umkm/produk-thumb";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import {
  kelolaProdukTerbit,
  suntingProduk,
  type HasilAksi,
} from "@/app/admin/laporan/actions-tambahan";
import { Input, Label } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { kategoriUmkm } from "@/lib/data/umkm";
import type { KategoriUmkm } from "@/lib/data/umkm";
import { formatRupiah } from "@/lib/utils";

export type BarisProduk = {
  id: string;
  slug: string;
  nama: string;
  kategori: KategoriUmkm;
  harga: number;
  satuan: string;
  deskripsi: string;
  pemilik: string;
  usaha: string;
  dusun: string;
  whatsapp: string;
  unggulan: boolean;
  foto: string | null;
};

const awal: HasilAksi = null;

/**
 * Produk yang sedang tayang, ditampilkan sama seperti di lapak warga
 * lengkap dengan fotonya. Petugas melihat persis apa yang dilihat warga,
 * jadi keputusan menarik atau menghapus diambil dari tampilan yang sama,
 * bukan dari baris tabel yang kehilangan konteks visualnya.
 */
export function DaftarProdukTerbit({ baris }: { baris: BarisProduk[] }) {
  if (baris.length === 0) {
    return (
      <p className="rounded-[var(--radius-card)] border border-line bg-surface p-6 text-center text-[0.9375rem] text-ink-muted">
        Belum ada produk yang tayang di lapak.
      </p>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {baris.map((p) => (
        <li key={p.id}>
          <KartuProdukTerbit produk={p} />
        </li>
      ))}
    </ul>
  );
}

function KartuProdukTerbit({ produk }: { produk: BarisProduk }) {
  const [hasil, kirim, sedang] = useActionState(kelolaProdukTerbit, awal);
  const [terbuka, setTerbuka] = React.useState(false);
  const [pastiHapus, setPastiHapus] = React.useState(false);

  if (hasil?.berhasil) {
    return (
      <div className="flex h-full items-center rounded-[var(--radius-card)] border border-green/30 bg-green-soft p-5 text-[0.875rem] leading-relaxed text-green-deep">
        {produk.nama}: {hasil.pesan}
      </div>
    );
  }

  return (
    <Dialog open={terbuka} onOpenChange={setTerbuka}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface text-left transition-[transform,border-color,box-shadow] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-green/40 hover:shadow-lg hover:shadow-green/8"
        >
          <ProdukThumb
            kategori={produk.kategori}
            foto={produk.foto ?? undefined}
            alt={`Foto ${produk.nama}`}
          />

          <div className="flex flex-1 flex-col p-4">
            <Badge tone="netral" className="self-start">
              {produk.kategori}
            </Badge>
            <h3 className="mt-2.5 text-[0.9375rem] font-bold leading-snug text-ink transition-colors group-hover:text-green-strong">
              {produk.nama}
            </h3>
            <p className="mt-1 text-[0.875rem]">
              <span className="font-bold text-green-strong">
                {formatRupiah(produk.harga)}
              </span>
              <span className="text-ink-muted"> / {produk.satuan}</span>
            </p>
            <p className="mt-auto pt-2.5 text-[0.75rem] text-ink-faint">
              {produk.usaha} · {produk.dusun}
            </p>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent
        judul={produk.nama}
        deskripsi={`${produk.usaha} · Dusun ${produk.dusun}`}
      >
        <ProdukThumb
          kategori={produk.kategori}
          foto={produk.foto ?? undefined}
          alt={`Foto ${produk.nama}`}
          className="rounded-[var(--radius-card)]"
        />

        <FormSunting produk={produk} />

        {hasil && !hasil.berhasil && (
          <p role="alert" className="mt-4 text-[0.875rem] text-danger">
            {hasil.pesan}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5">
          <Button asChild variant="outline">
            <Link href={`/umkm/${produk.slug}`} target="_blank">
              <ArrowSquareOutIcon size={17} weight="bold" />
              Lihat di lapak
            </Link>
          </Button>

          <form action={kirim} className="flex flex-col gap-3">
            <input type="hidden" name="id" value={produk.id} />

            <Button type="submit" name="tindakan" value="tarik" disabled={sedang}>
              <ArrowUUpLeftIcon size={17} weight="bold" />
              Tarik dari lapak
            </Button>
            <p className="-mt-1 text-[0.8125rem] leading-relaxed text-ink-faint">
              Produk kembali ke antrean tinjauan dan berhenti tampil untuk
              warga. Datanya tetap tersimpan.
            </p>

            {/* Konfirmasi dua langkah: penghapusan tidak bisa dibatalkan. */}
            {pastiHapus ? (
              <div className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-danger/30 bg-danger-soft p-4">
                <p className="flex items-start gap-2 text-[0.875rem] text-danger">
                  <WarningIcon size={17} weight="duotone" className="mt-0.5 shrink-0" />
                  Data produk ini akan hilang permanen.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="submit" name="tindakan" value="hapus"
                    variant="outline" disabled={sedang}
                    className="border-danger/40 text-danger hover:border-danger"
                  >
                    {sedang ? "Menghapus…" : "Ya, hapus permanen"}
                  </Button>
                  <Button type="button" variant="ghost"
                    onClick={() => setPastiHapus(false)}>
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <Button type="button" variant="ghost"
                onClick={() => setPastiHapus(true)}
                className="hover:bg-danger-soft hover:text-danger">
                <TrashIcon size={17} weight="bold" />
                Hapus produk
              </Button>
            )}
          </form>

          <DialogClose asChild>
            <Button type="button" variant="ghost">Tutup</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FormSunting({ produk }: { produk: BarisProduk }) {
  const [hasil, kirim, menyimpan] = useActionState(suntingProduk, awal);

  return (
    <form action={kirim} className="mt-5 flex flex-col gap-4 border-t border-line pt-5">
      <input type="hidden" name="id" value={produk.id} />

      <p className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-ink-faint">
        Sunting data produk
      </p>

      <div>
        <Label htmlFor={`nama-${produk.id}`}>Nama produk</Label>
        <Input id={`nama-${produk.id}`} name="nama" required
          defaultValue={produk.nama} className="mt-1.5" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor={`kat-${produk.id}`}>Kategori</Label>
          <select id={`kat-${produk.id}`} name="kategori" defaultValue={produk.kategori}
            className="mt-1.5 h-11 w-full cursor-pointer rounded-[var(--radius-chip)] border border-line-strong bg-surface px-3.5 text-[0.9375rem] text-ink transition-colors hover:border-green focus:border-green-strong">
            {kategoriUmkm.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor={`harga-${produk.id}`}>Harga (Rp)</Label>
          <Input id={`harga-${produk.id}`} name="harga" inputMode="numeric" required
            defaultValue={produk.harga} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor={`satuan-${produk.id}`}>Satuan</Label>
          <Input id={`satuan-${produk.id}`} name="satuan" required
            defaultValue={produk.satuan} className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor={`desk-${produk.id}`}>Deskripsi</Label>
        <Textarea id={`desk-${produk.id}`} name="deskripsi" rows={3} required
          defaultValue={produk.deskripsi} className="mt-1.5" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor={`usaha-${produk.id}`}>Nama usaha</Label>
          <Input id={`usaha-${produk.id}`} name="usaha" required
            defaultValue={produk.usaha} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor={`pemilik-${produk.id}`}>Pemilik</Label>
          <Input id={`pemilik-${produk.id}`} name="pemilik" required
            defaultValue={produk.pemilik} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor={`wa-${produk.id}`}>WhatsApp</Label>
          <Input id={`wa-${produk.id}`} name="whatsapp" inputMode="tel" required
            defaultValue={produk.whatsapp} className="mt-1.5" />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface-soft p-4">
        <input type="checkbox" name="unggulan" defaultChecked={produk.unggulan}
          className="h-5 w-5 cursor-pointer accent-[var(--green-strong)]" />
        <span className="text-[0.9375rem] text-ink">
          Tandai unggulan
          <span className="block text-[0.8125rem] text-ink-muted">
            Ikut tampil di sorotan UMKM pada beranda.
          </span>
        </span>
      </label>

      {hasil && (
        <p role="status" className={hasil.berhasil
          ? "text-[0.875rem] text-green-strong" : "text-[0.875rem] text-danger"}>
          {hasil.pesan}
        </p>
      )}

      <Button type="submit" variant="info" disabled={menyimpan}>
        {menyimpan ? "Menyimpan…" : "Simpan perubahan"}
      </Button>
    </form>
  );
}

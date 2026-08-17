"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  TrashIcon,
  ArrowUUpLeftIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  hapusPengumuman,
  kelolaProdukTerbit,
  type HasilAksi,
} from "@/app/admin/laporan/actions-tambahan";
import { formatRupiah, formatTanggal } from "@/lib/utils";

const awal: HasilAksi = null;

export type BarisPengumuman = {
  slug: string;
  judul: string;
  kategori: string;
  tanggal: string;
  penerbit: string;
  penting: boolean;
};

export type BarisProduk = {
  id: string;
  slug: string;
  nama: string;
  kategori: string;
  harga: number;
  satuan: string;
  usaha: string;
  dusun: string;
};

/**
 * Daftar isi yang sudah tayang, dalam bentuk tabel di layar lebar dan kartu
 * di layar sempit. Tabel yang dipaksa muat di ponsel akan menggeser halaman
 * ke samping, dan itu lebih mengganggu daripada kehilangan bentuk tabelnya.
 */

export function DaftarPengumumanTerbit({ baris }: { baris: BarisPengumuman[] }) {
  if (baris.length === 0) {
    return <Kosong teks="Belum ada pengumuman yang tayang." />;
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      <div className="hidden lg:block">
        <table className="w-full text-left text-[0.9375rem]">
          <thead>
            <tr className="border-b border-line bg-surface-soft">
              <Th>Judul</Th>
              <Th>Kategori</Th>
              <Th>Tanggal</Th>
              <Th>Penerbit</Th>
              <Th className="text-right">Tindakan</Th>
            </tr>
          </thead>
          <tbody>
            {baris.map((p) => (
              <tr key={p.slug} className="border-b border-line last:border-0">
                <td className="px-4 py-3.5">
                  <span className="font-semibold text-ink">{p.judul}</span>
                  {p.penting && (
                    <Badge tone="warn" className="ml-2">Penting</Badge>
                  )}
                </td>
                <td className="px-4 py-3.5 text-ink-muted">{p.kategori}</td>
                <td className="px-4 py-3.5 tabular-nums text-ink-muted">
                  {formatTanggal(p.tanggal)}
                </td>
                <td className="px-4 py-3.5 text-ink-muted">{p.penerbit}</td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end gap-2">
                    <Lihat href={`/pengumuman/${p.slug}`} />
                    <HapusPengumuman slug={p.slug} judul={p.judul} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-[var(--line)] lg:hidden">
        {baris.map((p) => (
          <li key={p.slug} className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="netral">{p.kategori}</Badge>
              {p.penting && <Badge tone="warn">Penting</Badge>}
              <span className="text-[0.75rem] text-ink-faint">
                {formatTanggal(p.tanggal)}
              </span>
            </div>
            <p className="mt-2 font-semibold text-ink">{p.judul}</p>
            <p className="mt-0.5 text-[0.8125rem] text-ink-muted">{p.penerbit}</p>
            <div className="mt-3 flex gap-2">
              <Lihat href={`/pengumuman/${p.slug}`} />
              <HapusPengumuman slug={p.slug} judul={p.judul} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DaftarProdukTerbit({ baris }: { baris: BarisProduk[] }) {
  if (baris.length === 0) {
    return <Kosong teks="Belum ada produk yang tayang di lapak." />;
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      <div className="hidden lg:block">
        <table className="w-full text-left text-[0.9375rem]">
          <thead>
            <tr className="border-b border-line bg-surface-soft">
              <Th>Produk</Th>
              <Th>Kategori</Th>
              <Th>Harga</Th>
              <Th>Usaha</Th>
              <Th className="text-right">Tindakan</Th>
            </tr>
          </thead>
          <tbody>
            {baris.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3.5 font-semibold text-ink">{p.nama}</td>
                <td className="px-4 py-3.5 text-ink-muted">{p.kategori}</td>
                <td className="px-4 py-3.5 tabular-nums text-ink-muted">
                  {formatRupiah(p.harga)}
                  <span className="text-ink-faint"> / {p.satuan}</span>
                </td>
                <td className="px-4 py-3.5 text-ink-muted">
                  {p.usaha}
                  <span className="text-ink-faint"> · {p.dusun}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end gap-2">
                    <Lihat href={`/umkm/${p.slug}`} />
                    <KelolaProduk id={p.id} nama={p.nama} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-[var(--line)] lg:hidden">
        {baris.map((p) => (
          <li key={p.id} className="p-4">
            <Badge tone="netral">{p.kategori}</Badge>
            <p className="mt-2 font-semibold text-ink">{p.nama}</p>
            <p className="mt-0.5 text-[0.875rem] text-green-strong">
              <span className="font-bold">{formatRupiah(p.harga)}</span>
              <span className="text-ink-muted"> / {p.satuan}</span>
            </p>
            <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
              {p.usaha} · {p.dusun}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Lihat href={`/umkm/${p.slug}`} />
              <KelolaProduk id={p.id} nama={p.nama} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- bagian kecil ----------

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-ink-faint ${className ?? ""}`}>
      {children}
    </th>
  );
}

function Kosong({ teks }: { teks: string }) {
  return (
    <p className="rounded-[var(--radius-card)] border border-line bg-surface p-6 text-[0.9375rem] text-ink-muted">
      {teks}
    </p>
  );
}

function Lihat({ href }: { href: string }) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={href} target="_blank">
        <ArrowSquareOutIcon size={15} weight="bold" />
        Lihat
      </Link>
    </Button>
  );
}

function HapusPengumuman({ slug, judul }: { slug: string; judul: string }) {
  const [hasil, kirim, sedang] = useActionState(hapusPengumuman, awal);
  const [pasti, setPasti] = React.useState(false);

  if (hasil?.berhasil) {
    return <span className="text-[0.8125rem] text-green-strong">{hasil.pesan}</span>;
  }

  /* Konfirmasi dua langkah, bukan window.confirm. Penghapusan tidak bisa
     dibatalkan dan dialog bawaan peramban mudah ditekan tanpa dibaca. */
  if (!pasti) {
    return (
      <Button type="button" variant="ghost" size="sm"
        onClick={() => setPasti(true)}
        className="hover:bg-danger-soft hover:text-danger"
        aria-label={`Hapus ${judul}`}>
        <TrashIcon size={15} weight="bold" />
        Hapus
      </Button>
    );
  }

  return (
    <form action={kirim} className="flex items-center gap-1.5">
      <input type="hidden" name="slug" value={slug} />
      <Button type="submit" size="sm" variant="outline" disabled={sedang}
        className="border-danger/40 text-danger hover:border-danger">
        {sedang ? "Menghapus…" : "Yakin hapus"}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => setPasti(false)}>
        Batal
      </Button>
    </form>
  );
}

function KelolaProduk({ id, nama }: { id: string; nama: string }) {
  const [hasil, kirim, sedang] = useActionState(kelolaProdukTerbit, awal);

  if (hasil?.berhasil) {
    return <span className="text-[0.8125rem] text-green-strong">{hasil.pesan}</span>;
  }

  return (
    <form action={kirim} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <Button type="submit" name="tindakan" value="tarik" size="sm" variant="outline"
        disabled={sedang} aria-label={`Tarik ${nama} dari lapak`}>
        <ArrowUUpLeftIcon size={15} weight="bold" />
        Tarik
      </Button>
      <Button type="submit" name="tindakan" value="hapus" size="sm" variant="ghost"
        disabled={sedang} className="hover:bg-danger-soft hover:text-danger"
        aria-label={`Hapus ${nama}`}>
        <TrashIcon size={15} weight="bold" />
        Hapus
      </Button>
    </form>
  );
}

"use client";

import * as React from "react";
import { useActionState } from "react";
import Image from "next/image";
import { CheckIcon, XIcon, ImageIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  tinjauUsulanProduk,
  type HasilAksi,
} from "@/app/admin/laporan/actions-tambahan";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import { FormSunting } from "@/components/admin/kartu-produk-terbit";

export type UsulanProduk = {
  id: string;
  slug: string;
  nama: string;
  kategori: "Makanan" | "Kerajinan" | "Pertanian" | "Jasa";
  harga: number;
  satuan: string;
  deskripsi: string;
  pemilik: string;
  usaha: string;
  rt: string;
  dusun: string;
  whatsapp: string;
  unggulan: boolean;
  foto: string | null;
  dibuat_pada: string;
};

const awal: HasilAksi = null;

export function KartuUsulanProduk({
  usulan,
  urlFoto,
}: {
  usulan: UsulanProduk;
  /** Basis URL publik bucket produk-umkm, dirakit di sisi server. */
  urlFoto: string;
}) {
  const [hasil, kirim, mengirim] = useActionState(tinjauUsulanProduk, awal);

  if (hasil?.berhasil) {
    return (
      <div className="rounded-[var(--radius-card)] border border-green/30 bg-green-soft p-5 text-[0.9375rem] text-green-deep">
        {usulan.nama}: {hasil.pesan}
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[var(--radius-chip)] bg-surface-soft sm:w-44">
          {usulan.foto ? (
            <Image
              src={usulan.foto.startsWith("http") ? usulan.foto : `${urlFoto}/${usulan.foto}`}
              alt={`Foto ${usulan.nama}`}
              fill
              sizes="176px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center gap-2 text-[0.8125rem] text-ink-faint">
              <ImageIcon size={17} weight="duotone" />
              Tanpa foto
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="warn">Menunggu tinjauan</Badge>
            <Badge tone="netral">{usulan.kategori}</Badge>
            <span className="text-[0.8125rem] text-ink-faint">
              Masuk {formatTanggal(usulan.dibuat_pada.slice(0, 10))}
            </span>
          </div>

          <h3 className="mt-3 text-[1.0625rem] font-bold text-ink">{usulan.nama}</h3>
          <p className="mt-1 text-[0.9375rem] text-green-strong">
            <span className="font-bold">{formatRupiah(usulan.harga)}</span>
            <span className="text-ink-muted"> / {usulan.satuan}</span>
          </p>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
            {usulan.deskripsi}
          </p>
          <p className="mt-3 text-[0.8125rem] text-ink-faint">
            {usulan.usaha} · {usulan.pemilik} · {usulan.rt} Dusun {usulan.dusun} ·{" "}
            {usulan.whatsapp}
          </p>
        </div>
      </div>

      {/* Sunting lebih dulu, baru putuskan. Tanpa ini, salah ketik harga
          dari warga hanya bisa dijawab dengan menolak lalu meminta kirim
          ulang, padahal memperbaikinya jauh lebih murah. */}
      <div className="border-t border-line px-5 pb-1 sm:px-6">
        <FormSunting produk={{ ...usulan, dusun: usulan.dusun, slug: usulan.slug }} />
      </div>

      <form action={kirim} className="border-t border-line bg-surface-soft p-5 sm:p-6">
        <input type="hidden" name="id" value={usulan.id} />

        <label htmlFor={`catatan-${usulan.id}`} className="text-[0.8125rem] font-semibold text-ink">
          Catatan untuk pengusul (opsional)
        </label>
        <Textarea
          id={`catatan-${usulan.id}`}
          name="catatanAdmin"
          rows={2}
          className="mt-1.5"
          placeholder="Contoh: fotonya kurang jelas, mohon kirim ulang lewat WhatsApp."
        />

        {hasil && !hasil.berhasil && (
          <p role="alert" className="mt-3 text-[0.875rem] text-danger">{hasil.pesan}</p>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="submit" name="keputusan" value="ditolak"
            variant="outline" disabled={mengirim}
            className="hover:border-danger hover:text-danger"
          >
            <XIcon size={17} weight="bold" />
            Tolak
          </Button>
          <Button type="submit" name="keputusan" value="terbit" disabled={mengirim}>
            <CheckIcon size={17} weight="bold" />
            Terima dan tayangkan
          </Button>
        </div>
      </form>
    </article>
  );
}

"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  StorefrontIcon,
  CheckCircleIcon,
  WarningIcon,
  ImageIcon,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usulkanProduk, type HasilUsulan } from "@/app/umkm/actions";
import { kategoriUmkm } from "@/lib/data/umkm";
import { cn } from "@/lib/utils";

const awal: HasilUsulan = null;

export function DialogUsulanProduk() {
  /* `sesi` dinaikkan tiap dialog ditutup supaya seluruh subpohon formulir
     dipasang ulang berikut state useActionState-nya. Tanpa itu, warga yang
     sudah berhasil mengirim satu produk akan selamanya melihat layar sukses
     lama beserta kode lacaknya, dan tidak bisa mengajukan produk kedua
     tanpa memuat ulang halaman. */
  const [sesi, setSesi] = React.useState(0);
  const [terbuka, setTerbuka] = React.useState(false);

  return (
    <Dialog
      open={terbuka}
      onOpenChange={(buka) => {
        setTerbuka(buka);
        if (!buka) setSesi((n) => n + 1);
      }}
    >
      <IsiDialogUsulan key={sesi} />
    </Dialog>
  );
}

function IsiDialogUsulan() {
  const [hasil, kirim, mengirim] = useActionState(usulkanProduk, awal);
  const [namaFoto, setNamaFoto] = React.useState<string | null>(null);

  const galat = hasil?.galat ?? {};

  /* Formulir dibiarkan terbuka saat berhasil supaya warga membaca pesan
     tindak lanjutnya. Menutup sendiri membuat kiriman terasa hilang. */

  return (
    <>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-[var(--radius-panel)] border-2 border-dashed border-green/40 bg-green-soft/40 px-6 py-6 text-center transition-[transform,background-color,border-color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] hover:border-green hover:bg-green-soft active:scale-[0.995] sm:py-7"
        >
          <StorefrontIcon
            size={24}
            weight="duotone"
            className="shrink-0 text-green-strong transition-transform duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5"
          />
          <span className="text-left">
            <span className="block text-[0.9375rem] font-bold text-green-deep sm:text-base">
              Punya usaha? Daftarkan produkmu di sini
            </span>
            <span className="mt-0.5 block text-[0.8125rem] text-ink-muted">
              Isi datanya, petugas desa yang akan meninjau sebelum tayang
            </span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent
        judul="Ajukan produk UMKM"
        deskripsi="Lengkapi data di bawah. Usulan tidak langsung tayang; petugas desa meninjaunya lebih dulu."
      >
        {hasil?.berhasil ? (
          <div className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] border border-green/30 bg-green-soft p-5">
            <CheckCircleIcon size={30} weight="duotone" className="text-green-strong" />
            <div>
              <p className="font-bold text-green-deep">Usulan terkirim</p>
              <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink">
                {hasil.pesan}
              </p>
            </div>

            {hasil.kodeLacak && (
              <div className="w-full rounded-[var(--radius-card)] border border-green/30 bg-surface px-5 py-4">
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  Kode lacak
                </p>
                <p className="mt-1 font-mono text-xl font-bold tracking-wider text-green-deep">
                  {hasil.kodeLacak}
                </p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-muted">
                  Kode tidak dikirim ulang lewat cara lain, jadi dicatat
                  sendiri saja.
                </p>
              </div>
            )}
            <DialogClose asChild>
              <Button type="button" variant="soft">
                Tutup
              </Button>
            </DialogClose>
          </div>
        ) : (
          <form action={kirim} className="flex flex-col gap-5">
            {hasil && !hasil.berhasil && (
              <p
                role="alert"
                className="flex items-start gap-2.5 rounded-[var(--radius-card)] border border-danger/30 bg-danger-soft p-3.5 text-[0.875rem] text-danger"
              >
                <WarningIcon size={18} weight="duotone" className="mt-0.5 shrink-0" />
                {hasil.pesan}
              </p>
            )}

            <Ruas label="Nama produk" nama="nama" galat={galat.nama} wajib
              placeholder="Contoh: Keripik Tempe Rempah" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="kategori">Kategori</Label>
                {/* Select asli, bukan Radix. Di dalam dialog, popover Radix
                    menambah satu lapis fokus lagi tanpa manfaat nyata. */}
                <select
                  id="kategori"
                  name="kategori"
                  required
                  defaultValue=""
                  className="mt-1.5 h-11 w-full cursor-pointer rounded-[var(--radius-chip)] border border-line-strong bg-surface px-3.5 text-[0.9375rem] text-ink transition-colors hover:border-green-strong/50 focus:border-green-strong"
                >
                  <option value="" disabled>Pilih kategori</option>
                  {kategoriUmkm.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <Ruas label="Satuan" nama="satuan" galat={galat.satuan} wajib
                placeholder="bungkus 250 g" />
            </div>

            <Ruas label="Harga (rupiah)" nama="harga" galat={galat.harga} wajib
              inputMode="numeric" placeholder="18000" />

            <div>
              <Label htmlFor="deskripsi">Deskripsi singkat</Label>
              <Textarea id="deskripsi" name="deskripsi" rows={3} required
                placeholder="Satu atau dua kalimat tentang produknya."
                aria-invalid={Boolean(galat.deskripsi)}
                className={cn("mt-1.5", galat.deskripsi && "border-danger")} />
              <Pesan teks={galat.deskripsi} />
            </div>

            <div>
              <Label htmlFor="detail">Penjelasan lengkap (opsional)</Label>
              <Textarea id="detail" name="detail" rows={4}
                placeholder="Cara pembuatan, bahan, ketahanan, ketentuan pemesanan. Pisahkan paragraf dengan satu baris kosong."
                className="mt-1.5" />
            </div>

            <fieldset className="grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
              <legend className="text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-ink-faint">
                Pemilik usaha
              </legend>
              <Ruas label="Nama pemilik" nama="pemilik" galat={galat.pemilik} wajib />
              <Ruas label="Nama usaha" nama="usaha" galat={galat.usaha} wajib />
              <Ruas label="RT" nama="rt" galat={galat.rt} wajib placeholder="RT 02" />
              <Ruas label="Dusun" nama="dusun" galat={galat.dusun} wajib placeholder="Krajan" />
              <div className="sm:col-span-2">
                <Ruas label="Nomor WhatsApp" nama="whatsapp" galat={galat.whatsapp} wajib
                  inputMode="tel" placeholder="081234567890" />
              </div>
            </fieldset>

            <div className="border-t border-line pt-5">
              <Label htmlFor="foto">Foto produk (opsional)</Label>
              <input
                id="foto"
                name="foto"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setNamaFoto(e.target.files?.[0]?.name ?? null)}
                className="mt-1.5 block w-full cursor-pointer text-[0.875rem] text-ink-muted file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-green-soft file:px-4 file:py-2.5 file:text-[0.875rem] file:font-semibold file:text-green-deep hover:file:bg-green-soft/70"
              />
              <p className="mt-1.5 flex items-center gap-1.5 text-[0.8125rem] text-ink-faint">
                <ImageIcon size={15} weight="duotone" />
                {namaFoto ?? "JPG, PNG, atau WebP. Maksimal 3 MB."}
              </p>
              <Pesan teks={galat.foto} />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="outline">Batal</Button>
              </DialogClose>
              <Button type="submit" disabled={mengirim}>
                {mengirim ? "Mengirim…" : "Kirim usulan"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </>
  );
}

function Ruas({
  label, nama, galat, wajib, ...props
}: React.ComponentProps<typeof Input> & {
  label: string; nama: string; galat?: string; wajib?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={nama}>{label}</Label>
      <Input
        id={nama}
        name={nama}
        required={wajib}
        aria-invalid={Boolean(galat)}
        className={cn("mt-1.5", galat && "border-danger")}
        {...props}
      />
      <Pesan teks={galat} />
    </div>
  );
}

function Pesan({ teks }: { teks?: string }) {
  if (!teks) return null;
  return <p className="mt-1.5 text-[0.8125rem] text-danger">{teks}</p>;
}

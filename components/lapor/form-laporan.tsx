"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  CopySimpleIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { kirimLaporan, type HasilKirimLaporan } from "@/app/lapor/actions";
import { daftarKategoriLaporan } from "@/lib/lapor/types";
import { cn } from "@/lib/utils";

const stateAwal: HasilKirimLaporan | null = null;

export function FormLaporan() {
  const [hasil, kirim, mengirim] = useActionState(kirimLaporan, stateAwal);
  const [kategori, setKategori] = React.useState<string>("");
  const [disalin, setDisalin] = React.useState(false);

  /* Tidak ada pembersihan formulir di sini. Begitu pengiriman berhasil,
     komponen merender layar "Laporan terkirim" dan formulirnya dilepas dari
     DOM, jadi tidak ada yang perlu dibersihkan. Satu-satunya jalan kembali
     ke formulir adalah tombol yang memuat ulang halaman. */

  if (hasil?.berhasil) {
    const salinKode = async () => {
      await navigator.clipboard.writeText(hasil.kodeLacak);
      setDisalin(true);
      setTimeout(() => setDisalin(false), 2000);
    };

    return (
      <div
        aria-live="polite"
        className="rounded-[var(--radius-panel)] border border-green/30 bg-green-soft p-6 sm:p-8"
      >
        <div className="flex items-start gap-3.5">
          <CheckCircleIcon
            size={26}
            weight="fill"
            className="mt-0.5 shrink-0 text-green-strong"
          />
          <div>
            <h3 className="text-lg font-extrabold text-green-deep">
              Laporan terkirim
            </h3>
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink">
              Simpan kode ini untuk memantau tindak lanjutnya. Kode tidak
              dikirim ulang lewat cara lain, jadi dicatat sendiri saja.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-green/30 bg-surface px-5 py-4">
          <span className="font-mono text-xl font-bold tracking-wider text-green-deep">
            {hasil.kodeLacak}
          </span>
          <button
            type="button"
            onClick={salinKode}
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-line-strong px-4 text-sm font-semibold text-ink-muted transition-colors hover:border-green hover:text-green-strong"
          >
            <CopySimpleIcon size={16} weight="bold" />
            {disalin ? "Tersalin" : "Salin"}
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="primary">
            <Link href={`/lapor/status?kode=${encodeURIComponent(hasil.kodeLacak)}`}>
              Lihat status sekarang
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Kirim laporan lain
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={kirim} className="flex flex-col gap-5">
      {hasil && !hasil.berhasil && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-[var(--radius-card)] border border-danger/30 bg-danger-soft px-5 py-4"
        >
          <WarningIcon
            size={20}
            weight="fill"
            className="mt-0.5 shrink-0 text-danger"
          />
          <p className="text-[0.9375rem] text-ink">{hasil.pesan}</p>
        </div>
      )}

      <div>
        <Label htmlFor="kategori">Jenis laporan</Label>
        <input type="hidden" name="kategori" value={kategori} />
        <Select value={kategori} onValueChange={setKategori}>
          <SelectTrigger id="kategori" aria-label="Pilih jenis laporan">
            <SelectValue placeholder="Pilih salah satu…" />
          </SelectTrigger>
          <SelectContent>
            {daftarKategoriLaporan.map((k) => (
              <SelectItem key={k} value={k}>
                {k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="lokasi">Lokasi kejadian</Label>
        <Input
          id="lokasi"
          name="lokasi"
          required
          minLength={5}
          maxLength={200}
          placeholder="Contoh: Depan RT 05, dekat warung Bu Marni"
        />
      </div>

      <div>
        <Label htmlFor="deskripsi">Ceritakan kejadiannya</Label>
        <Textarea
          id="deskripsi"
          name="deskripsi"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="Apa yang terjadi, sejak kapan, dan hal lain yang perlu diketahui petugas."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="namaPelapor">
            Nama <span className="font-normal text-ink-faint">(opsional)</span>
          </Label>
          <Input id="namaPelapor" name="namaPelapor" maxLength={100} placeholder="Boleh dikosongkan" />
        </div>
        <div>
          <Label htmlFor="kontak">
            WhatsApp{" "}
            <span className="font-normal text-ink-faint">(opsional)</span>
          </Label>
          <Input
            id="kontak"
            name="kontak"
            maxLength={30}
            placeholder="Untuk dihubungi bila perlu"
          />
        </div>
      </div>

      <p className="text-[0.8125rem] leading-relaxed text-ink-faint">
        Laporan bisa dikirim tanpa nama. Mengisi kontak membantu petugas
        menghubungi Anda bila perlu klarifikasi lokasi.
      </p>

      <Button
        type="submit"
        size="lg"
        disabled={mengirim || !kategori}
        className={cn(mengirim && "opacity-70")}
      >
        {mengirim ? "Mengirim…" : "Kirim laporan"}
      </Button>
    </form>
  );
}

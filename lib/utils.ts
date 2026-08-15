import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sengaja TIDAK memakai `style: "currency"`. Versi ICU Node.js (server)
 * dan browser (client) bisa beda soal spasi antara "Rp" dan angkanya,
 * menyebabkan hydration mismatch. Format angka biasa lalu tempel "Rp"
 * sendiri supaya hasilnya pasti sama di server maupun client.
 */
export function formatRupiah(nilai: number): string {
  const angka = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(nilai);
  return `Rp ${angka}`;
}

/** "2026-08-14" -> "14 Agustus 2026" */
export function formatTanggal(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** "2026-08-14" -> "14 Agu" */
export function formatTanggalPendek(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** "2026-08-14" -> "Jumat" */
export function namaHari(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function formatAngka(nilai: number): string {
  return new Intl.NumberFormat("id-ID").format(nilai);
}

/** Nomor WA lokal (08xx) -> tautan wa.me internasional */
export function tautanWhatsApp(nomor: string, pesan?: string): string {
  const bersih = nomor.replace(/\D/g, "").replace(/^0/, "62");
  const teks = pesan ? `?text=${encodeURIComponent(pesan)}` : "";
  return `https://wa.me/${bersih}${teks}`;
}

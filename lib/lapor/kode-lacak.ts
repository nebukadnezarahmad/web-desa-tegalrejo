const ABJAD = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // tanpa 0/O/1/I yang mirip

/** Kode lacak 8 karakter, dikelompokkan "XXXX-XXXX" supaya gampang dibaca lewat telepon. */
export function buatKodeLacak(): string {
  let acak = "";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  for (const b of bytes) acak += ABJAD[b % ABJAD.length];
  return `${acak.slice(0, 4)}-${acak.slice(4, 8)}`;
}

/** Menerima input longgar dari warga (huruf kecil, tanpa strip, spasi) lalu menormalkannya. */
export function normalisasiKodeLacak(input: string): string {
  const bersih = input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (bersih.length !== 8) return bersih;
  return `${bersih.slice(0, 4)}-${bersih.slice(4, 8)}`;
}

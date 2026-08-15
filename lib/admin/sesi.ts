const NAMA_COOKIE = "admin_sesi";
const UMUR_SESI_DETIK = 60 * 60 * 8; // 8 jam

/**
 * Sesi admin sederhana: satu kata sandi bersama (ADMIN_PASSWORD), bukan
 * sistem akun per-orang. Wajar untuk satu "petugas desa" yang mengelola
 * laporan, bukan situs dengan banyak pengguna berbeda peran.
 *
 * Token = base64url(payload).base64url(tandaTanganHMAC-SHA256).
 * Pakai Web Crypto (crypto.subtle) supaya jalan sama persis di middleware
 * (runtime Edge) maupun Server Action (runtime Node).
 */

function rahasia(): string {
  const nilai = process.env.ADMIN_SESSION_SECRET;
  if (!nilai) throw new Error("ADMIN_SESSION_SECRET belum diset.");
  return nilai;
}

function keBase64Url(bytes: Uint8Array): string {
  let biner = "";
  for (const b of bytes) biner += String.fromCharCode(b);
  return btoa(biner).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function dariBase64Url(teks: string): Uint8Array {
  const dipulihkan = teks.replace(/-/g, "+").replace(/_/g, "/");
  const dipadatkan = dipulihkan.padEnd(
    dipulihkan.length + ((4 - (dipulihkan.length % 4)) % 4),
    "=",
  );
  const biner = atob(dipadatkan);
  return Uint8Array.from(biner, (c) => c.charCodeAt(0));
}

async function kunciHmac(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(rahasia()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function buatTokenSesi(): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + UMUR_SESI_DETIK * 1000 });
  const payloadB64 = keBase64Url(new TextEncoder().encode(payload));
  const kunci = await kunciHmac();
  const tandaTangan = await crypto.subtle.sign(
    "HMAC",
    kunci,
    new TextEncoder().encode(payloadB64),
  );
  return `${payloadB64}.${keBase64Url(new Uint8Array(tandaTangan))}`;
}

export async function tokenSesiValid(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payloadB64, tandaTanganB64] = token.split(".");
  if (!payloadB64 || !tandaTanganB64) return false;

  try {
    const kunci = await kunciHmac();
    const valid = await crypto.subtle.verify(
      "HMAC",
      kunci,
      dariBase64Url(tandaTanganB64) as BufferSource,
      new TextEncoder().encode(payloadB64),
    );
    if (!valid) return false;

    const payload = JSON.parse(
      new TextDecoder().decode(dariBase64Url(payloadB64)),
    ) as { exp: number };
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export { NAMA_COOKIE, UMUR_SESI_DETIK };

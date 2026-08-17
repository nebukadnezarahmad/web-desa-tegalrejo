import { headers } from "next/headers";

/**
 * Pembatas laju sederhana untuk aksi publik.
 *
 * Disimpan di memori proses, bukan Redis. Pada Vercel tiap instansi punya
 * memorinya sendiri, jadi ini bukan pembatas yang sempurna: penyerang yang
 * kebetulan tersebar ke banyak instansi masih bisa lolos sebagian. Yang
 * dihentikan adalah kasus yang paling mungkin terjadi, yaitu satu orang
 * menekan tombol berulang kali atau menjalankan skrip sederhana dari satu
 * tempat. Untuk portal desa dengan lalu lintas sekian puluh orang sehari,
 * itu sepadan dan tidak menambah layanan baru yang harus dijaga.
 */

type Jejak = { jumlah: number; mulai: number };

const jejak = new Map<string, Jejak>();

/** Buang catatan kedaluwarsa supaya peta tidak tumbuh tanpa batas. */
function sapu(sekarang: number, jendelaMs: number) {
  for (const [k, v] of jejak) {
    if (sekarang - v.mulai > jendelaMs) jejak.delete(k);
  }
}

export async function alamatPemanggil(): Promise<string> {
  const h = await headers();
  /* Vercel selalu mengisi x-forwarded-for. Nilainya bisa berupa rantai,
     dan yang paling kiri adalah klien aslinya. */
  const maju = h.get("x-forwarded-for");
  if (maju) return maju.split(",")[0].trim();
  return h.get("x-real-ip") ?? "tak-dikenal";
}

export async function lewatiBatas(opsi: {
  kunci: string;
  maksimal: number;
  jendelaDetik: number;
}): Promise<{ boleh: boolean; sisaDetik: number }> {
  const sekarang = Date.now();
  const jendelaMs = opsi.jendelaDetik * 1000;
  sapu(sekarang, jendelaMs);

  const id = `${opsi.kunci}:${await alamatPemanggil()}`;
  const ada = jejak.get(id);

  if (!ada || sekarang - ada.mulai > jendelaMs) {
    jejak.set(id, { jumlah: 1, mulai: sekarang });
    return { boleh: true, sisaDetik: 0 };
  }

  if (ada.jumlah >= opsi.maksimal) {
    return {
      boleh: false,
      sisaDetik: Math.ceil((jendelaMs - (sekarang - ada.mulai)) / 1000),
    };
  }

  ada.jumlah += 1;
  return { boleh: true, sisaDetik: 0 };
}

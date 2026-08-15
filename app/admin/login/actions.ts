"use server";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { buatTokenSesi, NAMA_COOKIE, UMUR_SESI_DETIK } from "@/lib/admin/sesi";

export type HasilLogin = { pesan: string } | null;

function sandiCocok(masukan: string, benar: string): boolean {
  const a = Buffer.from(masukan);
  const b = Buffer.from(benar);
  // timingSafeEqual mengharuskan panjang sama; kalau beda, sudah pasti salah.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function loginAdmin(
  _sebelumnya: HasilLogin,
  formData: FormData,
): Promise<HasilLogin> {
  const sandi = String(formData.get("sandi") ?? "");
  const tujuan = String(formData.get("tujuan") || "/admin/laporan");
  const sandiBenar = process.env.ADMIN_PASSWORD;

  if (!sandiBenar) {
    return { pesan: "ADMIN_PASSWORD belum diset di server." };
  }

  if (!sandi || !sandiCocok(sandi, sandiBenar)) {
    return { pesan: "Kata sandi salah." };
  }

  const token = await buatTokenSesi();
  const jar = await cookies();
  jar.set(NAMA_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: UMUR_SESI_DETIK,
  });

  redirect(tujuan.startsWith("/admin") ? tujuan : "/admin/laporan");
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(NAMA_COOKIE);
  redirect("/admin/login");
}

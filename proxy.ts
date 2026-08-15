import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NAMA_COOKIE, tokenSesiValid } from "@/lib/admin/sesi";

/**
 * Melindungi seluruh /admin/* kecuali /admin/login. Next.js 16 mengganti
 * nama konvensi middleware.ts menjadi proxy.ts. Lihat catatan revisi
 * bundled docs, bukan dugaan dari data latih.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(NAMA_COOKIE)?.value;
  const valid = await tokenSesiValid(token);

  if (!valid) {
    const tujuan = new URL("/admin/login", request.url);
    tujuan.searchParams.set("dari", pathname);
    return NextResponse.redirect(tujuan);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

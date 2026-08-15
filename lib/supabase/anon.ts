import { createClient } from "@supabase/supabase-js";

/**
 * Klien Supabase dengan kunci publishable (anon). Cocok dipakai di Server
 * Action untuk aksi publik: kirim laporan (INSERT, diizinkan RLS) dan cek
 * status lewat fungsi cek_status_laporan. Tidak punya akses baca tabel
 * secara umum. Itu memang disengaja lewat kebijakan RLS di Supabase.
 */
export function klienAnon() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY belum diset.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

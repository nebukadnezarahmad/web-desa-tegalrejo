import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Klien Supabase dengan service_role key (akses penuh, melewati RLS).
 * HANYA untuk kode admin yang sudah dilindungi middleware sesi. Import
 * "server-only" membuat bundler gagal build kalau file ini pernah
 * ter-import dari komponen client secara tidak sengaja.
 */
export function klienService() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diset.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

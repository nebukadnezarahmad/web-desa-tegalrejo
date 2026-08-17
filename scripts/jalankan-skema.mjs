/**
 * Menjalankan supabase/skema.sql lewat Management API Supabase.
 *
 * PostgREST, yang dipakai kunci anon maupun service_role, hanya memaparkan
 * tabel dan fungsi yang sudah ada. Dia tidak bisa menjalankan DDL, jadi
 * `create table` mustahil lewat jalur itu. Management API bisa, tapi
 * memerlukan Personal Access Token yang berbeda dari kunci proyek.
 *
 * Pakai:
 *   1. Buat token di https://supabase.com/dashboard/account/tokens
 *   2. Tambahkan barisnya ke .env.local (berkas itu sudah diabaikan git):
 *        SUPABASE_ACCESS_TOKEN=sbp_...
 *   3. node --env-file=.env.local scripts/jalankan-skema.mjs
 *   4. Cabut kembali tokennya di dashboard bila sudah selesai.
 */

import { readFileSync } from "node:fs";

const token = process.env.SUPABASE_ACCESS_TOKEN;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!token) {
  console.error(
    "SUPABASE_ACCESS_TOKEN belum ada di .env.local.\n" +
      "Buat di https://supabase.com/dashboard/account/tokens lalu tambahkan barisnya.",
  );
  process.exit(1);
}

if (!url) {
  console.error("NEXT_PUBLIC_SUPABASE_URL belum diset.");
  process.exit(1);
}

const ref = new URL(url).hostname.split(".")[0];
/* Nama berkas boleh diberikan sebagai argumen supaya migrasi lanjutan
   memakai skrip yang sama. */
const berkas = process.argv[2] ?? "skema.sql";
const sql = readFileSync(new URL(`../supabase/${berkas}`, import.meta.url), "utf8");

const res = await fetch(
  `https://api.supabase.com/v1/projects/${ref}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  },
);

const teks = await res.text();

if (!res.ok) {
  console.error(`Gagal (HTTP ${res.status}):`, teks.slice(0, 600));
  process.exit(1);
}

console.log(`${berkas} dijalankan pada proyek ${ref}.`);
console.log(teks.slice(0, 300));

-- ============================================================
-- Balai: kode lacak usulan UMKM dan riwayat tindakan petugas
--
-- Jalankan setelah supabase/skema.sql. Aman diulang.
-- ============================================================


-- ------------------------------------------------------------
-- 1. Kode lacak untuk usulan produk
--
-- Warga yang mengajukan produk sebelumnya tidak punya cara apa pun untuk
-- tahu nasib usulannya. Kolom catatan_admin sudah ada tapi tidak pernah
-- sampai ke pengusulnya. Polanya meniru laporan warga yang sudah bekerja.
-- ------------------------------------------------------------

alter table public.produk_umkm
  add column if not exists kode_lacak text;

create unique index if not exists produk_umkm_kode_lacak_idx
  on public.produk_umkm (kode_lacak)
  where kode_lacak is not null;

-- Fungsi pengecekan status, bukan SELECT langsung.
--
-- Kebijakan RLS hanya membuka baris berstatus terbit untuk peran anon,
-- sedangkan yang justru perlu dicek warga adalah usulan yang masih
-- menunggu. SECURITY DEFINER menembus itu, tapi hanya mengembalikan kolom
-- yang aman: tanpa nomor WhatsApp, tanpa nama pemilik, tanpa alamat.
create or replace function public.cek_status_usulan(kode text)
returns table (
  nama            text,
  kategori        text,
  status          text,
  catatan_admin   text,
  dibuat_pada     timestamptz,
  diperbarui_pada timestamptz
)
language sql
security definer
set search_path = public
as $$
  select p.nama, p.kategori, p.status, p.catatan_admin,
         p.dibuat_pada, p.diperbarui_pada
  from public.produk_umkm p
  where p.kode_lacak = upper(trim(kode))
  limit 1;
$$;

revoke all on function public.cek_status_usulan(text) from public;
grant execute on function public.cek_status_usulan(text) to anon, authenticated;


-- ------------------------------------------------------------
-- 2. Riwayat tindakan petugas
--
-- Tanpa ini, produk yang hilang dari lapak tidak meninggalkan jejak apa
-- pun: tidak ada catatan siapa menariknya maupun kapan.
--
-- Tabel sengaja menyimpan ringkasan berupa teks, bukan kunci asing ke
-- baris aslinya. Tindakan yang paling perlu dilacak justru penghapusan,
-- dan kunci asing akan ikut lenyap bersama barisnya.
-- ------------------------------------------------------------

create table if not exists public.riwayat_admin (
  id          uuid primary key default gen_random_uuid(),
  entitas     text not null check (entitas in ('produk', 'pengumuman', 'laporan')),
  entitas_id  text,
  judul       text not null,
  tindakan    text not null,
  keterangan  text,
  dibuat_pada timestamptz not null default now()
);

create index if not exists riwayat_admin_waktu_idx
  on public.riwayat_admin (dibuat_pada desc);

alter table public.riwayat_admin enable row level security;

-- Sengaja tanpa policy apa pun. Riwayat memuat gambaran kerja internal
-- balai desa dan hanya perlu terbaca lewat kunci service dari panel
-- petugas; peran anon tertutup dengan sendirinya.


-- ------------------------------------------------------------
-- 3. Pemeriksaan
-- ------------------------------------------------------------
-- select count(*) from public.riwayat_admin;
-- select public.cek_status_usulan('XXXX-XXXX');

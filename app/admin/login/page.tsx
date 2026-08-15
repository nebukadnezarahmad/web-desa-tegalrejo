import type { Metadata } from "next";
import { FormLogin } from "@/components/admin/form-login";
import { desa } from "@/lib/data/desa";

export const metadata: Metadata = {
  title: "Masuk Petugas",
  robots: { index: false, follow: false },
};

export default async function HalamanLoginAdmin(
  props: PageProps<"/admin/login">,
) {
  const params = await props.searchParams;
  const dari = typeof params.dari === "string" ? params.dari : "/admin/laporan";

  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-surface-soft px-4 py-16">
      <div className="w-full max-w-sm rounded-[var(--radius-panel)] border border-line bg-surface p-7 shadow-sm shadow-ink/5 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-strong">
          Panel Petugas
        </p>
        <h1 className="mt-2 text-xl font-extrabold text-ink">
          Kelola laporan warga {desa.nama}
        </h1>
        <p className="mt-2 text-[0.875rem] text-ink-muted">
          Khusus petugas desa. Warga yang ingin melapor buka{" "}
          <a href="/lapor" className="font-semibold text-blue-strong">
            /lapor
          </a>
          .
        </p>

        <div className="mt-6">
          <FormLogin tujuan={dari} />
        </div>
      </div>
    </main>
  );
}

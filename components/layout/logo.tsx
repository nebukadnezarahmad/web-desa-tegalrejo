import { desa } from "@/lib/data/desa";

/**
 * Lambang Balai: atap balai desa di atas garis kontur.
 * Dua warna: hijau (tanah/tumbuh) dan biru (layanan).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="flex items-center gap-2.5">
        <svg
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          aria-hidden
          className="shrink-0"
        >
          <rect width="34" height="34" rx="10" fill="var(--green-strong)" />
          {/* atap balai */}
          <path
            d="M8 15.5 17 9l9 6.5"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* garis kontur di bawah atap */}
          <path
            d="M10 19.5c2-1.4 4-1.4 7 0s5 1.4 7 0"
            stroke="var(--blue)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10 23.5c2-1.4 4-1.4 7 0s5 1.4 7 0"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.65"
          />
        </svg>
        <span className="flex flex-col leading-none">
          <span className="text-[1.0625rem] font-extrabold tracking-tight text-ink">
            {desa.merek}
          </span>
          <span className="mt-0.5 text-[0.75rem] font-medium tracking-wide text-ink-faint">
            {desa.nama}
          </span>
        </span>
      </span>
    </span>
  );
}

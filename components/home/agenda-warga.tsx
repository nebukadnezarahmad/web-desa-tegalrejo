import {
  MapPinIcon,
  ClockIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { agendaMendatang, type Agenda } from "@/lib/data/agenda";
import { cn, formatTanggalPendek, namaHari } from "@/lib/utils";

const toneJenis: Record<Agenda["jenis"], "green" | "blue" | "netral"> = {
  Musyawarah: "blue",
  Kesehatan: "green",
  "Gotong royong": "green",
  Pelatihan: "blue",
  Budaya: "netral",
};

/** Sedikit kemiringan berselang-seling, meniru sobekan kalender meja yang tidak pernah sejajar sempurna. */
const kemiringan = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg"];

export function AgendaWarga() {
  return (
    <Section latar="putih" ritme="normal">
      <SectionHeading
        kicker="Kalender Warga"
        judul="Agenda yang akan datang"
        deskripsi="Kegiatan desa sebulan ke depan. Catat tanggalnya, hadir bila berkenan."
      />

      <ol className="flex flex-col">
        {agendaMendatang.map((a, i) => (
          <Reveal as="li" key={a.judul} index={i}>
            <div className="group grid grid-cols-[5.5rem_1fr] items-start gap-5 border-b border-line py-7 transition-colors first:border-t first:border-line sm:grid-cols-[6.5rem_1fr] sm:gap-8">
              {/* Sobekan kalender, motif yang beda sendiri dari kartu di bagian lain halaman */}
              <div
                className="relative w-full max-w-[5.5rem] justify-self-center pt-2 sm:max-w-[6.5rem]"
                style={{ transform: `rotate(${kemiringan[i % kemiringan.length]})` }}
              >
                {/* selotip kertas di sudut, kesan "ditempel" */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -top-1.5 left-1/2 h-4 w-10 -translate-x-1/2 -rotate-3 rounded-[2px] opacity-70",
                    i % 2 === 0 ? "bg-green-soft" : "bg-blue-soft",
                  )}
                />
                <div className="tepi-sobek relative bg-surface px-3 pb-4 pt-3 text-center shadow-md shadow-ink/10 ring-1 ring-line">
                  <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                    {namaHari(a.tanggal).slice(0, 3)}
                  </p>
                  <p className="mt-0.5 text-[1.75rem] font-extrabold leading-none tracking-tight text-green-strong sm:text-[2rem]">
                    {formatTanggalPendek(a.tanggal).split(" ")[0]}
                  </p>
                  <p className="mt-0.5 text-[0.75rem] font-semibold text-ink-muted">
                    {formatTanggalPendek(a.tanggal).split(" ")[1]}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-2.5">
                  <Badge tone={toneJenis[a.jenis]}>{a.jenis}</Badge>
                </div>
                <h3 className="text-[1.0625rem] font-bold text-ink">
                  {a.judul}
                </h3>
                <ul className="mt-3 flex flex-col gap-1.5 text-[0.9375rem] text-ink-muted sm:flex-row sm:flex-wrap sm:gap-x-6">
                  <li className="flex items-center gap-2">
                    <ClockIcon
                      size={16}
                      weight="duotone"
                      className="shrink-0 text-green-strong"
                    />
                    {a.waktu}
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPinIcon
                      size={16}
                      weight="duotone"
                      className="shrink-0 text-green-strong"
                    />
                    {a.lokasi}
                  </li>
                  <li className="flex items-center gap-2">
                    <UsersThreeIcon
                      size={16}
                      weight="duotone"
                      className="shrink-0 text-blue-strong"
                    />
                    {a.penyelenggara}
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

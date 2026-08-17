"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckIcon, ClockIcon, TagIcon } from "@phosphor-icons/react";
import { layananAdministrasi } from "@/lib/data/profil";

export function LayananAkordeon() {
  return (
    <Accordion type="single" collapsible className="flex flex-col gap-3">
      {layananAdministrasi.map((l, i) => (
        <AccordionItem key={l.nama} value={`layanan-${i}`}>
          <AccordionTrigger>{l.nama}</AccordionTrigger>
          <AccordionContent>
            <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
              {l.keterangan}
            </p>

            <div className="mt-6 grid gap-7 md:grid-cols-2">
              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-blue-strong">
                  Berkas yang dibawa
                </h4>
                <ul className="flex flex-col gap-2">
                  {l.syarat.map((s) => (
                    <li
                      key={s}
                      className="flex gap-2.5 text-[0.9375rem] text-ink-muted"
                    >
                      <CheckIcon
                        size={16}
                        weight="bold"
                        aria-hidden
                        className="mt-1 shrink-0 text-blue-strong"
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-blue-strong">
                  Urutan langkah
                </h4>
                <ol className="flex flex-col gap-2.5">
                  {l.alur.map((a, j) => (
                    <li key={a} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-soft text-[0.75rem] font-bold text-blue-deep"
                      >
                        {j + 1}
                      </span>
                      <span className="text-[0.9375rem] text-ink-muted">
                        {a}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5">
              <div className="flex items-center gap-2.5">
                <ClockIcon
                  size={18}
                  weight="duotone"
                  className="shrink-0 text-blue-strong"
                />
                <div>
                  <dt className="text-[0.75rem] text-ink-faint">
                    Perkiraan waktu
                  </dt>
                  <dd className="text-[0.875rem] font-semibold text-ink">
                    {l.estimasi}
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <TagIcon
                  size={18}
                  weight="duotone"
                  className="shrink-0 text-green-strong"
                />
                <div>
                  <dt className="text-[0.75rem] text-ink-faint">Biaya</dt>
                  <dd className="text-[0.875rem] font-semibold text-green-strong">
                    {l.biaya}
                  </dd>
                </div>
              </div>
            </dl>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

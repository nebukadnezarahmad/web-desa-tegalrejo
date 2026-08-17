"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Dialog di atas Radix. Radix yang menangani perangkap fokus, pengembalian
 * fokus ke pemicu saat ditutup, tombol Escape, dan penguncian gulir latar.
 * Animasinya ada di app/globals.css lewat data-slot, sejalan dengan pola
 * akordeon dan select, jadi seluruh gerak tetap memakai token yang sama.
 */

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  judul,
  deskripsi,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  judul: string;
  deskripsi?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px]"
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          /* Ditambatkan ke bawah pada layar sempit supaya terjangkau ibu
             jari, dan dipusatkan begitu ada ruang. `max-h` menjaga isian
             panjang tetap bisa digulung, bukan terpotong keluar layar. */
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-[var(--radius-panel)] border border-line bg-surface shadow-2xl shadow-ink/15",
          "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(38rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[var(--radius-panel)]",
          className,
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <DialogPrimitive.Title className="text-[1.0625rem] font-bold text-ink sm:text-lg">
              {judul}
            </DialogPrimitive.Title>
            {deskripsi ? (
              <DialogPrimitive.Description className="mt-1 text-[0.875rem] leading-relaxed text-ink-muted">
                {deskripsi}
              </DialogPrimitive.Description>
            ) : (
              /* Radix memperingatkan bila Description tidak ada. Disembunyikan
                 dari layar, tetap terbaca pembaca layar. */
              <DialogPrimitive.Description className="sr-only">
                {judul}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close
            aria-label="Tutup"
            className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-faint transition-[transform,background-color,color] duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)] hover:bg-surface-soft hover:text-ink active:scale-[0.94]"
          >
            <XIcon size={19} weight="bold" />
          </DialogPrimitive.Close>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

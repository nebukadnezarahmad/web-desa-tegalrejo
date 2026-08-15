"use client";

import { useSyncExternalStore } from "react";

const KUERI = "(max-width: 639px)";

function langgan(panggil: () => void) {
  const mq = window.matchMedia(KUERI);
  mq.addEventListener("change", panggil);
  return () => mq.removeEventListener("change", panggil);
}

/**
 * True saat layar lebih sempit dari breakpoint sm.
 * Dipakai untuk menyederhanakan grafik yang tidak bisa diatur lewat CSS
 * (jumlah tick, tinggi kanvas, tampil-tidaknya legenda).
 *
 * useSyncExternalStore dipakai supaya aman terhadap render serentak dan
 * tidak menimbulkan ketidakcocokan hidrasi: di server selalu false,
 * lalu menyesuaikan setelah terpasang di peramban.
 */
export function useLayarSempit(): boolean {
  return useSyncExternalStore(
    langgan,
    () => window.matchMedia(KUERI).matches,
    () => false,
  );
}

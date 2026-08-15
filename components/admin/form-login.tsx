"use client";

import { useActionState } from "react";
import { LockIcon, WarningIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { loginAdmin, type HasilLogin } from "@/app/admin/login/actions";

export function FormLogin({ tujuan }: { tujuan: string }) {
  const [hasil, kirim, mengirim] = useActionState<HasilLogin, FormData>(
    loginAdmin,
    null,
  );

  return (
    <form action={kirim} className="flex flex-col gap-5">
      <input type="hidden" name="tujuan" value={tujuan} />

      {hasil?.pesan && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-[var(--radius-card)] border border-danger/30 bg-danger-soft px-5 py-4"
        >
          <WarningIcon size={19} weight="fill" className="shrink-0 text-danger" />
          <p className="text-[0.9375rem] text-ink">{hasil.pesan}</p>
        </div>
      )}

      <div>
        <Label htmlFor="sandi">Kata sandi petugas</Label>
        <Input
          id="sandi"
          name="sandi"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" size="lg" disabled={mengirim}>
        <LockIcon size={18} weight="bold" />
        {mengirim ? "Memeriksa…" : "Masuk"}
      </Button>
    </form>
  );
}

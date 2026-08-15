import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-[var(--radius-card)] border border-line-strong bg-surface px-5 py-4 text-[0.9375rem] leading-relaxed text-ink transition-colors placeholder:text-ink-faint hover:border-green-strong/50 focus:border-green-strong",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

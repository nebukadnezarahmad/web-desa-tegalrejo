import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      tone: {
        green: "bg-green-soft text-green-deep",
        blue: "bg-blue-soft text-blue-deep",
        netral: "bg-surface-soft text-ink-muted border border-line",
        danger: "bg-danger-soft text-danger",
        warn: "bg-warn-soft text-warn",
      },
    },
    defaultVariants: { tone: "green" },
  },
);

function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };

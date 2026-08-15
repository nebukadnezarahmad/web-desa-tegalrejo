import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Hijau = tindakan utama
        primary: "bg-green-strong text-white hover:bg-green-deep shadow-sm",
        // Biru = informasi / layanan
        info: "bg-blue-strong text-white hover:bg-blue-deep shadow-sm",
        outline:
          "border border-line-strong bg-surface text-ink hover:border-green hover:text-green-strong",
        soft: "bg-green-soft text-green-deep hover:bg-green/20",
        softInfo: "bg-blue-soft text-blue-deep hover:bg-blue/20",
        ghost: "text-ink-muted hover:bg-surface-soft hover:text-ink",
      },
      size: {
        // Target sentuh minimal 44px
        default: "h-11 px-5 text-[0.9375rem]",
        lg: "h-13 px-7 text-base",
        sm: "h-11 px-4 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };

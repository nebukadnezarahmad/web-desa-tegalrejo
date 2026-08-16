"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface transition-colors data-[state=open]:border-blue/40",
        className,
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex flex-1 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-[0.9375rem] font-semibold text-ink transition-colors hover:text-blue-strong [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <CaretDownIcon
          size={18}
          weight="bold"
          className="shrink-0 text-blue-strong transition-transform duration-[var(--gerak-cepat)] ease-[var(--ease-out-quint)]"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden"
      {...props}
    >
      <div className={cn("border-t border-line px-5 py-4", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

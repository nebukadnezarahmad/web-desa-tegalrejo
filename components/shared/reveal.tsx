"use client";

import * as React from "react";

/**
 * Reveal on scroll lewat IntersectionObserver (bukan scroll listener).
 * Animasi hanya transform + opacity. Stagger diatur lewat --reveal-index.
 * Jika prefers-reduced-motion aktif, CSS di globals.css langsung menampilkan isi.
 */
export function Reveal({
  children,
  index = 0,
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  index?: number;
  as?: React.ElementType;
  className?: string;
}) {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "shown");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={{ "--reveal-index": index } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}

"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  invert = false,
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]",
            invert
              ? "border-white/20 bg-white/10 text-white/90"
              : "border-brand-200 bg-brand-50 text-brand-700",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              invert ? "bg-gold-soft" : "bg-brand-500",
            )}
          />
          {eyebrow}
        </span>
      ) : null}

      <h2
        className={cn(
          "mt-5 font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-balance sm:text-4xl md:text-[2.9rem]",
          invert ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>

      {subtitle ? (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg",
            align === "center" ? "mx-auto" : "",
            invert ? "text-white/75" : "text-ink/65",
          )}
        >
          {subtitle}
        </p>
      ) : null}

      {children}
    </div>
  );
}

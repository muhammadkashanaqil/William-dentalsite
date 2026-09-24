"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Variant =
  | "primary"
  | "light"
  | "dark"
  | "glass"
  | "outline"
  | "gold";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
  target?: string;
  rel?: string;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-soft hover:shadow-card",
  light: "bg-white text-brand-700 hover:bg-cream shadow-soft",
  dark: "bg-ink text-white hover:bg-brand-900",
  glass: "liquid-glass text-white hover:bg-white/15",
  outline:
    "border border-brand-300/70 text-brand-800 hover:border-brand-500 hover:bg-brand-50",
  gold: "bg-gold text-white hover:brightness-110 shadow-soft",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 sm:px-6 py-2.5 sm:py-3 text-sm",
  lg: "px-6 sm:px-7 py-3.5 text-[0.95rem]",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  disabled,
  ariaLabel,
  target,
  rel,
}: ButtonProps) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target={target}
        rel={rel}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

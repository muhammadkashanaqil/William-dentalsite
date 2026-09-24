"use client";

import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

type StarsProps = {
  rating?: number;
  className?: string;
  size?: number;
};

export function Stars({ rating = 5, className, size = 16 }: StarsProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 text-gold", className)}
      aria-label={`${rating} out of 5 stars`}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={cn(
            i < Math.round(rating) ? "fill-gold" : "fill-transparent opacity-40",
          )}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

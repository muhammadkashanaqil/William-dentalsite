"use client";

import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  /** wrap children in a centered max-width container */
  container?: boolean;
  as?: ElementType;
};

export function Section({
  id,
  className,
  children,
  container = true,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag id={id} className={cn("scroll-mt-24 w-full max-w-full overflow-hidden", className)}>
      {container ? (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10 lg:px-12">
          {children}
        </div>
      ) : (
        children
      )}
    </Tag>
  );
}

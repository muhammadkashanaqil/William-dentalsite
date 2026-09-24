"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const variants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: EASE },
  }),
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** delay in seconds */
  delay?: number;
  /** amount of element visible before triggering (0–1) */
  amount?: number;
  as?: "div" | "li" | "span";
};

export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.2,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

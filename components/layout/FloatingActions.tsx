"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { clinic } from "@/data/site";
import { useScrolled } from "@/hooks/useScroll";

type Action = {
  href: string;
  label: string;
  aria: string;
  className: string;
  icon: ReactNode;
  external?: boolean;
};

export function FloatingActions() {
  const showTop = useScrolled(640);
  const wa = `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(
    "Hi Lumina Dental! I'd like to book an appointment.",
  )}`;

  const actions: Action[] = [
    {
      href: clinic.phoneHref,
      label: "Call now",
      aria: `Call ${clinic.name} at ${clinic.phone}`,
      className: "bg-brand-600 text-white hover:bg-brand-700",
      icon: <Phone className="h-5 w-5" strokeWidth={2.2} />,
    },
    {
      href: wa,
      label: "WhatsApp",
      aria: "Chat with us on WhatsApp",
      className: "bg-[#25D366] text-white hover:brightness-105",
      icon: <MessageCircle className="h-5 w-5" strokeWidth={2.2} />,
      external: true,
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {showTop ? (
          <motion.button
            key="top"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{ duration: 0.25 }}
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/90 text-ink shadow-card backdrop-blur transition-colors hover:bg-white"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.2} />
          </motion.button>
        ) : null}
      </AnimatePresence>

      {actions.map((a) => (
        <a
          key={a.label}
          href={a.href}
          aria-label={a.aria}
          title={a.label}
          target={a.external ? "_blank" : undefined}
          rel={a.external ? "noopener noreferrer" : undefined}
          className={`group relative flex h-14 w-14 items-center justify-center rounded-full shadow-lift transition-transform duration-300 hover:scale-105 active:scale-95 ${a.className}`}
        >
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-current opacity-10 [animation-duration:2.6s]"
          />
          {a.icon}
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-soft transition-opacity duration-200 group-hover:opacity-100 md:block">
            {a.label}
          </span>
        </a>
      ))}
    </div>
  );
}

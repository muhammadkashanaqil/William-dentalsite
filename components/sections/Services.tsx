"use client";

import { ArrowRight, Check } from "lucide-react";
import { services } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/utils/cn";
import { useNavigation } from "@/context/NavigationContext";

export function Services() {
  const { navigate, openBookingModal } = useNavigation();

  return (
    <Section id="services" className="bg-sand/60 py-20 sm:py-28 overflow-hidden">
      <SectionHeading
        eyebrow="Comprehensive Clinical Care"
        title="Complete Dentistry, Beautifully Delivered"
        subtitle="Preventive, cosmetic and restorative dentistry — all performed by board-certified specialists using biomimetic precision under one calm roof."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 0.08}>
            <article
              className={cn(
                "group relative flex h-full flex-col justify-between rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 cursor-pointer",
                s.accent
                  ? "border-brand-700 bg-brand-700 text-white shadow-lift"
                  : "border-ink/8 bg-white shadow-soft hover:shadow-card",
              )}
              onClick={() => navigate(s.slug ? `services/${s.slug}` : "services")}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl",
                      s.accent
                        ? "bg-white/15 text-white"
                        : "bg-brand-50 text-brand-700",
                    )}
                  >
                    <s.icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <span
                    className={cn(
                      "text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full",
                      s.accent ? "bg-white/20 text-white" : "bg-sand text-ink/60"
                    )}
                  >
                    Learn More →
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p
                  className={cn(
                    "mt-2.5 text-sm leading-relaxed",
                    s.accent ? "text-white/80" : "text-ink/65",
                  )}
                >
                  {s.blurb}
                </p>

                <ul className="mt-5 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-xs sm:text-sm">
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0",
                          s.accent ? "text-brand-200" : "text-brand-500",
                        )}
                        strokeWidth={2.5}
                      />
                      <span className={s.accent ? "text-white/85" : "text-ink/70"}>
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(s.slug ? `services/${s.slug}` : "services");
                  }}
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-semibold hover:underline",
                    s.accent ? "text-white" : "text-brand-700",
                  )}
                >
                  Detailed Procedure Guide
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openBookingModal(s.slug || "general");
                  }}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold transition-all",
                    s.accent
                      ? "bg-white text-brand-900 hover:bg-cream"
                      : "bg-brand-50 text-brand-700 hover:bg-brand-100"
                  )}
                >
                  Book Slot
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => navigate("services")}
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink shadow-soft hover:bg-cream transition-colors"
        >
          View Full Services Catalog & Pricing Breakdown
          <ArrowRight className="h-4 w-4 text-brand-700" />
        </button>
      </div>
    </Section>
  );
}

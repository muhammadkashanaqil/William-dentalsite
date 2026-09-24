"use client";

import { ArrowRight, CalendarCheck, Phone } from "lucide-react";
import { clinic } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useNavigation } from "@/context/NavigationContext";

export function Cta() {
  const { openBookingModal } = useNavigation();

  return (
    <Section className="bg-cream pb-20 pt-4 sm:pb-28 overflow-hidden">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-700 via-brand-800 to-[#0b2724] px-6 py-16 text-center shadow-lift sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
              maskImage:
                "radial-gradient(ellipse at 50% 50%, #000 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at 50% 50%, #000 30%, transparent 75%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-400/20 blur-[110px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-gold/20 blur-[110px]"
          />

          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/90">
            Your healthiest smile starts here
          </span>

          <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-medium leading-[1.1] tracking-tight text-white text-balance sm:text-4xl md:text-5xl">
            Ready to meet a dental team that truly{" "}
            <span className="italic text-gold-soft">listens?</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base text-white/75 text-pretty sm:text-lg">
            Book your new-patient comprehensive examination today and discover dentistry that feels calm, clear and completely in your control.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Button onClick={() => openBookingModal()} variant="light" size="lg">
              <CalendarCheck className="h-[1.05rem] w-[1.05rem]" />
              Book your visit ($89 Special)
            </Button>
            <a
              href={clinic.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {clinic.phone}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

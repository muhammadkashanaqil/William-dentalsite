"use client";

import { Phone, Clock, ArrowRight } from "lucide-react";
import { clinic, emergencies } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useNavigation } from "@/context/NavigationContext";

export function Emergency() {
  const { navigate, openBookingModal } = useNavigation();

  return (
    <Section
      id="emergency"
      className="relative overflow-hidden bg-ink py-20 text-white sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-rose-500/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand-500/15 blur-[120px]"
      />

      <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left — copy */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-rose-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
              24/7 Emergency Dental Triage
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="mt-5 font-display text-3xl font-medium leading-[1.1] tracking-tight text-balance sm:text-4xl md:text-5xl">
              In pain right now? We'll see you{" "}
              <span className="text-gold-soft">today.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-white/75 text-pretty text-sm sm:text-base leading-relaxed">
              Dental emergencies don't wait — and neither do we. We reserve same-day urgent appointments every weekday and operate an after-hours priority hotline so you are never left in discomfort.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href={clinic.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-brand-900 shadow-soft hover:bg-cream transition-colors"
              >
                <Phone className="h-4 w-4 text-rose-600" />
                {clinic.phone}
              </a>
              <Button
                onClick={() => openBookingModal("emergency")}
                variant="glass"
                size="lg"
              >
                Request Urgent Same-Day Slot
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-6 flex items-center gap-4 text-xs sm:text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-300" />
                <span>Average callback: under 15 min</span>
              </div>
              <span>·</span>
              <button
                onClick={() => navigate("emergency")}
                className="text-brand-300 underline font-medium hover:text-white"
              >
                View Tooth First-Aid Guide →
              </button>
            </div>
          </Reveal>
        </div>

        {/* Right — reasons grid */}
        <Reveal delay={0.1}>
          <div className="grid gap-3 sm:grid-cols-2">
            {emergencies.map((e) => (
              <div
                key={e.title}
                onClick={() => navigate("emergency")}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all hover:bg-white/10 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <h3 className="text-sm font-semibold text-white">
                    {e.title}
                  </h3>
                </div>
                <p className="mt-2 text-xs text-white/65 leading-relaxed">{e.blurb}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

"use client";

import { ArrowRight } from "lucide-react";
import { features, images } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function WhyChooseUs() {
  return (
    <Section id="why" className="py-20 sm:py-28 overflow-hidden">
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left — heading + image */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <SectionHeading
            align="left"
            eyebrow="Why Lumina"
            title="Comfort-first dentistry, by design"
            subtitle="We obsess over the small details so your visit feels calm, clear and completely in your control."
          />

          <Reveal className="mt-8">
            <div className="relative overflow-hidden rounded-[2rem] border border-ink/5 shadow-card">
              <img
                src={images.whyCare}
                alt="A bright, welcoming Lumina Dental treatment suite with modern equipment"
                loading="lazy"
                className="aspect-[16/11] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-white/85 px-4 py-3 backdrop-blur">
                <div>
                  <p className="font-display text-xl font-semibold text-ink">
                    99% satisfaction
                  </p>
                  <p className="text-xs text-ink/60">across 2,000+ reviews</p>
                </div>
                <Button href="#testimonials" variant="primary" size="sm">
                  Read reviews
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right — features */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 0.08}>
              <div className="group h-full rounded-2xl border border-ink/8 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <f.icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {f.blurb}
                </p>
              </div>
            </Reveal>
          ))}

          <Reveal className="sm:col-span-2" delay={0.1}>
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-6 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-lg font-semibold text-brand-900">
                  Ready to feel the difference?
                </h3>
                <p className="mt-1 text-sm text-brand-900/70">
                  New-patient exams are just $89 — X-rays and cleaning included.
                </p>
              </div>
              <Button href="#appointment" variant="primary" className="shrink-0">
                Claim offer
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

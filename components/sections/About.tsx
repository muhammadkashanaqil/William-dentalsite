"use client";

import { ArrowRight, Check } from "lucide-react";
import { images } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useNavigation } from "@/context/NavigationContext";

const points = [
  "Calm, boutique studio atmosphere with aromatherapy and ambient noise-canceling suites",
  "All dental specialists under one roof — cosmetic, orthodontic & surgical",
  "Transparent upfront estimates, zero surprise billing, and 0% APR financing",
];

export function About() {
  const { navigate } = useNavigation();

  return (
    <Section id="about" className="py-20 sm:py-28 overflow-hidden">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image collage */}
        <Reveal className="order-1">
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-ink/5 shadow-card">
              <img
                src={images.aboutInterior}
                alt="Bright, modern interior of the Lumina Dental Studio treatment area"
                loading="lazy"
                className="aspect-[5/4] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 right-0 hidden w-44 overflow-hidden rounded-2xl border-4 border-cream shadow-lift sm:block sm:w-52">
              <img
                src={images.aboutCare}
                alt="A dentist gently speaking with a relaxed patient"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            {/* Stat badge */}
            <div className="absolute -left-3 bottom-6 rounded-2xl bg-brand-600 px-5 py-4 text-white shadow-lift sm:-left-6">
              <p className="font-display text-2xl font-semibold leading-none">18+</p>
              <p className="mt-1 text-xs text-white/80">years of care in SF</p>
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <div className="order-2">
          <SectionHeading
            align="left"
            eyebrow="The Studio Experience"
            title="Dentistry designed around how you actually feel."
            subtitle="Since 2007, Lumina Dental Studio has transformed the dental experience — trading clinical anxiety for calm hospitality, 3D imaging, and biological preservation."
          />

          <div className="mt-8 space-y-3.5">
            {points.map((p, i) => (
              <Reveal key={p} delay={i * 0.06}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-[0.95rem] leading-relaxed text-ink/75">
                    {p}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button onClick={() => navigate("team")} variant="primary">
              Meet the specialists
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button onClick={() => navigate("about")} variant="outline">
              Learn our philosophy & tech
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

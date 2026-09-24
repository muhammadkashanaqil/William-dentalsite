"use client";

import { Quote } from "lucide-react";
import { testimonials } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";

export function Testimonials() {
  return (
    <Section id="testimonials" className="py-20 sm:py-28">
      <SectionHeading
        eyebrow="Patient stories"
        title="Loved by thousands of smiles"
        subtitle="Real words from real patients — the reason we come to work smiling every day."
      />

      <Reveal className="mx-auto mt-8 max-w-md">
        <div className="flex items-center justify-center gap-4 rounded-full border border-ink/8 bg-white px-5 py-3 shadow-soft">
          <Stars rating={5} size={16} />
          <span className="text-sm font-semibold text-ink">4.9 / 5</span>
          <span className="h-4 w-px bg-ink/10" />
          <span className="text-sm text-ink/60">2,124 verified reviews</span>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={(i % 3) * 0.08}>
            <figure className="flex h-full flex-col rounded-3xl border border-ink/8 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
              <Quote className="h-7 w-7 text-brand-200" fill="currentColor" />
              <Stars rating={t.rating} size={15} className="mt-3" />
              <blockquote className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink/75 text-pretty">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/5 pt-5">
                <img
                  src={t.avatar}
                  alt=""
                  loading="lazy"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink/55">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

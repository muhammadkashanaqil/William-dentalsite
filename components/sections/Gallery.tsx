"use client";

import { gallery, images } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { ArrowRight } from "lucide-react";
import { useNavigation } from "@/context/NavigationContext";

export function Gallery() {
  const { navigate } = useNavigation();

  return (
    <Section id="gallery" className="bg-sand/60 py-20 sm:py-28 overflow-hidden">
      <SectionHeading
        eyebrow="Smile Transformations"
        title="Real Results, Real Confidence"
        subtitle="Drag the interactive slider below to inspect an authentic whitening result, or explore smiles crafted right here at Lumina."
      />

      {/* Featured before / after */}
      <Reveal className="mx-auto mt-12 max-w-3xl">
        <BeforeAfter
          image={images.gallery[2]}
          alt="A patient's smile"
          beforeLabel="Before"
          afterLabel="After whitening"
        />
      </Reveal>

      {/* Transformation grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.slice(0, 3).map((item, i) => (
          <Reveal key={item.treatment} delay={(i % 3) * 0.07}>
            <div
              onClick={() => navigate("gallery")}
              className="group relative block overflow-hidden rounded-2xl border border-ink/8 shadow-soft cursor-pointer bg-sand"
            >
              <img
                src={item.img}
                alt={`${item.treatment} result from Lumina Dental Studio`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-90"
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-white backdrop-blur">
                  {item.category}
                </span>
                <p className="mt-1.5 text-base font-semibold text-white">
                  {item.treatment}
                </p>
                <p className="mt-0.5 text-xs text-white/70">
                  {item.duration} · By {item.dentist}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => navigate("gallery")}
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink shadow-soft hover:bg-cream transition-colors"
        >
          View Full Before & After Gallery ({gallery.length} Cases)
          <ArrowRight className="h-4 w-4 text-brand-700" />
        </button>
      </div>
    </Section>
  );
}

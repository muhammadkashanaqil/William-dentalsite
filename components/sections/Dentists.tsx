"use client";

import { ArrowRight, CalendarCheck } from "lucide-react";
import { dentists } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useNavigation } from "@/context/NavigationContext";

export function Dentists() {
  const { navigate, openBookingModal } = useNavigation();

  return (
    <Section id="team" className="py-20 sm:py-28 overflow-hidden">
      <SectionHeading
        eyebrow="Clinical Leadership"
        title="Specialists Who Genuinely Care"
        subtitle="A multidisciplinary team of board-certified clinicians from Harvard, UCSF, and Penn Dental — dedicated to gentle, aesthetic excellence."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dentists.map((d, i) => (
          <Reveal key={d.name} delay={(i % 3) * 0.08}>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
              <div className="relative overflow-hidden cursor-pointer" onClick={() => navigate("team")}>
                <img
                  src={d.img}
                  alt={`Portrait of ${d.name}, ${d.role} at Lumina Dental Studio`}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {d.name}
                  </h3>
                  <p className="text-xs text-white/80">{d.role}</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                    {d.credentials}
                  </p>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-ink/70">
                    {d.bio}
                  </p>

                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {d.focus.map((f) => (
                      <span
                        key={f}
                        className="rounded-full bg-brand-50 px-2.5 py-1 text-[0.7rem] font-medium text-brand-800"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-ink/5 flex items-center justify-between">
                  <button
                    onClick={() => navigate("team")}
                    className="text-xs font-semibold text-ink/65 hover:text-brand-700 flex items-center gap-1"
                  >
                    Full Bio <ArrowRight className="h-3 w-3" />
                  </button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs py-1.5 px-3"
                    onClick={() => openBookingModal("general", d.id)}
                  >
                    <CalendarCheck className="h-3.5 w-3.5" />
                    Book Slot
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12 text-center">
        <p className="text-xs sm:text-sm text-ink/60">
          Plus a caring, highly trained team of registered dental hygienists and treatment coordinators.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button onClick={() => navigate("team")} variant="outline" size="sm">
            View All Doctor Credentials & Case Studies
          </Button>
          <Button onClick={() => openBookingModal()} variant="primary" size="sm">
            Book Comprehensive Consultation
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}

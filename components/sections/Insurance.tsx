"use client";

import { FileCheck, ShieldCheck, Wallet, ArrowRight } from "lucide-react";
import { insurance } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useNavigation } from "@/context/NavigationContext";

const perks = [
  {
    icon: ShieldCheck,
    title: "In-network with 30+ plans",
    blurb: "Delta Dental, MetLife, Cigna, Guardian, Aetna, BlueCross, and more.",
  },
  {
    icon: FileCheck,
    title: "We file claims on your behalf",
    blurb: "Our coordinators verify benefits in real time and handle all paperwork.",
  },
  {
    icon: Wallet,
    title: "0% APR financing available",
    blurb: "Flexible monthly installments up to 24 months with zero interest.",
  },
];

export function Insurance() {
  const { navigate, openBookingModal } = useNavigation();

  return (
    <Section id="insurance" className="bg-sand/60 py-20 sm:py-28 overflow-hidden">
      <SectionHeading
        eyebrow="Insurance & financing"
        title="Quality Care That Fits Your Budget"
        subtitle="Maximize your dental insurance benefits and eliminate out-of-pocket guesswork. We make paying for your smile simple and transparent."
      />

      <Reveal className="mx-auto mt-10 max-w-4xl">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {insurance.map((name) => (
            <span
              key={name}
              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-ink/75 shadow-soft"
            >
              {name}
            </span>
          ))}
          <button
            onClick={() => navigate("insurance")}
            className="rounded-full border border-dashed border-brand-400 bg-brand-50/50 px-4 py-2 text-xs sm:text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
          >
            + See All In-Network Plans & Membership Club →
          </button>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {perks.map((perk, i) => (
          <Reveal key={perk.title} delay={i * 0.08}>
            <div className="flex h-full flex-col items-start rounded-2xl border border-ink/8 bg-white p-6 shadow-soft hover:shadow-card transition-shadow">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <perk.icon className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                {perk.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/65">
                {perk.blurb}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 text-center">
        <p className="text-xs sm:text-sm text-ink/65">
          Not sure if your insurance is accepted? We'll calculate your exact copay for free.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button onClick={() => navigate("insurance")} variant="outline" size="sm">
            Calculate Monthly Installments
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button onClick={() => openBookingModal()} variant="primary" size="sm">
            Verify Insurance & Book Slot
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}

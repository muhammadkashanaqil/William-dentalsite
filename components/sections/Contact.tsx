"use client";

import { ArrowUpRight, Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { clinic, hours } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const details = [
  {
    icon: MapPin,
    label: "Visit us",
    value: `${clinic.address.line1}, ${clinic.address.city}, ${clinic.address.region} ${clinic.address.postalCode}`,
    href: `https://maps.google.com/?q=${encodeURIComponent(clinic.mapQuery)}`,
  },
  {
    icon: Phone,
    label: "Call us",
    value: clinic.phone,
    href: clinic.phoneHref,
  },
  {
    icon: Mail,
    label: "Email us",
    value: clinic.email,
    href: `mailto:${clinic.email}`,
  },
];

export function Contact() {
  return (
    <Section id="contact" className="bg-sand/60 py-20 sm:py-28 overflow-hidden">
      <SectionHeading
        eyebrow="Visit the studio"
        title="Find us in the heart of the city"
        subtitle="Stop by, call, or message us — whatever's easiest. We can't wait to welcome you."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {/* Details + hours */}
        <Reveal>
          <div className="flex h-full flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-1">
              {details.map((d) => (
                <a
                  key={d.label}
                  href={d.href}
                  target={d.label === "Visit us" ? "_blank" : undefined}
                  rel={d.label === "Visit us" ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-2xl border border-ink/8 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <d.icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                      {d.label}
                    </p>
                    <p className="truncate font-medium text-ink">{d.value}</p>
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-ink/30 transition-colors group-hover:text-brand-600" />
                </a>
              ))}
            </div>

            {/* Hours */}
            <div className="rounded-2xl border border-ink/8 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 text-brand-600" />
                <h3 className="font-display text-lg font-semibold text-ink">
                  Opening hours
                </h3>
              </div>
              <dl className="mt-4 divide-y divide-ink/8">
                {hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <dt className="text-ink/65">{h.day}</dt>
                    <dd className="font-medium text-ink">{h.time}</dd>
                  </div>
                ))}
              </dl>
              <Button
                href={`https://maps.google.com/?q=${encodeURIComponent(clinic.mapQuery)}`}
                variant="outline"
                size="sm"
                className="mt-5 w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="h-4 w-4" />
                Get directions
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Map */}
        <Reveal delay={0.1}>
          <div className="h-full min-h-[360px] overflow-hidden rounded-3xl border border-ink/8 shadow-card">
            <iframe
              title={`Map showing the location of ${clinic.name}`}
              src={clinic.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[360px] w-full"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

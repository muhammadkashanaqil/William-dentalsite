"use client";

import { stats } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

export function TrustBar() {
  return (
    <section className="relative z-10 -mt-px border-y border-ink/5 bg-cream w-full max-w-full overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10 lg:px-12">
        <dl className="grid grid-cols-2 divide-y divide-ink/5 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.06}
              className="flex flex-col items-center px-4 py-7 text-center sm:py-9"
            >
              <dt className="order-2 mt-1.5 text-xs font-medium uppercase tracking-wide text-ink/55 sm:text-sm">
                {s.label}
              </dt>
              <dd className="order-1 font-display text-3xl font-semibold tracking-tight text-brand-700 sm:text-4xl">
                {s.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

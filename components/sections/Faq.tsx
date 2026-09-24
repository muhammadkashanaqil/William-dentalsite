"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, ArrowRight, Search } from "lucide-react";
import { faqs } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { useNavigation } from "@/context/NavigationContext";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Faq() {
  const { navigate } = useNavigation();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" className="py-20 sm:py-28 overflow-hidden">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Left — heading + contact card */}
        <div className="lg:col-span-5">
          <SectionHeading
            align="left"
            eyebrow="Patient Information"
            title="Frequently Asked Questions"
            subtitle="Clear answers on appointments, sedation dentistry, insurance, and treatment timelines. Have a custom question? Our clinical desk responds promptly."
          />
          <Reveal className="mt-8">
            <div className="rounded-3xl border border-brand-200 bg-brand-50/70 p-7">
              <h3 className="font-display text-xl font-semibold text-brand-900">
                Have a Specific Question?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-brand-900/70">
                Search our comprehensive knowledge base or submit a question directly to our clinical coordinators.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button onClick={() => navigate("faq")} variant="primary" size="sm">
                  <Search className="h-3.5 w-3.5" /> Search All FAQs
                </Button>
                <Button onClick={() => navigate("contact")} variant="outline" size="sm">
                  Ask Clinic Directly
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right — accordion */}
        <div className="lg:col-span-7">
          <Reveal>
            <div className="divide-y divide-ink/10 border-y border-ink/10">
              {faqs.slice(0, 5).map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={f.q}>
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      >
                        <span
                          className={cn(
                            "font-semibold text-sm sm:text-base transition-colors",
                            isOpen ? "text-brand-700" : "text-ink",
                          )}
                        >
                          {f.q}
                        </span>
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                            isOpen
                              ? "rotate-45 border-brand-600 bg-brand-600 text-white"
                              : "border-ink/15 text-ink/60",
                          )}
                        >
                          <Plus className="h-4 w-4" strokeWidth={2.5} />
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 pr-8 text-xs sm:text-sm leading-relaxed text-ink/75">
                            {f.a}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => navigate("faq")}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 hover:text-brand-900"
              >
                View all FAQs & submit inquiry <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

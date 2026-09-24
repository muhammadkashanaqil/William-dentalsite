"use client";

import { ArrowRight, CalendarCheck, ShieldCheck, Star } from "lucide-react";
import { clinic, images } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Stars";
import { Reveal } from "@/components/ui/Reveal";
import { useNavigation } from "@/context/NavigationContext";

export function Hero() {
  const { navigate, openBookingModal } = useNavigation();

  return (
    <section
      id="home"
      className="relative isolate bg-brand-900 text-white w-full max-w-full overflow-hidden"
    >
      {/* Background layers */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-br from-brand-800 via-brand-900 to-[#0b2724]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse at 50% 40%, #000 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 40%, #000 40%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-brand-400/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute -right-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-gold/15 blur-[120px]"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pt-28 pb-14 sm:px-6 sm:pt-32 sm:pb-16 md:px-10 lg:grid-cols-12 lg:gap-10 lg:px-8 xl:px-12 lg:pt-32 lg:pb-16 xl:pt-36 xl:pb-20">
        {/* Left — copy */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-300" />
              </span>
              Now welcoming new patients · $89 First Exam & Scan
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-6 font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-balance sm:text-5xl md:text-6xl xl:text-[4.2rem]">
              A calmer, kinder way to{" "}
              <span className="italic text-gold-soft">care for your smile.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 text-pretty sm:text-lg">
              At {clinic.name}, cutting-edge 3D technology meets genuinely gentle care. From routine cleanings and Diamond+ Invisalign to porcelain veneers and computer-guided implants.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Button
                onClick={() => openBookingModal()}
                variant="light"
                size="lg"
              >
                <CalendarCheck className="h-[1.05rem] w-[1.05rem]" />
                Book your visit
              </Button>
              <Button
                onClick={() => navigate("services")}
                variant="glass"
                size="lg"
              >
                Explore services
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex -space-x-3">
                {images.avatars.slice(0, 4).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-10 w-10 rounded-full border-2 border-brand-900 object-cover"
                  />
                ))}
              </div>
              <div>
                <Stars rating={5} size={15} />
                <p className="mt-0.5 text-sm text-white/70">
                  <span className="font-semibold text-white">4.9/5</span> from 2,124+ verified patients
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right — image + glass cards */}
        <Reveal delay={0.15} className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end w-full">
          <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-[440px] xl:max-w-[480px]">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 shadow-lift">
              <img
                src={images.heroWarm}
                alt="A Lumina Dental clinician warmly welcoming a patient in a modern, bright treatment room"
                className="aspect-[4/5] w-full object-cover object-[center_15%]"
                loading="eager"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-brand-950/50 via-transparent to-transparent pointer-events-none"
              />
            </div>

            {/* Floating Card 1: Top-Left status badge (Contained cleanly inside photo) */}
            <div className="liquid-glass absolute top-3 left-3 sm:top-5 sm:left-5 z-10 rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-white shadow-card transition-transform hover:scale-105">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-emerald-400/25 text-emerald-300 shrink-0">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <div className="leading-tight">
                  <p className="text-xs sm:text-sm font-semibold">Open Today</p>
                  <p className="text-[0.68rem] sm:text-xs text-white/75">8am – 6pm · Bayview SF</p>
                </div>
              </div>
            </div>

            {/* Floating Card 2: Bottom-Right rating badge (Contained cleanly inside photo) */}
            <div className="liquid-glass animate-float absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-10 rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-white shadow-card transition-transform hover:scale-105">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gold/30 text-gold-soft shrink-0">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                </span>
                <div className="leading-tight">
                  <p className="text-xs sm:text-sm font-semibold">Top 1% Rated</p>
                  <p className="text-[0.68rem] sm:text-xs text-white/75">in San Francisco</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

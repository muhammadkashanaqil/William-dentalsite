import Link from "next/link";
import { ArrowRight, Star, Shield, Clock, CalendarCheck } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 lg:pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              Clinical Precision Meets <span className="text-cyan-600">Luxury Care</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10">
              Experience the future of dentistry with AI-assisted care and state-of-the-art treatments designed for your absolute comfort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/appointments/request"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-orange-600 transition-all"
              >
                Book Appointment
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-slate-800 transition-all"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
        {/* Background Decorative Blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-100/50 rounded-full blur-3xl -z-10 opacity-70"></div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Premium Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Comprehensive dental care tailored to your unique needs using the latest technology.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              title="Professional Whitening"
              description="Brighten your smile in just one visit with our advanced laser whitening technology."
              href="/services/whitening"
              icon={<Star className="h-6 w-6" />}
            />
            <ServiceCard
              title="Comprehensive Cleaning"
              description="Maintain optimal oral health with our thorough cleaning and examination."
              href="/services/cleaning"
              icon={<Shield className="h-6 w-6" />}
            />
            <ServiceCard
              title="Dental Implants"
              description="Permanent, natural-looking solutions for missing teeth with state-of-the-art procedures."
              href="/services/implants"
              icon={<CalendarCheck className="h-6 w-6" />}
            />
          </div>
          <div className="mt-12 text-center">
            <Link href="/services" className="inline-flex items-center font-semibold text-cyan-600 hover:text-cyan-700">
              View all services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Doctor & Trust Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-slate-200">
                {/* Placeholder for Doctor Image */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
                  [Doctor Portrait]
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 glass p-6 rounded-2xl max-w-xs">
                <p className="font-serif text-lg font-bold text-slate-900">Dr. William</p>
                <p className="text-sm text-slate-600 mt-1">Over 15 years of excellence in cosmetic and restorative dentistry.</p>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Redefining the Dental Experience
              </h2>
              <div className="space-y-6 text-slate-600">
                <p>
                  At William Dentist, we believe that a visit to the dentist should be something you look forward to. We've combined the relaxing atmosphere of a luxury spa with the precision of advanced medical technology.
                </p>
                <ul className="space-y-4 mt-8">
                  <li className="flex gap-4">
                    <div className="mt-1 shrink-0 h-10 w-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Advanced Technology</h3>
                      <p className="text-sm mt-1">3D imaging and AI-assisted diagnostics for precise treatment.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="mt-1 shrink-0 h-10 w-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Zero Wait Times</h3>
                      <p className="text-sm mt-1">Your appointment starts exactly when scheduled.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance & CTA */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold mb-6">Accepted Insurance</h2>
          <p className="text-slate-300 mb-10">
            We work with most major PPO insurance plans. Our team will handle the paperwork to maximize your benefits.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12 opacity-70">
            {/* Logos placeholder */}
            <span className="px-4 py-2 border border-white/20 rounded-md">Delta Dental</span>
            <span className="px-4 py-2 border border-white/20 rounded-md">Cigna</span>
            <span className="px-4 py-2 border border-white/20 rounded-md">MetLife</span>
            <span className="px-4 py-2 border border-white/20 rounded-md">Aetna</span>
          </div>
          <Link
            href="/appointments/request"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-8 py-3.5 text-base font-semibold text-white hover:bg-orange-600 transition-all"
          >
            Schedule Your Visit
          </Link>
        </div>
      </section>
    </div>
  );
}

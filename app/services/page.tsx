import { getServices } from "@/lib/data";
import { ServiceCard } from "@/components/ServiceCard";
import { Sparkles, ShieldCheck, Stethoscope, Syringe } from "lucide-react";
import Link from "next/link";

// Helper to map icons based on slug
const getIcon = (slug: string) => {
  switch (slug) {
    case "whitening":
      return <Sparkles className="h-6 w-6" />;
    case "cleaning":
      return <ShieldCheck className="h-6 w-6" />;
    case "implants":
      return <Stethoscope className="h-6 w-6" />;
    case "invisalign":
      return <Syringe className="h-6 w-6" />;
    default:
      return <Stethoscope className="h-6 w-6" />;
  }
};

export const metadata = {
  title: "Dental Services | William Dentist",
  description: "Explore our comprehensive list of premium dental services.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="py-24 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Our <span className="text-cyan-600">Services</span>
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            From routine checkups to full mouth restorations, we utilize advanced technology and compassionate care to keep your smile healthy and beautiful.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.name}
              description={service.summary}
              href={`/services/${service.slug}`}
              icon={getIcon(service.slug)}
            />
          ))}
        </div>

        <div className="mt-20 text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">Not sure what you need?</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Book a comprehensive consultation. Our team will evaluate your oral health and provide a personalized treatment plan.
          </p>
          <Link
            href="/appointments/request"
            className="inline-flex items-center justify-center rounded-md bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
          >
            Request Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}

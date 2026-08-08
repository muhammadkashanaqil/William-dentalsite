import { getServiceBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Calendar, ChevronLeft } from "lucide-react";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-700 mb-8"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to all services
        </Link>

        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 mb-12">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            {service.name}
          </h1>
          <p className="text-xl text-slate-600 mb-8 font-medium">
            {service.summary}
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-700">
              <Clock className="h-4 w-4 text-cyan-600" />
              Approx. {service.duration_minutes} minutes
            </div>
            {service.price_text && (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-700">
                <span className="text-cyan-600 font-bold">$</span>
                {service.price_text}
              </div>
            )}
          </div>

          <div className="prose prose-slate max-w-none mb-10">
            <p className="text-slate-700 leading-relaxed text-lg">
              {service.content}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-200 pt-8">
            <Link
              href={`/appointments/request?service=${service.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-orange-600 transition-all"
            >
              <Calendar className="h-5 w-5" />
              Request this service
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-slate-800 transition-all"
            >
              Ask a question
            </Link>
          </div>
        </div>

        <div className="text-sm text-slate-500 bg-slate-50 p-6 rounded-xl">
          <strong>Disclaimer:</strong> The information provided on this page is for educational purposes only and does not constitute medical advice. A comprehensive examination by our clinical staff is required to determine the appropriate treatment for your specific needs.
        </div>
      </div>
    </div>
  );
}

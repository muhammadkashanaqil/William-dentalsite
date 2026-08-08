import { getFaqs } from "@/lib/data";
import { FAQAccordion } from "@/components/FAQAccordion";
import Link from "next/link";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Frequently Asked Questions | William Dentist",
  description: "Find answers to common questions about our dental services, billing, and appointments.",
};

export default async function FAQPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const faqs = await getFaqs(category, q);

  // Group by category for better display if no search is active
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const cat = faq.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  async function searchAction(formData: FormData) {
    "use server";
    const query = formData.get("q");
    if (query) {
      redirect(`/faq?q=${encodeURIComponent(query.toString())}`);
    } else {
      redirect(`/faq`);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            How can we <span className="text-cyan-600">help?</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Browse our knowledge base or search for specific questions about treatments, insurance, and clinic policies.
          </p>
          
          <form action={searchAction} className="relative max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search questions..."
                className="w-full rounded-full border-0 py-4 pl-12 pr-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 shadow-sm sm:text-sm sm:leading-6"
              />
              <button 
                type="submit" 
                className="absolute right-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Search
              </button>
            </div>
          </form>
          
          {(q || category) && (
            <div className="mt-4 flex justify-center">
              <Link href="/faq" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                Clear filters
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-12">
          {Object.entries(groupedFaqs).map(([cat, catFaqs]) => (
            <div key={cat}>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">{cat}</h2>
              <FAQAccordion faqs={catFaqs as any} />
            </div>
          ))}
          
          {Object.keys(groupedFaqs).length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200">
              No questions found for your search.
            </div>
          )}
        </div>

        <div className="mt-20 bg-cyan-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">Still have questions?</h2>
            <p className="text-cyan-100 mb-8 max-w-xl mx-auto">
              Our team is ready to help you with any specific inquiries about your dental health or our services.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-sm hover:bg-slate-50 transition-colors"
              >
                Contact Clinic
              </Link>
              <button
                className="inline-flex items-center justify-center rounded-md border border-cyan-400/30 bg-cyan-800/50 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-cyan-800 transition-colors"
              >
                Ask AI Assistant
              </button>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl z-0"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-700/40 rounded-full blur-3xl z-0"></div>
        </div>
      </div>
    </div>
  );
}

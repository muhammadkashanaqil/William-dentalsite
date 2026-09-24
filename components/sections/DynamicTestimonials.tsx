"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Star, Plus, CheckCircle2, Sparkles, Filter, X, Loader2 } from "lucide-react";
import { testimonials as initialTestimonials, services } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import { Button } from "@/components/ui/Button";
import { useNavigation } from "@/context/NavigationContext";

export interface ReviewItem {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  service: string;
  rating: number;
  quote: string;
  date: string;
  verified: boolean;
  featured?: boolean;
}

export function DynamicTestimonials({ isStandalonePage = false }: { isStandalonePage?: boolean }) {
  const { navigate } = useNavigation();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for submitting review
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [service, setService] = useState("Cosmetic Dentistry");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
          return;
        }
      }
      // Fallback to initial if empty
      setReviews(
        initialTestimonials.map((t, idx) => ({
          id: `INIT-${idx}`,
          name: t.name,
          avatar: t.avatar,
          role: t.role,
          service: t.service || "General Care",
          rating: t.rating,
          quote: t.quote,
          date: "Verified Patient",
          verified: true,
          featured: true,
        }))
      );
    } catch (err) {
      console.warn("Could not fetch reviews from API, using fallback data", err);
      setReviews(
        initialTestimonials.map((t, idx) => ({
          id: `INIT-${idx}`,
          name: t.name,
          avatar: t.avatar,
          role: t.role,
          service: t.service || "General Care",
          rating: t.rating,
          quote: t.quote,
          date: "Verified Patient",
          verified: true,
          featured: true,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) {
      setErrorMsg("Please provide your name and your review feedback.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || `${service} Patient`,
          service,
          rating,
          quote: quote.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmitSuccess(true);
        if (data.review) {
          setReviews((prev) => [data.review, ...prev]);
        }
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
          setName("");
          setRole("");
          setQuote("");
          setRating(5);
        }, 1800);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Failed to submit review. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Connection issue. Please verify backend connectivity.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (selectedService === "all") return true;
    return r.service.toLowerCase().includes(selectedService.toLowerCase());
  });

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "4.9";

  const categories = [
    { id: "all", label: "All Reviews" },
    { id: "cosmetic", label: "Cosmetic & Veneers" },
    { id: "invisalign", label: "Invisalign" },
    { id: "implants", label: "Dental Implants" },
    { id: "whitening", label: "Whitening" },
    { id: "general", label: "Family & Cleanings" },
    { id: "emergency", label: "Emergency Care" },
  ];

  return (
    <Section id="testimonials" className={`overflow-hidden ${isStandalonePage ? "py-12 sm:py-16" : "py-20 sm:py-28"}`}>
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <SectionHeading
            align="left"
            eyebrow="Real Patient Experiences"
            title="Trusted by over 25,000 radiant smiles"
            subtitle="Authentic, live reviews from our patients across cosmetic, restorative, and routine wellness visits."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-800 hover:shadow-card"
          >
            <Plus className="h-4 w-4" />
            Share Your Story
          </button>
          {!isStandalonePage && (
            <Button
              onClick={() => navigate("reviews")}
              variant="outline"
              size="sm"
            >
              View All Reviews
            </Button>
          )}
        </div>
      </div>

      {/* Trust & Aggregate Rating Banner */}
      <Reveal className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-ink/8 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 font-display text-2xl font-bold">
              {avgRating}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Stars rating={5} size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  100% Verified
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-ink">
                Based on {reviews.length > 0 ? reviews.length : 2124} real patient submissions
              </p>
            </div>
          </div>

          {/* Quick filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-ink/50 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Filter:
            </span>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedService(cat.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedService === cat.id
                    ? "bg-brand-700 text-white shadow-sm"
                    : "bg-cream text-ink/70 hover:bg-sand/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Reviews Grid */}
      {loading ? (
        <div className="mt-12 flex flex-col items-center justify-center py-12 text-ink/50">
          <Loader2 className="h-8 w-8 animate-spin text-brand-700 mb-2" />
          <p className="text-xs font-semibold">Loading verified reviews...</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.slice(0, isStandalonePage ? 50 : 6).map((t, i) => (
            <Reveal key={t.id || i} delay={(i % 3) * 0.06}>
              <figure className="flex h-full flex-col justify-between rounded-3xl border border-ink/8 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <div>
                  <div className="flex items-center justify-between">
                    <Stars rating={t.rating} size={15} />
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[0.7rem] font-semibold text-brand-700">
                      {t.service}
                    </span>
                  </div>
                  <blockquote className="mt-4 text-[0.92rem] leading-relaxed text-ink/80">
                    "{t.quote}"
                  </blockquote>
                </div>

                <figcaption className="mt-6 flex items-center justify-between border-t border-ink/5 pt-4">
                  <div className="flex items-center gap-3">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        loading="lazy"
                        className="h-10 w-10 rounded-full object-cover border border-ink/10"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-800 font-bold text-sm">
                        {t.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-ink flex items-center gap-1.5">
                        {t.name}
                        {t.verified && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 inline" />
                        )}
                      </p>
                      <p className="text-xs text-ink/50">{t.role}</p>
                    </div>
                  </div>
                  <span className="text-[0.7rem] text-ink/40">{t.date}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-lift border border-ink/10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-1 text-ink/50 hover:bg-cream hover:text-ink transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {submitSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-ink">Thank You for Your Feedback!</h3>
                <p className="mt-2 text-sm text-ink/70">
                  Your review has been permanently saved to our clinic database and published. We appreciate your trust in Lumina Dental Studio.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2.5 text-brand-700 mb-1">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Patient Story</span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-ink">Share Your Smile Journey</h3>
                <p className="mt-1 text-xs text-ink/60">
                  Your feedback helps us continuously improve and guides new patients seeking compassionate care.
                </p>

                {errorMsg && (
                  <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmitReview} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jessica Miller"
                      className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">Treatment Received</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">Star Rating</label>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 text-gold hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`h-5 w-5 ${star <= rating ? "fill-gold text-gold" : "text-ink/20"}`}
                            />
                          </button>
                        ))}
                        <span className="ml-1 text-xs font-bold text-ink">{rating}/5</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Patient Tagline / Headline (Optional)</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Veneers Patient or Anxious Patient Turned Fan"
                      className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Your Review & Experience *</label>
                    <textarea
                      required
                      rows={3}
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      placeholder="Describe your appointment, the comfort of the clinic, doctor's bedside manner, and your smile results..."
                      className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-full px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-cream"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-brand-700 px-6 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-brand-800 disabled:opacity-50 transition-all"
                    >
                      {submitting ? "Saving to Database..." : "Post Review"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </Section>
  );
}

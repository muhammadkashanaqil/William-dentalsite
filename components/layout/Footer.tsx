"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Clock, Mail, MapPin, Phone, Shield } from "lucide-react";
import { clinic } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/utils/cn";
import { useNavigation } from "@/context/NavigationContext";

export function Footer() {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const columns = [
    {
      title: "Services & Care",
      links: [
        { label: "Cosmetic & Veneers", route: "services/cosmetic" },
        { label: "Invisalign Clear Aligners", route: "services/invisalign" },
        { label: "Guided Dental Implants", route: "services/implants" },
        { label: "Laser Teeth Whitening", route: "services/whitening" },
        { label: "Pediatric Dentistry", route: "services/pediatric" },
        { label: "24/7 Emergency Care", route: "emergency" },
      ],
    },
    {
      title: "Clinic & Story",
      links: [
        { label: "About Lumina Studio", route: "about" },
        { label: "Meet the Specialists", route: "team" },
        { label: "Smile Gallery & Results", route: "gallery" },
        { label: "Patient Reviews & Stories", route: "reviews" },
        { label: "Why Choose Us", route: "about" },
      ],
    },
    {
      title: "Patient Resources",
      links: [
        { label: "Patient Health Portal", route: "portal" },
        { label: "Book Appointment", route: "book" },
        { label: "Insurance & 0% Financing", route: "insurance" },
        { label: "Frequently Asked Questions", route: "faq" },
        { label: "Office Directions & Parking", route: "contact" },
        { label: "Staff Admin Portal", route: "admin" },
      ],
    },
  ];

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setStatus("error");
      return;
    }

    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email: email.trim(),
          subject: "Newsletter Subscription",
          message: "User subscribed to newsletter via footer.",
        }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <footer className="relative overflow-hidden bg-ink text-white/70">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:px-10 md:py-20 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4">
            <button onClick={() => navigate("home")} className="text-left">
              <Logo tone="light" />
            </button>
            <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-white/60">
              {clinic.name} is a modern dental studio in {clinic.address.city},{" "}
              {clinic.address.region} — blending gentle, biomimetic care
              with advanced 3D digital precision.
            </p>

            <form onSubmit={submit} className="mt-7 max-w-sm" noValidate>
              <label
                htmlFor="newsletter"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50"
              >
                Smile Newsletter & Special Offers
              </label>
              <div className="mt-2.5 flex gap-2">
                <input
                  id="newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder="you@email.com"
                  aria-invalid={status === "error"}
                  className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:border-brand-400 focus:bg-white/10 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-400"
                >
                  Join
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <p
                aria-live="polite"
                className={cn(
                  "mt-2 min-h-[1.1rem] text-xs",
                  status === "success" && "text-brand-300",
                  status === "error" && "text-rose-300",
                  status === "idle" && "text-white/40",
                )}
              >
                {status === "success"
                  ? "You're on the VIP list — welcome to Lumina! 🦷"
                  : status === "error"
                    ? "Please enter a valid email address."
                    : "Oral-care tips & private offers. Unsubscribe anytime."}
              </p>
            </form>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <button
                        onClick={() => navigate(l.route)}
                        className="text-left text-xs sm:text-sm text-white/65 transition-colors hover:text-white"
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 sm:col-span-3 border-t border-white/10 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                Visit the Studio in San Francisco
              </h3>
              <ul className="mt-4 grid gap-3 text-xs sm:text-sm text-white/65 sm:grid-cols-2 lg:grid-cols-4">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                  <span>
                    {clinic.address.line1}<br />
                    {clinic.address.city}, {clinic.address.region} {clinic.address.postalCode}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-brand-300" />
                  <a href={clinic.phoneHref} className="hover:text-white font-semibold">
                    {clinic.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-brand-300" />
                  <a href={`mailto:${clinic.email}`} className="hover:text-white">
                    {clinic.email}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                  <span>
                    Mon–Fri 8am–6pm<br />
                    Sat 9am–3pm · 24/7 Urgent
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {clinic.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/50">
            <button onClick={() => navigate("admin")} className="hover:text-brand-300 flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> Staff Portal
            </button>
            <span>·</span>
            <span>Crafted for San Francisco, CA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

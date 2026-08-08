"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      source: "contact_form",
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      serviceId: formData.get("serviceId") || null,
      message: formData.get("message"),
      preferredContact: formData.get("preferredContact"),
      consent: formData.get("consent") === "on",
      pageUrl: window.location.href,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit form");
      }

      setIsSuccess(true);
      setReference(json.data?.reference);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 mb-4">
          <Send className="h-6 w-6 text-cyan-600" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
        <p className="text-slate-600 mb-4">
          Thank you for reaching out. A member of our team will get back to you shortly.
        </p>
        {reference && (
          <div className="bg-white rounded-lg p-3 inline-block border border-cyan-200">
            <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Reference Number</span>
            <span className="font-mono font-semibold text-slate-800">{reference}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold leading-6 text-slate-900">Full Name *</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="block w-full rounded-md border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 bg-slate-50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="preferredContact" className="block text-sm font-semibold leading-6 text-slate-900">Preferred Contact Method</label>
          <select
            id="preferredContact"
            name="preferredContact"
            className="block w-full rounded-md border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 bg-slate-50"
          >
            <option value="phone">Phone Call</option>
            <option value="email">Email</option>
            <option value="sms">Text Message</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold leading-6 text-slate-900">Email Address *</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="block w-full rounded-md border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 bg-slate-50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-semibold leading-6 text-slate-900">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            required
            className="block w-full rounded-md border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 bg-slate-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="serviceId" className="block text-sm font-semibold leading-6 text-slate-900">Topic or Service</label>
        <select
          id="serviceId"
          name="serviceId"
          className="block w-full rounded-md border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 bg-slate-50"
        >
          <option value="">General Inquiry</option>
          <option value="whitening">Professional Whitening</option>
          <option value="cleaning">Comprehensive Cleaning</option>
          <option value="implants">Dental Implants</option>
          <option value="invisalign">Invisalign</option>
          <option value="billing">Billing & Insurance</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-slate-900">Message</label>
        <textarea
          name="message"
          id="message"
          rows={4}
          className="block w-full rounded-md border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 bg-slate-50"
          placeholder="How can we help you today?"
        />
        <p className="text-xs text-slate-500">Please do not include detailed medical information or sensitive health data in this form.</p>
      </div>

      <div className="flex gap-3">
        <div className="flex h-6 items-center">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600"
          />
        </div>
        <label htmlFor="consent" className="text-sm leading-6 text-slate-600">
          I consent to being contacted by William Dentist regarding this inquiry.
        </label>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center items-center gap-2 rounded-md bg-slate-900 px-3 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}

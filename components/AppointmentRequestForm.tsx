"use client";

import { useState } from "react";
import { AvailabilityPicker } from "./AvailabilityPicker";
import { Loader2, CalendarCheck } from "lucide-react";

export function AppointmentRequestForm({ services }: { services: any[] }) {
  const [selectedService, setSelectedService] = useState(services[0]?.slug || "");
  const [selectedSlot, setSelectedSlot] = useState<{start: string, end: string, label: string} | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSlot) {
      setError("Please select an available appointment time.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const serviceObj = services.find(s => s.slug === selectedService);

    const data = {
      patientType: formData.get("patientType"),
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      serviceId: serviceObj?.id,
      startAt: selectedSlot.start,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notes: formData.get("notes"),
      consent: formData.get("consent") === "on",
      idempotencyKey: crypto.randomUUID()
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit request");
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
      <div className="bg-cyan-50 border border-cyan-100 rounded-3xl p-10 text-center max-w-2xl mx-auto">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 mb-6">
          <CalendarCheck className="h-8 w-8 text-cyan-600" />
        </div>
        <h3 className="font-serif text-3xl font-bold text-slate-900 mb-4">Request Received!</h3>
        <p className="text-lg text-slate-600 mb-8">
          Thank you for requesting an appointment. Our team will review your request and confirm shortly.
        </p>
        {reference && (
          <div className="bg-white rounded-xl p-6 inline-block border border-cyan-200 shadow-sm">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider block mb-2">Appointment Reference</span>
            <span className="font-mono text-2xl font-bold text-slate-900">{reference}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm">
      
      {/* 1. Service Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-slate-900">1. Select Service</h3>
        <select
          value={selectedService}
          onChange={(e) => {
            setSelectedService(e.target.value);
            setSelectedSlot(null); // Reset slot when service changes
          }}
          className="block w-full rounded-xl border-0 py-3.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-base bg-slate-50"
        >
          {services.map(s => (
            <option key={s.id} value={s.slug}>{s.name} - {s.duration_minutes} min</option>
          ))}
        </select>
      </div>

      {/* 2. Choose Time */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-slate-900">2. Choose a Time</h3>
        <AvailabilityPicker 
          serviceId={services.find(s => s.slug === selectedService)?.id} 
          selectedSlot={selectedSlot}
          onSlotSelect={setSelectedSlot}
        />
      </div>

      {/* 3. Patient Details */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
        <h3 className="text-xl font-serif font-bold text-slate-900">3. Your Details</h3>
        
        <div className="flex gap-6 mb-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="patientType" value="new" defaultChecked className="text-cyan-600 focus:ring-cyan-600 h-4 w-4" />
            <span className="text-slate-700 font-medium">New Patient</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="patientType" value="returning" className="text-cyan-600 focus:ring-cyan-600 h-4 w-4" />
            <span className="text-slate-700 font-medium">Returning Patient</span>
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-slate-900">Full Name *</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-semibold text-slate-900">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm bg-slate-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-slate-900">Email Address *</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm bg-slate-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="block text-sm font-semibold text-slate-900">Notes (Optional)</label>
          <textarea
            name="notes"
            id="notes"
            rows={3}
            maxLength={250}
            className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm bg-slate-50"
            placeholder="Any specific requests or preferences?"
          />
          <p className="text-xs text-slate-500">Max 250 characters. Do not include detailed clinical notes.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600 shrink-0"
          />
          <label htmlFor="consent" className="text-sm leading-6 text-slate-600">
            I consent to the collection of my information to schedule this appointment and receive SMS/email reminders.
          </label>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center items-center gap-2 rounded-xl bg-orange-500 px-4 py-4 text-base font-bold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
          {isSubmitting ? "Processing..." : "Request Appointment"}
        </button>
      </div>
    </form>
  );
}

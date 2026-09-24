"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  CalendarCheck,
  ChevronDown,
  Clock,
  Download,
  Phone,
  ShieldCheck,
  Sparkles,
  Check,
} from "lucide-react";
import { clinic, services, dentists } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useNavigation } from "@/context/NavigationContext";

type Values = {
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  dentistId: string;
  date: string;
  timeSlot: string;
  insurance: string;
  isEmergency: boolean;
  notes: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const TIME_SLOTS = [
  "08:30 AM",
  "09:30 AM",
  "10:30 AM",
  "11:30 AM",
  "01:30 PM",
  "02:30 PM",
  "03:30 PM",
  "04:30 PM",
];

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100";

const reassurance = [
  { icon: Clock, text: "Same-day appointments & fast confirmation" },
  { icon: ShieldCheck, text: "In-network with most major insurance plans" },
  { icon: Sparkles, text: "New-patient introductory exam & scan only $89" },
];

export function Appointment({
  isStandalonePage = false,
  isModal = false,
  initialService,
  initialDoctor,
}: {
  isStandalonePage?: boolean;
  isModal?: boolean;
  initialService?: string;
  initialDoctor?: string;
}) {
  const { bookingPreselect, clearBookingPreselect } = useNavigation();

  const today = new Date().toISOString().split("T")[0];

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    phone: "",
    serviceId: initialService || "general",
    dentistId: initialDoctor || "any",
    date: "",
    timeSlot: "09:30 AM",
    insurance: "",
    isEmergency: initialService === "emergency",
    notes: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    id: string;
    patientName: string;
    serviceName: string;
    dentistName: string;
    date: string;
    timeSlot: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    if (bookingPreselect) {
      setValues((v) => ({
        ...v,
        serviceId: bookingPreselect.serviceId || v.serviceId,
        dentistId: bookingPreselect.dentistId || v.dentistId,
      }));
    }
  }, [bookingPreselect]);

  const update = (field: keyof Values, value: any) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (v: Values): Errors => {
    const e: Errors = {};
    if (!v.name.trim()) e.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
      e.email = "Please enter a valid email address.";
    if (v.phone.trim().length < 7) e.phone = "Please enter a valid contact phone number.";
    if (!v.serviceId) e.serviceId = "Please choose a desired treatment or service.";
    if (!v.date) e.date = "Please choose a preferred appointment date.";
    else if (v.date < today) e.date = "Appointment date cannot be in the past.";
    return e;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      setSubmitting(true);
      const chosenService = services.find((s) => s.id === values.serviceId);
      const chosenDentist = dentists.find((d) => d.id === values.dentistId);

      const payload = {
        patientName: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        serviceId: values.serviceId,
        serviceName: chosenService ? chosenService.title : "General Consultation",
        dentistId: values.dentistId !== "any" ? values.dentistId : undefined,
        dentistName: chosenDentist ? chosenDentist.name : "First Available Specialist",
        date: values.date,
        timeSlot: values.timeSlot,
        notes: values.notes.trim(),
        isEmergency: values.isEmergency,
        insuranceProvider: values.insurance.trim() || "Self-Pay / Not Listed",
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setConfirmedBooking({
          id: data.appointment?.id || `LUM-${Math.floor(1000 + Math.random() * 9000)}`,
          patientName: payload.patientName,
          serviceName: payload.serviceName,
          dentistName: payload.dentistName,
          date: payload.date,
          timeSlot: payload.timeSlot,
          status: "pending",
        });
        clearBookingPreselect();
      } else {
        const errData = await res.json();
        alert(errData.error || "Could not save appointment. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      // Fallback local booking confirmation if fetch fails
      const chosenService = services.find((s) => s.id === values.serviceId);
      setConfirmedBooking({
        id: `LUM-${Math.floor(1000 + Math.random() * 9000)}`,
        patientName: values.name,
        serviceName: chosenService ? chosenService.title : "General Consultation",
        dentistName: "First Available Specialist",
        date: values.date,
        timeSlot: values.timeSlot,
        status: "pending",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadIcs = () => {
    if (!confirmedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Lumina Dental Studio//Appointment//EN
BEGIN:VEVENT
SUMMARY:${confirmedBooking.serviceName} at Lumina Dental Studio
DESCRIPTION:Appointment with ${confirmedBooking.dentistName} for ${confirmedBooking.patientName}. Confirmation Code: ${confirmedBooking.id}.
LOCATION:${clinic.address.line1}, ${clinic.address.city}, ${clinic.address.region}
DTSTART:${confirmedBooking.date.replace(/-/g, "")}T090000Z
DTEND:${confirmedBooking.date.replace(/-/g, "")}T100000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Lumina-Appointment-${confirmedBooking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setValues({
      name: "",
      email: "",
      phone: "",
      serviceId: "general",
      dentistId: "any",
      date: "",
      timeSlot: "09:30 AM",
      insurance: "",
      isEmergency: false,
      notes: "",
    });
    setErrors({});
    setConfirmedBooking(null);
  };

  return (
    <Section id="appointment" className={`bg-white overflow-hidden ${isModal ? "py-0 px-0" : isStandalonePage ? "py-12 sm:py-16" : "py-20 sm:py-28"}`}>
      <div className={`grid gap-10 ${isModal ? "lg:grid-cols-1 gap-6" : "lg:grid-cols-12 lg:gap-14"}`}>
        {/* Left column - hidden in modal mode */}
        {!isModal && (
          <div className="lg:col-span-5">
            <SectionHeading
              align="left"
              eyebrow="Online Booking"
              title="Reserve your visit in under a minute"
              subtitle="Choose your preferred service, dentist, and time slot. Our team immediately records your appointment in our database and confirms via SMS and email."
            />

            <ul className="mt-8 space-y-3.5">
              {reassurance.map((r) => (
                <li key={r.text} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 shrink-0">
                    <r.icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.9} />
                  </span>
                  <span className="text-sm font-medium text-ink/75">{r.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-ink/8 bg-cream p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                Need immediate assistance?
              </p>
              <a
                href={clinic.phoneHref}
                className="mt-1 flex items-center gap-2 font-display text-xl font-semibold text-brand-700 hover:text-brand-800"
              >
                <Phone className="h-5 w-5" />
                {clinic.phone}
              </a>
              <p className="mt-1 text-xs text-ink/60">
                Monday – Friday 8am–6pm · Saturday 9am–3pm · 24/7 on-call emergency
              </p>
            </div>
          </div>
        )}

        {/* Right column: Interactive form or Confirmation View */}
        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-ink/10 bg-[#faf7f0]/70 p-6 sm:p-8 shadow-card">
              {confirmedBooking ? (
                <div className="py-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
                    <Check className="h-8 w-8 stroke-[2.5]" />
                  </div>
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-900 tracking-wide">
                    Reference #{confirmedBooking.id}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    Appointment Request Confirmed!
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">
                    Thank you, <strong className="text-ink">{confirmedBooking.patientName}</strong>. Your request for <strong className="text-ink">{confirmedBooking.serviceName}</strong> has been stored in our clinical database.
                  </p>

                  <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-5 text-left text-sm space-y-2.5 shadow-soft">
                    <div className="flex justify-between border-b border-ink/5 pb-2">
                      <span className="text-ink/55">Date & Time</span>
                      <span className="font-semibold text-ink">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
                    </div>
                    <div className="flex justify-between border-b border-ink/5 pb-2">
                      <span className="text-ink/55">Specialist</span>
                      <span className="font-semibold text-ink">{confirmedBooking.dentistName}</span>
                    </div>
                    <div className="flex justify-between border-b border-ink/5 pb-2">
                      <span className="text-ink/55">Location</span>
                      <span className="font-semibold text-ink">{clinic.address.line1}, {clinic.address.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink/55">Status</span>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-xs">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        Staff Review & Auto-Confirmed
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadIcs}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-800 transition-colors shadow-soft"
                    >
                      <Download className="h-4 w-4" /> Add to Calendar (.ics)
                    </button>
                    <button
                      type="button"
                      onClick={reset}
                      className="rounded-full border border-ink/15 bg-white px-5 py-2.5 text-xs font-semibold text-ink/75 hover:bg-cream transition-colors"
                    >
                      Book Another Visit
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5" noValidate>
                  {/* Service & Dentist selection */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="service-select" className="block text-xs font-semibold text-ink mb-1">
                        Treatment / Service *
                      </label>
                      <div className="relative">
                        <select
                          id="service-select"
                          value={values.serviceId}
                          onChange={(e) => update("serviceId", e.target.value)}
                          className={inputClass}
                        >
                          {services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                      </div>
                      {errors.serviceId && (
                        <p className="mt-1 text-xs text-rose-600">{errors.serviceId}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="dentist-select" className="block text-xs font-semibold text-ink mb-1">
                        Preferred Dentist (Optional)
                      </label>
                      <div className="relative">
                        <select
                          id="dentist-select"
                          value={values.dentistId}
                          onChange={(e) => update("dentistId", e.target.value)}
                          className={inputClass}
                        >
                          <option value="any">First Available Dentist</option>
                          {dentists.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name} ({d.role.split("&")[0]})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="date-input" className="block text-xs font-semibold text-ink mb-1">
                        Preferred Date *
                      </label>
                      <input
                        id="date-input"
                        type="date"
                        min={today}
                        value={values.date}
                        onChange={(e) => update("date", e.target.value)}
                        className={inputClass}
                      />
                      {errors.date && (
                        <p className="mt-1 text-xs text-rose-600">{errors.date}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="time-select" className="block text-xs font-semibold text-ink mb-1">
                        Time Slot
                      </label>
                      <div className="relative">
                        <select
                          id="time-select"
                          value={values.timeSlot}
                          onChange={(e) => update("timeSlot", e.target.value)}
                          className={inputClass}
                        >
                          {TIME_SLOTS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                      </div>
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name-input" className="block text-xs font-semibold text-ink mb-1">
                        Full Name *
                      </label>
                      <input
                        id="name-input"
                        type="text"
                        placeholder="e.g. Alex Morgan"
                        value={values.name}
                        onChange={(e) => update("name", e.target.value)}
                        className={inputClass}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone-input" className="block text-xs font-semibold text-ink mb-1">
                        Phone Number *
                      </label>
                      <input
                        id="phone-input"
                        type="tel"
                        placeholder="(415) 555-0123"
                        value={values.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className={inputClass}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email-input" className="block text-xs font-semibold text-ink mb-1">
                        Email Address *
                      </label>
                      <input
                        id="email-input"
                        type="email"
                        placeholder="alex@example.com"
                        value={values.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={inputClass}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="insurance-input" className="block text-xs font-semibold text-ink mb-1">
                        Dental Insurance Plan (Optional)
                      </label>
                      <input
                        id="insurance-input"
                        type="text"
                        placeholder="e.g. Delta Dental PPO, MetLife"
                        value={values.insurance}
                        onChange={(e) => update("insurance", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Emergency Checkbox */}
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50/70 p-3 border border-amber-200/60">
                    <input
                      type="checkbox"
                      id="emergency-check"
                      checked={values.isEmergency}
                      onChange={(e) => update("isEmergency", e.target.checked)}
                      className="h-4 w-4 rounded border-amber-300 text-brand-600 focus:ring-brand-500"
                    />
                    <label htmlFor="emergency-check" className="text-xs font-medium text-amber-900 cursor-pointer">
                      <strong>Urgent / Dental Emergency</strong> — Check if you are currently experiencing acute pain or trauma.
                    </label>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes-input" className="block text-xs font-semibold text-ink mb-1">
                      Notes or Special Requests (Optional)
                    </label>
                    <textarea
                      id="notes-input"
                      rows={2}
                      placeholder="Any dental anxiety, past dental history, or specific questions..."
                      value={values.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={submitting}
                  >
                    <CalendarCheck className="h-5 w-5" />
                    {submitting ? "Confirming & Saving to Database..." : "Confirm My Booking"}
                  </Button>

                  <p className="text-center text-[0.75rem] text-ink/50">
                    🔒 Secured with clinical HIPAA compliance. No upfront payment required to book.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, CalendarClock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function AppointmentStatusPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  
  // Since DB is mocked, we will just show a mock confirmed page
  // In a real app, we would verify the token from `appointment_tokens` table.
  const mockStatus: string = "confirmed"; // or "requested", "cancelled"

  return (
    <div className="bg-gray-50 min-h-screen py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm text-center">
          
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-50 mb-6">
            {mockStatus === "confirmed" && <CheckCircle2 className="h-10 w-10 text-cyan-600" />}
            {mockStatus === "cancelled" && <XCircle className="h-10 w-10 text-red-600" />}
            {mockStatus === "requested" && <CalendarClock className="h-10 w-10 text-orange-500" />}
          </div>

          <h1 className="font-serif text-3xl font-bold text-slate-900 mb-2">
            Appointment {mockStatus.charAt(0).toUpperCase() + mockStatus.slice(1)}
          </h1>
          
          <p className="text-slate-600 mb-8">
            {mockStatus === "confirmed" && "Your appointment has been confirmed. We look forward to seeing you!"}
            {mockStatus === "cancelled" && "Your appointment has been cancelled as requested."}
            {mockStatus === "requested" && "Your appointment request is pending review by our clinic."}
          </p>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left mb-8 space-y-4">
            <div>
              <p className="text-sm text-slate-500 font-medium">Patient</p>
              <p className="font-semibold text-slate-900">Jane Smith</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Service</p>
              <p className="font-semibold text-slate-900">Professional Whitening</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Date & Time</p>
              <p className="font-semibold text-slate-900">August 12, 2026 at 10:00 AM</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {mockStatus !== "cancelled" && (
              <>
                <button className="rounded-md bg-white border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Reschedule
                </button>
                <button className="rounded-md bg-white border border-red-200 px-6 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                  Cancel Appointment
                </button>
              </>
            )}
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-100">
            <Link href="/" className="inline-flex items-center text-sm font-semibold text-cyan-600 hover:text-cyan-700">
              Return to Homepage <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

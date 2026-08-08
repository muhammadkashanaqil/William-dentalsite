import { getServices } from "@/lib/data";
import { AppointmentRequestForm } from "@/components/AppointmentRequestForm";

export const metadata = {
  title: "Request Appointment | William Dentist",
  description: "Schedule your next dental visit with William Dentist.",
};

export default async function AppointmentRequestPage() {
  const services = await getServices();

  return (
    <div className="bg-gray-50 min-h-screen py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Request an <span className="text-cyan-600">Appointment</span>
          </h1>
          <p className="text-lg text-slate-600">
            Select a service and choose an available time slot. We'll confirm your appointment shortly.
          </p>
        </div>

        <AppointmentRequestForm services={services} />
      </div>
    </div>
  );
}

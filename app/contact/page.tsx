import { LeadForm } from "@/components/LeadForm";
import { MapPin, Phone, Mail, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact Us | William Dentist",
  description: "Get in touch with our dental clinic in Beverly Hills.",
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Contact <span className="text-cyan-600">Us</span>
          </h1>
          <p className="text-lg text-slate-600">
            We're here to answer any questions you have. Send us a message or contact us directly.
          </p>
        </div>

        {/* Emergency Notice */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 text-lg">Medical Emergency?</h3>
              <p className="text-red-700 mt-1">
                For severe swelling, uncontrolled bleeding, breathing difficulty, or life-threatening emergencies, please call <strong>911</strong> or visit your local emergency room immediately. This website does not triage emergencies.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-8">Clinic Information</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="shrink-0 h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">Location</h3>
                  <p className="text-slate-600 mt-1">
                    123 Smile Way<br />
                    Beverly Hills, CA 90210
                  </p>
                  <a href="#" className="text-cyan-600 hover:text-cyan-700 text-sm font-medium mt-2 inline-block">View on Maps &rarr;</a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">Phone</h3>
                  <p className="text-slate-600 mt-1">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">Email</h3>
                  <p className="text-slate-600 mt-1">hello@williamdentist.online</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">Hours</h3>
                  <ul className="text-slate-600 mt-1 space-y-1">
                    <li className="flex justify-between w-48"><span>Mon - Thu:</span> <span>9:00 AM - 5:00 PM</span></li>
                    <li className="flex justify-between w-48"><span>Friday:</span> <span>9:00 AM - 1:00 PM</span></li>
                    <li className="flex justify-between w-48"><span>Sat - Sun:</span> <span>Closed</span></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-2">Ready to book?</h3>
              <p className="text-slate-600 text-sm mb-4">Skip the form and choose an available time slot immediately.</p>
              <Link
                href="/appointments/request"
                className="inline-flex items-center justify-center rounded-md bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
              >
                Request Appointment
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">Send a Message</h2>
            <LeadForm />
          </div>
        </div>
      </div>
    </div>
  );
}

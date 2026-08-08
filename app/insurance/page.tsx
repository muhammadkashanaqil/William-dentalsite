import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Insurance & Financing | William Dentist",
  description: "Information regarding accepted insurance plans and financing options at William Dentist.",
};

export default function InsurancePage() {
  const acceptedInsurances = [
    "Delta Dental PPO",
    "Cigna DPPO",
    "MetLife PDP Plus",
    "Aetna PPO",
    "Guardian DentalGuard",
    "UnitedHealthcare Dental PPO"
  ];

  return (
    <div className="bg-white min-h-screen py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Insurance & <span className="text-cyan-600">Financing</span>
          </h1>
          <p className="text-lg text-slate-600">
            We believe that premium dental care should be accessible. Our team works diligently to maximize your insurance benefits and offers flexible financing solutions.
          </p>
        </div>

        <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-8 mb-16">
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">Accepted Insurance Plans</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {acceptedInsurances.map((plan) => (
              <div key={plan} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-cyan-600 shrink-0" />
                <span className="font-medium text-slate-700">{plan}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-start gap-3 text-sm text-slate-600 bg-white/50 p-4 rounded-xl">
            <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <p>
              <strong>Verification Disclaimer:</strong> While we accept the plans listed above, coverage varies significantly by individual policy. We cannot guarantee coverage amounts. Please contact our office with your insurance information prior to your appointment for a complimentary benefits check. Do not send member IDs or card data via unsecured email or chat.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="border border-slate-200 rounded-2xl p-8">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-4">Self-Pay Options</h3>
            <p className="text-slate-600 mb-6">
              For patients without dental insurance, we offer competitive self-pay rates. We accept all major credit cards, HSA, and FSA cards.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li>• Visa, Mastercard, AMEX</li>
              <li>• Health Savings Accounts (HSA)</li>
              <li>• Flexible Spending Accounts (FSA)</li>
              <li>• Cash & Check</li>
            </ul>
          </div>
          <div className="border border-slate-200 rounded-2xl p-8">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-4">Financing</h3>
            <p className="text-slate-600 mb-6">
              We partner with third-party financing providers to offer flexible, low-to-no-interest payment plans for comprehensive treatments.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li>• CareCredit (Subject to credit approval)</li>
              <li>• In-house payment plans (for orthodontic treatments)</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-600 mb-6 font-medium">Have specific questions about your coverage?</p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              Ask an Insurance Question
            </Link>
            <Link
              href="/appointments/request"
              className="inline-flex items-center justify-center rounded-md bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
            >
              Request Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

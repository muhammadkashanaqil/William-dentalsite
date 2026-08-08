import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";

export const metadata = {
  title: "About Dr. William & the Clinic | William Dentist",
  description: "Learn about Dr. William, our clinic's story, and our approach to premium dental care.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
              Meet <span className="text-cyan-600">Dr. William</span>
            </h1>
            <div className="prose prose-lg prose-slate max-w-none text-slate-600">
              <p>
                Dr. William is a renowned restorative and cosmetic dentist dedicated to transforming smiles and improving lives. With over 15 years of clinical experience, Dr. William combines meticulous precision with a compassionate approach, ensuring every patient receives the highest standard of care in a comfortable, anxiety-free environment.
              </p>
              <h3 className="font-serif text-2xl text-slate-900 mt-8 mb-4">Credentials & Education</h3>
              <ul className="space-y-2">
                <li><strong>DDS:</strong> University of California, Los Angeles (UCLA) School of Dentistry</li>
                <li><strong>Residency:</strong> Cedars-Sinai Medical Center, Advanced Education in General Dentistry</li>
                <li><strong>Fellowship:</strong> International Congress of Oral Implantologists (ICOI)</li>
                <li><strong>Member:</strong> American Academy of Cosmetic Dentistry (AACD)</li>
              </ul>
              <h3 className="font-serif text-2xl text-slate-900 mt-8 mb-4">Our Clinic's Approach</h3>
              <p>
                At William Dentist, we believe that oral health is a vital component of overall wellness. Our clinic was founded on the principle that dental visits should be exceptional experiences rather than obligatory chores. We've designed our practice to feel more like a luxury spa than a traditional medical office, utilizing the latest AI-assisted technologies to provide precise, efficient, and pain-free treatments.
              </p>
            </div>
            
            <div className="mt-10 flex gap-4">
              <Link
                href="/appointments/request"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-orange-600 transition-all"
              >
                <Calendar className="h-5 w-5" />
                Book an Appointment
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-slate-100 px-8 py-3.5 text-base font-semibold text-slate-900 hover:bg-slate-200 transition-colors"
              >
                Contact Clinic
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-slate-200 shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-medium">
                [Dr. William Portrait - Synthetic Portfolio Demo]
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-100 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

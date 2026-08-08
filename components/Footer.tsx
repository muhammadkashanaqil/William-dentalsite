import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              William <span className="text-cyan-500">Dentist</span>
            </span>
            <p className="text-sm leading-6">
              Experience premium dental care where clinical precision meets a luxury environment. Your smile is our priority.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-cyan-500 font-semibold text-sm">
                Facebook
              </a>
              <a href="#" className="text-slate-400 hover:text-cyan-500 font-semibold text-sm">
                Instagram
              </a>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">Quick Links</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/services" className="text-sm leading-6 hover:text-white transition-colors">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-sm leading-6 hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/insurance" className="text-sm leading-6 hover:text-white transition-colors">
                      Insurance & Financing
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-sm leading-6 hover:text-white transition-colors">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/privacy" className="text-sm leading-6 hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm leading-6 hover:text-white transition-colors">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">Contact Info</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li className="flex gap-3">
                    <MapPin className="h-5 w-5 text-cyan-500 shrink-0" />
                    <span className="text-sm leading-6">123 Smile Way<br />Beverly Hills, CA 90210</span>
                  </li>
                  <li className="flex gap-3">
                    <Phone className="h-5 w-5 text-cyan-500 shrink-0" />
                    <span className="text-sm leading-6">+1 (555) 123-4567</span>
                  </li>
                  <li className="flex gap-3">
                    <Mail className="h-5 w-5 text-cyan-500 shrink-0" />
                    <span className="text-sm leading-6">hello@williamdentist.online</span>
                  </li>
                  <li className="flex gap-3">
                    <Clock className="h-5 w-5 text-cyan-500 shrink-0" />
                    <span className="text-sm leading-6">Mon-Thu: 9AM - 5PM<br />Fri: 9AM - 1PM</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs leading-5 text-slate-400">
            &copy; {new Date().getFullYear()} William Dentist. All rights reserved.
          </p>
          <p className="text-xs leading-5 text-slate-500 mt-4 md:mt-0 max-w-lg text-center md:text-right">
            Disclaimer: This website is a demonstration portfolio project. No real medical advice or diagnosis is provided. If experiencing a life-threatening emergency, call your local emergency services immediately.
          </p>
        </div>
      </div>
    </footer>
  );
}

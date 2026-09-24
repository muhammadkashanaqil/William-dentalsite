"use client";

import Link from "next/link";
import { ArrowRight, Star, Shield, Clock, CalendarCheck, CheckCircle2, Sparkles } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden bg-slate-900 text-white">
        {/* Animated Abstract Background */}
        <motion.div style={{ y: yBg, opacity: opacityBg }} className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-900/40 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-slate-800/80 rounded-full blur-[100px] -z-10"></div>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900"></div>
        </motion.div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium tracking-wide text-cyan-50">Redefining Modern Dentistry</span>
            </motion.div>
            
            <motion.div variants={fadeUp}>
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
                Clinical Precision.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Luxury Care.
                </span>
              </h1>
            </motion.div>

            <motion.p variants={fadeUp} className="text-lg md:text-2xl text-slate-300 mb-12 max-w-2xl font-light leading-relaxed">
              Experience the future of dentistry with AI-assisted diagnostics and state-of-the-art treatments designed for your absolute comfort.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/appointments/request"
                className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-900 overflow-hidden transition-transform hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Book Private Consultation</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 backdrop-blur-md px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/50"
              >
                Explore Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Trust Section (Replaces the doctor image) */}
      <section className="relative -mt-16 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass bg-white/80 p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center border-white">
            <div className="h-12 w-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-5">
              <Star className="h-6 w-6 fill-current" />
            </div>
            <h3 className="text-4xl font-serif font-bold text-slate-900 mb-2">4.9/5</h3>
            <p className="text-slate-600 font-medium">Average Patient Rating</p>
          </div>
          <div className="glass bg-white/80 p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center border-white">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-4xl font-serif font-bold text-slate-900 mb-2">15+ Yrs</h3>
            <p className="text-slate-600 font-medium">Clinical Excellence</p>
          </div>
          <div className="glass bg-white/80 p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center border-white">
            <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-5">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-4xl font-serif font-bold text-slate-900 mb-2">10k+</h3>
            <p className="text-slate-600 font-medium">Smiles Restored</p>
          </div>
        </motion.div>
      </section>

      {/* Philosophy / Features */}
      <section className="py-32 bg-transparent relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                An atmosphere of <span className="text-cyan-600 italic">tranquility.</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-600 font-light leading-relaxed">
                <p>
                  At William Dentist, we believe that a visit to the dentist should be something you look forward to. We've combined the relaxing atmosphere of a luxury spa with the precision of advanced medical technology.
                </p>
                <p>
                  Every detail of your visit is carefully orchestrated. From our zero-wait-time policy to our AI-assisted diagnostic tools, your comfort and health are our highest priorities.
                </p>
                <div className="pt-6">
                  <Link href="/about" className="inline-flex items-center font-semibold text-slate-900 hover:text-cyan-600 transition-colors group">
                    Discover Our Philosophy 
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
            
            {/* Abstract Composition instead of Doctor Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="relative h-[600px] rounded-[40px] overflow-hidden bg-slate-900"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900 via-slate-900 to-blue-900"></div>
              {/* Decorative rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center z-10">
                <Shield className="h-16 w-16 text-cyan-400 mb-8 opacity-80" />
                <h3 className="font-serif text-3xl font-bold mb-4">State-of-the-art Technology</h3>
                <p className="text-slate-300 font-light text-lg">3D imaging and AI-assisted diagnostics for unparalleled precision and pain-free treatments.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-white relative rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6">Signature Treatments</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">Comprehensive, bespoke dental care tailored to your unique needs using the latest technological advancements.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              title="Professional Whitening"
              description="Brighten your smile in just one visit with our advanced laser whitening technology. Safe, fast, and highly effective."
              href="/services/whitening"
              icon={<Star className="h-6 w-6" />}
              delay={0.1}
            />
            <ServiceCard
              title="Comprehensive Cleaning"
              description="Maintain optimal oral health with our thorough cleaning, scaling, and microscopic examination."
              href="/services/cleaning"
              icon={<Shield className="h-6 w-6" />}
              delay={0.2}
            />
            <ServiceCard
              title="Dental Implants"
              description="Permanent, natural-looking solutions for missing teeth using 3D-guided surgical precision."
              href="/services/implants"
              icon={<CalendarCheck className="h-6 w-6" />}
              delay={0.3}
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 text-center"
          >
            <Link href="/services" className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-slate-900 text-slate-900 font-semibold hover:bg-slate-900 hover:text-white transition-colors">
              Explore All Treatments
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/40 via-slate-900 to-slate-900"></div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8">Ready for a better smile?</h2>
            <p className="text-xl text-slate-300 mb-12 font-light max-w-2xl mx-auto">
              We work with most major PPO insurance plans. Our dedicated concierge team will handle the paperwork to maximize your benefits.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-16 opacity-60">
              <span className="px-6 py-3 border border-white/20 rounded-xl text-sm tracking-wide font-medium">Delta Dental</span>
              <span className="px-6 py-3 border border-white/20 rounded-xl text-sm tracking-wide font-medium">Cigna</span>
              <span className="px-6 py-3 border border-white/20 rounded-xl text-sm tracking-wide font-medium">MetLife</span>
              <span className="px-6 py-3 border border-white/20 rounded-xl text-sm tracking-wide font-medium">Aetna</span>
            </div>
            <Link
              href="/appointments/request"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-10 py-5 text-lg font-semibold text-white hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)]"
            >
              Reserve Your Appointment
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

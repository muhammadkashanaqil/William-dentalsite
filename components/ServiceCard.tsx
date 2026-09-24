"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  delay?: number;
}

export function ServiceCard({ title, description, href, icon, delay = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: delay }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col justify-between rounded-2xl glass p-8 shadow-sm transition-all hover:shadow-xl bg-white/60 hover:bg-white"
    >
      <div>
        {icon && (
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">
          <Link href={href} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {title}
          </Link>
        </h3>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
      <div className="mt-8 flex items-center text-sm font-semibold text-cyan-600">
        Learn more
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
}

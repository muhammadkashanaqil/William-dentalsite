"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        
        return (
          <div 
            key={faq.id}
            className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all duration-200 hover:border-cyan-200 hover:shadow-sm"
          >
            <button
              className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
              onClick={() => toggle(faq.id)}
            >
              <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
              <ChevronDown 
                className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? "transform rotate-180 text-cyan-600" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-6 pb-5 pt-0 text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      
      {faqs.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No FAQs found matching your criteria.
        </div>
      )}
    </div>
  );
}

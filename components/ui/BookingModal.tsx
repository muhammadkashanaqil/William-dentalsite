"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useNavigation } from "@/context/NavigationContext";
import { Appointment } from "@/components/sections/Appointment";

export function BookingModal() {
  const { isBookingModalOpen, closeBookingModal, bookingPreselectedService, bookingPreselectedDoctor } =
    useNavigation();

  if (!isBookingModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeBookingModal}
          className="fixed inset-0 bg-ink/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-cream p-4 sm:p-6 shadow-2xl border border-ink/10"
        >
          {/* Close button */}
          <button
            onClick={closeBookingModal}
            aria-label="Close booking modal"
            className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 border border-ink/10 text-ink/70 hover:bg-white hover:text-ink shadow-soft transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Appointment Component */}
          <div className="pt-2">
            <Appointment
              isModal={true}
              initialService={bookingPreselectedService}
              initialDoctor={bookingPreselectedDoctor}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

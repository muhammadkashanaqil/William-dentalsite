"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface Slot {
  start: string;
  end: string;
  label: string;
}

interface AvailabilityPickerProps {
  serviceId?: string;
  selectedSlot: Slot | null;
  onSlotSelect: (slot: Slot) => void;
}

/**
 * Format a Date to YYYY-MM-DD in the user's LOCAL timezone
 * (avoids UTC date being one day off for users east of GMT).
 */
function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function AvailabilityPicker({ serviceId, selectedSlot, onSlotSelect }: AvailabilityPickerProps) {
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchSlots = useCallback(async (date: Date) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const dateStr = toLocalDateString(date);
      const params = new URLSearchParams({ date: dateStr });
      if (serviceId) params.set("serviceId", serviceId);

      const res = await fetch(`/api/appointments/availability?${params.toString()}`);
      const json = await res.json();

      if (res.ok) {
        setSlots(json.data || []);
      } else {
        setErrorMsg(json.error || "Could not load available times.");
        setSlots([]);
      }
    } catch (e) {
      console.error("Failed to fetch availability", e);
      setErrorMsg("Network error. Please try again.");
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchSlots(currentDate);
  }, [fetchSlots, currentDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const prevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    if (prev >= today) setCurrentDate(prev);
  };

  const isPrevDisabled = currentDate <= today;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
      {/* Date navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={prevDay}
          disabled={isPrevDisabled}
          className="p-2 rounded-full hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </button>
        <span className="font-semibold text-slate-900">
          {currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </span>
        <button
          type="button"
          onClick={nextDay}
          className="p-2 rounded-full hover:bg-slate-200 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {/* Slot grid */}
      <div className="min-h-[200px] relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
          </div>
        )}

        {!isLoading && errorMsg && (
          <div className="flex h-full items-center justify-center text-red-500 text-sm py-12">
            {errorMsg}
          </div>
        )}

        {!isLoading && !errorMsg && slots.length === 0 && (
          <div className="flex h-full items-center justify-center text-slate-500 py-12">
            No available slots on this day.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {!isLoading &&
            slots.map((slot, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSlotSelect(slot)}
                className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
                  selectedSlot?.start === slot.start
                    ? "bg-cyan-600 border-cyan-600 text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-700 hover:border-cyan-400 hover:text-cyan-700 hover:shadow-sm"
                }`}
              >
                {slot.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

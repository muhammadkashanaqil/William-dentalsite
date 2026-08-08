import { createServerClient } from "@/lib/supabase/server";
import { fetchGoogleFreeBusy } from "@/lib/google-calendar";

export type AvailabilitySlot = {
  start: string;
  end: string;
};

export type AvailabilityResult = {
  date: string;
  timezone: string;
  serviceDurationMinutes: number;
  slots: AvailabilitySlot[];
  error?: string;
};

/**
 * Core multi-source availability calculation.
 * Combines clinic hours, closures, DB appointments, holds, and Google Free/Busy.
 * Called directly by both /api/availability and /api/appointments/availability.
 */
export async function calculateAvailability(
  dateStr: string,
  serviceId?: string | null
): Promise<AvailabilityResult> {
  const supabase = createServerClient();

  // 1. Fetch site settings and service duration in parallel
  const [{ data: settings }, serviceRes] = await Promise.all([
    supabase
      .from("site_settings")
      .select("timezone, slot_interval_minutes, minimum_lead_hours, booking_horizon_days")
      .single(),
    serviceId
      ? supabase.from("services").select("duration_minutes").eq("id", serviceId).single()
      : Promise.resolve({ data: null }),
  ]);

  const timezone = settings?.timezone || "America/Chicago";
  const slotInterval = settings?.slot_interval_minutes || 30;
  const durationMinutes = (serviceRes as any)?.data?.duration_minutes || 60;
  const minLeadHours = settings?.minimum_lead_hours || 2;

  // 2. Determine day of week (0=Sunday) — parse dateStr directly to avoid TZ issues
  const [year, month, day] = dateStr.split("-").map(Number);
  // Use noon UTC to avoid DST day-boundary issues
  const reqDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const dayOfWeek = reqDate.getUTCDay(); // 0 = Sunday, 6 = Saturday

  // 3. Fetch clinic hours for this day of week
  const { data: clinicHours } = await supabase
    .from("clinic_hours")
    .select("opens_at, closes_at, is_closed")
    .eq("day_of_week", dayOfWeek)
    .single();

  if (!clinicHours || clinicHours.is_closed || !clinicHours.opens_at || !clinicHours.closes_at) {
    return { date: dateStr, timezone, serviceDurationMinutes: durationMinutes, slots: [] };
  }

  // 4. Build UTC-based day boundaries for DB queries
  const dayStartUtc = `${dateStr}T00:00:00Z`;
  const dayEndUtc = `${dateStr}T23:59:59Z`;

  // 5. Fetch all blocking data in parallel
  const [
    { data: closures },
    { data: dbAppointments },
    { data: holds },
    googleBusy,
  ] = await Promise.all([
    supabase
      .from("clinic_closures")
      .select("starts_at, ends_at")
      .lt("starts_at", dayEndUtc)
      .gt("ends_at", dayStartUtc),
    supabase
      .from("appointments")
      .select("start_at, end_at")
      .neq("status", "cancelled")
      .lt("start_at", dayEndUtc)
      .gt("end_at", dayStartUtc),
    supabase
      .from("appointment_holds")
      .select("slot_start, slot_end")
      .gt("expires_at", new Date().toISOString())
      .lt("slot_start", dayEndUtc)
      .gt("slot_end", dayStartUtc),
    fetchGoogleFreeBusy(dayStartUtc, dayEndUtc, timezone),
  ]);

  // 6. Parse clinic open/close times as UTC timestamps for this date
  const [openH, openM] = clinicHours.opens_at.split(":").map(Number);
  const [closeH, closeM] = clinicHours.closes_at.split(":").map(Number);

  // Build slot times using UTC so there's no local-machine timezone offset
  const openMs = Date.UTC(year, month - 1, day, openH, openM, 0);
  const closeMs = Date.UTC(year, month - 1, day, closeH, closeM, 0);
  const nowWithLeadMs = Date.now() + minLeadHours * 60 * 60 * 1000;

  // 7. Generate candidate slots
  const candidateSlots: AvailabilitySlot[] = [];
  let currentMs = openMs;

  while (currentMs + durationMinutes * 60_000 <= closeMs) {
    const slotStart = new Date(currentMs);
    const slotEnd = new Date(currentMs + durationMinutes * 60_000);

    // Only include future slots (respecting lead time)
    if (slotStart.getTime() >= nowWithLeadMs) {
      candidateSlots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
      });
    }

    currentMs += slotInterval * 60_000;
  }

  // 8. Collect all busy intervals
  const busyIntervals: { startMs: number; endMs: number }[] = [];

  (closures || []).forEach((c) => {
    busyIntervals.push({ startMs: new Date(c.starts_at).getTime(), endMs: new Date(c.ends_at).getTime() });
  });

  (dbAppointments || []).forEach((a) => {
    busyIntervals.push({ startMs: new Date(a.start_at).getTime(), endMs: new Date(a.end_at).getTime() });
  });

  (holds || []).forEach((h) => {
    busyIntervals.push({ startMs: new Date(h.slot_start).getTime(), endMs: new Date(h.slot_end).getTime() });
  });

  googleBusy.forEach((g) => {
    busyIntervals.push({ startMs: new Date(g.start).getTime(), endMs: new Date(g.end).getTime() });
  });

  // 9. Filter out busy slots
  const availableSlots = candidateSlots.filter((slot) => {
    const sStart = new Date(slot.start).getTime();
    const sEnd = new Date(slot.end).getTime();
    return !busyIntervals.some((b) => sStart < b.endMs && sEnd > b.startMs);
  });

  return {
    date: dateStr,
    timezone,
    serviceDurationMinutes: durationMinutes,
    slots: availableSlots,
  };
}

import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createGoogleEvent } from "@/lib/google-calendar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function parseChicagoDateTime(
  dateStr: string,
  timeStr: string
): { startISO: string; displayDate: string; displayTime: string } {
  const cleanDate = dateStr.trim();
  const cleanTime = timeStr.trim();

  let hours = 9;
  let minutes = 0;

  const timeMatch = cleanTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10);
    minutes = parseInt(timeMatch[2], 10);
    const meridiem = timeMatch[3]?.toUpperCase();

    if (meridiem === "PM" && hours < 12) {
      hours += 12;
    } else if (meridiem === "AM" && hours === 12) {
      hours = 0;
    }
  }

  const pad = (n: number) => n.toString().padStart(2, "0");
  const formattedTimeStr = `${pad(hours)}:${pad(minutes)}:00`;

  // Estimate offset for America/Chicago (-05:00 for CDT in summer, -06:00 for CST in winter)
  const d = new Date(`${cleanDate}T${formattedTimeStr}-05:00`);
  const isDST = d.getMonth() >= 2 && d.getMonth() <= 10;
  const tzOffsetStr = isDST ? "-05:00" : "-06:00";

  const startISO = new Date(`${cleanDate}T${formattedTimeStr}${tzOffsetStr}`).toISOString();

  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayTime = `${displayHours}:${pad(minutes)} ${ampm}`;

  return {
    startISO,
    displayDate: cleanDate,
    displayTime,
  };
}

export async function POST(request: Request) {
  try {
    // 1. Validate authentication header
    const expectedSecret = process.env.N8N_WEBHOOK_SECRET;
    const providedSecret =
      request.headers.get("X-William-Dentist-Secret") ||
      request.headers.get("x-william-dentist-secret") ||
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
      request.headers.get("x-webhook-secret");

    if (
      expectedSecret &&
      expectedSecret !== "server-only" &&
      expectedSecret.trim() !== "" &&
      providedSecret !== expectedSecret.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse payload supporting top-level or nested objects
    const rawBody = await request.json();
    const payload =
      rawBody.appointment ||
      rawBody.data ||
      rawBody.parameters ||
      rawBody.args ||
      rawBody.json ||
      rawBody;

    const leadId = payload.leadId || payload.lead_id || rawBody.leadId;
    const conversationId = payload.conversationId || payload.conversation_id || rawBody.conversationId;

    let patientName =
      payload.patientName ||
      payload.patient_name ||
      payload.name ||
      payload.full_name ||
      payload.fullName ||
      "";

    let patientEmail =
      payload.patientEmail ||
      payload.patient_email ||
      payload.email ||
      payload.email_address ||
      "";

    let patientPhone =
      payload.patientPhone ||
      payload.patient_phone ||
      payload.phone ||
      payload.phone_number ||
      "";

    const serviceStr = payload.service || payload.service_name || payload.serviceName || rawBody.service;
    const dateStr = payload.date || payload.appointment_date || rawBody.date;
    const timeStr = payload.time || payload.appointment_time || rawBody.time;

    if (!dateStr || !timeStr) {
      return NextResponse.json(
        { success: false, error: "date and time are required." },
        { status: 400 }
      );
    }

    // Separate name and email if email was passed in patientName
    patientName = typeof patientName === "string" ? patientName.trim() : "";
    patientEmail = typeof patientEmail === "string" ? patientEmail.trim() : "";
    patientPhone = typeof patientPhone === "string" ? patientPhone.trim() : "";

    if (patientName.includes("@")) {
      if (!patientEmail) patientEmail = patientName;
      const localPart = patientEmail.split("@")[0];
      patientName =
        localPart
          .replace(/[._-]+/g, " ")
          .split(" ")
          .filter(Boolean)
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ") || "Valued Patient";
    }

    if (!patientName) {
      if (patientEmail && patientEmail.includes("@")) {
        const localPart = patientEmail.split("@")[0];
        patientName =
          localPart
            .replace(/[._-]+/g, " ")
            .split(" ")
            .filter(Boolean)
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ") || "Valued Patient";
      } else if (patientPhone) {
        patientName = `Patient (${patientPhone})`;
      } else {
        patientName = "Valued Patient";
      }
    }

    const supabase = createServerClient();

    // 3. Resolve service from database
    let serviceId: string | null = null;
    let serviceName = "General Dentistry";
    let durationMinutes = 60;

    if (serviceStr && typeof serviceStr === "string") {
      const { data: serviceData } = await supabase
        .from("services")
        .select("id, name, duration_minutes")
        .or(`name.ilike.%${serviceStr.trim()}%,slug.ilike.%${serviceStr.trim()}%`)
        .limit(1)
        .maybeSingle();

      if (serviceData?.id) {
        serviceId = serviceData.id;
        serviceName = serviceData.name;
        if (serviceData.duration_minutes) {
          durationMinutes = serviceData.duration_minutes;
        }
      }
    }

    if (!serviceId) {
      const { data: fallbackService } = await supabase
        .from("services")
        .select("id, name, duration_minutes")
        .limit(1)
        .maybeSingle();

      if (fallbackService?.id) {
        serviceId = fallbackService.id;
        serviceName = fallbackService.name;
        if (fallbackService.duration_minutes) {
          durationMinutes = fallbackService.duration_minutes;
        }
      }
    }

    // 4. Convert selected date/time using America/Chicago timezone
    const { startISO, displayDate, displayTime } = parseChicagoDateTime(dateStr, timeStr);
    const startMs = new Date(startISO).getTime();
    const endISO = new Date(startMs + durationMinutes * 60000).toISOString();

    // 5. Recheck slot availability
    const { data: overlaps } = await supabase
      .from("appointments")
      .select("id")
      .neq("status", "cancelled")
      .lt("start_at", endISO)
      .gt("end_at", startISO);

    if (overlaps && overlaps.length > 0) {
      return NextResponse.json({
        success: false,
        error: "Selected appointment slot is no longer available.",
      });
    }

    // 6. Create appointment using existing appointment system
    const appointmentId = crypto.randomUUID();
    const reference = `WD-APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const idempotencyKey = crypto.randomUUID();

    const { error: insertErr } = await supabase.from("appointments").insert({
      id: appointmentId,
      reference,
      idempotency_key: idempotencyKey,
      lead_id: leadId || null,
      service_id: serviceId,
      patient_name: patientName,
      patient_phone: patientPhone || null,
      patient_email: patientEmail || null,
      patient_type: "new",
      start_at: startISO,
      end_at: endISO,
      status: "requested",
    });

    if (insertErr) {
      console.error("Error inserting appointment into Supabase:", insertErr);
      return NextResponse.json(
        { success: false, error: "Failed to create appointment record." },
        { status: 500 }
      );
    }

    // 7. Sync appointment to Google Calendar
    let calendarSynced = false;
    let googleEventId: string | null = null;
    let syncStatus = "pending";
    let syncErrorMessage: string | null = null;

    try {
      const gRes = await createGoogleEvent({
        id: appointmentId,
        patient_name: patientName,
        start_at: startISO,
        end_at: endISO,
      });

      if (gRes?.eventId) {
        googleEventId = gRes.eventId;
        calendarSynced = true;
        syncStatus = "synced";
      }
    } catch (gErr: any) {
      console.warn("Failed to sync appointment with Google Calendar:", gErr.message);
      syncStatus = "failed";
      syncErrorMessage = gErr.message || "Google Calendar sync failed";
    }

    // Save real google_event_id and calendar sync status
    await supabase
      .from("appointments")
      .update({
        google_event_id: googleEventId,
        calendar_sync_status: syncStatus,
        calendar_last_synced_at: syncStatus === "synced" ? new Date().toISOString() : null,
        calendar_error_message: syncErrorMessage,
      })
      .eq("id", appointmentId);

    // 8. Link conversation / lead
    if (conversationId && typeof conversationId === "string") {
      try {
        await supabase
          .from("conversations")
          .update({ lead_id: leadId || null })
          .eq("id", conversationId.trim());
      } catch (linkErr) {
        console.warn("Failed to link conversation to lead:", linkErr);
      }
    }

    if (leadId && typeof leadId === "string") {
      try {
        await supabase
          .from("leads")
          .update({ status: "appointment_requested", updated_at: new Date().toISOString() })
          .eq("id", leadId.trim());
      } catch (leadErr) {
        console.warn("Failed to update lead status:", leadErr);
      }
    }

    // 9. Return real appointment reference response
    return NextResponse.json({
      success: true,
      appointmentId,
      reference,
      service: serviceName,
      date: displayDate,
      time: displayTime,
      timezone: "America/Chicago",
      calendarSynced,
    });
  } catch (error: any) {
    console.error("AI create appointment error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create appointment" },
      { status: 500 }
    );
  }
}

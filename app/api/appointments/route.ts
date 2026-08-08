import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createGoogleEvent, fetchGoogleFreeBusy } from "@/lib/google-calendar";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  try {
    const body = await request.json();
    const { patientType, name, phone, email, serviceId, startAt, notes, idempotencyKey } = body;

    if (!name || (!phone && !email) || !startAt) {
      return NextResponse.json(
        { error: "Name, contact info, and appointment time are required.", data: null, requestId },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 1. Look up service duration
    let durationMinutes = 60;
    if (serviceId) {
      const { data: svc } = await supabase
        .from("services")
        .select("duration_minutes")
        .eq("id", serviceId)
        .single();
      if (svc?.duration_minutes) durationMinutes = svc.duration_minutes;
    }

    const endAt = new Date(new Date(startAt).getTime() + durationMinutes * 60000).toISOString();

    // 2. Recheck DB Overlaps
    const { data: existingOverlaps } = await supabase
      .from("appointments")
      .select("id")
      .neq("status", "cancelled")
      .lt("start_at", endAt)
      .gt("end_at", startAt);

    if (existingOverlaps && existingOverlaps.length > 0) {
      return NextResponse.json(
        {
          error: "This time slot has already been requested or booked. Please choose a different time.",
          data: null,
          requestId,
        },
        { status: 409 }
      );
    }

    // 3. Recheck Google Calendar Free/Busy if connected
    const googleBusy = await fetchGoogleFreeBusy(startAt, endAt);
    const startMs = new Date(startAt).getTime();
    const endMs = new Date(endAt).getTime();

    const isGoogleBusy = googleBusy.some((b) => {
      const bStart = new Date(b.start).getTime();
      const bEnd = new Date(b.end).getTime();
      return startMs < bEnd && endMs > bStart;
    });

    if (isGoogleBusy) {
      return NextResponse.json(
        {
          error: "This time slot is marked busy on Google Calendar. Please choose a different time.",
          data: null,
          requestId,
        },
        { status: 409 }
      );
    }

    // 4. Create appointment in Supabase
    const reference = `WD-APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const appointmentId = crypto.randomUUID();

    const { data: appointment, error: dbError } = await supabase
      .from("appointments")
      .insert({
        id: appointmentId,
        reference,
        idempotency_key: idempotencyKey || crypto.randomUUID(),
        service_id: serviceId || null,
        patient_name: name,
        patient_phone: phone || null,
        patient_email: email || null,
        patient_type: patientType || "new",
        start_at: startAt,
        end_at: endAt,
        notes: notes || null,
        status: "requested",
        calendar_sync_status: "pending",
      })
      .select()
      .single();

    if (dbError || !appointment) {
      console.error("Database insert error:", dbError);
      return NextResponse.json(
        { error: dbError?.message || "Failed to create appointment in database", data: null, requestId },
        { status: 500 }
      );
    }

    // 5. Attempt Google Calendar Event creation
    let googleEventId: string | null = null;
    let googleCalendarId: string | null = null;
    let syncStatus = "pending";
    let syncErrorMessage: string | null = null;

    try {
      const gRes = await createGoogleEvent({
        id: appointment.id,
        patient_name: appointment.patient_name,
        start_at: appointment.start_at,
        end_at: appointment.end_at,
      });

      googleEventId = gRes.eventId;
      googleCalendarId = gRes.calendarId;
      syncStatus = "synced";
    } catch (gErr: any) {
      console.warn("Google Calendar sync failed (appointment saved in DB):", gErr.message);
      if (gErr.message !== "Google Calendar is not connected.") {
        syncStatus = "failed";
        syncErrorMessage = gErr.message || "Failed to sync event to Google Calendar";
      }
    }

    // 6. Update appointment with Google Calendar sync results
    if (syncStatus !== "pending" || googleEventId) {
      await supabase
        .from("appointments")
        .update({
          google_event_id: googleEventId,
          google_calendar_id: googleCalendarId,
          calendar_sync_status: syncStatus,
          calendar_last_synced_at: syncStatus === "synced" ? new Date().toISOString() : null,
          calendar_error_message: syncErrorMessage,
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointment.id);
    }

    return NextResponse.json(
      {
        data: {
          appointmentId: appointment.id,
          reference: appointment.reference,
          status: appointment.status,
          calendarSyncStatus: syncStatus,
          googleEventId,
        },
        error: null,
        requestId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Invalid request payload", data: null, requestId },
      { status: 400 }
    );
  }
}

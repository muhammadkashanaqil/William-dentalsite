import { NextResponse } from "next/server";
import { calculateAvailability } from "@/lib/availability";

/**
 * GET /api/appointments/availability?date=YYYY-MM-DD&serviceId=UUID
 *
 * Returns slots formatted with human-readable labels for the booking UI.
 * Uses the shared calculateAvailability utility (no server-to-server HTTP call).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");

  if (!dateStr) {
    return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
  }

  try {
    const result = await calculateAvailability(dateStr, serviceId);

    // Add human-readable label to each slot for the AvailabilityPicker UI
    const formattedSlots = result.slots.map((slot) => {
      const startDate = new Date(slot.start);
      const label = startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: result.timezone,
      });
      return { start: slot.start, end: slot.end, label };
    });

    return NextResponse.json({ data: formattedSlots });
  } catch (e: any) {
    console.error("Error fetching appointment availability:", e);
    return NextResponse.json({ data: [], error: e.message }, { status: 500 });
  }
}

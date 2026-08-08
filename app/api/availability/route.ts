import { NextResponse } from "next/server";
import { calculateAvailability } from "@/lib/availability";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");

  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json(
      { error: "Missing or invalid date parameter (YYYY-MM-DD required)" },
      { status: 400 }
    );
  }

  try {
    const result = await calculateAvailability(dateStr, serviceId);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("Availability calculation error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to calculate availability" },
      { status: 500 }
    );
  }
}

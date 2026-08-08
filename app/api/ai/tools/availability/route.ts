import { NextResponse } from "next/server";
import { calculateAvailability } from "@/lib/availability";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    // Validate authentication header
    const secret = request.headers.get("x-william-dentist-secret");
    const expectedSecret = process.env.N8N_WEBHOOK_SECRET;

    if (!secret || !expectedSecret || secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service");
    const date = searchParams.get("date");

    if (!service || !date) {
      return NextResponse.json(
        { success: false, error: "service and date are required" },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { success: false, error: "date must be in YYYY-MM-DD format" },
        { status: 400 }
      );
    }

    // Resolve service name/slug to a UUID using the existing services table
    let serviceId: string | null = null;
    try {
      const supabase = createServerClient();
      const { data: serviceData } = await supabase
        .from("services")
        .select("id, name, duration_minutes")
        .or(`name.ilike.%${service.trim()}%,slug.ilike.%${service.trim()}%`)
        .limit(1)
        .maybeSingle();

      if (serviceData?.id) {
        serviceId = serviceData.id;
      }
    } catch (err) {
      console.warn("Could not resolve service name to ID:", err);
    }

    // Call existing booking availability logic
    const result = await calculateAvailability(date, serviceId);

    return NextResponse.json({
      success: true,
      service,
      ...result,
    });
  } catch (error) {
    console.error("AI availability error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check availability" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // Validate authentication header against N8N_WEBHOOK_SECRET
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

    const body = await request.json();
    const { name, email, phone, service, conversationId } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }

    let supabase;
    try {
      supabase = createServerClient();
    } catch {
      supabase = null;
    }

    let serviceId: string | null = null;

    // Lookup service ID if service name/slug is provided
    if (service && typeof service === "string" && supabase) {
      try {
        const { data: serviceData } = await supabase
          .from("services")
          .select("id")
          .or(`name.ilike.%${service.trim()}%,slug.ilike.%${service.trim()}%`)
          .limit(1)
          .maybeSingle();

        if (serviceData?.id) {
          serviceId = serviceData.id;
        }
      } catch (err) {
        console.warn("Failed to lookup service:", err);
      }
    }

    const leadId = crypto.randomUUID();
    const reference = `WD-LEAD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create lead record in Supabase
    if (supabase) {
      const { error: insertErr } = await supabase.from("leads").insert({
        id: leadId,
        reference,
        source: "ai_chat",
        status: "new",
        name: name.trim(),
        email: email ? String(email).trim() : null,
        phone: phone ? String(phone).trim() : null,
        service_id: serviceId,
      });

      if (insertErr) {
        console.error("Error inserting lead into Supabase:", insertErr);
        return NextResponse.json(
          { success: false, error: "Failed to create lead record." },
          { status: 500 }
        );
      }

      // Link conversation to the lead if conversationId is provided
      if (conversationId && typeof conversationId === "string") {
        try {
          await supabase
            .from("conversations")
            .update({ lead_id: leadId })
            .eq("id", conversationId.trim());
        } catch (linkErr) {
          console.warn("Failed to link conversation to lead:", linkErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      leadId,
    });
  } catch (error) {
    console.error("Error creating AI lead tool record:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request payload" },
      { status: 400 }
    );
  }
}

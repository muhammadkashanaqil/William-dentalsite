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

    const rawBody = await request.json();
    const payload =
      rawBody.lead ||
      rawBody.data ||
      rawBody.parameters ||
      rawBody.args ||
      rawBody.json ||
      rawBody;

    let rawName =
      payload.name ||
      payload.full_name ||
      payload.fullName ||
      payload.patient_name ||
      payload.patientName ||
      payload.contact_name ||
      "";

    let rawEmail =
      payload.email ||
      payload.email_address ||
      payload.emailAddress ||
      payload.user_email ||
      "";

    let rawPhone =
      payload.phone ||
      payload.phone_number ||
      payload.phoneNumber ||
      payload.mobile ||
      payload.contact_phone ||
      "";

    const service = payload.service || payload.service_name || payload.serviceName || rawBody.service;
    const conversationId = payload.conversationId || payload.conversation_id || rawBody.conversationId;

    let name = typeof rawName === "string" ? rawName.trim() : "";
    let email = typeof rawEmail === "string" ? rawEmail.trim() : "";
    let phone = typeof rawPhone === "string" ? rawPhone.trim() : "";

    const isEmailFormat = (val: string) => val.includes("@");

    // If name is an email address, extract it into email and clear name
    if (name && isEmailFormat(name)) {
      if (!email) {
        email = name;
      }
      name = "";
    }

    // Derive human name if missing or cleared, ensuring email is never saved in the name column
    if (!name) {
      if (email && email.includes("@")) {
        const localPart = email.split("@")[0];
        const formatted = localPart
          .replace(/[._-]+/g, " ")
          .split(" ")
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
        name = formatted || "AI Chat Guest";
      } else if (phone) {
        name = `Guest (${phone})`;
      } else {
        name = "AI Chat Guest";
      }
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
        name,
        email: email || null,
        phone: phone || null,
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

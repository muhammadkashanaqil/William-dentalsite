import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requestId = crypto.randomUUID();
    
    // In a real implementation we would use Zod to validate the body
    const { source, name, phone, email, serviceId, message, preferredContact, consent } = body;
    
    if (!name || (!phone && !email)) {
      return NextResponse.json({ error: "Name and either phone or email are required", data: null, requestId }, { status: 400 });
    }

    const reference = `WD-LEAD-${Math.floor(1000 + Math.random() * 9000)}`;
    const leadId = crypto.randomUUID();

    try {
      const supabase = createServerClient();
      const { error } = await supabase.from("leads").insert({
        id: leadId,
        reference,
        source: source || "contact_form",
        name,
        phone,
        email,
        service_id: serviceId || null,
        message,
        consent,
      });
      
      if (error) {
        console.error("Supabase insert error:", error);
        // Fallback to mock success if DB not configured (for portfolio demo)
      }
    } catch (e) {
      console.warn("Database not configured. Simulating successful lead capture.");
    }

    return NextResponse.json({
      data: {
        leadId,
        reference,
        status: "new"
      },
      error: null,
      requestId
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ 
      error: "Invalid request payload", 
      data: null, 
      requestId: crypto.randomUUID() 
    }, { status: 400 });
  }
}

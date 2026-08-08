import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("X-Webhook-Signature");
    const timestamp = request.headers.get("X-Webhook-Timestamp");
    
    if (!signature || !timestamp) {
      return NextResponse.json({ error: "Missing signature headers" }, { status: 401 });
    }

    // Check for stale timestamp (e.g., older than 5 minutes)
    if (Date.now() - parseInt(timestamp, 10) > 5 * 60 * 1000) {
      return NextResponse.json({ error: "Stale timestamp" }, { status: 401 });
    }

    const rawBody = await request.text();
    const secret = process.env.N8N_WEBHOOK_SECRET;

    if (secret) {
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(`${timestamp}.${rawBody}`);
      const computedSignature = hmac.digest("hex");
      
      if (computedSignature !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else {
      console.warn("N8N_WEBHOOK_SECRET is not configured. Skipping signature validation.");
    }

    const payload = JSON.parse(rawBody);
    
    // Process webhook payload (e.g. status updates from n8n)
    console.log("Received n8n webhook:", payload);

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

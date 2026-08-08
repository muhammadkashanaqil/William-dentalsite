import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

function generateMockResponse(userMessage: string): string {
  const text = userMessage.toLowerCase();

  if (text.includes("invisalign") || text.includes("aligner") || text.includes("braces")) {
    return "Yes, William Dentist offers Invisalign Clear Aligners. Would you like me to check appointment availability?";
  }

  if (text.includes("whiten") || text.includes("laser")) {
    return "We offer professional in-office whitening starting at $299 that can brighten your smile by several shades in just 60 minutes. Would you like to book a whitening appointment?";
  }

  if (text.includes("clean") || text.includes("checkup") || text.includes("exam")) {
    return "Our comprehensive dental cleanings and routine checkups are covered by most major insurance plans. Would you like to check available appointment slots?";
  }

  if (text.includes("implant") || text.includes("missing tooth")) {
    return "William Dentist specializes in permanent, natural-looking dental implants. We offer initial consultations to evaluate your personalized plan. Should I help schedule a consultation?";
  }

  if (text.includes("appointment") || text.includes("book") || text.includes("schedule") || text.includes("slot")) {
    return "You can easily request an appointment online through our booking page or call our clinic at +1 (555) 123-4567. What day works best for you?";
  }

  if (text.includes("hour") || text.includes("open") || text.includes("time") || text.includes("address") || text.includes("location")) {
    return "William Dentist is located at 123 Smile Way, Beverly Hills, CA. We are open Monday–Thursday 9:00 AM – 5:00 PM, and Friday 9:00 AM – 1:00 PM.";
  }

  return "Thank you for reaching out to William Dentist! We offer comprehensive dental care including Invisalign, Whitening, Implants, and Cleanings. How can I assist you with your smile today?";
}

function parseN8nReply(webhookData: any): string | null {
  if (!webhookData) return null;

  if (typeof webhookData === "string" && webhookData.trim()) {
    return webhookData.trim();
  }

  if (Array.isArray(webhookData) && webhookData.length > 0) {
    const firstItem = webhookData[0];
    if (typeof firstItem === "string") return firstItem;
    if (typeof firstItem === "object") {
      return parseN8nReply(firstItem.json || firstItem);
    }
  }

  if (typeof webhookData === "object") {
    const candidate =
      webhookData.reply ||
      webhookData.output ||
      webhookData.answer ||
      webhookData.text ||
      webhookData.message ||
      webhookData.response;

    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }

    if (candidate && typeof candidate === "object") {
      return parseN8nReply(candidate);
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId: inputConvId, message, currentPage, page } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required." },
        { status: 400 }
      );
    }

    const sourcePage = currentPage || page || "/";
    const aiMode = process.env.AI_MODE || "mock";

    if (aiMode === "disabled") {
      return NextResponse.json({
        success: false,
        conversationId: inputConvId || crypto.randomUUID(),
        reply: "Our AI chat is currently disabled. Please contact our clinic directly at +1 (555) 123-4567.",
        requiresHuman: true,
      });
    }

    // Initialize Supabase Client
    let supabase;
    try {
      supabase = createServerClient();
    } catch {
      supabase = null;
    }

    let conversationId = inputConvId;

    // Create conversation in Supabase if non-existent
    if (!conversationId && supabase) {
      try {
        const { data: newConv, error: convErr } = await supabase
          .from("conversations")
          .insert({
            source_page: sourcePage,
            status: "active",
          })
          .select("id")
          .single();

        if (!convErr && newConv) {
          conversationId = newConv.id;
        }
      } catch (err) {
        console.warn("Failed to create conversation record in Supabase:", err);
      }
    }

    if (!conversationId) {
      conversationId = crypto.randomUUID();
    }

    const trimmedUserMsg = message.trim();

    // Save user message to Supabase
    if (supabase) {
      try {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "user",
          content: trimmedUserMsg,
        });
      } catch (err) {
        console.warn("Failed to save user message to Supabase:", err);
      }
    }

    let aiReply = "";

    if (aiMode === "webhook") {
      const webhookUrl = process.env.N8N_AI_CHAT_WEBHOOK_URL;

      if (!webhookUrl) {
        console.warn("AI_MODE is set to webhook, but N8N_AI_CHAT_WEBHOOK_URL is missing. Falling back to mock response.");
        aiReply = generateMockResponse(trimmedUserMsg);
      } else {
        try {
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "X-William-Dentist-Secret": process.env.N8N_WEBHOOK_SECRET || "",
          };

          const webhookRes = await fetch(webhookUrl, {
            method: "POST",
            headers,
            body: JSON.stringify({
              conversationId,
              message: trimmedUserMsg,
              currentPage: sourcePage,
            }),
          });

          if (!webhookRes.ok) {
            const errorText = await webhookRes.text();
            throw new Error(`n8n webhook failed: ${webhookRes.status} ${errorText}`);
          }

          const rawData = await webhookRes.json().catch(async () => {
            const textData = await webhookRes.text();
            return textData;
          });

          const extractedReply = parseN8nReply(rawData);
          aiReply = extractedReply || (typeof rawData === "string" ? rawData : JSON.stringify(rawData));
        } catch (webhookErr) {
          console.error("Error communicating with n8n AI Webhook:", webhookErr);
          aiReply = "I am currently unable to reach our AI assistant. Please contact the clinic directly at +1 (555) 123-4567 or try again shortly.";
        }
      }
    } else {
      // Default: AI_MODE === "mock"
      aiReply = generateMockResponse(trimmedUserMsg);
    }

    const messageId = crypto.randomUUID();

    // Save assistant message to Supabase
    if (supabase) {
      try {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: aiReply,
        });
      } catch (err) {
        console.warn("Failed to save assistant message to Supabase:", err);
      }
    }

    return NextResponse.json({
      success: true,
      conversationId,
      messageId,
      reply: aiReply,
      answer: aiReply,
    });
  } catch (error) {
    console.error("Error handling AI chat request:", error);
    return NextResponse.json({ success: false, error: "Invalid request payload" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json({ success: false, error: "Missing conversationId parameter" }, { status: 400 });
  }

  try {
    const supabase = createServerClient();
    const { data: messages, error } = await supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      conversationId,
      messages: messages || [],
    });
  } catch (error) {
    console.warn("Failed to fetch conversation history from Supabase:", error);
    return NextResponse.json({
      success: true,
      conversationId,
      messages: [],
    });
  }
}

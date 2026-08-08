import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getOAuth2Client } from "@/lib/google-calendar";
import crypto from "crypto";

export async function GET() {
  try {
    // 1. Confirm the user is an authenticated admin
    await requireAdmin();

    // 2. Generate random OAuth state value
    const state = crypto.randomBytes(32).toString("hex");

    // 3. Generate authorization URL
    const oauthClient = getOAuth2Client();
    const authorizationUrl = oauthClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      state,
      scope: [
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/calendar.freebusy",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });

    // 4. Save state in secure HTTP-only cookie & redirect
    const response = NextResponse.redirect(authorizationUrl);
    response.cookies.set("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    return response;
  } catch (e: any) {
    console.error("Google connect error:", e);
    return NextResponse.json({ error: e.message || "Unauthorized" }, { status: 401 });
  }
}

import { google } from "googleapis";
import { decryptToken } from "./crypto";
import { createServerClient } from "./supabase/server";

export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/google/callback`;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Google OAuth credentials (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET).");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Returns an authenticated Google Calendar client using an encrypted refresh token.
 */
export function getGoogleCalendarClient(encryptedRefreshToken: string) {
  const oauthClient = getOAuth2Client();
  const refreshToken = decryptToken(encryptedRefreshToken);
  oauthClient.setCredentials({ refresh_token: refreshToken });
  return google.calendar({ version: "v3", auth: oauthClient });
}

/**
 * Tests connection to Google Calendar via a Free/Busy query.
 */
export async function testGoogleCalendarConnection(
  encryptedRefreshToken: string,
  calendarId: string = "primary",
  timeZone: string = "America/Chicago"
) {
  const calendar = getGoogleCalendarClient(encryptedRefreshToken);
  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone,
      items: [{ id: calendarId }],
    },
  });

  return response.data;
}

function getTargetCalendarId(dbCalendarId?: string | null): string {
  if (!dbCalendarId || dbCalendarId.includes("holiday")) {
    return "primary";
  }
  return dbCalendarId;
}

export async function getGoogleIntegrationCredentials() {
  const supabase = createServerClient();
  const [{ data: integration }, { data: settings }] = await Promise.all([
    supabase
      .from("integration_connections")
      .select("status, refresh_token_encrypted, calendar_id, connected_email")
      .eq("provider", "google_calendar")
      .maybeSingle(),
    supabase
      .from("site_settings")
      .select("google_refresh_token_encrypted, google_calendar_id, google_status, timezone")
      .single(),
  ]);

  const refreshToken =
    integration?.refresh_token_encrypted || settings?.google_refresh_token_encrypted;
  const isConnected =
    (integration?.status === "connected" && !!integration?.refresh_token_encrypted) ||
    (settings?.google_status === "connected" && !!settings?.google_refresh_token_encrypted);
  const calendarId = getTargetCalendarId(integration?.calendar_id || settings?.google_calendar_id);
  const timezone = settings?.timezone || "America/Chicago";

  return {
    isConnected,
    refreshToken,
    calendarId,
    timezone,
  };
}

/**
 * Fetches busy time ranges from Google Calendar if connected.
 */
export async function fetchGoogleFreeBusy(
  timeMin: string,
  timeMax: string,
  timeZone: string = "America/Chicago"
): Promise<{ start: string; end: string }[]> {
  try {
    const creds = await getGoogleIntegrationCredentials();

    if (!creds.isConnected || !creds.refreshToken) {
      return [];
    }

    const calendar = getGoogleCalendarClient(creds.refreshToken);
    const tz = creds.timezone || timeZone;

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: tz,
        items: [{ id: creds.calendarId }],
      },
    });

    const busyList = response.data.calendars?.[creds.calendarId]?.busy || [];
    return busyList
      .filter((b) => b.start && b.end)
      .map((b) => ({ start: b.start!, end: b.end! }));
  } catch (err: any) {
    console.warn("Failed to fetch Google Calendar Free/Busy:", err.message);
    return [];
  }
}

/**
 * Inserts an event into Google Calendar with minimal privacy-compliant data.
 */
export async function createGoogleEvent(appointment: {
  id: string;
  patient_name: string;
  start_at: string;
  end_at: string;
}) {
  const creds = await getGoogleIntegrationCredentials();

  if (!creds.isConnected || !creds.refreshToken) {
    throw new Error("Google Calendar is not connected.");
  }

  const calendar = getGoogleCalendarClient(creds.refreshToken);
  const calendarId = creds.calendarId;
  const tz = creds.timezone;

  try {
    // Minimal patient info for privacy
    const response = await calendar.events.insert({
      calendarId,
      sendUpdates: "none",
      requestBody: {
        summary: `Dental Appointment - ${appointment.patient_name}`,
        description: `Website appointment ID: ${appointment.id}`,
        start: {
          dateTime: appointment.start_at,
          timeZone: tz,
        },
        end: {
          dateTime: appointment.end_at,
          timeZone: tz,
        },
        extendedProperties: {
          private: {
            appointmentId: appointment.id,
            source: "williamdentist.online",
          },
        },
      },
    });

    return {
      eventId: response.data.id!,
      calendarId,
    };
  } catch (e: any) {
    // Extract human-readable message from Google API error
    const googleMsg =
      e?.response?.data?.error?.message ||
      e?.errors?.[0]?.message ||
      e?.message ||
      "Google Calendar API error";
    throw new Error(`Calendar sync failed: ${googleMsg}`);
  }
}

/**
 * Updates an existing Google Calendar event for rescheduling.
 */
export async function updateGoogleEvent(
  googleEventId: string,
  appointment: {
    id: string;
    patient_name: string;
    start_at: string;
    end_at: string;
  }
) {
  const creds = await getGoogleIntegrationCredentials();

  if (!creds.isConnected || !creds.refreshToken) {
    throw new Error("Google Calendar is not connected.");
  }

  const calendar = getGoogleCalendarClient(creds.refreshToken);
  const calendarId = creds.calendarId;
  const tz = creds.timezone;

  try {
    const response = await calendar.events.patch({
      calendarId,
      eventId: googleEventId,
      sendUpdates: "none",
      requestBody: {
        summary: `Dental Appointment - ${appointment.patient_name}`,
        start: {
          dateTime: appointment.start_at,
          timeZone: tz,
        },
        end: {
          dateTime: appointment.end_at,
          timeZone: tz,
        },
      },
    });
    return response.data;
  } catch (e: any) {
    const googleMsg =
      e?.response?.data?.error?.message ||
      e?.errors?.[0]?.message ||
      e?.message ||
      "Google Calendar API error";
    throw new Error(`Calendar sync failed: ${googleMsg}`);
  }
}

/**
 * Removes an event from Google Calendar on appointment cancellation.
 */
export async function deleteGoogleEvent(googleEventId: string) {
  const creds = await getGoogleIntegrationCredentials();

  if (!creds.isConnected || !creds.refreshToken) {
    return;
  }

  const calendar = getGoogleCalendarClient(creds.refreshToken);
  const calendarId = creds.calendarId;

  await calendar.events.delete({
    calendarId,
    eventId: googleEventId,
    sendUpdates: "none",
  });
}

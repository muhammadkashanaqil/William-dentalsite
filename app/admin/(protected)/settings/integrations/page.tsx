"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, RefreshCw, CheckCircle2, AlertCircle, Loader2, Unplug } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type IntegrationStatus = {
  connected: boolean;
  status: "connected" | "not_connected" | "error";
  email: string | null;
  calendarName: string | null;
  lastTestedAt: string | null;
  lastError: string | null;
};

export default function IntegrationsPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<IntegrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.data) {
        const s = json.data;
        const isConn = s.google_status === "connected" && !!s.google_refresh_token_encrypted;
        setData({
          connected: isConn,
          status: s.google_status || "not_connected",
          email: s.google_connected_email || "williamdentist@gmail.com",
          calendarName: s.google_calendar_name || "William Dentist Appointments",
          lastTestedAt: s.google_last_tested_at,
          lastError: s.google_last_error,
        });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load integration settings." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    if (searchParams.get("connected") === "true") {
      setMessage({ type: "success", text: "Google Calendar connected successfully!" });
    } else if (searchParams.get("error")) {
      setMessage({ type: "error", text: `Connection error: ${searchParams.get("error")}` });
    }
  }, [fetchStatus, searchParams]);

  const handleTestConnection = async () => {
    setTesting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/google/test", { method: "POST" });
      const json = await res.json();
      if (res.ok && json.success) {
        setMessage({ type: "success", text: "Test successful! Free/Busy query verified." });
        await fetchStatus();
      } else {
        setMessage({ type: "error", text: json.error || "Connection test failed." });
      }
    } catch (e: any) {
      setMessage({ type: "error", text: e.message || "Failed to test connection." });
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Google Calendar? Appointments will no longer sync automatically.")) {
      return;
    }
    setDisconnecting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/google/disconnect", { method: "POST" });
      if (res.ok) {
        setMessage({ type: "success", text: "Google Calendar disconnected." });
        await fetchStatus();
      } else {
        setMessage({ type: "error", text: "Failed to disconnect." });
      }
    } catch (e: any) {
      setMessage({ type: "error", text: e.message || "Disconnect failed." });
    } finally {
      setDisconnecting(false);
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "Never";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/admin/settings" className="hover:text-cyan-600">Settings</Link>
            <span>/</span>
            <span>Integrations</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
          <p className="text-sm text-slate-500 mt-1">
            Connect external calendar and automation tools for William Dentist.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs font-semibold underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Google Calendar Integration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Google Calendar</h2>
              <p className="text-xs text-slate-500">Sync appointments and calculate availability in real time.</p>
            </div>
          </div>

          {!loading && data && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                data.connected
                  ? "bg-green-100 text-green-800"
                  : data.status === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${data.connected ? "bg-green-500" : data.status === "error" ? "bg-red-500" : "bg-slate-400"}`} />
              {data.connected ? "Connected" : data.status === "error" ? "Connection Error" : "Not connected"}
            </span>
          )}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-8 flex items-center justify-center text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-600 mr-2" />
              Loading integration status...
            </div>
          ) : data?.connected ? (
            /* Connected View */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Account</p>
                  <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">{data.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Calendar</p>
                  <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">{data.calendarName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Last Tested</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{formatDate(data.lastTestedAt)}</p>
                </div>
              </div>

              {data.lastError && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  <span className="font-semibold">Last warning: </span>{data.lastError}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  {testing ? "Testing..." : "Test Connection"}
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-semibold hover:bg-red-100 disabled:opacity-50 transition-colors"
                >
                  {disconnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unplug className="h-4 w-4" />}
                  {disconnecting ? "Disconnecting..." : "Disconnect"}
                </button>
              </div>
            </div>
          ) : (
            /* Not Connected View */
            <div className="space-y-6">
              {data?.status === "error" && data?.lastError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">Connection Error</p>
                    <p className="mt-0.5">{data.lastError}</p>
                  </div>
                </div>
              )}
              <p className="text-sm text-slate-600">
                Connect your clinic&apos;s Google Calendar to automatically block off busy time slots on the booking page and create calendar events for new patient appointments.
              </p>
              <div>
                <a
                  href="/api/google/connect"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-500 shadow-sm transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  {data?.status === "error" ? "Reconnect Google Calendar" : "Connect Google Calendar"}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

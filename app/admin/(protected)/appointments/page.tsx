"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Calendar, Loader2, ChevronDown, Trash2, RefreshCw } from "lucide-react";

type Appointment = {
  id: string;
  reference: string;
  patient_name: string;
  patient_phone: string | null;
  patient_email: string | null;
  patient_type: string;
  start_at: string;
  end_at: string;
  status: string;
  calendar_sync_status: string;
  calendar_error_message?: string | null;
  notes: string | null;
  services: { name: string; duration_minutes: number } | null;
};

const STATUS_OPTIONS = ["requested", "confirmed", "completed", "cancelled", "no_show", "reschedule_requested"];

const STATUS_COLORS: Record<string, string> = {
  requested: "bg-orange-100 text-orange-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-slate-100 text-slate-600",
  reschedule_requested: "bg-purple-100 text-purple-800",
};

const SYNC_DISPLAY: Record<string, { label: string; cls: string }> = {
  synced: { label: "✓ Synced", cls: "text-green-600 font-semibold" },
  pending: { label: "⟳ Pending", cls: "text-orange-500 font-medium" },
  failed: { label: "✕ Failed", cls: "text-red-500 font-semibold" },
  cancelled: { label: "– Cancelled", cls: "text-slate-400 font-normal" },
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const fetchAppointments = useCallback(async (q = "", status = "all") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status !== "all") params.set("status", status);
      const res = await fetch(`/api/admin/appointments?${params.toString()}`);
      const json = await res.json();
      setAppointments(json.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments(search, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    fetchAppointments(search, status);
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchAppointments(search, statusFilter);
    setUpdatingId(null);
  };

  const retrySync = async (id: string) => {
    setSyncingId(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, { method: "POST" });
      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        json = { error: `Server response error (${res.status})` };
      }

      if (!res.ok) {
        alert(`Sync failed: ${json.error || "Could not sync with Google Calendar"}`);
      }
    } catch (e: any) {
      alert(`Sync error: ${e.message}`);
    } finally {
      await fetchAppointments(search, statusFilter);
      setSyncingId(null);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("Delete this appointment? This cannot be undone.")) return;
    setUpdatingId(id);
    await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
    await fetchAppointments(search, statusFilter);
    setUpdatingId(null);
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago" }),
      time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" }),
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage patient appointments and Google Calendar sync.</p>
        </div>
        <a href="/appointments/request" target="_blank" className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 transition-colors">
          <Calendar className="h-4 w-4" />
          New Appointment
        </a>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <form onSubmit={handleSearch} className="relative flex gap-2 w-full max-w-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search patients or reference..."
                className="w-full rounded-md border-0 py-2 pl-9 pr-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600"
              />
            </div>
            <button type="submit" className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
              Go
            </button>
          </form>
          <div className="flex gap-2 flex-wrap">
            {["all", "requested", "confirmed", "completed", "cancelled"].map(s => (
              <button
                key={s}
                onClick={() => handleStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${statusFilter === s ? "bg-cyan-600 text-white" : "bg-white text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white">
                <tr>
                  <th className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Service</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Google Sync</th>
                  <th className="relative py-3.5 pl-3 pr-6"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 text-sm">
                      No appointments found.
                    </td>
                  </tr>
                )}
                {appointments.map((apt) => {
                  const { date, time } = formatDateTime(apt.start_at);
                  const sync = SYNC_DISPLAY[apt.calendar_sync_status] || SYNC_DISPLAY["pending"];
                  return (
                    <tr key={apt.id} className={`hover:bg-slate-50 transition-colors ${updatingId === apt.id ? "opacity-50" : ""}`}>
                      <td className="py-4 pl-6 pr-3">
                        <p className="text-sm font-medium text-slate-900">{apt.patient_name}</p>
                        {apt.patient_phone && <p className="text-xs text-slate-500">{apt.patient_phone}</p>}
                        {apt.patient_email && <p className="text-xs text-slate-500">{apt.patient_email}</p>}
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{apt.reference}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                        {apt.services?.name || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <p className="text-sm font-medium text-slate-900">{date}</p>
                        <p className="text-xs text-slate-500">{time}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="relative inline-block">
                          <select
                            value={apt.status}
                            onChange={e => updateStatus(apt.id, e.target.value)}
                            disabled={updatingId === apt.id}
                            className={`appearance-none pr-6 pl-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer border-0 ring-0 focus:ring-1 focus:ring-cyan-600 ${STATUS_COLORS[apt.status] || "bg-slate-100 text-slate-600"}`}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 opacity-60" />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`text-xs ${sync.cls}`}>{sync.label}</span>
                          {apt.calendar_sync_status === "failed" && (
                            <button
                              type="button"
                              onClick={() => retrySync(apt.id)}
                              disabled={syncingId === apt.id}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200 transition-colors disabled:opacity-50"
                            >
                              {syncingId === apt.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                              Retry Calendar Sync
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right">
                        <button
                          onClick={() => deleteAppointment(apt.id)}
                          disabled={updatingId === apt.id}
                          className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-white border-t border-slate-200 px-6 py-4">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium">{appointments.length}</span> appointment{appointments.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

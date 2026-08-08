"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

type Settings = {
  clinic_name: string;
  dentist_name: string;
  phone: string;
  email: string;
  address_line1: string;
  city: string;
  region: string;
  postal_code: string;
  timezone: string;
  slot_interval_minutes: number;
  booking_horizon_days: number;
  minimum_lead_hours: number;
};

const defaultSettings: Settings = {
  clinic_name: "William Dentist",
  dentist_name: "Dr. William",
  phone: "+1 (555) 123-4567",
  email: "hello@williamdentist.online",
  address_line1: "123 Smile Way",
  city: "Beverly Hills",
  region: "CA",
  postal_code: "90210",
  timezone: "America/Los_Angeles",
  slot_interval_minutes: 30,
  booking_horizon_days: 60,
  minimum_lead_hours: 2,
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(json => {
        if (json.data) setForm({ ...defaultSettings, ...json.data });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Failed to save");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof Settings, value: string | number) =>
    setForm(f => ({ ...f, [key]: value }));

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage clinic details and booking preferences.</p>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
      {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">✓ Settings saved successfully!</p>}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-8">

          {/* Clinic Info */}
          <section>
            <h2 className="text-base font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2">Clinic Information</h2>
            <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
              {[
                { label: "Clinic Name", key: "clinic_name" as keyof Settings, col: 2 },
                { label: "Dentist Name", key: "dentist_name" as keyof Settings, col: 2 },
                { label: "Contact Email", key: "email" as keyof Settings, col: 1 },
                { label: "Contact Phone", key: "phone" as keyof Settings, col: 1 },
                { label: "Street Address", key: "address_line1" as keyof Settings, col: 2 },
                { label: "City", key: "city" as keyof Settings, col: 1 },
                { label: "State / Region", key: "region" as keyof Settings, col: 1 },
                { label: "Postal Code", key: "postal_code" as keyof Settings, col: 1 },
              ].map(({ label, key, col }) => (
                <div key={key} className={col === 2 ? "sm:col-span-2" : ""}>
                  <label className="block text-sm font-medium leading-6 text-slate-900">{label}</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={form[key] as string}
                      onChange={e => set(key, e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Booking Settings */}
          <section>
            <h2 className="text-base font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2">Booking Settings</h2>
            <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">Slot Interval</label>
                <div className="mt-1">
                  <select value={form.slot_interval_minutes} onChange={e => set("slot_interval_minutes", Number(e.target.value))} className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm">
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">Booking Horizon (days)</label>
                <div className="mt-1">
                  <input type="number" min={7} max={365} value={form.booking_horizon_days} onChange={e => set("booking_horizon_days", Number(e.target.value))} className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">Min Lead Time (hours)</label>
                <div className="mt-1">
                  <input type="number" min={0} max={72} value={form.minimum_lead_hours} onChange={e => set("minimum_lead_hours", Number(e.target.value))} className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm" />
                </div>
              </div>
            </div>
          </section>

          {/* Integrations link */}
          <section>
            <h2 className="text-base font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2">Integrations</h2>
            <div className="space-y-3">
              <a href="/admin/settings/integrations" className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors group">
                <div>
                  <p className="font-medium text-slate-900 text-sm group-hover:text-cyan-600 transition-colors">Google Calendar</p>
                  <p className="text-xs text-slate-500 mt-0.5">Manage OAuth connection, Free/Busy synchronization, and calendar event settings.</p>
                </div>
                <span className="inline-flex items-center text-xs font-semibold text-cyan-600 group-hover:translate-x-0.5 transition-transform">
                  Manage Integrations →
                </span>
              </a>
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900 text-sm">n8n Workflow Webhooks</p>
                  <p className="text-xs text-slate-500 mt-0.5">Configure via <code className="bg-slate-200 px-1 rounded">.env.local</code> → <code className="bg-slate-200 px-1 rounded">N8N_AI_CHAT_WEBHOOK_URL</code></p>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${process.env.NEXT_PUBLIC_N8N_CONFIGURED ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-500"}`}>
                  {process.env.NEXT_PUBLIC_N8N_CONFIGURED ? "Connected" : "Not configured"}
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex items-center justify-end border-t border-slate-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Mail, Loader2, ChevronDown } from "lucide-react";

type Lead = {
  id: string;
  reference: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  message: string | null;
  created_at: string;
  services?: { name: string } | null;
};

const STATUS_OPTIONS = ["new", "contacted", "qualified", "appointment_requested", "booked", "follow_up", "not_interested", "closed"];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-cyan-100 text-cyan-800",
  contacted: "bg-blue-100 text-blue-800",
  qualified: "bg-indigo-100 text-indigo-800",
  appointment_requested: "bg-purple-100 text-purple-800",
  booked: "bg-green-100 text-green-800",
  follow_up: "bg-orange-100 text-orange-800",
  not_interested: "bg-slate-100 text-slate-600",
  closed: "bg-red-100 text-red-700",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      const json = await res.json();
      setLeads(json.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads(search);
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchLeads(search);
    setUpdatingId(null);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leads & Inquiries</h1>
        <p className="text-sm text-slate-500 mt-1">Manage patient inquiries submitted via the contact form.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50">
          <form onSubmit={handleSearch} className="relative max-w-sm w-full flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email, or ref..."
                className="w-full rounded-md border-0 py-2 pl-9 pr-4 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-cyan-600"
              />
            </div>
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
              <Filter className="h-4 w-4 text-slate-400" />
            </button>
          </form>
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
                  <th className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Service</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="relative py-3.5 pl-3 pr-6"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {leads.length === 0 && (
                  <tr><td colSpan={5} className="py-12 text-center text-slate-400 text-sm">No leads found.</td></tr>
                )}
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pl-6 pr-3">
                      <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                      {lead.email && <p className="text-xs text-slate-500">{lead.email}</p>}
                      {lead.phone && <p className="text-xs text-slate-500">{lead.phone}</p>}
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{lead.reference}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                      {lead.services?.name || "General Inquiry"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="relative inline-block">
                        <select
                          value={lead.status}
                          onChange={e => updateStatus(lead.id, e.target.value)}
                          disabled={updatingId === lead.id}
                          className={`appearance-none pr-6 pl-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer border-0 ring-1 ring-inset ring-transparent focus:ring-cyan-600 ${STATUS_COLORS[lead.status] || "bg-slate-100 text-slate-600"}`}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 opacity-60" />
                      </div>
                    </td>
                    <td className="py-4 pl-3 pr-6 text-right">
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="text-slate-400 hover:text-cyan-600 p-2 inline-block">
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-white border-t border-slate-200 px-6 py-4">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium">{leads.length}</span> lead{leads.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

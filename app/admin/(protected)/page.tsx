"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarDays, Users, TrendingUp, Clock, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";

type Stats = {
  totalAppointments: number;
  pendingAppointments: number;
  totalLeads: number;
  newLeads: number;
  conversionRate: number;
  pendingSyncs: number;
};

type Activity = {
  id: string;
  type: "appointment" | "lead";
  name: string;
  service: string;
  status: string;
  timestamp: string;
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  requested: "bg-orange-100 text-orange-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-700",
  new: "bg-cyan-100 text-cyan-800",
  contacted: "bg-blue-100 text-blue-800",
  booked: "bg-green-100 text-green-800",
  qualified: "bg-indigo-100 text-indigo-800",
  follow_up: "bg-orange-100 text-orange-800",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<"checking" | "ok" | "error">("checking");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setStats(json.data.stats);
      setActivity(json.data.recentActivity);
      setDbStatus("ok");
    } catch {
      setDbStatus("error");
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchOverview, 60000);
    return () => clearInterval(interval);
  }, [fetchOverview]);

  const statCards = stats
    ? [
        {
          name: "Total Appointments",
          value: stats.totalAppointments,
          sub: `${stats.pendingAppointments} pending review`,
          icon: CalendarDays,
          positive: true,
        },
        {
          name: "New Leads",
          value: stats.newLeads,
          sub: `${stats.totalLeads} total leads`,
          icon: Users,
          positive: true,
        },
        {
          name: "Conversion Rate",
          value: `${stats.conversionRate}%`,
          sub: "Leads → booked",
          icon: TrendingUp,
          positive: stats.conversionRate >= 0,
        },
        {
          name: "Pending Syncs",
          value: stats.pendingSyncs,
          sub: "Awaiting calendar sync",
          icon: Clock,
          positive: stats.pendingSyncs === 0,
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Here&apos;s what&apos;s happening at your clinic today.</p>
        </div>
        <button
          onClick={fetchOverview}
          disabled={loading}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : `Refreshed ${timeAgo(lastRefresh.toISOString())}`}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && !stats
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4" />
                <div className="h-8 bg-slate-100 rounded w-1/2" />
              </div>
            ))
          : statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.name} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                    <Icon className="h-5 w-5 text-cyan-600" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className={`text-xs mt-1 font-medium ${stat.positive ? "text-green-600" : "text-orange-500"}`}>
                    {stat.sub}
                  </p>
                </div>
              );
            })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Activity</h2>
            <Link href="/admin/appointments" className="text-sm text-cyan-600 font-medium hover:text-cyan-700">
              View All
            </Link>
          </div>
          {loading && activity.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
            </div>
          ) : activity.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">No recent activity yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activity.map((item) => (
                <div key={item.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                      item.type === "appointment" ? "bg-orange-100 text-orange-600" : "bg-cyan-100 text-cyan-600"
                    }`}>
                      {item.type === "appointment"
                        ? <CalendarDays className="h-5 w-5" />
                        : <Users className="h-5 w-5" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.service} &bull; {item.type === "appointment" ? "Appointment" : "Inquiry"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[item.status] || "bg-slate-100 text-slate-600"}`}>
                      {item.status.replace(/_/g, " ")}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{timeAgo(item.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">System Status</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Database */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-slate-700">Database Connection</p>
                {dbStatus === "checking" ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300 animate-pulse" />
                ) : dbStatus === "ok" ? (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                )}
              </div>
              <p className="text-xs text-slate-500">
                {dbStatus === "ok" ? "Connected to Supabase successfully." : dbStatus === "error" ? "Failed to connect to database." : "Checking connection..."}
              </p>
            </div>

            {/* Stats summary */}
            {stats && (
              <>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Stats</p>
                  <div className="space-y-3">
                    {[
                      { label: "Confirmed appointments", value: stats.totalAppointments - stats.pendingAppointments },
                      { label: "Awaiting confirmation", value: stats.pendingAppointments, highlight: stats.pendingAppointments > 0 },
                      { label: "Unreviewed leads", value: stats.newLeads, highlight: stats.newLeads > 0 },
                      { label: "Unsynced calendar", value: stats.pendingSyncs, highlight: stats.pendingSyncs > 0 },
                    ].map(({ label, value, highlight }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{label}</span>
                        <span className={`text-xs font-bold ${highlight ? "text-orange-500" : "text-slate-700"}`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <Link href="/admin/appointments" className="block text-xs text-center text-cyan-600 hover:text-cyan-700 font-medium py-1.5 border border-cyan-200 rounded-lg hover:bg-cyan-50 transition-colors">
                    Manage Appointments →
                  </Link>
                  <Link href="/admin/leads" className="block text-xs text-center text-slate-600 hover:text-slate-700 font-medium py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    Review Leads →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

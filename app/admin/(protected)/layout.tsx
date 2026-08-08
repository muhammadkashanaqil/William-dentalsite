import { requireAdmin } from "@/lib/auth";
import { signOutAction } from "./actions";
import { LogOut, Bell } from "lucide-react";
import { SidebarNav } from "./SidebarNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  const initials = profile.display_name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-900">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shrink-0 hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="font-serif font-bold text-xl tracking-wide">
            William<span className="text-cyan-400">Dentist</span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav />
        </div>
        <div className="p-4 border-t border-slate-800">
          {/* Admin info */}
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-semibold text-xs shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile.display_name}
              </p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          {/* Sign out form (server action) */}
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 hover:text-white w-full transition-colors"
            >
              <LogOut className="mr-3 shrink-0 h-5 w-5 text-slate-400" />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="md:hidden font-serif font-bold text-lg">
            William<span className="text-cyan-600">Dentist</span> Admin
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-orange-500" />
            </button>
            <div className="h-8 w-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-semibold text-xs">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

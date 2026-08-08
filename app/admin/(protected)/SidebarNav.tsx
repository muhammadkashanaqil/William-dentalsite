"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Appointments", href: "/admin/appointments", icon: CalendarDays },
  { name: "Leads", href: "/admin/leads", icon: Users },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="px-3 space-y-1">
      {navigation.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? "bg-cyan-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon
              className={`mr-3 shrink-0 h-5 w-5 ${
                isActive ? "text-cyan-100" : "text-slate-400"
              }`}
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

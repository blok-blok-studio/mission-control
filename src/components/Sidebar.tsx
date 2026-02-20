"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ClipboardList,
  Film,
  ShieldCheck,
  Users,
  Calendar,
  FolderOpen,
  Brain,
  FileText,
  Building2,
  MessageSquareText,
  Network,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/content", label: "Content", icon: Film },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/agents", label: "Org Chart", icon: Network },
  { href: "/office", label: "Office", icon: Building2 },
  { href: "/council", label: "Council", icon: Users },
  { href: "/approvals", label: "Approvals", icon: ShieldCheck },
  { href: "/memories", label: "Memory", icon: Brain },
  { href: "/feedback", label: "Feedback", icon: MessageSquareText },
  { href: "/docs", label: "Docs", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-zinc-950 border-r border-zinc-800/60 flex flex-col z-50">
      <div className="px-4 py-4 flex items-center gap-2.5">
        <div className="flex items-center gap-1 text-zinc-400">
          <LayoutGrid size={16} />
          <span className="text-lg">⚡</span>
        </div>
        <span className="text-sm font-semibold text-zinc-200 tracking-tight">
          Mission Control
        </span>
      </div>

      <nav className="flex-1 px-2 space-y-0.5 mt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                isActive
                  ? "bg-zinc-800/80 text-white font-medium"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40"
              }`}
            >
              <Icon size={16} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-2 border-t border-zinc-800/60">
        <div className="bg-zinc-900/50 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-[10px] text-zinc-600 mb-1.5">
            <span>28 agents</span>
            <span>•</span>
            <span>4 departments</span>
          </div>
          <div className="flex gap-1">
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">1 Opus</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400">17 Sonnet</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-400">10 Haiku</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-400/15 flex items-center justify-center text-xs">
            ⚡
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-300">Cortana</p>
            <p className="text-[10px] text-green-500">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

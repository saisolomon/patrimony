"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Wallet,
  Building2,
  Brain,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assets", label: "Assets", icon: Wallet },
  { href: "/entities", label: "Entities", icon: Building2 },
  { href: "/insights", label: "Insights", icon: Brain },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-border bg-bg-secondary transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-border px-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
              <span className="text-lg font-bold text-gold">P</span>
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight text-text-primary">
                Patrimony
              </span>
              <span className="ml-1.5 text-[10px] font-medium uppercase tracking-widest text-gold">
                UHNW
              </span>
            </div>
          </Link>
          <button
            className="rounded-lg p-1.5 text-text-muted hover:bg-bg-card hover:text-text-primary lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gold/10 text-gold"
                    : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
                }`}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive
                      ? "text-gold"
                      : "text-text-muted group-hover:text-text-secondary"
                  }`}
                />
                {item.label}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Area */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-xl px-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-sm font-semibold text-gold">
              {user?.firstName?.[0]}{user?.lastName?.[0] || ""}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">
                {user?.firstName} {user?.lastName?.[0] ? `${user.lastName[0]}.` : ""}
              </p>
              <p className="truncate text-xs text-gold">Patrimony</p>
            </div>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-card hover:text-danger"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-[280px]">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-bg-primary/80 px-4 backdrop-blur-xl lg:hidden">
          <button
            className="rounded-lg p-2 text-text-secondary hover:bg-bg-card hover:text-text-primary"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/10">
              <span className="text-sm font-bold text-gold">P</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              Patrimony
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

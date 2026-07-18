import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileImage,
  LayoutDashboard,
  Monitor,
  Radio,
  Tablet,
  Users,
} from "lucide-react";
import Logo from "./Logo";
import TableExportMenu from "./TableExportMenu";

const NAV = [
  { href: "#dashboard", label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { href: "#dashboard-tv", label: "TV Display", icon: Monitor, id: "tv" },
  { href: "#checkin", label: "Check-in", icon: Tablet, id: "venue" },
  { href: "#admin", label: "Attendees", icon: Users, id: "admin" },
  { href: "#signage", label: "Signage", icon: FileImage, id: "signage" },
];

const STORAGE_KEY = "ops-sidebar-collapsed";

export default function OpsShell({
  active,
  title,
  subtitle,
  children,
  actions,
  exportData,
}) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  return (
    <div className="ops-ui min-h-screen bg-slate-100">
      {/* Mobile top bar */}
      <header className="border-b border-white/10 bg-navy px-4 py-3 md:hidden">
        <Logo variant="light" />
        <nav className="mt-3 flex gap-1 overflow-x-auto pb-1">
          {NAV.map(({ href, label, icon: Icon, id }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={href}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                  isActive ? "bg-brand-blue text-navy" : "text-blue-100/80"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </a>
            );
          })}
          {exportData && (
            <div className="shrink-0">
              <TableExportMenu {...exportData} variant="dark" />
            </div>
          )}
        </nav>
      </header>

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 hidden flex-col bg-navy text-white transition-[width] duration-200 ease-out md:flex ${
            collapsed ? "w-[4.5rem]" : "w-64"
          }`}
        >
          <div
            className={`flex items-center border-b border-white/10 py-4 ${
              collapsed ? "justify-center px-2" : "justify-between px-4"
            }`}
          >
            {!collapsed && (
              <div className="min-w-0">
                <Logo variant="light" />
                <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-blue-200/70">
                  Event Operations
                </p>
              </div>
            )}
            {collapsed && (
              <Logo variant="light" size="sm" />
            )}
            {!collapsed && (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="rounded-lg p-1.5 text-blue-200/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>

          {collapsed && (
            <div className="flex justify-center py-2">
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="rounded-lg p-1.5 text-blue-200/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <nav className={`flex-1 space-y-1 py-4 ${collapsed ? "px-2" : "px-3"}`}>
            {NAV.map(({ href, label, icon: Icon, id }) => {
              const isActive = active === id;
              return (
                <a
                  key={id}
                  href={href}
                  title={collapsed ? label : undefined}
                  className={`flex items-center rounded-xl text-sm font-medium transition-colors ${
                    collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
                  } ${
                    isActive
                      ? "bg-brand-blue text-navy"
                      : "text-blue-100/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && label}
                </a>
              );
            })}
          </nav>

          <div className={`space-y-2 border-t border-white/10 py-4 ${collapsed ? "px-2" : "px-3"}`}>
            {exportData && (
              <div className={collapsed ? "flex justify-center" : ""}>
                <TableExportMenu
                  {...exportData}
                  variant="dark"
                />
              </div>
            )}
            {!collapsed && (
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-blue-200/60">
                <Radio className="h-3.5 w-3.5 shrink-0 text-brand-blue" />
                <span className="truncate">Ghana Hubs AGM 2026</span>
              </div>
            )}
          </div>
        </aside>

        <div
          className={`flex min-h-screen flex-1 flex-col transition-[padding] duration-200 ease-out ${
            collapsed ? "md:pl-[4.5rem]" : "md:pl-64"
          }`}
        >
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setCollapsed((c) => !c)}
                  className="mt-0.5 hidden rounded-lg p-2 text-slate-400 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 hover:text-navy md:inline-flex"
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {collapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </button>
                <div>
                  <p className="text-xs font-medium text-brand-blue">Live Intelligence</p>
                  <h1 className="text-xl font-bold text-navy sm:text-2xl">{title}</h1>
                  {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
                </div>
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          </header>

          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

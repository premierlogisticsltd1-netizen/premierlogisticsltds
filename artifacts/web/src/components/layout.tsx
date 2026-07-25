import { Link, useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { useGetMe } from "@workspace/api-client-react";
import {
  Package2, LayoutDashboard, Truck, LogOut, Loader2, Search,
  Users, FileText, Receipt, BarChart3, Shield, UserCircle,
  Menu, X, Phone, Bell, ChevronRight, Plus, Home,
} from "lucide-react";
import { useListNotifications, useMarkNotificationRead } from "@workspace/api-client-react";
import { useState } from "react";

const PHONE = "+1 202 753 0933";
const PHONE_HREF = "tel:+12027530933";

// Maps routes → { title, parent? }
const PAGE_META: Record<string, { title: string; parent?: string }> = {
  "/dashboard":           { title: "Dashboard" },
  "/shipments":           { title: "Shipments",        parent: "/dashboard" },
  "/shipments/new":       { title: "New Shipment",     parent: "/shipments" },
  "/customers":           { title: "Customers",        parent: "/dashboard" },
  "/drivers":             { title: "Drivers",          parent: "/dashboard" },
  "/quotes":              { title: "Quotes",           parent: "/dashboard" },
  "/invoices":            { title: "Invoices",         parent: "/dashboard" },
  "/reports":             { title: "Reports",          parent: "/dashboard" },
  "/portal":              { title: "My Account" },
  "/track":               { title: "Track Shipment" },
  "/admin":               { title: "User Management",  parent: "/dashboard" },
  "/admin/contact-messages": { title: "Contact Messages", parent: "/admin" },
};

function getBreadcrumbs(location: string): { label: string; href: string }[] {
  // exact match first, then prefix
  const meta =
    PAGE_META[location] ??
    Object.entries(PAGE_META)
      .filter(([k]) => k !== "/dashboard" && location.startsWith(k))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1];

  if (!meta) return [];

  const crumbs: { label: string; href: string }[] = [];
  if (meta.parent) {
    const parentMeta = PAGE_META[meta.parent];
    if (parentMeta) crumbs.push({ label: parentMeta.title, href: meta.parent });
  }
  crumbs.push({ label: meta.title, href: location });
  return crumbs;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { data: me } = useGetMe();
  const [location] = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const role = me?.role;

  const { data: notifications = [] } = useListNotifications({
    query: { enabled: !!isAuthenticated, queryKey: ["listNotifications"] },
  });
  const markRead = useMarkNotificationRead();
  const unreadCount = notifications.filter((n: { read: boolean }) => !n.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return <>{children}</>;

  const roleStr = role as string | undefined;
  const isOwner    = roleStr === "owner";
  const isStaff    = isOwner || ["admin","manager","operations","support","tracking_agent","staff"].includes(roleStr ?? "");
  const isAdmin    = isOwner || roleStr === "admin" || roleStr === "manager";
  const isCustomer = roleStr === "customer";
  const isDriver   = roleStr === "driver";

  const navGroups = [
    ...(isStaff ? [
      {
        label: "Operations",
        items: [
          { href: "/dashboard", label: "Dashboard",  icon: LayoutDashboard },
          { href: "/shipments", label: "Shipments",  icon: Package2 },
          { href: "/customers", label: "Customers",  icon: Users },
          { href: "/drivers",   label: "Drivers",    icon: Truck },
        ],
      },
      {
        label: "Finance",
        items: [
          { href: "/quotes",   label: "Quotes",   icon: FileText },
          { href: "/invoices", label: "Invoices", icon: Receipt },
          { href: "/reports",  label: "Reports",  icon: BarChart3 },
        ],
      },
    ] : []),
    ...(isDriver ? [
      {
        label: "My Deliveries",
        items: [
          { href: "/shipments", label: "Assigned Shipments", icon: Package2 },
          { href: "/track",     label: "Track Shipment",     icon: Search },
        ],
      },
    ] : []),
    ...(isCustomer ? [
      {
        label: "My Account",
        items: [
          { href: "/portal",   label: "My Account",   icon: UserCircle },
          { href: "/quotes",   label: "My Quotes",    icon: FileText },
          { href: "/invoices", label: "My Invoices",  icon: Receipt },
        ],
      },
    ] : []),
    {
      label: "Tools",
      items: [
        ...(isStaff || isDriver ? [{ href: "/track", label: "Track Shipment", icon: Search }] : []),
        ...(isAdmin ? [{ href: "/admin",                 label: "User Management",  icon: Shield  }] : []),
        ...(isAdmin ? [{ href: "/admin/contact-messages", label: "Contact Messages", icon: FileText }] : []),
      ],
    },
  ].filter(g => g.items.length > 0);

  const roleColors: Record<string, string> = {
    owner:          "bg-purple-100 text-purple-700",
    admin:          "bg-red-100 text-red-700",
    manager:        "bg-rose-100 text-rose-700",
    operations:     "bg-blue-100 text-blue-700",
    support:        "bg-cyan-100 text-cyan-700",
    tracking_agent: "bg-indigo-100 text-indigo-700",
    staff:          "bg-blue-100 text-blue-700",
    driver:         "bg-yellow-100 text-yellow-700",
    customer:       "bg-green-100 text-green-700",
  };

  const roleLabels: Record<string, string> = {
    owner: "Owner", admin: "Admin", manager: "Manager",
    operations: "Operations", support: "Support",
    tracking_agent: "Tracking Agent", staff: "Staff",
    driver: "Driver", customer: "Customer",
  };

  const breadcrumbs = getBreadcrumbs(location);
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label ?? "Dashboard";

  const initials =
    ((user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")).toUpperCase() || "U";

  const NavItem = ({ item }: { item: { href: string; label: string; icon: React.ElementType } }) => {
    const Icon = item.icon;
    const isActive =
      location === item.href ||
      (item.href !== "/" && location.startsWith(item.href));
    return (
      <Link
        href={item.href}
        onClick={() => setMobileSidebarOpen(false)}
        className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
          isActive
            ? "bg-primary text-white shadow-sm"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        }`}
      >
        <Icon className={`h-4 w-4 shrink-0 transition-transform duration-150 ${isActive ? "" : "group-hover:scale-110"}`} />
        <span className="flex-1 truncate">{item.label}</span>
        {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-70" />}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full select-none">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border gap-3 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={() => setMobileSidebarOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow group-hover:bg-primary/90 transition-colors">
            <Truck className="h-4 w-4 text-white" />
          </span>
          <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-black tracking-wide text-sidebar-foreground text-sm leading-tight">
            PREMIER<br /><span className="text-primary">LOGISTICS</span>
          </span>
        </Link>
      </div>

      {/* Quick create */}
      {isStaff && (
        <div className="px-4 pt-4 pb-2">
          <Link
            href="/shipments/new"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Shipment
          </Link>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-2 px-3 space-y-4 overflow-y-auto scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/35 select-none">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => <NavItem key={item.href} item={item} />)}
            </div>
          </div>
        ))}
      </nav>

      {/* Notifications */}
      <div className="px-3 py-2 border-t border-sidebar-border relative">
        <button
          onClick={() => setNotifOpen(v => !v)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-lg transition-colors"
        >
          <Bell className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute bottom-full left-2 right-2 mb-1 bg-popover border border-border rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">Notifications</span>
              <button onClick={() => setNotifOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">You're all caught up.</p>
            ) : (
              notifications.slice(0, 10).map((n: { id: number; title: string; message: string; read: boolean; createdAt: string }) => (
                <div
                  key={n.id}
                  onClick={() => { if (!n.read) markRead.mutate({ id: n.id }); }}
                  className={`px-4 py-3 border-b border-border/50 last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                    <div className={!n.read ? "" : "pl-4"}>
                      <p className={`text-xs font-semibold ${!n.read ? "text-primary" : "text-foreground"}`}>{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Contact */}
      <div className="px-5 py-2 border-t border-sidebar-border">
        <a href={PHONE_HREF} className="flex items-center gap-2 text-xs text-sidebar-foreground/40 hover:text-primary transition-colors">
          <Phone className="h-3 w-3" />
          {PHONE}
        </a>
      </div>

      {/* User */}
      <div className="p-4 border-t border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 px-1 mb-3">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="Avatar" className="h-9 w-9 rounded-full object-cover ring-2 ring-sidebar-border" />
          ) : (
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center font-bold text-sm text-white shrink-0">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-sidebar-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            {role && (
              <span className={`inline-flex items-center px-1.5 py-0 rounded text-[10px] font-bold capitalize mt-0.5 ${roleColors[roleStr ?? ""] ?? "bg-primary/10 text-primary"}`}>
                {roleLabels[roleStr ?? ""] ?? roleStr}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border hidden md:flex flex-col shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-sidebar text-sidebar-foreground flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 z-10 text-sidebar-foreground/50 hover:text-sidebar-foreground p-1 rounded-md hover:bg-sidebar-accent transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top header — always visible */}
        <header className="h-14 border-b border-border bg-white/80 backdrop-blur-sm flex items-center gap-4 px-4 md:px-6 shrink-0 sticky top-0 z-30">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-sm min-w-0 flex-1" aria-label="Breadcrumb">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <Home className="h-3.5 w-3.5" />
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
                <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors truncate">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-foreground truncate">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick track */}
            <Link
              href="/track"
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-3 py-1.5 hover:bg-muted transition-colors font-medium"
            >
              <Search className="h-3.5 w-3.5" />
              Track
            </Link>

            {/* Notifications (mobile) */}
            <div className="relative md:hidden">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* New Shipment — header CTA on desktop */}
            {isStaff && (
              <Link
                href="/shipments/new"
                className="hidden md:flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-md px-3 py-1.5 transition-colors shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                New Shipment
              </Link>
            )}

            {/* Avatar */}
            <div className="flex items-center gap-2 ml-1">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Avatar" className="h-7 w-7 rounded-full object-cover ring-2 ring-border" />
              ) : (
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

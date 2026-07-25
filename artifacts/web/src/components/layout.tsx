import { Link, useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { useGetMe } from "@workspace/api-client-react";
import {
  Package2, LayoutDashboard, Truck, LogOut, Loader2, Search,
  Users, FileText, Receipt, BarChart3, Shield, UserCircle,
  Menu, X, Phone, ChevronRight, Bell,
} from "lucide-react";
import { useListNotifications, useMarkNotificationRead } from "@workspace/api-client-react";
import { useState as useStateNotif } from "react";
import { useState } from "react";

const PHONE = "+1 202 753 0933";
const PHONE_HREF = "tel:+12027530933";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { data: me } = useGetMe();
  const [location] = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useStateNotif(false);
  const role = me?.role;
  const { data: notifications = [] } = useListNotifications({ query: { enabled: !!isAuthenticated, queryKey: ["listNotifications"] } });
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
  const isOwner = roleStr === "owner";
  const isStaff = isOwner || ["admin", "manager", "operations", "support", "tracking_agent", "staff"].includes(roleStr ?? "");
  const isAdmin = isOwner || roleStr === "admin" || roleStr === "manager";
  const isCustomer = roleStr === "customer";
  const isDriver = roleStr === "driver";

  const navGroups = [
    ...(isStaff ? [{
      label: "Operations",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/shipments", label: "Shipments", icon: Package2 },
        { href: "/customers", label: "Customers", icon: Users },
        { href: "/drivers", label: "Drivers", icon: Truck },
      ],
    }, {
      label: "Finance",
      items: [
        { href: "/quotes", label: "Quotes", icon: FileText },
        { href: "/invoices", label: "Invoices", icon: Receipt },
        { href: "/reports", label: "Reports", icon: BarChart3 },
      ],
    }] : []),
    ...(isDriver ? [{
      label: "My Deliveries",
      items: [
        { href: "/shipments", label: "Assigned Shipments", icon: Package2 },
        { href: "/track", label: "Track Shipment", icon: Search },
      ],
    }] : []),
    ...(isCustomer ? [{
      label: "My Account",
      items: [
        { href: "/portal", label: "My Account", icon: UserCircle },
        { href: "/quotes", label: "My Quotes", icon: FileText },
        { href: "/invoices", label: "My Invoices", icon: Receipt },
      ],
    }] : []),
    {
      label: "Tools",
      items: [
        ...(isStaff || isDriver ? [{ href: "/track", label: "Track Shipment", icon: Search }] : []),
        ...(isAdmin ? [{ href: "/admin", label: "User Management", icon: Shield }] : []),
        ...(isAdmin ? [{ href: "/admin/contact-messages", label: "Contact Messages", icon: FileText }] : []),
      ],
    },
  ].filter(g => g.items.length > 0);

  const roleColors: Record<string, string> = {
    owner: "bg-purple-100 text-purple-700",
    admin: "bg-red-100 text-red-700",
    manager: "bg-rose-100 text-rose-700",
    operations: "bg-blue-100 text-blue-700",
    support: "bg-cyan-100 text-cyan-700",
    tracking_agent: "bg-indigo-100 text-indigo-700",
    staff: "bg-blue-100 text-blue-700",
    driver: "bg-yellow-100 text-yellow-700",
    customer: "bg-green-100 text-green-700",
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border gap-3 shrink-0">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-primary">
          <Truck className="h-4 w-4 text-white" />
        </span>
        <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-black tracking-wider text-sidebar-foreground text-sm">
          PREMIER<br /><span className="font-black">LOGISTICS</span>
        </span>
      </div>

      {/* Role badge */}
      {role && (
        <div className="px-5 pt-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold capitalize ${roleColors[role] ?? "bg-primary/10 text-primary"}`}>
            {role}
          </span>
        </div>
      )}

      {/* Nav groups */}
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm group ${
                      isActive
                        ? "bg-primary text-white font-semibold"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Notifications */}
      <div className="px-3 py-2 border-t border-sidebar-border relative">
        <button
          onClick={() => setNotifOpen(v => !v)}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-md transition-colors"
        >
          <Bell className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
        {notifOpen && (
          <div className="absolute bottom-full left-2 right-2 mb-1 bg-popover border border-border rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto">
            <div className="px-3 py-2 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wide">Notifications</div>
            {notifications.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No notifications yet.</p>
            ) : (
              notifications.slice(0, 10).map((n: { id: number; title: string; message: string; read: boolean; createdAt: string }) => (
                <div key={n.id}
                  onClick={() => { if (!n.read) markRead.mutate({ id: n.id }); }}
                  className={`px-3 py-3 border-b border-border/50 last:border-0 cursor-pointer hover:bg-muted/50 ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-xs font-semibold ${!n.read ? "text-primary" : "text-foreground"}`}>{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                    {!n.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Contact strip */}
      <div className="px-5 py-3 border-t border-sidebar-border">
        <a href={PHONE_HREF} className="flex items-center gap-2 text-xs text-sidebar-foreground/50 hover:text-primary transition-colors">
          <Phone className="h-3 w-3" />
          {PHONE}
        </a>
      </div>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 mb-3 px-2">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm text-white">
              {user?.firstName?.[0] || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-sidebar-foreground">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border hidden md:flex flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-72 bg-sidebar text-sidebar-foreground flex flex-col shadow-2xl">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 text-sidebar-foreground/50 hover:text-sidebar-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Mobile top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 md:hidden shrink-0 bg-white">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="font-black tracking-wider text-[#1a2744] flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <Truck className="text-primary h-5 w-5" />
            PREMIER LOGISTICS
          </div>
          <div className="w-6" /> {/* spacer */}
        </header>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

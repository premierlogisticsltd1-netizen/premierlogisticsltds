import { Link, useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { useGetMe } from "@workspace/api-client-react";
import {
  Package2, LayoutDashboard, Truck, LogOut, Loader2, Search,
  Users, FileText, Receipt, BarChart3, Shield, UserCircle, Bell
} from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { data: me } = useGetMe();
  const [location] = useLocation();
  const role = me?.role;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const isStaff = role === "staff" || role === "admin";
  const isAdmin = role === "admin";
  const isCustomer = role === "customer";

  const navItems = [
    ...(isStaff || isAdmin ? [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/shipments", label: "Shipments", icon: Package2 },
      { href: "/customers", label: "Customers", icon: Users },
      { href: "/drivers", label: "Drivers", icon: Truck },
      { href: "/quotes", label: "Quotes", icon: FileText },
      { href: "/invoices", label: "Invoices", icon: Receipt },
      { href: "/reports", label: "Reports", icon: BarChart3 },
    ] : []),
    ...(isCustomer ? [
      { href: "/portal", label: "My Account", icon: UserCircle },
      { href: "/quotes", label: "My Quotes", icon: FileText },
      { href: "/invoices", label: "My Invoices", icon: Receipt },
    ] : []),
    { href: "/track", label: "Track Shipment", icon: Search },
    ...(isAdmin ? [
      { href: "/admin", label: "Admin", icon: Shield },
    ] : []),
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border gap-3 font-bold text-xl tracking-tight">
          <Truck className="text-primary h-6 w-6" />
          PREMIER LOGISTICS
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          {role && (
            <div className="px-3 py-1 mb-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary capitalize">
                {role}
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 mb-3 px-2">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="Avatar" className="h-8 w-8 rounded-full" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center font-bold text-sm">
                {user?.firstName?.[0] || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 md:hidden">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <Truck className="text-primary h-6 w-6" />
            PREMIER LOGISTICS
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

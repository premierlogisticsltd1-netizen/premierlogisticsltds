import { useGetPortalOverview, useRegisterAsCustomer } from "@workspace/api-client-react";
import { useState } from "react";
import { Package, FileText, Receipt, UserCircle, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

function formatStatus(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

function StatusBadge({ status }: { status: string }) {
  const color = {
    delivered: "bg-green-100 text-green-800 border-green-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    in_transit: "bg-blue-100 text-blue-800 border-blue-200",
    paid: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    overdue: "bg-red-100 text-red-800 border-red-200",
  }[status] ?? "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {formatStatus(status)}
    </span>
  );
}

export default function Portal() {
  const qc = useQueryClient();
  const { data: overview, isLoading } = useGetPortalOverview();
  const { mutateAsync: register, isPending: registering } = useRegisterAsCustomer();
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", address: "" });
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await register({ data: form });
      qc.invalidateQueries();
    } catch {
      setError("Registration failed. Please try again.");
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!overview?.registered) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <div className="mb-8 text-center">
          <UserCircle className="h-14 w-14 text-primary mx-auto mb-3" />
          <h1 className="text-3xl font-bold tracking-tight">Create Your Account</h1>
          <p className="text-muted-foreground mt-2">Register as a customer to track your shipments, request quotes, and view invoices.</p>
        </div>

        <form onSubmit={handleRegister} className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              <AlertCircle className="h-4 w-4 shrink-0" />{error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4">
            {[
              { key: "name", label: "Full Name", required: true, placeholder: "Jane Smith" },
              { key: "email", label: "Email Address", required: true, placeholder: "jane@company.com" },
              { key: "company", label: "Company (optional)", placeholder: "Acme Corp" },
              { key: "phone", label: "Phone (optional)", placeholder: "+1 555 000 0000" },
              { key: "address", label: "Address (optional)", placeholder: "123 Main St, City, Country" },
            ].map(({ key, label, required, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
                <input
                  type={key === "email" ? "email" : "text"}
                  required={required}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={registering}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 px-4 py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2"
          >
            {registering ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {registering ? "Registering…" : "Create Customer Account"}
          </button>
        </form>
      </div>
    );
  }

  const { customer, shipments, quotes, invoices } = overview;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {customer?.name}.</p>
        </div>
        {customer?.company && (
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">{customer.company}</span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Shipments", count: shipments.length, icon: Package, href: "/track", color: "bg-blue-100 text-blue-600" },
          { label: "Quote Requests", count: quotes.length, icon: FileText, href: "/quotes", color: "bg-yellow-100 text-yellow-600" },
          { label: "Invoices", count: invoices.length, icon: Receipt, href: "/invoices", color: "bg-green-100 text-green-600" },
        ].map(({ label, count, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="bg-card border border-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
              <div className={`h-8 w-8 rounded-md flex items-center justify-center ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-bold">{count}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Shipments */}
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-4">Recent Shipments</h2>
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            {shipments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No shipments yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Tracking #</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shipments.slice(0, 5).map(s => (
                    <tr key={s.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono font-medium text-primary">{s.trackingNumber}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-4">Recent Invoices</h2>
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            {invoices.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No invoices yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Invoice #</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.slice(0, 5).map(inv => (
                    <tr key={inv.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono font-medium">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3 font-medium">${Number(inv.amount).toFixed(2)}</td>
                      <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-primary" />
          Account Details
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            ["Name", customer?.name],
            ["Email", customer?.email],
            ["Company", customer?.company || "—"],
            ["Phone", customer?.phone || "—"],
            ["Address", customer?.address || "—"],
            ["Account Status", customer?.status ? formatStatus(customer.status) : "—"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-muted-foreground font-medium">{label}</dt>
              <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

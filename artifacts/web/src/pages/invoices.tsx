import { useListInvoices, useCreateInvoice, useUpdateInvoice, useGetMe, useListCustomers, useListShipments } from "@workspace/api-client-react";
import { useState } from "react";
import { Receipt, Plus, X, Loader2, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function statusColor(s: string) {
  return { paid: "bg-green-100 text-green-800 border-green-200", pending: "bg-yellow-100 text-yellow-800 border-yellow-200", overdue: "bg-red-100 text-red-800 border-red-200", cancelled: "bg-gray-100 text-gray-800 border-gray-200" }[s] ?? "bg-gray-100 text-gray-800 border-gray-200";
}

export default function Invoices() {
  const qc = useQueryClient();
  const { data: me } = useGetMe();
  const { data: invoices = [], isLoading } = useListInvoices();
  const { data: customers = [] } = useListCustomers();
  const { data: shipments = [] } = useListShipments();
  const { mutateAsync: createInvoice, isPending: creating } = useCreateInvoice();
  const { mutateAsync: updateInvoice, isPending: updating } = useUpdateInvoice();

  const isStaff = me?.role === "staff" || me?.role === "admin";
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: "", customerId: "", shipmentId: "", dueDate: "" });
  const [error, setError] = useState("");

  const totalBilled = invoices.reduce((s, i) => s + Number(i.amount), 0);
  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0);
  const outstanding = totalBilled - totalPaid;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.amount || Number(form.amount) <= 0) { setError("A valid amount is required."); return; }
    try {
      await createInvoice({ data: { amount: Number(form.amount), customerId: form.customerId ? Number(form.customerId) : undefined, shipmentId: form.shipmentId ? Number(form.shipmentId) : undefined, dueDate: form.dueDate || undefined } });
      setForm({ amount: "", customerId: "", shipmentId: "", dueDate: "" });
      setShowForm(false);
      qc.invalidateQueries();
    } catch { setError("Failed to create invoice."); }
  }

  async function handleMarkPaid(id: number) {
    try {
      await updateInvoice({ id, data: { status: "paid" } });
      qc.invalidateQueries();
    } catch { /* noop */ }
  }

  async function handleMarkCancelled(id: number) {
    try {
      await updateInvoice({ id, data: { status: "cancelled" } });
      qc.invalidateQueries();
    } catch { /* noop */ }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-1">{isStaff ? "Create and manage customer invoices." : "Your invoices from Premier Logistics."}</p>
        </div>
        {isStaff && (
          <button onClick={() => setShowForm(v => !v)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm shadow-sm">
            <Plus className="h-4 w-4" />New Invoice
          </button>
        )}
      </div>

      {/* Summary */}
      {isStaff && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Billed", value: `$${totalBilled.toFixed(2)}`, color: "text-foreground" },
            { label: "Total Paid", value: `$${totalPaid.toFixed(2)}`, color: "text-green-600" },
            { label: "Outstanding", value: `$${outstanding.toFixed(2)}`, color: outstanding > 0 ? "text-red-600" : "text-foreground" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {showForm && isStaff && (
        <form onSubmit={handleCreate} className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">New Invoice</h2>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3"><AlertCircle className="h-4 w-4" />{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="inv-amount" className="block text-sm font-medium mb-1">Amount ($) <span className="text-red-500">*</span></label>
              <input id="inv-amount" name="amount" type="number" min="0" step="0.01" required placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label htmlFor="inv-customerId" className="block text-sm font-medium mb-1">Customer</label>
              <select id="inv-customerId" name="customerId" value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">— Select customer —</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="inv-shipmentId" className="block text-sm font-medium mb-1">Linked Shipment</label>
              <select id="inv-shipmentId" name="shipmentId" value={form.shipmentId} onChange={e => setForm(f => ({ ...f, shipmentId: e.target.value }))}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">— Select shipment —</option>
                {shipments.map(s => <option key={s.id} value={s.id}>{s.trackingNumber} — {s.recipientName}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="inv-dueDate" className="block text-sm font-medium mb-1">Due Date</label>
              <input id="inv-dueDate" name="dueDate" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={creating}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {creating ? "Creating…" : "Create Invoice"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-border px-4 py-2 rounded-md text-sm hover:bg-muted">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-lg font-medium">No invoices yet</h3>
            <p className="text-muted-foreground text-sm mt-1">{isStaff ? "Create your first invoice above." : "No invoices have been issued to you yet."}</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Invoice #</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Issued</th>
                {isStaff && <th className="px-6 py-4 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-mono font-medium text-primary">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 font-bold">${Number(inv.amount).toFixed(2)} <span className="font-normal text-muted-foreground text-xs">{inv.currency ?? "USD"}</span></td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(inv.status)}`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  {isStaff && (
                    <td className="px-6 py-4">
                      {inv.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleMarkPaid(inv.id)} disabled={updating}
                            className="text-xs bg-green-600 text-white rounded px-2 py-1 hover:bg-green-700 disabled:opacity-60">Mark Paid</button>
                          <button onClick={() => handleMarkCancelled(inv.id)} disabled={updating}
                            className="text-xs border border-border rounded px-2 py-1 hover:bg-muted disabled:opacity-60">Cancel</button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

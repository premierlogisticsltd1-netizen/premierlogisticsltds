import { useListQuotes, useCreateQuote, useUpdateQuote, useGetMe } from "@workspace/api-client-react";
import { useState } from "react";
import { FileText, Plus, X, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function formatStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}
function statusColor(s: string) {
  return { requested: "bg-yellow-100 text-yellow-800 border-yellow-200", reviewing: "bg-blue-100 text-blue-800 border-blue-200", approved: "bg-green-100 text-green-800 border-green-200", rejected: "bg-red-100 text-red-800 border-red-200" }[s] ?? "bg-gray-100 text-gray-800 border-gray-200";
}

export default function Quotes() {
  const qc = useQueryClient();
  const { data: me } = useGetMe();
  const { data: quotes = [], isLoading } = useListQuotes();
  const { mutateAsync: createQuote, isPending: creating } = useCreateQuote();
  const { mutateAsync: updateQuote, isPending: updating } = useUpdateQuote();

  const isStaff = me?.role === "staff" || me?.role === "admin";
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ origin: "", destination: "", serviceType: "standard", weight: "", notes: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createQuote({ data: { ...form, weight: form.weight ? Number(form.weight) : undefined } });
      setForm({ origin: "", destination: "", serviceType: "standard", weight: "", notes: "" });
      setShowForm(false);
      qc.invalidateQueries();
    } catch { setError("Failed to submit quote request."); }
  }

  async function handleUpdate(id: number) {
    try {
      await updateQuote({ id, data: { status: editStatus as never, estimatedCost: editCost ? Number(editCost) : undefined, notes: editNotes || undefined } });
      setEditId(null);
      qc.invalidateQueries();
    } catch { setError("Failed to update quote."); }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
          <p className="text-muted-foreground mt-1">{isStaff ? "Manage quote requests from customers." : "Request and track your shipping quotes."}</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Request Quote
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg">New Quote Request</h2>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground hover:text-foreground" /></button>
          </div>
          {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3"><AlertCircle className="h-4 w-4" />{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "origin", label: "Origin", required: true, placeholder: "London, UK" },
              { key: "destination", label: "Destination", required: true, placeholder: "New York, US" },
              { key: "weight", label: "Weight (kg)", type: "number", placeholder: "0.0" },
            ].map(({ key, label, required, placeholder, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input type={type || "text"} required={required} placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1">Service Type</label>
              <select value={form.serviceType} onChange={e => setForm(f => ({ ...f, serviceType: e.target.value }))}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="overnight">Overnight</option>
                <option value="freight">Freight</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea rows={2} placeholder="Any special requirements…" value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={creating}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {creating ? "Submitting…" : "Submit Request"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-border px-4 py-2 rounded-md text-sm hover:bg-muted">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : quotes.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-lg font-medium">No quotes yet</h3>
            <p className="text-muted-foreground text-sm mt-1">Submit a quote request to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Quote #</th>
                <th className="px-6 py-4 font-medium">Route</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Est. Cost</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                {isStaff && <th className="px-6 py-4 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quotes.map(q => (
                <tr key={q.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-mono font-medium text-primary">{q.quoteNumber}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{q.origin}</div>
                    <div className="text-muted-foreground text-xs">→ {q.destination}</div>
                  </td>
                  <td className="px-6 py-4 capitalize">{q.serviceType}</td>
                  <td className="px-6 py-4">{q.estimatedCost != null ? `$${Number(q.estimatedCost).toFixed(2)}` : "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(q.status)}`}>
                      {formatStatus(q.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(q.createdAt).toLocaleDateString()}</td>
                  {isStaff && (
                    <td className="px-6 py-4">
                      {editId === q.id ? (
                        <div className="space-y-2 min-w-[200px]">
                          <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                            className="w-full border border-input rounded px-2 py-1 text-xs bg-background">
                            {["requested", "reviewing", "approved", "rejected"].map(s => <option key={s} value={s}>{formatStatus(s)}</option>)}
                          </select>
                          <input type="number" placeholder="Cost ($)" value={editCost} onChange={e => setEditCost(e.target.value)}
                            className="w-full border border-input rounded px-2 py-1 text-xs bg-background" />
                          <div className="flex gap-1">
                            <button onClick={() => handleUpdate(q.id)} disabled={updating}
                              className="flex-1 bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-medium disabled:opacity-60">
                              {updating ? "…" : "Save"}
                            </button>
                            <button onClick={() => setEditId(null)} className="flex-1 border border-border rounded px-2 py-1 text-xs">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => { setEditId(q.id); setEditStatus(q.status); setEditCost(q.estimatedCost ? String(q.estimatedCost) : ""); setEditNotes(q.notes ?? ""); }}
                          className="text-xs text-primary hover:underline flex items-center gap-1">
                          <ChevronDown className="h-3 w-3" /> Update
                        </button>
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

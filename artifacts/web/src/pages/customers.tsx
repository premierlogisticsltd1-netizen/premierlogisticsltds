import { useListCustomers, useCreateCustomer, useUpdateCustomer } from "@workspace/api-client-react";
import { useState } from "react";
import { Users, Plus, X, Loader2, AlertCircle, Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function statusColor(s: string) {
  return { active: "bg-green-100 text-green-800 border-green-200", inactive: "bg-gray-100 text-gray-800 border-gray-200", suspended: "bg-red-100 text-red-800 border-red-200" }[s] ?? "bg-gray-100 text-gray-800 border-gray-200";
}

export default function Customers() {
  const qc = useQueryClient();
  const { data: customers = [], isLoading } = useListCustomers();
  const { mutateAsync: createCustomer, isPending: creating } = useCreateCustomer();
  const { mutateAsync: updateCustomer, isPending: updating } = useUpdateCustomer();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", address: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("active");
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createCustomer({ data: form });
      setForm({ name: "", email: "", company: "", phone: "", address: "" });
      setShowForm(false);
      qc.invalidateQueries();
    } catch { setError("Failed to create customer."); }
  }

  async function handleStatusUpdate(id: number) {
    try {
      await updateCustomer({ id, data: { status: editStatus as never } });
      setEditId(null);
      qc.invalidateQueries();
    } catch { setError("Failed to update customer."); }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage customer accounts and status.</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm shadow-sm">
          <Plus className="h-4 w-4" />Add Customer
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">New Customer</h2>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3"><AlertCircle className="h-4 w-4" />{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Full Name", required: true },
              { key: "email", label: "Email", required: true },
              { key: "company", label: "Company" },
              { key: "phone", label: "Phone" },
              { key: "address", label: "Address" },
            ].map(({ key, label, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
                <input type={key === "email" ? "email" : "text"} required={required} placeholder={label}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={creating}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {creating ? "Adding…" : "Add Customer"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-border px-4 py-2 rounded-md text-sm hover:bg-muted">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-lg font-medium">No customers yet</h3>
            <p className="text-muted-foreground text-sm mt-1">Add your first customer above.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c.company || "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c.phone || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(c.status)}`}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {editId === c.id ? (
                      <div className="flex gap-2 items-center">
                        <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                          className="border border-input rounded px-2 py-1 text-xs bg-background">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                        <button onClick={() => handleStatusUpdate(c.id)} disabled={updating}
                          className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs disabled:opacity-60">Save</button>
                        <button onClick={() => setEditId(null)} className="border border-border rounded px-2 py-1 text-xs hover:bg-muted">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditId(c.id); setEditStatus(c.status); }}
                        className="text-xs text-primary hover:underline flex items-center gap-1">
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import { useListDrivers, useCreateDriver, useUpdateDriver, useGetMe } from "@workspace/api-client-react";
import { useState } from "react";
import { Truck, Plus, X, Loader2, AlertCircle, MapPin, Phone, Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function statusColor(s: string) {
  return { available: "bg-green-100 text-green-800 border-green-200", on_delivery: "bg-blue-100 text-blue-800 border-blue-200", off_duty: "bg-gray-100 text-gray-800 border-gray-200" }[s] ?? "bg-gray-100 text-gray-800 border-gray-200";
}
function formatStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

export default function Drivers() {
  const qc = useQueryClient();
  const { data: me } = useGetMe();
  const { data: drivers = [], isLoading } = useListDrivers();
  const { mutateAsync: createDriver, isPending: creating } = useCreateDriver();
  const { mutateAsync: updateDriver, isPending: updating } = useUpdateDriver();

  const isAdmin = me?.role === "admin";
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", licenseNumber: "", currentLocation: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("available");
  const [editLocation, setEditLocation] = useState("");
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await createDriver({ data: form });
      setForm({ name: "", email: "", phone: "", licenseNumber: "", currentLocation: "" });
      setShowForm(false);
      qc.invalidateQueries();
    } catch { setError("Failed to add driver."); }
  }

  async function handleUpdate(id: number) {
    try {
      await updateDriver({ id, data: { status: editStatus as never, currentLocation: editLocation || undefined } });
      setEditId(null);
      qc.invalidateQueries();
    } catch { setError("Failed to update driver."); }
  }

  const available = drivers.filter(d => d.status === "available").length;
  const onDelivery = drivers.filter(d => d.status === "on_delivery").length;
  const offDuty = drivers.filter(d => d.status === "off_duty").length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
          <p className="text-muted-foreground mt-1">Monitor driver status and availability.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(v => !v)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm shadow-sm">
            <Plus className="h-4 w-4" />Add Driver
          </button>
        )}
      </div>

      {/* Fleet overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Available", count: available, color: "bg-green-100 text-green-600" },
          { label: "On Delivery", count: onDelivery, color: "bg-blue-100 text-blue-600" },
          { label: "Off Duty", count: offDuty, color: "bg-gray-100 text-gray-600" },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold">{count}</p>
              <div className={`h-8 w-8 rounded-md flex items-center justify-center ${color} mb-0.5`}>
                <Truck className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Add Driver</h2>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
          </div>
          {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3"><AlertCircle className="h-4 w-4" />{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Full Name", required: true },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
              { key: "licenseNumber", label: "License Number" },
              { key: "currentLocation", label: "Current Location" },
            ].map(({ key, label, required }) => (
              <div key={key}>
                <label htmlFor={`drv-${key}`} className="block text-sm font-medium mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
                <input id={`drv-${key}`} name={key} required={required} placeholder={label}
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
              {creating ? "Adding…" : "Add Driver"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-border px-4 py-2 rounded-md text-sm hover:bg-muted">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-3 p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : drivers.length === 0 ? (
          <div className="col-span-3 p-12 text-center">
            <Truck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-lg font-medium">No drivers registered</h3>
            <p className="text-muted-foreground text-sm mt-1">{isAdmin ? "Add your first driver above." : "No drivers have been added yet."}</p>
          </div>
        ) : (
          drivers.map(d => (
            <div key={d.id} className="bg-card border border-border rounded-lg p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-base">{d.name}</h3>
                  {d.licenseNumber && <p className="text-xs text-muted-foreground font-mono">#{d.licenseNumber}</p>}
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor(d.status)}`}>
                  {formatStatus(d.status)}
                </span>
              </div>
              <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                {d.email && <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0" />{d.email}</div>}
                {d.phone && <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0" />{d.phone}</div>}
                {d.currentLocation && <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0" />{d.currentLocation}</div>}
              </div>
              {editId === d.id ? (
                <div className="space-y-2 border-t border-border pt-3">
                  <label htmlFor={`drv-edit-status-${d.id}`} className="sr-only">Status</label>
                  <select id={`drv-edit-status-${d.id}`} name="editStatus" value={editStatus} onChange={e => setEditStatus(e.target.value)}
                    className="w-full border border-input rounded px-2 py-1 text-sm bg-background">
                    <option value="available">Available</option>
                    <option value="on_delivery">On Delivery</option>
                    <option value="off_duty">Off Duty</option>
                  </select>
                  <label htmlFor={`drv-edit-loc-${d.id}`} className="sr-only">Location update</label>
                  <input id={`drv-edit-loc-${d.id}`} name="editLocation" placeholder="Location update" value={editLocation} onChange={e => setEditLocation(e.target.value)}
                    className="w-full border border-input rounded px-2 py-1 text-sm bg-background" />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(d.id)} disabled={updating}
                      className="flex-1 bg-primary text-primary-foreground rounded px-3 py-1.5 text-xs font-medium disabled:opacity-60">
                      {updating ? "Saving…" : "Save"}
                    </button>
                    <button onClick={() => setEditId(null)} className="flex-1 border border-border rounded px-3 py-1.5 text-xs hover:bg-muted">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setEditId(d.id); setEditStatus(d.status); setEditLocation(d.currentLocation ?? ""); }}
                  className="w-full text-xs text-primary hover:underline flex items-center justify-center gap-1 border border-border rounded px-3 py-1.5 hover:bg-muted transition-colors">
                  <Pencil className="h-3 w-3" /> Update Status
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

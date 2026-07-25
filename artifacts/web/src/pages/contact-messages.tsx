import { useState, useEffect } from "react";
import { MessageSquare, Loader2, AlertCircle, Mail, Phone, Calendar } from "lucide-react";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  assignedTo: string | null;
  createdAt: string;
};

function statusColor(s: string) {
  return {
    new: "bg-blue-100 text-blue-800 border-blue-200",
    open: "bg-yellow-100 text-yellow-800 border-yellow-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    closed: "bg-gray-100 text-gray-800 border-gray-200",
  }[s] ?? "bg-gray-100 text-gray-800 border-gray-200";
}

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/contact-messages", { credentials: "include" })
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(setMessages)
      .catch(() => setError("Failed to load messages"))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: number, status: string) {
    setUpdatingId(id);
    try {
      const r = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error();
      const updated = await r.json();
      setMessages(prev => prev.map(m => m.id === id ? updated : m));
    } catch {
      setError("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" /> Contact Messages
        </h1>
        <p className="text-muted-foreground mt-1">Manage inbound contact form submissions.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["new", "open", "resolved", "closed"] as const).map(s => (
          <div key={s} className="bg-card border border-border rounded-lg p-4 shadow-sm text-center">
            <p className="text-2xl font-bold">{messages.filter(m => m.status === s).length}</p>
            <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${statusColor(s)}`}>{s}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          <AlertCircle className="h-4 w-4" />{error}
        </div>
      )}

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">No contact messages yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map(m => (
              <div key={m.id} className="p-5 hover:bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold">{m.name}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${statusColor(m.status)}`}>{m.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{m.email}</span>
                      {m.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{m.phone}</span>}
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    {m.subject && <p className="text-sm font-medium mb-1">{m.subject}</p>}
                    <p className={`text-sm text-muted-foreground ${expandedId !== m.id ? "line-clamp-2" : ""}`}>{m.message}</p>
                    {m.message.length > 120 && (
                      <button onClick={() => setExpandedId(expandedId === m.id ? null : m.id)} className="text-xs text-primary hover:underline mt-1">
                        {expandedId === m.id ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <label htmlFor={`status-${m.id}`} className="sr-only">Update status</label>
                    <select
                      id={`status-${m.id}`}
                      value={m.status}
                      onChange={e => updateStatus(m.id, e.target.value)}
                      disabled={updatingId === m.id}
                      className="border border-input rounded px-2 py-1 text-xs bg-background capitalize disabled:opacity-60"
                    >
                      {["new", "open", "resolved", "closed"].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    {updatingId === m.id && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

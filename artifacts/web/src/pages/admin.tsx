import { useListAdminUsers, useUpdateUserRole } from "@workspace/api-client-react";
import { useState } from "react";
import { Shield, Loader2, AlertCircle, Check, UserPlus, Trash2, X, Eye, EyeOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@workspace/replit-auth-web";

const ROLES = ["owner", "admin", "manager", "operations", "support", "tracking_agent", "driver", "customer"] as const;
type Role = typeof ROLES[number];

function roleColor(role: string) {
  return ({
    owner: "bg-purple-100 text-purple-800 border-purple-200",
    admin: "bg-red-100 text-red-800 border-red-200",
    manager: "bg-rose-100 text-rose-800 border-rose-200",
    operations: "bg-blue-100 text-blue-800 border-blue-200",
    support: "bg-cyan-100 text-cyan-800 border-cyan-200",
    tracking_agent: "bg-indigo-100 text-indigo-800 border-indigo-200",
    staff: "bg-blue-100 text-blue-800 border-blue-200",
    driver: "bg-yellow-100 text-yellow-800 border-yellow-200",
    customer: "bg-green-100 text-green-800 border-green-200",
  } as Record<string, string>)[role] ?? "bg-gray-100 text-gray-800 border-gray-200";
}

const roleLabel: Record<string, string> = {
  owner: "Owner", admin: "Admin", manager: "Manager", operations: "Operations",
  support: "Support", tracking_agent: "Tracking Agent", staff: "Staff",
  driver: "Driver", customer: "Customer",
};

const BLANK_FORM = { firstName: "", lastName: "", email: "", password: "", role: "staff" as string };

export default function Admin() {
  const qc = useQueryClient();
  const { user: me } = useAuth();
  const { data: users = [], isLoading } = useListAdminUsers();
  const { mutateAsync: updateRole, isPending: updating } = useUpdateUserRole();

  // Role editing
  const [editId, setEditId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>("staff");
  const [successId, setSuccessId] = useState<string | null>(null);
  const [roleError, setRoleError] = useState("");

  // Create account form
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [showPw, setShowPw] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  // Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  async function handleRoleUpdate(id: string) {
    setRoleError("");
    try {
      await updateRole({ id, data: { role: editRole as never } });
      setEditId(null);
      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 2000);
      qc.invalidateQueries();
    } catch { setRoleError("Failed to update role."); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(""); setCreateSuccess("");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setCreateError(data.error ?? "Failed to create account"); return; }
      setCreateSuccess(`Account created for ${data.email}`);
      setForm(BLANK_FORM);
      setShowCreate(false);
      qc.invalidateQueries();
    } catch { setCreateError("Connection error. Try again."); }
    finally { setCreating(false); }
  }

  async function handleDelete(id: string, email: string) {
    if (!window.confirm(`Delete account for ${email}? This cannot be undone.`)) return;
    setDeleteError("");
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (!res.ok) { setDeleteError(data.error ?? "Failed to delete account"); return; }
      qc.invalidateQueries();
    } catch { setDeleteError("Connection error. Try again."); }
    finally { setDeletingId(null); }
  }

  const roleCounts = ROLES.reduce((acc, r) => {
    acc[r] = users.filter(u => u.role === r).length;
    return acc;
  }, {} as Record<Role, number>);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" /> Admin Panel
          </h1>
          <p className="text-muted-foreground mt-1">Manage user accounts and access roles.</p>
        </div>
        <button
          onClick={() => { setShowCreate(v => !v); setCreateError(""); setCreateSuccess(""); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
        >
          {showCreate ? <X className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {showCreate ? "Cancel" : "Create Account"}
        </button>
      </div>

      {/* Create account form */}
      {showCreate && (
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <h2 className="font-bold text-lg mb-4">New Staff Account</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">First name</label>
              <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                placeholder="Jane" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Last name</label>
              <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                placeholder="Smith" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="jane@example.com" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Role</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {ROLES.map(r => <option key={r} value={r}>{roleLabel[r]}</option>)}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required minLength={6}
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 characters"
                  className="w-full h-10 px-3 pr-10 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {createError && (
              <div className="sm:col-span-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                <AlertCircle className="h-4 w-4 shrink-0" />{createError}
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
              <button type="submit" disabled={creating}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                {creating ? <><Loader2 className="h-4 w-4 animate-spin" />Creating…</> : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success / delete error banners */}
      {createSuccess && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          <Check className="h-4 w-4 shrink-0" />{createSuccess}
        </div>
      )}
      {deleteError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0" />{deleteError}
        </div>
      )}
      {roleError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0" />{roleError}
        </div>
      )}

      {/* Role summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {ROLES.map(r => (
          <div key={r} className="bg-card border border-border rounded-lg p-4 shadow-sm text-center">
            <p className="text-2xl font-bold">{roleCounts[r] ?? 0}</p>
            <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-medium border ${roleColor(r)}`}>{roleLabel[r]}</span>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <h2 className="font-bold">All Users <span className="text-muted-foreground font-normal text-sm">({users.length})</span></h2>
        </div>
        {isLoading ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Change Role</th>
                  <th className="px-6 py-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-medium">{[u.firstName, u.lastName].filter(Boolean).join(" ") || "—"}</div>
                      <div className="text-xs text-muted-foreground font-mono">{u.id.slice(0, 12)}…</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{u.email ?? "—"}</td>
                    <td className="px-6 py-4">
                      {successId === u.id ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs"><Check className="h-3 w-3" />Updated!</span>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${roleColor(u.role)}`}>
                          {roleLabel[u.role] ?? u.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {editId === u.id ? (
                        <div className="flex gap-2 items-center">
                          <select value={editRole} onChange={e => setEditRole(e.target.value)}
                            className="border border-input rounded px-2 py-1 text-xs bg-background">
                            {ROLES.map(r => <option key={r} value={r}>{roleLabel[r]}</option>)}
                          </select>
                          <button onClick={() => handleRoleUpdate(u.id)} disabled={updating}
                            className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-medium disabled:opacity-60">
                            {updating ? "…" : "Save"}
                          </button>
                          <button onClick={() => setEditId(null)} className="border border-border rounded px-2 py-1 text-xs hover:bg-muted">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditId(u.id); setEditRole(u.role); }}
                          className="text-xs text-primary hover:underline">
                          Assign Role
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {u.id !== me?.id && (
                        <button
                          onClick={() => handleDelete(u.id, u.email ?? u.id)}
                          disabled={deletingId === u.id}
                          title="Delete account"
                          className="text-muted-foreground hover:text-red-600 disabled:opacity-40 transition-colors"
                        >
                          {deletingId === u.id
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Trash2 className="h-4 w-4" />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

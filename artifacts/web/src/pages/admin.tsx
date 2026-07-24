import { useListAdminUsers, useUpdateUserRole } from "@workspace/api-client-react";
import { useState } from "react";
import { Shield, Loader2, AlertCircle, Check } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const ROLES = ["admin", "staff", "driver", "customer"] as const;

function roleColor(role: string) {
  return { admin: "bg-purple-100 text-purple-800 border-purple-200", staff: "bg-blue-100 text-blue-800 border-blue-200", driver: "bg-yellow-100 text-yellow-800 border-yellow-200", customer: "bg-green-100 text-green-800 border-green-200" }[role] ?? "bg-gray-100 text-gray-800 border-gray-200";
}

export default function Admin() {
  const qc = useQueryClient();
  const { data: users = [], isLoading } = useListAdminUsers();
  const { mutateAsync: updateRole, isPending: updating } = useUpdateUserRole();
  const [editId, setEditId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>("staff");
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);

  async function handleRoleUpdate(id: string) {
    setError("");
    try {
      await updateRole({ id, data: { role: editRole as never } });
      setEditId(null);
      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 2000);
      qc.invalidateQueries();
    } catch { setError("Failed to update role."); }
  }

  const roleCounts = ROLES.reduce((acc, r) => {
    acc[r] = users.filter(u => u.role === r).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" /> Admin Panel
        </h1>
        <p className="text-muted-foreground mt-1">Manage user accounts and access roles.</p>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ROLES.map(r => (
          <div key={r} className="bg-card border border-border rounded-lg p-4 shadow-sm text-center">
            <p className="text-2xl font-bold">{roleCounts[r] ?? 0}</p>
            <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${roleColor(r)}`}>{r}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          <AlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="font-bold">All Users <span className="text-muted-foreground font-normal text-sm">({users.length})</span></h2>
        </div>
        {isLoading ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">No users found.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Current Role</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="font-medium">{u.firstName} {u.lastName}</div>
                    <div className="text-xs text-muted-foreground font-mono">{u.id.slice(0, 12)}…</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{u.email ?? "—"}</td>
                  <td className="px-6 py-4">
                    {successId === u.id ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs"><Check className="h-3 w-3" />Updated!</span>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${roleColor(u.role)}`}>
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {editId === u.id ? (
                      <div className="flex gap-2 items-center">
                        <select value={editRole} onChange={e => setEditRole(e.target.value)}
                          className="border border-input rounded px-2 py-1 text-xs bg-background capitalize">
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import { useGetDashboardStats, useListShipments, useGetOwnerSetupStatus, useClaimOwnerRole } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Package, Truck, CheckCircle2, Clock, AlertCircle, TrendingUp, Loader2, Crown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: recentShipments, isLoading: shipmentsLoading } = useListShipments({ status: "pending" });
  const { data: setupStatus } = useGetOwnerSetupStatus();
  const { mutateAsync: claimOwner, isPending: claiming } = useClaimOwnerRole();
  const [claimError, setClaimError] = useState("");
  const [claimDone, setClaimDone] = useState(false);
  const qc = useQueryClient();

  async function handleClaim() {
    setClaimError("");
    try {
      await claimOwner({});
      setClaimDone(true);
      qc.invalidateQueries();
    } catch {
      setClaimError("Could not claim owner role — an owner may already exist. Refresh and try again.");
    }
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out_for_delivery': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (statsLoading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of today's logistics operations.</p>
        </div>
        <Link 
          href="/shipments/new" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm shadow-sm inline-flex items-center gap-2"
        >
          <Package className="h-4 w-4" />
          New Shipment
        </Link>
      </div>

      {/* Owner Setup Banner */}
      {setupStatus && !setupStatus.ownerExists && !claimDone && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Crown className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-purple-900">No owner account yet</p>
              <p className="text-sm text-purple-700 mt-0.5">
                Claim the Owner (Super Admin) role to unlock full control over users, roles, and system settings.
              </p>
              {claimError && <p className="text-sm text-red-600 mt-1">{claimError}</p>}
            </div>
          </div>
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="shrink-0 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold text-sm px-5 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            {claiming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crown className="h-4 w-4" />}
            {claiming ? "Claiming…" : "Claim Owner Role"}
          </button>
        </div>
      )}
      {claimDone && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-purple-600 shrink-0" />
          <p className="font-semibold text-purple-900">You are now the Owner (Super Admin). Refresh to see your updated role.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-card-border p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-muted-foreground text-sm">Total Shipments</h3>
            <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats?.total || 0}</p>
        </div>

        <div className="bg-card border border-card-border p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-muted-foreground text-sm">Pending</h3>
            <div className="h-8 w-8 bg-yellow-100 rounded-md flex items-center justify-center">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats?.pending || 0}</p>
        </div>

        <div className="bg-card border border-card-border p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-muted-foreground text-sm">In Transit</h3>
            <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
              <Truck className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats?.inTransit || 0}</p>
        </div>

        <div className="bg-card border border-card-border p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-muted-foreground text-sm">Delivered</h3>
            <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats?.delivered || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Recent Pending Shipments</h2>
            <Link href="/shipments" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          
          <div className="bg-card border border-card-border rounded-lg shadow-sm overflow-hidden">
            {shipmentsLoading ? (
              <div className="p-8 text-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
            ) : recentShipments?.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-foreground">No pending shipments</h3>
                <p className="text-muted-foreground text-sm">All caught up for now.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-mono tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Tracking #</th>
                    <th className="px-6 py-4 font-medium">Destination</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentShipments?.slice(0, 5).map(shipment => (
                    <tr key={shipment.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/shipments/${shipment.id}`} className="font-mono font-medium text-primary hover:underline">
                          {shipment.trackingNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{shipment.recipientName}</div>
                        <div className="text-muted-foreground truncate max-w-[200px]">{shipment.recipientAddress}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                          {formatStatus(shipment.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-card border border-card-border p-6 rounded-lg shadow-sm">
            <h3 className="font-bold tracking-tight mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Action Required
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">Failed Deliveries</span>
                <span className="text-xl font-bold text-red-600">{stats?.failed || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">Out for Delivery</span>
                <span className="text-xl font-bold text-primary">{stats?.outForDelivery || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Awaiting Pickup</span>
                <span className="text-xl font-bold text-yellow-600">{stats?.pickedUp || 0}</span>
              </div>
            </div>
            
            <Link href="/shipments" className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted transition-colors">
              Manage Queue
            </Link>
          </div>

          {/* Status chart */}
          <div className="bg-card border border-card-border p-6 rounded-lg shadow-sm">
            <h3 className="font-bold tracking-tight mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Status Overview
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={[
                { name: "Pending", count: stats?.pending || 0, fill: "#f59e0b" },
                { name: "Picked Up", count: stats?.pickedUp || 0, fill: "#a78bfa" },
                { name: "Transit", count: stats?.inTransit || 0, fill: "#3b82f6" },
                { name: "Out", count: stats?.outForDelivery || 0, fill: "#fb923c" },
                { name: "Done", count: stats?.delivered || 0, fill: "#22c55e" },
                { name: "Failed", count: stats?.failed || 0, fill: "#ef4444" },
              ]} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" name="Shipments" radius={[3, 3, 0, 0]}>
                  {["#f59e0b","#a78bfa","#3b82f6","#fb923c","#22c55e","#ef4444"].map((fill, i) => (
                    <Cell key={i} fill={fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

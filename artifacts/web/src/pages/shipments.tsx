import { useEffect, useState } from "react";
import { useListShipments } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Search, Loader2, Package, Download } from "lucide-react";
import { format } from "date-fns";
import type { ListShipmentsStatus } from "@workspace/api-client-react";

const STATUS_TABS: { label: string; value: ListShipmentsStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Picked Up', value: 'picked_up' },
  { label: 'In Transit', value: 'in_transit' },
  { label: 'Out for Delivery', value: 'out_for_delivery' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Failed', value: 'failed' },
];

export default function Shipments() {
  const [activeTab, setActiveTab] = useState<ListShipmentsStatus | 'all'>('all');
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Simple debounce
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: shipments, isLoading } = useListShipments({
    status: activeTab === 'all' ? undefined : activeTab,
    search: debouncedSearch || undefined,
  });

  const formatStatus = (status: string) => status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out_for_delivery': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground mt-1">Manage and track all logistics parcels.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!shipments?.length) return;
              const headers = ["Tracking #", "Sender", "Sender Address", "Recipient", "Recipient Address", "Status", "Service", "Weight (kg)", "Est. Delivery", "Created"];
              const rows = shipments.map(s => [
                s.trackingNumber, s.senderName, s.senderAddress, s.recipientName, s.recipientAddress,
                s.status, s.serviceType ?? "standard", s.weight ?? "", s.estimatedDelivery ?? "",
                new Date(s.createdAt).toISOString(),
              ]);
              const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url;
              a.download = `shipments-${new Date().toISOString().slice(0,10)}.csv`; a.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-2 border border-border px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <Link 
            href="/shipments/new" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm shadow-sm inline-flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Create Shipment
          </Link>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-lg shadow-sm flex flex-col flex-1 min-h-[500px]">
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <label htmlFor="shipment-search" className="sr-only">Search shipments</label>
            <input
              id="shipment-search"
              name="search"
              type="text"
              placeholder="Search by tracking number, name, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  activeTab === tab.value 
                    ? 'bg-foreground text-background' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : shipments?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
              <Package className="h-16 w-16 text-muted-foreground/20 mb-4" />
              <h3 className="text-xl font-bold tracking-tight mb-2">No shipments found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-mono tracking-wider sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 font-medium border-b border-border">Tracking #</th>
                  <th className="px-6 py-4 font-medium border-b border-border">Sender</th>
                  <th className="px-6 py-4 font-medium border-b border-border">Recipient</th>
                  <th className="px-6 py-4 font-medium border-b border-border">Status</th>
                  <th className="px-6 py-4 font-medium border-b border-border text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shipments?.map(shipment => (
                  <tr key={shipment.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <Link href={`/shipments/${shipment.id}`} className="font-mono font-medium text-primary hover:underline flex items-center gap-2">
                        {shipment.trackingNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{shipment.senderName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{shipment.recipientName}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate max-w-[200px]">
                        <MapPin className="h-3 w-3" />
                        {shipment.recipientAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                        {formatStatus(shipment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground font-mono text-xs">
                      {format(new Date(shipment.createdAt), "MMM d, yyyy HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

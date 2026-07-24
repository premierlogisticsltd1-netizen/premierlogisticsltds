import { useGetReportsSummary } from "@workspace/api-client-react";
import { BarChart3, TrendingUp, CheckCircle2, Truck, Receipt, FileText, Loader2, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string | number; sub?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={`h-9 w-9 rounded-md flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Reports() {
  const qc = useQueryClient();
  const { data: report, isLoading, dataUpdatedAt } = useGetReportsSummary();

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const shipments = report?.shipments;
  const invoices = report?.invoices;
  const quotes = report?.quotes;

  const deliveryRate = shipments?.total ? Math.round((shipments.delivered / shipments.total) * 100) : 0;
  const quoteConversionRate = quotes?.total ? Math.round((quotes.approved / quotes.total) * 100) : 0;
  const collectionRate = invoices?.billed ? Math.round((invoices.paid / invoices.billed) * 100) : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Overview of operations performance.
            {dataUpdatedAt ? ` Generated ${new Date(dataUpdatedAt).toLocaleTimeString()}.` : ""}
          </p>
        </div>
        <button onClick={() => qc.invalidateQueries()}
          className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded-md text-sm hover:bg-muted transition-colors">
          <RefreshCw className="h-4 w-4" />Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Shipments" value={shipments?.total ?? 0} icon={Truck} color="bg-blue-100 text-blue-600" />
        <StatCard label="Delivered" value={shipments?.delivered ?? 0} sub={`${deliveryRate}% delivery rate`} icon={CheckCircle2} color="bg-green-100 text-green-600" />
        <StatCard label="In Transit" value={shipments?.inTransit ?? 0} icon={TrendingUp} color="bg-primary/10 text-primary" />
        <StatCard label="Total Billed" value={`$${Number(invoices?.billed ?? 0).toLocaleString("en", { minimumFractionDigits: 2 })}`} icon={Receipt} color="bg-yellow-100 text-yellow-600" />
        <StatCard label="Amount Collected" value={`$${Number(invoices?.paid ?? 0).toLocaleString("en", { minimumFractionDigits: 2 })}`} sub={`${collectionRate}% collection rate`} icon={Receipt} color="bg-green-100 text-green-600" />
        <StatCard label="Outstanding" value={`$${Number(invoices?.outstanding ?? 0).toLocaleString("en", { minimumFractionDigits: 2 })}`} icon={Receipt} color="bg-red-100 text-red-600" />
      </div>

      {/* Performance bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-5">
          <h2 className="font-bold text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Shipment Performance</h2>
          <div className="space-y-4">
            {[
              { label: "Delivered", value: shipments?.delivered ?? 0, color: "bg-green-500" },
              { label: "In Transit", value: shipments?.inTransit ?? 0, color: "bg-blue-500" },
              { label: "Pending", value: (shipments?.total ?? 0) - (shipments?.delivered ?? 0) - (shipments?.inTransit ?? 0), color: "bg-yellow-400" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground">{value} shipment{value !== 1 ? "s" : ""}</span>
                </div>
                <ProgressBar value={value} max={shipments?.total ?? 1} color={color} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-5">
          <h2 className="font-bold text-lg flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Quotes & Revenue</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">Quote Conversion Rate</span>
                <span className="text-muted-foreground">{quotes?.approved ?? 0} / {quotes?.total ?? 0} approved</span>
              </div>
              <ProgressBar value={quotes?.approved ?? 0} max={quotes?.total ?? 1} color="bg-primary" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">Revenue Collected</span>
                <span className="text-muted-foreground">{collectionRate}% of billed</span>
              </div>
              <ProgressBar value={invoices?.paid ?? 0} max={invoices?.billed ?? 1} color="bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">Delivery Success Rate</span>
                <span className="text-muted-foreground">{deliveryRate}%</span>
              </div>
              <ProgressBar value={shipments?.delivered ?? 0} max={shipments?.total ?? 1} color="bg-green-500" />
            </div>
          </div>

          <div className="pt-2 border-t border-border grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Total Quotes</p>
              <p className="font-bold text-xl">{quotes?.total ?? 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Quotes Approved</p>
              <p className="font-bold text-xl text-green-600">{quotes?.approved ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Receipt className="h-5 w-5 text-primary" />Revenue Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Billed", amount: invoices?.billed ?? 0, pct: 100, color: "border-l-4 border-blue-500" },
            { label: "Collected", amount: invoices?.paid ?? 0, pct: collectionRate, color: "border-l-4 border-green-500" },
            { label: "Outstanding", amount: invoices?.outstanding ?? 0, pct: 100 - collectionRate, color: "border-l-4 border-red-500" },
          ].map(({ label, amount, pct, color }) => (
            <div key={label} className={`bg-muted/30 rounded-lg p-4 ${color}`}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold mt-1">${Number(amount).toLocaleString("en", { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground mt-1">{pct}% of total billed</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

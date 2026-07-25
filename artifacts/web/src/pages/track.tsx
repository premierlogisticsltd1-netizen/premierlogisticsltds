import { useState } from "react";
import { getTrackShipmentQueryKey, useTrackShipment } from "@workspace/api-client-react";
import { Search, Package, MapPin, Truck, CheckCircle2, AlertCircle, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function Track() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: trackResult, isLoading, isError, error } = useTrackShipment(searchQuery, {
    query: { enabled: !!searchQuery, retry: false, queryKey: getTrackShipmentQueryKey(searchQuery) }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setSearchQuery(trackingNumber.trim());
    }
  };

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

  const shipment = trackResult?.shipment;
  const events = trackResult?.events || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center px-6 bg-card">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <Truck className="text-primary h-6 w-6" />
            PREMIER LOGISTICS
          </div>
          <a href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Staff Login
          </a>
        </div>
      </header>

      {/* Hero / Search */}
      <div className="bg-sidebar text-sidebar-foreground py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Track your shipment</h1>
          <p className="text-sidebar-foreground/70 mb-8 max-w-xl mx-auto">
            Enter your tracking number below to get real-time updates on your package's journey.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <label htmlFor="trackingNumber" className="sr-only">Tracking Number</label>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                id="trackingNumber"
                name="trackingNumber"
                placeholder="Enter Tracking Number (e.g. TRK-...)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                autoComplete="off"
                className="w-full pl-12 pr-4 py-4 bg-card text-foreground border-2 border-transparent rounded-lg focus:outline-none focus:border-primary font-mono text-lg transition-colors shadow-lg"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !trackingNumber}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-bold transition-colors disabled:opacity-50 shadow-lg flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Track"}
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {isError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-lg flex items-start gap-4">
              <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg">Shipment not found</h3>
                <p className="opacity-90">Please verify the tracking number and try again. If you just dropped off your package, it may take up to 24 hours to appear in our system.</p>
              </div>
            </div>
          )}

          {!isError && shipment && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Status Header */}
              <div className="bg-card border border-card-border p-6 md:p-8 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Tracking Number</p>
                  <h2 className="text-3xl font-mono font-bold tracking-tight">{shipment.trackingNumber}</h2>
                </div>
                <div className="flex flex-col md:items-end">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Current Status</p>
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border ${getStatusColor(shipment.status)}`}>
                    {formatStatus(shipment.status)}
                  </span>
                </div>
              </div>

              {/* Journey Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border border-card-border p-6 rounded-lg shadow-sm flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">From</p>
                    <p className="font-medium text-lg">{shipment.senderName}</p>
                  </div>
                </div>
                <div className="bg-card border border-card-border p-6 rounded-lg shadow-sm flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">To</p>
                    <p className="font-medium text-lg">{shipment.recipientName}</p>
                    <p className="text-muted-foreground mt-1">{shipment.recipientAddress}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Est */}
              {shipment.estimatedDelivery && (
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg flex items-center gap-4 text-blue-900 dark:bg-blue-900/20 dark:border-blue-900/30 dark:text-blue-200">
                  <Calendar className="h-6 w-6" />
                  <div>
                    <p className="font-bold">Estimated Delivery</p>
                    <p className="text-lg">{format(new Date(shipment.estimatedDelivery), "EEEE, MMMM do yyyy")}</p>
                  </div>
                </div>
              )}

              {/* Shipment Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {shipment.weight && (
                  <div className="bg-card border border-card-border p-5 rounded-lg shadow-sm">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Weight</p>
                    <p className="font-semibold text-lg">{shipment.weight} kg</p>
                  </div>
                )}
                {(shipment.width || shipment.height || shipment.length) && (
                  <div className="bg-card border border-card-border p-5 rounded-lg shadow-sm">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Dimensions (cm)</p>
                    <p className="font-semibold">{shipment.length ?? '—'} × {shipment.width ?? '—'} × {shipment.height ?? '—'}</p>
                  </div>
                )}
                {shipment.serviceType && (
                  <div className="bg-card border border-card-border p-5 rounded-lg shadow-sm">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Service</p>
                    <p className="font-semibold capitalize">{shipment.serviceType.replace('_', ' ')}</p>
                  </div>
                )}
              </div>

              {/* QR Code + Estimated Delivery */}
              <div className="flex flex-col md:flex-row gap-4">
                {shipment.estimatedDelivery && (
                  <div className="flex-1 bg-blue-50 border border-blue-100 p-6 rounded-lg flex items-center gap-4 text-blue-900 dark:bg-blue-900/20 dark:border-blue-900/30 dark:text-blue-200">
                    <Calendar className="h-6 w-6 shrink-0" />
                    <div>
                      <p className="font-bold">Estimated Delivery</p>
                      <p className="text-lg">{format(new Date(shipment.estimatedDelivery), "EEEE, MMMM do yyyy")}</p>
                    </div>
                  </div>
                )}
                <div className="bg-card border border-card-border p-6 rounded-lg shadow-sm flex flex-col items-center gap-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Scan to Track</p>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(shipment.trackingNumber)}&color=1a2744`}
                    alt={`QR code for ${shipment.trackingNumber}`}
                    width={120}
                    height={120}
                    className="rounded"
                  />
                  <p className="font-mono text-xs text-muted-foreground">{shipment.trackingNumber}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-card border border-card-border rounded-lg shadow-sm p-6 md:p-8">
                <h3 className="text-xl font-bold mb-8">Travel History</h3>
                
                {events.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No tracking events available yet.</p>
                ) : (
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">
                    {[...events].reverse().map((event, i) => {
                      const isLatest = i === 0;
                      return (
                        <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isLatest ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {event.status === 'delivered' ? <CheckCircle2 className="h-5 w-5" /> : <Truck className="h-4 w-4" />}
                          </div>
                          <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-lg border shadow-sm ${isLatest ? 'bg-card border-primary/20 shadow-md' : 'bg-muted/30 border-border'}`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                              <div className="font-bold text-lg text-foreground">{formatStatus(event.status)}</div>
                              <time className="font-mono text-sm text-muted-foreground">{format(new Date(event.timestamp), "MMM d, yyyy • h:mm a")}</time>
                            </div>
                            <div className="text-foreground/80 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>{event.location}{event.city ? `, ${event.city}` : ''}{event.country ? `, ${event.country}` : ''}</span>
                            </div>
                            {event.facility && (
                              <p className="mt-1 text-sm text-muted-foreground">Facility: {event.facility}</p>
                            )}
                            {(event.latitude && event.longitude) && (
                              <p className="mt-1 text-xs text-muted-foreground font-mono">
                                {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                              </p>
                            )}
                            {event.notes && (
                              <p className="mt-3 text-sm text-muted-foreground italic bg-background p-3 rounded border border-border/50">
                                "{event.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {!searchQuery && !isLoading && (
            <div className="text-center py-20 opacity-50">
              <Package className="h-24 w-24 mx-auto mb-6 opacity-50" />
              <p className="text-xl font-medium">Ready to track.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

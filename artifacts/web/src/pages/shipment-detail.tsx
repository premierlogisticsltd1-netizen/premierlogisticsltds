import { useState, useRef } from "react";
import { useParams, Link } from "wouter";
import { 
  useGetShipment, 
  useUpdateShipment, 
  useListShipmentEvents, 
  useAddTrackingEvent,
  useDeleteShipment,
  useSubmitProofOfDelivery,
  useAssignDriver,
  useListDrivers,
  useGetMe,
  getGetShipmentQueryKey,
  getListShipmentEventsQueryKey,
  getListShipmentsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, Package, MapPin, Clock, Scale, Calendar, Trash2,
  CheckCircle2, Plus, Loader2, AlertCircle, FileText, Truck, ClipboardCheck, UserCheck
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { ShipmentUpdateStatus, TrackingEventInputStatus } from "@workspace/api-client-react";

const STATUS_OPTIONS: { label: string; value: ShipmentUpdateStatus }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Picked Up', value: 'picked_up' },
  { label: 'In Transit', value: 'in_transit' },
  { label: 'Out for Delivery', value: 'out_for_delivery' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Failed', value: 'failed' },
];

export default function ShipmentDetail() {
  const params = useParams();
  const id = Number(params.id);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: shipment, isLoading: isShipmentLoading } = useGetShipment(id, { query: { enabled: !!id, queryKey: getGetShipmentQueryKey(id) } });
  const { data: events, isLoading: isEventsLoading } = useListShipmentEvents(id, { query: { enabled: !!id, queryKey: getListShipmentEventsQueryKey(id) } });

  const { data: me } = useGetMe();
  const roleStr = me?.role as string | undefined;
  const isStaff = ["admin", "manager", "operations", "support", "tracking_agent", "staff"].includes(roleStr ?? "");

  const updateShipment = useUpdateShipment();
  const addEvent = useAddTrackingEvent();
  const deleteShipment = useDeleteShipment();
  const submitPod = useSubmitProofOfDelivery();
  const assignDriver = useAssignDriver();
  const { data: drivers = [] } = useListDrivers({ query: { enabled: isStaff, queryKey: ["listDrivers"] } });

  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [assignSuccess, setAssignSuccess] = useState("");

  const handleAssignDriver = async () => {
    const driverId = selectedDriverId ? Number(selectedDriverId) : (null as unknown as number);
    await assignDriver.mutateAsync({ id, data: { driverId } });
    setAssignSuccess(driverId ? `Driver assigned successfully` : "Driver unassigned");
    setTimeout(() => setAssignSuccess(""), 3000);
    queryClient.invalidateQueries({ queryKey: getGetShipmentQueryKey(id) });
  };

  const [podForm, setPodForm] = useState({ recipientName: "", notes: "" });
  const [podSubmitted, setPodSubmitted] = useState(false);

  const [eventForm, setEventForm] = useState({
    status: 'in_transit' as TrackingEventInputStatus,
    location: '',
    notes: '',
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

  const handleUpdateStatus = (newStatus: ShipmentUpdateStatus) => {
    updateShipment.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: (updatedShipment) => {
          queryClient.setQueryData(getGetShipmentQueryKey(id), updatedShipment);
          toast({ title: "Status Updated", description: `Shipment is now ${formatStatus(newStatus)}` });
        }
      }
    );
  };

  const handlePod = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPod.mutateAsync({ id, data: { recipientName: podForm.recipientName, notes: podForm.notes || undefined } });
    setPodSubmitted(true);
    queryClient.invalidateQueries({ queryKey: getGetShipmentQueryKey(id) });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent.mutate(
      {
        id,
        data: {
          status: eventForm.status,
          location: eventForm.location,
          notes: eventForm.notes || undefined,
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListShipmentEventsQueryKey(id) });
          // Also update the shipment status if the event status is newer/different
          if (shipment && shipment.status !== eventForm.status) {
             handleUpdateStatus(eventForm.status as ShipmentUpdateStatus);
          }
          setEventForm(prev => ({ ...prev, location: '', notes: '' }));
          toast({ title: "Event Added", description: "Tracking timeline updated." });
        }
      }
    );
  };

  if (isShipmentLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!shipment) {
    return <div className="p-8 text-center text-muted-foreground">Shipment not found.</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <Link href="/shipments" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shipments
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold font-mono tracking-tight">{shipment.trackingNumber}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(shipment.status)}`}>
              {formatStatus(shipment.status)}
            </span>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">Created {format(new Date(shipment.createdAt), "PPpp")}</p>
        </div>
        
        <div className="flex gap-2">
          <label htmlFor="shipment-status-select" className="sr-only">Update shipment status</label>
          <select 
            id="shipment-status-select"
            name="shipmentStatus"
            value={shipment.status}
            onChange={(e) => handleUpdateStatus(e.target.value as ShipmentUpdateStatus)}
            disabled={updateShipment.isPending}
            className="px-4 py-2 border border-input bg-card rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Details Card */}
          <div className="bg-card border border-card-border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/20">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Waybill Details
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Origin</div>
                  <div className="font-medium">{shipment.senderName}</div>
                  <div className="text-sm text-foreground/80 mt-1">{shipment.senderAddress}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Specs</div>
                  <div className="text-sm flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      {shipment.weight ? `${shipment.weight} kg` : 'Not specified'}
                    </div>
                    {(shipment.width || shipment.height || shipment.length) && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>{shipment.length ?? '?'} × {shipment.width ?? '?'} × {shipment.height ?? '?'} cm (L×W×H)</span>
                      </div>
                    )}
                    {shipment.serviceType && (
                      <div className="flex items-center gap-2 text-muted-foreground capitalize">
                        <Truck className="h-4 w-4" />
                        {shipment.serviceType.replace('_', ' ')} service
                      </div>
                    )}
                    {shipment.description && (
                      <div className="flex items-start gap-2">
                        <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>{shipment.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Destination</div>
                  <div className="font-medium">{shipment.recipientName}</div>
                  <div className="text-sm text-foreground/80 mt-1">{shipment.recipientAddress}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Timeline</div>
                  <div className="text-sm flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Est: {shipment.estimatedDelivery ? format(new Date(shipment.estimatedDelivery), "PP") : 'Not set'}
                    </div>
                  </div>
                </div>
                {/* QR Code */}
                <div className="pt-4 border-t border-border flex flex-col items-center gap-2">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Scan to Track</div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(shipment.trackingNumber)}&color=1a2744`}
                    alt={`QR for ${shipment.trackingNumber}`}
                    width={120} height={120}
                    className="rounded border border-border p-1 bg-white"
                  />
                  <span className="font-mono text-xs text-muted-foreground">{shipment.trackingNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add Event Form */}
          <div className="bg-card border border-card-border rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Log Tracking Event
            </h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="event-status" className="block text-sm font-medium mb-1">Status</label>
                  <select 
                    id="event-status"
                    name="eventStatus"
                    value={eventForm.status}
                    onChange={e => setEventForm(p => ({ ...p, status: e.target.value as TrackingEventInputStatus }))}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="event-location" className="block text-sm font-medium mb-1">Current Location</label>
                  <input
                    id="event-location"
                    name="location"
                    required
                    value={eventForm.location}
                    onChange={e => setEventForm(p => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. Sort Facility, Chicago"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="event-notes" className="block text-sm font-medium mb-1">Internal Notes (Optional)</label>
                <input
                  id="event-notes"
                  name="notes"
                  value={eventForm.notes}
                  onChange={e => setEventForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="e.g. Package delayed due to weather"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addEvent.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {addEvent.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Log Event
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Assign Driver */}
        {isStaff && (
          <div className="bg-card border border-card-border rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Assign Driver
            </h3>
            {(shipment as unknown as { assignedDriverId?: number | null }).assignedDriverId && (
              <div className="mb-3 text-sm text-muted-foreground flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                Currently: <span className="font-medium text-foreground">
                  {(drivers as Array<{id: number; name: string}>).find(d => d.id === (shipment as unknown as { assignedDriverId?: number | null }).assignedDriverId)?.name ?? `Driver #${(shipment as unknown as { assignedDriverId?: number | null }).assignedDriverId}`}
                </span>
              </div>
            )}
            {assignSuccess && (
              <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />{assignSuccess}
              </div>
            )}
            <div className="flex gap-2">
              <label htmlFor="assign-driver-select" className="sr-only">Select Driver</label>
              <select
                id="assign-driver-select"
                value={selectedDriverId}
                onChange={e => setSelectedDriverId(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">— Unassigned —</option>
                {(drivers as Array<{id: number; name: string; status: string}>)
                  .filter(d => d.status !== "inactive")
                  .map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))
                }
              </select>
              <button
                onClick={handleAssignDriver}
                disabled={assignDriver.isPending}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5 disabled:opacity-60"
              >
                {assignDriver.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                {(shipment as unknown as { assignedDriverId?: number | null }).assignedDriverId ? "Reassign" : "Assign"}
              </button>
            </div>
          </div>
        )}

        {/* Proof of Delivery */}
        {isStaff && shipment.status !== "delivered" && (
          <div className="bg-card border border-card-border rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              Proof of Delivery
            </h3>
            {podSubmitted ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-md p-4 text-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                Delivery confirmed. Shipment marked as delivered.
              </div>
            ) : (
              <form onSubmit={handlePod} className="space-y-4">
                <div>
                  <label htmlFor="pod-recipientName" className="block text-sm font-medium mb-1">Recipient Name <span className="text-red-500">*</span></label>
                  <input id="pod-recipientName" name="recipientName" required placeholder="Name of person who received the package"
                    value={podForm.recipientName} onChange={e => setPodForm(p => ({ ...p, recipientName: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label htmlFor="pod-notes" className="block text-sm font-medium mb-1">Notes (optional)</label>
                  <input id="pod-notes" name="podNotes" placeholder="e.g. Left at reception desk"
                    value={podForm.notes} onChange={e => setPodForm(p => ({ ...p, notes: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <button type="submit" disabled={submitPod.isPending}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-60">
                  {submitPod.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4" />}
                  {submitPod.isPending ? "Recording…" : "Confirm Delivery"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-card-border rounded-lg shadow-sm p-6 sticky top-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Event History
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {isEventsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : events?.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No events logged yet.</p>
              ) : (
                events?.map((event, i) => (
                  <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-card bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {event.status === 'delivered' ? <CheckCircle2 className="h-4 w-4" /> : 
                       event.status === 'failed' ? <AlertCircle className="h-4 w-4" /> :
                       <Truck className="h-4 w-4" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-muted/30 p-4 rounded-md border border-border shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-sm text-foreground">{formatStatus(event.status)}</div>
                        <time className="font-mono text-xs text-muted-foreground">{format(new Date(event.timestamp), "MMM d, HH:mm")}</time>
                      </div>
                      <div className="text-sm text-foreground/80 flex items-center gap-1 mt-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {event.location}
                      </div>
                      {event.notes && (
                        <div className="mt-2 text-xs bg-card border border-border p-2 rounded text-muted-foreground italic">
                          {event.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

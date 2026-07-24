import { useState } from "react";
import { useCreateShipment, getListShipmentsQueryKey } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Loader2, Scale, MapPin, User, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewShipment() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createShipment = useCreateShipment();

  const [formData, setFormData] = useState({
    senderName: "",
    senderAddress: "",
    recipientName: "",
    recipientAddress: "",
    weight: "",
    description: "",
    estimatedDelivery: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createShipment.mutate(
      {
        data: {
          senderName: formData.senderName,
          senderAddress: formData.senderAddress,
          recipientName: formData.recipientName,
          recipientAddress: formData.recipientAddress,
          weight: formData.weight ? Number(formData.weight) : undefined,
          description: formData.description || undefined,
          estimatedDelivery: formData.estimatedDelivery ? new Date(formData.estimatedDelivery).toISOString() : undefined,
        }
      },
      {
        onSuccess: (shipment) => {
          queryClient.invalidateQueries({ queryKey: getListShipmentsQueryKey() });
          toast({
            title: "Shipment Created",
            description: `Tracking #: ${shipment.trackingNumber}`,
          });
          setLocation(`/shipments/${shipment.id}`);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.error || "Failed to create shipment",
            variant: "destructive"
          });
        }
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/shipments" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shipments
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create Waybill</h1>
        <p className="text-muted-foreground mt-1">Register a new shipment into the logistics network.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-card-border p-8 rounded-lg shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sender Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-border pb-2 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Sender Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name / Company</label>
                <input
                  required
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  Origin Address
                </label>
                <textarea
                  required
                  name="senderAddress"
                  value={formData.senderAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                  placeholder="Full street address..."
                />
              </div>
            </div>
          </div>

          {/* Recipient Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-border pb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Destination Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Recipient Name</label>
                <input
                  required
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  Delivery Address
                </label>
                <textarea
                  required
                  name="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                  placeholder="Full street address..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Shipment Specs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Scale className="h-3 w-3 text-muted-foreground" />
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.01"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                Est. Delivery Date
              </label>
              <input
                type="date"
                name="estimatedDelivery"
                value={formData.estimatedDelivery}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Description / Notes</label>
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                placeholder="e.g. Fragile contents"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex justify-end gap-3">
          <Link href="/shipments" className="px-6 py-2 border border-input bg-background rounded-md text-sm font-medium hover:bg-muted transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createShipment.isPending}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {createShipment.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Register Shipment
          </button>
        </div>
      </form>
    </div>
  );
}

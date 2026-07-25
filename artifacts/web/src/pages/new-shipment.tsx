import { useRef, useState } from "react";
import { useCreateShipment, getListShipmentsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Check, Loader2, Scale, MapPin, User,
  Calendar, FileText, Printer, Package, ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatedShipment {
  id: number;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  weight?: number | null;
  description?: string | null;
  estimatedDelivery?: string | null;
  status: string;
  createdAt: string;
}

function InvoiceReceipt({ shipment, onClose }: { shipment: CreatedShipment; onClose: () => void }) {
  const printRef = useRef<HTMLDivElement>(null);
  const invoiceNumber = `INV-${shipment.trackingNumber}`;
  const receiptNumber = `RCT-${shipment.trackingNumber}`;
  const date = new Date(shipment.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const estDelivery = shipment.estimatedDelivery
    ? new Date(shipment.estimatedDelivery).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    : "—";

  function handlePrint() {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Waybill & Invoice — ${shipment.trackingNumber}</title>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Open Sans', sans-serif; color: #1a1a2e; background: white; padding: 24px; }
            .doc { max-width: 720px; margin: 0 auto; }
            .doc + .doc { margin-top: 48px; border-top: 2px dashed #ccc; padding-top: 48px; }
            h1, h2, h3, h4 { font-family: 'Montserrat', sans-serif; }
            .badge { display: inline-block; background: #ff6208; color: white; padding: 2px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; font-family: Montserrat, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            td, th { padding: 8px 12px; text-align: left; border: 1px solid #e5e7eb; font-size: 13px; }
            th { background: #f3f4f6; font-weight: 600; font-family: Montserrat, sans-serif; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
            .logo { font-family: Montserrat, sans-serif; font-weight: 900; font-size: 18px; color: #1a2744; }
            .logo span { color: #ff6208; }
            .meta { text-align: right; font-size: 12px; color: #6b7280; }
            .meta strong { font-size: 20px; color: #1a2744; display: block; font-family: Montserrat, sans-serif; }
            .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #6b7280; margin: 20px 0 8px; }
            .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; font-size: 13px; }
            .box strong { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #9ca3af; display: block; margin-bottom: 4px; }
            .total { background: #1a2744; color: white; padding: 12px 16px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
            .total span { font-family: Montserrat, sans-serif; font-weight: 700; }
            .footer-note { font-size: 11px; color: #9ca3af; margin-top: 24px; text-align: center; }
            @media print { body { padding: 0; } .doc + .doc { page-break-before: always; border: none; padding-top: 24px; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  }

  const docContent = (
    <div ref={printRef}>
      {/* ── INVOICE ── */}
      <div className="doc">
        <div className="header">
          <div>
            <div className="logo">PREMIER <span>LOGISTICS</span></div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>+1 202 753 0933</div>
          </div>
          <div className="meta">
            <strong>{invoiceNumber}</strong>
            INVOICE<br />Date: {date}
          </div>
        </div>
        <div className="grid2">
          <div className="box">
            <strong>Sender</strong>
            {shipment.senderName}<br />{shipment.senderAddress}
          </div>
          <div className="box">
            <strong>Recipient</strong>
            {shipment.recipientName}<br />{shipment.recipientAddress}
          </div>
        </div>
        <table style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Tracking Number</th>
              <th>Weight</th>
              <th>Est. Delivery</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{shipment.description || "General cargo"}</td>
              <td>{shipment.trackingNumber}</td>
              <td>{shipment.weight ? `${shipment.weight} kg` : "—"}</td>
              <td>{estDelivery}</td>
              <td><span className="badge">{shipment.status}</span></td>
            </tr>
          </tbody>
        </table>
        <div className="total">
          <span>Total Charges</span>
          <span>To be invoiced</span>
        </div>
        <div className="footer-note">Thank you for choosing Premier Logistics · premier-logistics.com · +1 202 753 0933</div>
      </div>

      {/* ── RECEIPT / WAYBILL ── */}
      <div className="doc">
        <div className="header">
          <div>
            <div className="logo">PREMIER <span>LOGISTICS</span></div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>+1 202 753 0933</div>
          </div>
          <div className="meta">
            <strong>{receiptNumber}</strong>
            WAYBILL / RECEIPT<br />Date: {date}
          </div>
        </div>
        <table>
          <tbody>
            <tr><th style={{ width: "40%" }}>Tracking Number</th><td><strong>{shipment.trackingNumber}</strong></td></tr>
            <tr><th>Sender</th><td>{shipment.senderName}, {shipment.senderAddress}</td></tr>
            <tr><th>Recipient</th><td>{shipment.recipientName}, {shipment.recipientAddress}</td></tr>
            <tr><th>Weight</th><td>{shipment.weight ? `${shipment.weight} kg` : "—"}</td></tr>
            <tr><th>Description</th><td>{shipment.description || "General cargo"}</td></tr>
            <tr><th>Estimated Delivery</th><td>{estDelivery}</td></tr>
            <tr><th>Status</th><td><span className="badge">{shipment.status}</span></td></tr>
            <tr><th>Created</th><td>{date}</td></tr>
          </tbody>
        </table>
        <div className="footer-note" style={{ marginTop: 32, borderTop: "2px solid #e5e7eb", paddingTop: 16 }}>
          Sender signature: _____________________________ &nbsp;&nbsp;&nbsp; Recipient signature: _____________________________
        </div>
        <div className="footer-note">This waybill is proof of shipment receipt · Premier Logistics · +1 202 753 0933</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-8">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-[#1a2744] px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-400 text-white">
              <Check className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>Shipment Created</p>
              <p className="text-xs text-white/60">{shipment.trackingNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-6 py-4 bg-gray-50">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded bg-[#ff6208] px-4 py-2 text-sm font-bold text-white hover:bg-[#e55500] transition"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <Printer className="h-4 w-4" />
            Print Invoice &amp; Waybill
          </button>
          <Link
            href={`/shipments/${shipment.id}`}
            className="inline-flex items-center gap-2 rounded border border-[#1a2744] px-4 py-2 text-sm font-bold text-[#1a2744] hover:bg-[#1a2744] hover:text-white transition"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <ExternalLink className="h-4 w-4" />
            View Shipment
          </Link>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition ml-auto">
            Close &amp; Continue
          </button>
        </div>

        {/* Document preview */}
        <div className="overflow-y-auto max-h-[70vh] p-6 space-y-8 text-sm text-[#1a1a2e]">
          {/* Invoice Preview */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#1a2744] px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/70" style={{ fontFamily: "'Montserrat', sans-serif" }}>Invoice</span>
              <span className="text-white font-bold text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>{invoiceNumber}</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400 font-bold mb-1">Sender</p>
                  <p className="font-semibold">{shipment.senderName}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{shipment.senderAddress}</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400 font-bold mb-1">Recipient</p>
                  <p className="font-semibold">{shipment.recipientName}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{shipment.recipientAddress}</p>
                </div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-500 font-semibold">Description</th>
                    <th className="text-left py-2 text-gray-500 font-semibold">Tracking</th>
                    <th className="text-left py-2 text-gray-500 font-semibold">Weight</th>
                    <th className="text-left py-2 text-gray-500 font-semibold">Est. Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">{shipment.description || "General cargo"}</td>
                    <td className="py-2 font-mono font-bold">{shipment.trackingNumber}</td>
                    <td className="py-2">{shipment.weight ? `${shipment.weight} kg` : "—"}</td>
                    <td className="py-2">{estDelivery}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-between items-center bg-[#1a2744] text-white rounded px-4 py-2.5 text-xs font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <span>Total Charges</span><span>To be invoiced</span>
              </div>
              <p className="text-xs text-gray-400 text-center">Date: {date} · Premier Logistics · +1 202 753 0933</p>
            </div>
          </div>

          {/* Waybill / Receipt Preview */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-[#ff6208] px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80" style={{ fontFamily: "'Montserrat', sans-serif" }}>Waybill / Receipt</span>
              <span className="text-white font-bold text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>{receiptNumber}</span>
            </div>
            <div className="p-5">
              <table className="w-full text-xs">
                <tbody>
                  {[
                    ["Tracking Number", <span className="font-bold font-mono text-[#1a2744]">{shipment.trackingNumber}</span>],
                    ["Sender", `${shipment.senderName} · ${shipment.senderAddress}`],
                    ["Recipient", `${shipment.recipientName} · ${shipment.recipientAddress}`],
                    ["Weight", shipment.weight ? `${shipment.weight} kg` : "—"],
                    ["Description", shipment.description || "General cargo"],
                    ["Estimated Delivery", estDelivery],
                    ["Status", <span className="rounded bg-[#ff6208] px-2 py-0.5 text-white font-bold text-xs">{shipment.status}</span>],
                    ["Date Created", date],
                  ].map(([label, value]) => (
                    <tr key={label as string} className="border-b border-gray-100">
                      <td className="py-2 pr-3 font-semibold text-gray-500 w-36">{label}</td>
                      <td className="py-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 grid grid-cols-2 gap-6 border-t border-gray-200 pt-4 text-xs text-gray-400">
                <div>Sender signature: <div className="mt-4 border-b border-gray-300 w-full" /></div>
                <div>Recipient signature: <div className="mt-4 border-b border-gray-300 w-full" /></div>
              </div>
              <p className="text-xs text-gray-400 text-center mt-4">Premier Logistics · +1 202 753 0933</p>
            </div>
          </div>
        </div>

        {/* Hidden print content */}
        <div style={{ display: "none" }}>
          {docContent}
        </div>
      </div>
    </div>
  );
}

export default function NewShipment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createShipment = useCreateShipment();
  const [createdShipment, setCreatedShipment] = useState<CreatedShipment | null>(null);
  const [showDocs, setShowDocs] = useState(false);

  const [formData, setFormData] = useState({
    senderName: "",
    senderAddress: "",
    recipientName: "",
    recipientAddress: "",
    weight: "",
    description: "",
    estimatedDelivery: "",
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
          estimatedDelivery: formData.estimatedDelivery
            ? new Date(formData.estimatedDelivery).toISOString()
            : undefined,
        },
      },
      {
        onSuccess: (shipment) => {
          queryClient.invalidateQueries({ queryKey: getListShipmentsQueryKey() });
          toast({ title: "Shipment Created", description: `Tracking #: ${shipment.trackingNumber}` });
          setCreatedShipment(shipment as CreatedShipment);
          setShowDocs(true);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: (error as { data?: { error?: string }; message?: string }).data?.error || (error as { message?: string }).message || "Failed to create shipment",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {showDocs && createdShipment && (
        <InvoiceReceipt shipment={createdShipment} onClose={() => setShowDocs(false)} />
      )}

      <div className="mb-8">
        <Link
          href="/shipments"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shipments
        </Link>
        <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Create Waybill
        </h1>
        <p className="text-muted-foreground mt-1">Register a new shipment — an invoice and waybill receipt will be generated automatically.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-card-border p-8 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sender */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-border pb-2 flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <User className="h-5 w-5 text-primary" /> Sender Details
            </h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="senderName" className="block text-sm font-medium mb-1">Name / Company</label>
                <input id="senderName" required name="senderName" value={formData.senderName} onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label htmlFor="senderAddress" className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" /> Origin Address
                </label>
                <textarea id="senderAddress" required name="senderAddress" value={formData.senderAddress} onChange={handleChange} rows={3}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                  placeholder="Full street address..." />
              </div>
            </div>
          </div>

          {/* Recipient */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-border pb-2 flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <MapPin className="h-5 w-5 text-primary" /> Destination Details
            </h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="recipientName" className="block text-sm font-medium mb-1">Recipient Name</label>
                <input id="recipientName" required name="recipientName" value={formData.recipientName} onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label htmlFor="recipientAddress" className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" /> Delivery Address
                </label>
                <textarea id="recipientAddress" required name="recipientAddress" value={formData.recipientAddress} onChange={handleChange} rows={3}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                  placeholder="Full street address..." />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <FileText className="h-5 w-5 text-primary" /> Shipment Specs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Scale className="h-3 w-3 text-muted-foreground" /> Weight (kg)
              </label>
              <input id="weight" type="number" step="0.01" name="weight" value={formData.weight} onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                placeholder="0.00" />
            </div>
            <div>
              <label htmlFor="estimatedDelivery" className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" /> Est. Delivery Date
              </label>
              <input id="estimatedDelivery" type="date" name="estimatedDelivery" value={formData.estimatedDelivery} onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description / Notes</label>
              <input id="description" name="description" value={formData.description} onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                placeholder="e.g. Fragile contents" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-5 p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-700">
            <Package className="h-4 w-4 shrink-0" />
            An <strong>invoice</strong> and <strong>waybill receipt</strong> will be generated automatically after registration.
          </div>
          <div className="flex justify-end gap-3">
            <Link href="/shipments"
              className="px-6 py-2 border border-input bg-background rounded-md text-sm font-medium hover:bg-muted transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={createShipment.isPending}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {createShipment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Register Shipment &amp; Generate Documents
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

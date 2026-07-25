import { Link } from "wouter";
import { Truck, Plane, Ship, Package, Clock, Globe, Shield, BarChart3 } from "lucide-react";

export default function Services() {
  const services = [
    { icon: Truck, title: "Road Freight", desc: "FTL and LTL shipping across our road network with real-time GPS tracking.", features: ["FTL & LTL options", "Temperature-controlled", "Hazmat certified", "Last-mile delivery"] },
    { icon: Plane, title: "Air Freight", desc: "Express and economy air freight solutions for time-critical shipments.", features: ["Next-flight-out", "Door-to-door", "Customs clearance", "Priority handling"] },
    { icon: Ship, title: "Ocean Freight", desc: "FCL and LCL ocean freight across major trade lanes.", features: ["FCL & LCL", "Port-to-door", "Inland transport", "Cargo insurance"] },
    { icon: Package, title: "Parcel & Express", desc: "Fast parcel delivery for e-commerce and business shipments.", features: ["Same-day available", "Proof of delivery", "Returns management", "API integration"] },
    { icon: Clock, title: "Time-Critical Logistics", desc: "Guaranteed time-definite delivery with 24/7 operations monitoring.", features: ["Minute-level precision", "Dedicated handler", "Executive alerts", "SLA guarantees"] },
    { icon: Globe, title: "International Freight", desc: "End-to-end global freight management with customs brokerage.", features: ["Customs brokerage", "Trade compliance", "HS classification", "Duty drawback"] },
    { icon: Shield, title: "Warehousing", desc: "Strategic warehousing and pick-pack-ship fulfillment.", features: ["Climate-controlled", "Inventory management", "B2B & D2C fulfillment", "Cross-docking"] },
    { icon: BarChart3, title: "Supply Chain Consulting", desc: "Expert analysis to reduce costs and improve resilience.", features: ["Network design", "Cost reduction", "Risk assessment", "Technology integration"] },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-[#1a2744] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black tracking-wider"><Truck className="h-6 w-6 text-[#ff6208]" />PREMIER LOGISTICS</Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/about" className="hover:text-[#ff6208]">About</Link>
            <Link href="/services" className="text-[#ff6208]">Services</Link>
            <Link href="/track" className="hover:text-[#ff6208]">Track</Link>
            <Link href="/contact" className="hover:text-[#ff6208]">Contact</Link>
            <Link href="/login" className="bg-[#ff6208] text-white px-4 py-2 rounded font-semibold hover:bg-[#e55500]">Staff Login</Link>
          </div>
        </div>
      </nav>
      <section className="bg-[#1a2744] text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>Our Logistics Services</h1>
          <p className="text-xl text-white/70">From express parcels to complex supply chains — a tailored solution for every shipping need.</p>
        </div>
      </section>
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.title} className="border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-[#ff6208]/10 rounded-xl flex items-center justify-center mb-6"><s.icon className="h-6 w-6 text-[#ff6208]" /></div>
              <h3 className="text-xl font-black text-[#1a2744] mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>{s.title}</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">{s.desc}</p>
              <ul className="space-y-2">{s.features.map((f) => <li key={f} className="text-sm text-gray-600 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#ff6208]" />{f}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-[#ff6208] py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Solution?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-[#ff6208] px-8 py-3 rounded font-bold hover:bg-gray-100">Contact Sales</Link>
            <Link href="/track" className="border border-white text-white px-8 py-3 rounded font-bold hover:bg-[#ff6208]/80">Track a Shipment</Link>
          </div>
        </div>
      </section>
      <footer className="bg-[#1a2744] text-white/60 py-12 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Premier Logistics Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}

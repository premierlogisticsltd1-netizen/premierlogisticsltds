import { Link } from "wouter";
import { Truck, ChevronDown, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Faqs() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setOpen(o => ({ ...o, [key]: !o[key] }));
  const sections = [
    { title: "Shipping Basics", items: [
      { q: "What types of shipments do you handle?", a: "We handle parcels, pallets, full truckloads, air freight, ocean freight, and specialised cargo." },
      { q: "How do I create a shipment?", a: "Book via the customer portal or contact our support team with origin, destination, weight, and service type." },
      { q: "Can you collect from my premises?", a: "Yes. We offer door-to-door and door-to-port collection options." },
      { q: "What is the maximum parcel weight?", a: "Standard parcel limit is 70 kg. Heavier items move as freight." },
    ]},
    { title: "Tracking", items: [
      { q: "How do I track my shipment?", a: "Enter your tracking number on the Track Shipment page or in the customer portal." },
      { q: "How often is tracking updated?", a: "Updates are posted at every major milestone, typically within minutes." },
      { q: "What does 'In Transit' mean?", a: "Your shipment is moving through our network between origin and destination." },
      { q: "Can I share tracking?", a: "Yes. The tracking page is public and requires no login." },
    ]},
    { title: "Customs & International", items: [
      { q: "Do you handle customs clearance?", a: "Yes. Our customs brokerage team prepares documentation and handles duties." },
      { q: "What documents do I need?", a: "Typically commercial invoice, packing list, and any required licences or certificates." },
      { q: "How long does customs take?", a: "Usually 1–3 business days depending on the country and commodity." },
      { q: "Can you ship to any country?", a: "We serve 60+ countries. Restricted destinations are flagged during quoting." },
    ]},
    { title: "Billing & Payment", items: [
      { q: "How do I get a quote?", a: "Use the Request a Quote page or contact sales. Quotes are delivered within 2 hours." },
      { q: "What payment methods do you accept?", a: "Bank transfer, credit card, and corporate account billing." },
      { q: "Can I set up a credit account?", a: "Yes. Credit applications are reviewed within 2 business days." },
    ]},
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-[#1a2744] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black tracking-wider"><Truck className="h-6 w-6 text-[#ff6208]" />PREMIER LOGISTICS</Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/about" className="hover:text-[#ff6208]">About</Link>
            <Link href="/services" className="hover:text-[#ff6208]">Services</Link>
            <Link href="/track" className="hover:text-[#ff6208]">Track</Link>
            <Link href="/contact" className="hover:text-[#ff6208]">Contact</Link>
            <Link href="/faqs" className="text-[#ff6208]">FAQs</Link>
            <Link href="/login" className="bg-[#ff6208] text-white px-4 py-2 rounded font-semibold hover:bg-[#e55500]">Staff Login</Link>
          </div>
        </div>
      </nav>
      <section className="bg-[#1a2744] text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>Frequently Asked Questions</h1>
          <p className="text-xl text-white/70">Quick answers to common questions.</p>
        </div>
      </section>
      <section className="py-20 max-w-4xl mx-auto px-6">
        {sections.map(section => (
          <div key={section.title} className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a2744] mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>{section.title}</h2>
            <div className="space-y-3">
              {section.items.map(item => {
                const key = section.title + item.q;
                return <div key={item.q} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => toggle(key)} className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50">
                    <span className="font-medium text-[#1a2744] pr-4">{item.q}</span>
                    <ChevronDown className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${open[key] ? "rotate-180" : ""}`} />
                  </button>
                  {open[key] && <div className="px-5 pb-5 text-gray-600 leading-relaxed">{item.a}</div>}
                </div>;
              })}
            </div>
          </div>
        ))}
      </section>
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <MessageCircle className="h-12 w-12 text-[#ff6208] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#1a2744] mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>Still have questions?</h2>
          <Link href="/contact" className="bg-[#ff6208] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#e55500]">Contact Support</Link>
        </div>
      </section>
      <footer className="bg-[#1a2744] text-white/60 py-12 text-center text-sm"><p>&copy; {new Date().getFullYear()} Premier Logistics Ltd.</p></footer>
    </div>
  );
}

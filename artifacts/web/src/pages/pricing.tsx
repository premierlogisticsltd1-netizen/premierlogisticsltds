import { Link } from "wouter";
import { Truck, Check, X } from "lucide-react";

export default function Pricing() {
  const tiers = [
    { name: "Starter", price: "Free", desc: "For occasional shippers", cta: "Get Started", highlight: false },
    { name: "Business", price: "$299", period: "/month", desc: "For regular shipping needs", cta: "Start Trial", highlight: true },
    { name: "Enterprise", price: "Custom", desc: "For high-volume shippers", cta: "Contact Sales", highlight: false },
  ];
  const features = [
    { label: "Customer portal", starter: true, business: true, enterprise: true },
    { label: "Public tracking", starter: true, business: true, enterprise: true },
    { label: "Real-time tracking", starter: true, business: true, enterprise: true },
    { label: "Email notifications", starter: true, business: true, enterprise: true },
    { label: "Road freight", starter: true, business: true, enterprise: true },
    { label: "Air & ocean freight", starter: false, business: true, enterprise: true },
    { label: "Dedicated account manager", starter: false, business: true, enterprise: true },
    { label: "Volume discounts", starter: false, business: "10%", enterprise: "Custom" },
    { label: "API access", starter: false, business: true, enterprise: true },
    { label: "Customs brokerage", starter: "Pay-per-use", business: true, enterprise: true },
    { label: "Warehousing", starter: false, business: "Add-on", enterprise: true },
    { label: "SLA guarantees", starter: false, business: true, enterprise: true },
  ];
  const render = (val: boolean | string) => val === true ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : val === false ? <X className="h-5 w-5 text-gray-300 mx-auto" /> : <span className="text-sm font-medium text-[#ff6208]">{val}</span>;
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
            <Link href="/pricing" className="text-[#ff6208]">Pricing</Link>
            <Link href="/login" className="bg-[#ff6208] text-white px-4 py-2 rounded font-semibold hover:bg-[#e55500]">Staff Login</Link>
          </div>
        </div>
      </nav>
      <section className="bg-[#1a2744] text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>Transparent Pricing</h1>
          <p className="text-xl text-white/70">Choose a plan that fits your shipping volume.</p>
        </div>
      </section>
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {tiers.map(t => <div key={t.name} className={`rounded-2xl p-8 border ${t.highlight ? "border-[#ff6208] shadow-xl relative" : "border-gray-200"}`}>
            {t.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff6208] text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>}
            <h3 className="text-xl font-bold text-[#1a2744]">{t.name}</h3>
            <div className="mt-4 mb-2"><span className="text-4xl font-black text-[#ff6208]">{t.price}</span>{t.period && <span className="text-gray-500">{t.period}</span>}</div>
            <p className="text-gray-600 mb-6">{t.desc}</p>
            <Link href="/contact" className={`block text-center py-3 rounded-lg font-bold ${t.highlight ? "bg-[#ff6208] text-white hover:bg-[#e55500]" : "bg-gray-100 text-[#1a2744] hover:bg-gray-200"}`}>{t.cta}</Link>
          </div>)}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead><tr className="bg-gray-50"><th className="text-left p-4 border border-gray-200 font-bold text-[#1a2744]">Feature</th><th className="p-4 border border-gray-200 font-bold text-[#1a2744]">Starter</th><th className="p-4 border border-gray-200 font-bold text-[#ff6208]">Business</th><th className="p-4 border border-gray-200 font-bold text-[#1a2744]">Enterprise</th></tr></thead>
            <tbody>{features.map(f => <tr key={f.label} className="hover:bg-gray-50"><td className="p-4 border border-gray-200 text-gray-700">{f.label}</td><td className="p-4 border border-gray-200 text-center">{render(f.starter)}</td><td className="p-4 border border-gray-200 text-center">{render(f.business)}</td><td className="p-4 border border-gray-200 text-center">{render(f.enterprise)}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <footer className="bg-[#1a2744] text-white/60 py-12 text-center text-sm"><p>&copy; {new Date().getFullYear()} Premier Logistics Ltd.</p></footer>
    </div>
  );
}

import { Link } from "wouter";
import { Truck, Shield, Globe, Clock, Award, Users } from "lucide-react";

export default function About() {
  const stats = [
    { label: "Years in Business", value: "15+" },
    { label: "Countries Served", value: "60+" },
    { label: "Shipments Delivered", value: "2M+" },
    { label: "Client Satisfaction", value: "98.7%" },
  ];
  const values = [
    { icon: Shield, title: "Reliability", desc: "Every shipment is treated as our own, with safe, on-time delivery." },
    { icon: Globe, title: "Global Reach", text: "Network spanning 60+ countries with trusted local partners." },
    { icon: Clock, title: "Timeliness", desc: "Real-time tracking and proactive communication at every milestone." },
    { icon: Award, title: "Excellence", desc: "ISO-certified operations with rigorous quality checks." },
  ];
  const team = [
    { name: "Marcus O. Adeyemi", title: "CEO", initials: "MA" },
    { name: "Sarah L. Chen", title: "COO", initials: "SC" },
    { name: "David R. Nwachukwu", title: "VP Global Logistics", initials: "DN" },
    { name: "Amina K. Hassan", title: "Head of Customer Experience", initials: "AH" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-[#1a2744] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black tracking-wider"><Truck className="h-6 w-6 text-[#ff6208]" />PREMIER LOGISTICS</Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/about" className="text-[#ff6208]">About</Link>
            <Link href="/services" className="hover:text-[#ff6208]">Services</Link>
            <Link href="/track" className="hover:text-[#ff6208]">Track</Link>
            <Link href="/contact" className="hover:text-[#ff6208]">Contact</Link>
            <Link href="/login" className="bg-[#ff6208] text-white px-4 py-2 rounded font-semibold hover:bg-[#e55500]">Staff Login</Link>
          </div>
        </div>
      </nav>
      <section className="bg-[#1a2744] text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>About Premier Logistics</h1>
          <p className="text-xl text-white/70">Connecting businesses and communities across six continents since 2009.</p>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => <div key={s.label}><div className="text-4xl font-black text-[#ff6208] mb-2">{s.value}</div><div className="text-gray-600">{s.label}</div></div>)}
        </div>
      </section>
      <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-black text-[#1a2744] mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">To deliver more than packages — we deliver certainty. In a world of complex supply chains, Premier Logistics provides the clarity, speed, and trust that businesses depend on.</p>
          <p className="text-gray-600 leading-relaxed">Every shipment gets the same commitment: accurate tracking, transparent communication, and professional handling from pickup to proof of delivery.</p>
        </div>
        <div className="bg-[#ff6208]/10 rounded-2xl p-10">
          <blockquote className="text-xl italic text-[#1a2744] leading-relaxed">"We don't just move goods — we move businesses forward. Every delivery is a promise kept."</blockquote>
          <p className="mt-6 text-[#ff6208] font-semibold">— Marcus O. Adeyemi, CEO</p>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black text-[#1a2744] text-center mb-12" style={{ fontFamily: "'Montserrat', sans-serif" }}>Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-12 w-12 bg-[#ff6208]/10 rounded-lg flex items-center justify-center mb-4"><v.icon className="h-6 w-6 text-[#ff6208]" /></div>
                <h3 className="font-bold text-[#1a2744] mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-black text-[#1a2744] text-center mb-12" style={{ fontFamily: "'Montserrat', sans-serif" }}>Leadership Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((m) => <div key={m.name} className="text-center"><div className="h-20 w-20 rounded-full bg-[#1a2744] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">{m.initials}</div><h3 className="font-bold text-[#1a2744]">{m.name}</h3><p className="text-gray-500 text-sm">{m.title}</p></div>)}
        </div>
      </section>
      <section className="bg-[#ff6208] py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Ship with Confidence?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-[#ff6208] px-8 py-3 rounded font-bold hover:bg-gray-100">Contact Us</Link>
            <Link href="/track" className="border border-white text-white px-8 py-3 rounded font-bold hover:bg-[#ff6208]/80">Track Shipment</Link>
          </div>
        </div>
      </section>
      <footer className="bg-[#1a2744] text-white/60 py-12 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Premier Logistics Ltd. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
      </footer>
    </div>
  );
}

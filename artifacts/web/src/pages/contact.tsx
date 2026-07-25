import { useState } from "react";
import { Link } from "wouter";
import { Truck, MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };
  const offices = [
    { city: "London", address: "Premier House, 22 Canary Wharf, London E14 5AB, UK", phone: "+44 20 7946 0800" },
    { city: "Lagos", address: "Block D, Victoria Island Business District, Lagos, Nigeria", phone: "+234 1 700 4900" },
    { city: "New York", address: "One World Trade Center, Suite 8500, New York, NY 10007", phone: "+1 212 555 0190" },
    { city: "Dubai", address: "Level 14, Emaar Square, Business Bay, Dubai, UAE", phone: "+971 4 550 2000" },
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
            <Link href="/contact" className="text-[#ff6208]">Contact</Link>
            <Link href="/login" className="bg-[#ff6208] text-white px-4 py-2 rounded font-semibold hover:bg-[#e55500]">Staff Login</Link>
          </div>
        </div>
      </nav>
      <section className="bg-[#1a2744] text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>Contact Us</h1>
          <p className="text-xl text-white/70">Our logistics team is available 24/7.</p>
        </div>
      </section>
      <section className="py-20 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-black text-[#1a2744] mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>Send a Message</h2>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1a2744]">Message Received!</h3>
              <p className="text-gray-600">Our team will respond within 2 business hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input id="contact-name" name="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6208]" /></div>
                <div><label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input id="contact-email" name="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6208]" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input id="contact-phone" name="phone" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6208]" /></div>
                <div><label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject *</label><select id="contact-subject" name="subject" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6208] bg-white"><option value="">Select</option><option value="quote">Request a Quote</option><option value="support">Shipment Support</option><option value="tracking">Tracking Help</option><option value="billing">Billing</option><option value="other">Other</option></select></div>
              </div>
              <div><label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label><textarea id="contact-message" name="message" required rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6208] resize-none" /></div>
              <button type="submit" className="w-full bg-[#ff6208] text-white py-3 rounded-lg font-bold hover:bg-[#e55500] flex items-center justify-center gap-2"><Send className="h-4 w-4" />Send Message</button>
            </form>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#1a2744] mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>Reach Us</h2>
          <div className="space-y-6 mb-10">
            <div className="flex gap-4"><div className="h-10 w-10 bg-[#ff6208]/10 rounded-lg flex items-center justify-center"><Phone className="h-5 w-5 text-[#ff6208]" /></div><div><p className="font-bold text-[#1a2744]">Global Hotline</p><p className="text-gray-600">+1 800 PREMIER</p></div></div>
            <div className="flex gap-4"><div className="h-10 w-10 bg-[#ff6208]/10 rounded-lg flex items-center justify-center"><Mail className="h-5 w-5 text-[#ff6208]" /></div><div><p className="font-bold text-[#1a2744]">Email</p><p className="text-gray-600">support@premierlogisticsltds.com</p></div></div>
            <div className="flex gap-4"><div className="h-10 w-10 bg-[#ff6208]/10 rounded-lg flex items-center justify-center"><Clock className="h-5 w-5 text-[#ff6208]" /></div><div><p className="font-bold text-[#1a2744]">Business Hours</p><p className="text-gray-600">Mon–Fri 8 AM – 8 PM GMT</p></div></div>
          </div>
          <h3 className="text-xl font-bold text-[#1a2744] mb-4">Global Offices</h3>
          <div className="grid sm:grid-cols-2 gap-4">{offices.map(o => <div key={o.city} className="bg-gray-50 rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4 text-[#ff6208]" /><span className="font-bold text-[#1a2744]">{o.city}</span></div><p className="text-gray-500 text-sm">{o.address}</p><p className="text-[#ff6208] text-sm font-medium">{o.phone}</p></div>)}</div>
        </div>
      </section>
      <footer className="bg-[#1a2744] text-white/60 py-12 text-center text-sm"><p>&copy; {new Date().getFullYear()} Premier Logistics Ltd.</p></footer>
    </div>
  );
}

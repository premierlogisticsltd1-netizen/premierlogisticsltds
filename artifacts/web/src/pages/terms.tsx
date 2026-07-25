import { Link } from "wouter";
import { Truck } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-[#1a2744] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black tracking-wider"><Truck className="h-6 w-6 text-[#ff6208]" />PREMIER LOGISTICS</Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/about" className="hover:text-[#ff6208]">About</Link>
            <Link href="/services" className="hover:text-[#ff6208]">Services</Link>
            <Link href="/contact" className="hover:text-[#ff6208]">Contact</Link>
            <Link href="/login" className="bg-[#ff6208] text-white px-4 py-2 rounded font-semibold hover:bg-[#e55500]">Staff Login</Link>
          </div>
        </div>
      </nav>
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-black text-[#1a2744] mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>Terms of Service</h1>
          <p className="text-gray-500 mb-8">Effective Date: January 1, 2024</p>
          <div className="prose max-w-none text-gray-700">
            <p>Welcome to Premier Logistics Ltd. These Terms of Service govern your access to and use of our website, customer portal, and logistics services.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">1. Acceptance</h2><p>By creating an account, booking a shipment, or using our Services, you agree to these Terms and our Privacy Policy.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">2. Services</h2><p>We provide domestic and international freight forwarding, transportation, warehousing, customs brokerage, and related logistics services.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">3. Account Registration</h2><p>You must provide accurate information. You are responsible for maintaining the confidentiality of your credentials.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">4. Prohibited Items</h2><p>You may not ship illegal, dangerous, or prohibited items. You must accurately declare shipment contents and values.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">5. Payments</h2><p>Fees are based on quoted rates, weight, dimensions, destination, and additional services. Payment is due according to agreed terms.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">6. Liability</h2><p>Our liability is limited to the terms agreed in your contract or applicable international carriage conventions.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">7. Governing Law</h2><p>These Terms are governed by the laws of England and Wales.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">8. Contact</h2><p>For questions, contact legal@premierlogisticsltds.com.</p>
          </div>
        </div>
      </section>
      <footer className="bg-[#1a2744] text-white/60 py-12 text-center text-sm"><p>&copy; {new Date().getFullYear()} Premier Logistics Ltd.</p></footer>
    </div>
  );
}

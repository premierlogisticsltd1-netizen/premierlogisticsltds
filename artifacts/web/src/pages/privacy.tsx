import { Link } from "wouter";
import { Truck } from "lucide-react";

export default function Privacy() {
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
          <h1 className="text-4xl font-black text-[#1a2744] mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Effective Date: January 1, 2024</p>
          <div className="prose max-w-none text-gray-700">
            <p>Premier Logistics Ltd is committed to protecting your privacy. This policy explains how we collect, use, disclose, and safeguard your personal information.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">1. Information We Collect</h2><p>We collect personal information you provide directly, such as name, email, phone, company name, billing address, and shipment details. We also collect information automatically through cookies and similar technologies.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">2. How We Use Your Information</h2><p>We use your information to provide and improve logistics services, process shipments, manage accounts, communicate with you, comply with legal obligations, and enhance security.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">3. Cookies</h2><p>We use cookies to maintain sessions, remember preferences, analyse usage, and deliver relevant marketing. You can manage cookie preferences through your browser.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">4. Sharing with Third Parties</h2><p>We may share information with trusted partners such as carriers, customs brokers, and payment processors, as well as regulators when required by law. We do not sell personal information.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">5. Data Security</h2><p>We implement technical and organisational measures including encryption, access controls, and regular security assessments.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">6. Your Rights</h2><p>Depending on your jurisdiction, you may have the right to access, correct, delete, or restrict processing of your personal information.</p>
            <h2 className="text-2xl font-bold text-[#1a2744] mt-8 mb-4">7. Contact</h2><p>For questions, contact support@premierlogisticsltds.com.</p>
          </div>
        </div>
      </section>
      <footer className="bg-[#1a2744] text-white/60 py-12 text-center text-sm"><p>&copy; {new Date().getFullYear()} Premier Logistics Ltd.</p></footer>
    </div>
  );
}

import {
  ArrowRight,
  Check,
  Globe2,
  Headphones,
  MapPin,
  Menu,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useCreatePublicQuote } from "@workspace/api-client-react";

const PHONE = "+1 202 753 0933";
const PHONE_HREF = "tel:+12027530933";

const services = [
  {
    icon: Truck,
    title: "Express delivery",
    text: "Time-critical transport with clear milestones from pickup to handoff.",
  },
  {
    icon: Globe2,
    title: "Global freight",
    text: "Coordinated air, road, and ocean freight for growing supply chains.",
  },
  {
    icon: Package,
    title: "Business logistics",
    text: "Flexible fulfillment and last-mile operations built around your customers.",
  },
];

const steps = [
  ["01", "Book", "Share your shipment details and choose the service that fits."],
  ["02", "Move", "Our operations team coordinates every handoff in real time."],
  ["03", "Deliver", "Get proactive updates through a reliable final delivery."],
];

const stats = [
  ["98.7%", "On-time delivery"],
  ["65+", "Countries covered"],
  ["24/7", "Shipment visibility"],
  ["12k+", "Businesses served"],
];

export default function Home() {
  const { mutateAsync: createPublicQuote, isPending: submitting } = useCreatePublicQuote();
  const [submittedQuote, setSubmittedQuote] = useState<string | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    origin: "",
    destination: "",
    serviceType: "standard",
    weight: "",
    notes: "",
  });

  function updateQuoteField(field: keyof typeof quoteForm, value: string) {
    setQuoteForm((c) => ({ ...c, [field]: value }));
  }

  async function handleQuoteSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setQuoteError("");
    setSubmittedQuote(null);
    try {
      const quote = await createPublicQuote({
        data: {
          contactName: quoteForm.contactName,
          contactEmail: quoteForm.contactEmail,
          contactPhone: quoteForm.contactPhone || undefined,
          origin: quoteForm.origin,
          destination: quoteForm.destination,
          serviceType: quoteForm.serviceType,
          weight: quoteForm.weight ? Number(quoteForm.weight) : undefined,
          notes: quoteForm.notes || undefined,
        },
      });
      setSubmittedQuote(quote.quoteNumber);
      setQuoteForm({ contactName: "", contactEmail: "", contactPhone: "", origin: "", destination: "", serviceType: "standard", weight: "", notes: "" });
    } catch {
      setQuoteError("We couldn't submit your request. Please check your details and try again.");
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a2e]" style={{ fontFamily: "'Open Sans', sans-serif" }}>

      {/* ── Utility Bar ── */}
      <div className="bg-[#1a2744] text-white text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-10">
          <div className="hidden items-center gap-5 sm:flex">
            <Link href="/track" className="opacity-70 hover:opacity-100 transition-opacity">Track &amp; Trace</Link>
            <span className="opacity-30">|</span>
            <Link href="/contact" className="opacity-70 hover:opacity-100 transition-opacity">Support</Link>
            <span className="opacity-30">|</span>
            <Link href="/faqs" className="opacity-70 hover:opacity-100 transition-opacity">Help &amp; FAQs</Link>
            <span className="opacity-30">|</span>
            <Link href="/pricing" className="opacity-70 hover:opacity-100 transition-opacity">Pricing</Link>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <a href={PHONE_HREF} className="flex items-center gap-1.5 font-semibold hover:text-[#ff6208] transition-colors">
              <Phone className="h-3 w-3" />
              {PHONE}
            </a>
            <span className="opacity-30 hidden sm:inline">|</span>
            <Link href="/login" className="hidden sm:inline opacity-70 hover:opacity-100 transition-opacity">Staff Login</Link>
          </div>
        </div>
      </div>

      {/* ── Main Navigation ── */}
      <header className="sticky top-0 z-40 bg-white shadow-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded bg-[#ff6208] text-white">
              <Truck className="h-5 w-5" />
            </span>
            <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="leading-none">
              <span className="block text-sm font-black tracking-[0.18em] text-[#1a2744]">PREMIER</span>
              <span className="block text-sm font-black tracking-[0.18em] text-[#1a2744]">LOGISTICS</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <Link href="/about" className="text-[#1a2744] hover:text-[#ff6208] transition-colors">About</Link>
            <Link href="/services" className="text-[#1a2744] hover:text-[#ff6208] transition-colors">Services</Link>
            <Link href="/track" className="text-[#1a2744] hover:text-[#ff6208] transition-colors">Track</Link>
            <Link href="/pricing" className="text-[#1a2744] hover:text-[#ff6208] transition-colors">Pricing</Link>
            <Link href="/contact" className="text-[#1a2744] hover:text-[#ff6208] transition-colors">Contact</Link>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="#quote"
              className="rounded bg-[#ff6208] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#e55500]"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Request a Quote
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded text-[#1a2744]"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 text-sm font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#1a2744] hover:text-[#ff6208]">About</Link>
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#1a2744] hover:text-[#ff6208]">Services</Link>
            <Link href="/track" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#1a2744] hover:text-[#ff6208]">Track</Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#1a2744] hover:text-[#ff6208]">Pricing</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#1a2744] hover:text-[#ff6208]">Contact</Link>
            <Link href="/faqs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#1a2744] hover:text-[#ff6208]">FAQs</Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#1a2744] hover:text-[#ff6208]">Staff Login</Link>
            <a href="#quote" onClick={() => setMobileMenuOpen(false)} className="block mt-2 rounded bg-[#ff6208] px-4 py-2.5 text-center text-white">Request a Quote</a>
            <a href={PHONE_HREF} className="flex items-center gap-2 py-2 text-[#ff6208]">
              <Phone className="h-4 w-4" /> {PHONE}
            </a>
          </div>
        )}
      </header>

      <main>

        {/* ── Hero ── */}
        <section className="relative flex min-h-[88vh] items-center overflow-hidden">
          {/* Photo background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80')" }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#1a2744]/75" />

          <div className="relative mx-auto w-full max-w-7xl px-6 py-28 lg:px-10">
            <div className="max-w-2xl">
              <p
                className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#ff6208]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <span className="h-px w-8 bg-[#ff6208]" />
                Logistics without blind spots
              </p>
              <h1
                className="text-5xl font-black leading-tight text-white sm:text-6xl xl:text-7xl"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Move what matters.
                <span className="block text-[#ff6208]">Know where it is.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">
                Premier Logistics Management Platform gives ambitious businesses one dependable view of every shipment, route, and delivery.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#quote"
                  className="inline-flex items-center gap-2 rounded bg-[#ff6208] px-7 py-4 font-bold text-white transition hover:bg-[#e55500]"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Request a Quote <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/track"
                  className="inline-flex items-center gap-2 rounded border-2 border-white px-7 py-4 font-bold text-white transition hover:bg-white hover:text-[#1a2744]"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Track a Shipment
                </Link>
              </div>

              {/* Phone in hero */}
              <a href={PHONE_HREF} className="mt-8 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-[#ff6208]" />
                Call us: <span className="font-semibold text-white">{PHONE}</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="bg-[#ff6208]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/20 px-6 sm:grid-cols-4 lg:px-10">
            {stats.map(([value, label]) => (
              <div key={label} className="px-6 py-7 text-white">
                <p className="text-3xl font-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>{value}</p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wide text-white/80">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Services ── */}
        <section id="services" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff6208]" style={{ fontFamily: "'Montserrat', sans-serif" }}>What We Do</p>
              <h2 className="mt-4 text-4xl font-black text-[#1a2744] sm:text-5xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                One logistics partner. Every direction.
              </h2>
              <p className="mt-5 text-lg leading-8 text-gray-500">
                From the first mile to the final doorstep, our network is designed to make complex movement feel simple.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {services.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="group rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#ff6208]/40 hover:shadow-xl"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#1a2744] text-[#ff6208] transition group-hover:bg-[#ff6208] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-[#1a2744]" style={{ fontFamily: "'Montserrat', sans-serif" }}>{title}</h3>
                  <p className="mt-3 leading-7 text-gray-500">{text}</p>
                  <a href="#quote" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#ff6208]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Get a Quote <ArrowRight className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="process" className="bg-[#1a2744] py-24 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff6208]" style={{ fontFamily: "'Montserrat', sans-serif" }}>The Premier Standard</p>
                <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Shipping that keeps you in control.
                </h2>
                <p className="mt-5 leading-8 text-white/60">
                  Clear communication, accountable teams, and technology that turns every handoff into a moment of confidence.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-[#ff6208]" />
                    Secure, validated, and built for scale
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <Headphones className="h-5 w-5 shrink-0 text-[#ff6208]" />
                    Human support when it matters
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <Phone className="h-5 w-5 shrink-0 text-[#ff6208]" />
                    <a href={PHONE_HREF} className="hover:text-white transition-colors">{PHONE}</a>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                {steps.map(([number, title, text]) => (
                  <div key={number} className="border-t-2 border-[#ff6208] pt-6">
                    <p className="text-2xl font-black text-[#ff6208]" style={{ fontFamily: "'Montserrat', sans-serif" }}>{number}</p>
                    <h3 className="mt-8 text-xl font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Quote Form ── */}
        <section id="quote" className="bg-gray-50 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:items-start">
              {/* Left info */}
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff6208]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Ready When You Are</p>
                <h2 className="mt-4 text-4xl font-black text-[#1a2744] sm:text-5xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Let's move your next shipment forward.
                </h2>
                <p className="mt-5 text-lg leading-8 text-gray-500">
                  Tell us where it needs to go. Our team will help you find the right route and service.
                </p>
                <div className="mt-8 space-y-4 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff6208] text-white shrink-0">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-[#1a2744]">Call Us Directly</p>
                      <a href={PHONE_HREF} className="text-[#ff6208] font-bold hover:underline">{PHONE}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff6208] text-white shrink-0">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-[#1a2744]">Global Coverage</p>
                      <p>65+ countries, 24/7 visibility</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="rounded-xl bg-white p-8 shadow-lg border border-gray-100">
                {submittedQuote ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                      <Check className="h-8 w-8" />
                    </span>
                    <h3 className="text-xl font-bold text-[#1a2744]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Quote Request Received!</h3>
                    <p className="mt-2 text-gray-500">Reference <span className="font-bold text-[#1a2744]">{submittedQuote}</span>. Our team will follow up shortly.</p>
                    <p className="mt-1 text-sm text-gray-400">Or call us at <a href={PHONE_HREF} className="text-[#ff6208] font-semibold">{PHONE}</a></p>
                    <button
                      type="button"
                      onClick={() => setSubmittedQuote(null)}
                      className="mt-6 rounded bg-[#ff6208] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e55500] transition"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleQuoteSubmit}>
                    <h3 className="text-xl font-bold text-[#1a2744] mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>Get a Free Quote</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        { field: "contactName", label: "Your Name", placeholder: "Alex Morgan", required: true },
                        { field: "contactEmail", label: "Email Address", placeholder: "alex@company.com", type: "email", required: true },
                        { field: "contactPhone", label: "Phone Number", placeholder: "+44 20 1234 5678", type: "tel" },
                        { field: "origin", label: "Pickup Location", placeholder: "London, UK", required: true },
                        { field: "destination", label: "Delivery Location", placeholder: "New York, US", required: true },
                      ].map(({ field, label, placeholder, type, required }) => (
                        <label key={field} htmlFor={`quote-${field}`} className="block text-sm font-semibold text-[#1a2744]">
                          {label}{required && <span className="text-[#ff6208] ml-0.5">*</span>}
                          <input
                            id={`quote-${field}`}
                            name={field}
                            type={type ?? "text"}
                            required={required}
                            value={quoteForm[field as keyof typeof quoteForm]}
                            onChange={(e) => updateQuoteField(field as keyof typeof quoteForm, e.target.value)}
                            placeholder={placeholder}
                            className="mt-1.5 w-full rounded border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-normal outline-none transition focus:border-[#ff6208] focus:ring-2 focus:ring-[#ff6208]/20"
                          />
                        </label>
                      ))}
                      <label htmlFor="quote-serviceType" className="block text-sm font-semibold text-[#1a2744]">
                        Service Type
                        <select
                          id="quote-serviceType"
                          name="serviceType"
                          value={quoteForm.serviceType}
                          onChange={(e) => updateQuoteField("serviceType", e.target.value)}
                          className="mt-1.5 w-full rounded border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#ff6208] focus:ring-2 focus:ring-[#ff6208]/20"
                        >
                          <option value="standard">Standard</option>
                          <option value="express">Express</option>
                          <option value="overnight">Overnight</option>
                          <option value="freight">Freight</option>
                        </select>
                      </label>
                      <label htmlFor="quote-weight" className="block text-sm font-semibold text-[#1a2744]">
                        Weight (kg)
                        <input
                          id="quote-weight"
                          name="weight"
                          type="number"
                          min="0"
                          step="0.1"
                          value={quoteForm.weight}
                          onChange={(e) => updateQuoteField("weight", e.target.value)}
                          placeholder="Optional"
                          className="mt-1.5 w-full rounded border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#ff6208] focus:ring-2 focus:ring-[#ff6208]/20"
                        />
                      </label>
                    </div>
                    <label htmlFor="quote-notes" className="mt-4 block text-sm font-semibold text-[#1a2744]">
                      Shipment Details
                      <textarea
                        id="quote-notes"
                        name="notes"
                        rows={3}
                        value={quoteForm.notes}
                        onChange={(e) => updateQuoteField("notes", e.target.value)}
                        placeholder="Tell us anything important about the shipment."
                        className="mt-1.5 w-full resize-none rounded border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#ff6208] focus:ring-2 focus:ring-[#ff6208]/20"
                      />
                    </label>
                    {quoteError && <p className="mt-3 text-sm font-medium text-red-600">{quoteError}</p>}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded bg-[#ff6208] py-3.5 font-bold text-white transition hover:bg-[#e55500] disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {submitting ? "Submitting…" : "Request a Quote"}
                      {!submitting && <ArrowRight className="h-4 w-4" />}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer id="contact" className="bg-[#1a2744] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded bg-[#ff6208]">
                  <Truck className="h-5 w-5 text-white" />
                </span>
                <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-black tracking-wider text-white">PREMIER LOGISTICS</span>
              </div>
              <p className="text-sm leading-7 text-white/55">Premier Logistics Management Platform — dependable shipping, real-time visibility, and global delivery operations.</p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold uppercase tracking-wider text-white text-xs mb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>Services</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="/services" className="hover:text-white transition-colors">Express Delivery</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Global Freight</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Business Logistics</Link></li>
                <li><Link href="/track" className="hover:text-white transition-colors">Track Shipment</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold uppercase tracking-wider text-white text-xs mb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>Company</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Staff Login</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold uppercase tracking-wider text-white text-xs mb-5" style={{ fontFamily: "'Montserrat', sans-serif" }}>Contact</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li>
                  <a href={PHONE_HREF} className="flex items-center gap-2 hover:text-white transition-colors font-semibold text-[#ff6208]">
                    <Phone className="h-4 w-4" />
                    {PHONE}
                  </a>
                </li>
                <li>
                  <a href="#quote" className="flex items-center gap-2 hover:text-white transition-colors">
                    <ArrowRight className="h-4 w-4 text-[#ff6208]" />
                    Request a Quote
                  </a>
                </li>
                <li>
                  <span className="flex items-center gap-2">
                    <Headphones className="h-4 w-4 text-[#ff6208]" />
                    24/7 Support Available
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-white/40">
            <span>© 2026 Premier Logistics. All rights reserved.</span>
            <div className="flex gap-5">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

import {
  ArrowRight,
  Check,
  Globe2,
  Headphones,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Link } from "wouter";

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

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111113]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f7f5]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#ff6208] text-white">
              <Truck className="h-5 w-5" />
            </span>
            <span className="leading-none">
              <span className="block text-sm font-bold tracking-[0.18em]">PREMIER</span>
              <span className="block text-sm font-bold tracking-[0.18em]">LOGISTICS</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            <a href="#services" className="transition-colors hover:text-[#ff6208]">Services</a>
            <a href="#process" className="transition-colors hover:text-[#ff6208]">How it works</a>
            <Link href="/track" className="transition-colors hover:text-[#ff6208]">Track shipment</Link>
            <a href="#contact" className="transition-colors hover:text-[#ff6208]">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-semibold sm:block">Staff login</Link>
            <a href="#quote" className="rounded-md bg-[#111113] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff6208]">
              Request a quote
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#111113] text-white">
          <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[#ff6208]/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#ff6208]/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-10 lg:py-28">
            <div>
              <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8a48]">
                <span className="h-px w-8 bg-[#ff6208]" />
                Logistics without blind spots
              </p>
              <h1 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-7xl">
                Move what matters.
                <span className="block text-[#ff6208]">Know where it is.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-white/65">
                Premier Logistics Management Platform gives ambitious businesses one dependable view of every shipment, route, and delivery.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a href="#quote" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ff6208] px-6 py-3.5 font-semibold text-white transition hover:bg-[#ff7a2d]">
                  Start a shipment <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/track" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:border-white/50">
                  Track a package
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl">
              <div className="rounded-xl bg-[#f7f7f5] p-5 text-[#111113]">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">Live shipment view</p>
                    <p className="mt-1 font-mono text-lg font-bold">PL-20260724-000184</p>
                  </div>
                  <span className="rounded-full bg-[#ff6208]/10 px-3 py-1 text-xs font-bold text-[#d94f00]">IN TRANSIT</span>
                </div>
                <div className="relative space-y-7 pl-8">
                  <div className="absolute bottom-4 left-[11px] top-3 w-px bg-[#ff6208]/30" />
                  {[
                    ["London, UK", "Picked up", true],
                    ["Rotterdam, NL", "Sorting facility", true],
                    ["New York, US", "Destination hub", false],
                  ].map(([place, status, complete]) => (
                    <div key={place as string} className="relative flex items-start gap-4">
                      <span className={`absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-4 border-[#f7f7f5] ${complete ? "bg-[#ff6208]" : "bg-black/15"}`}>
                        {complete && <Check className="h-3 w-3 text-white" />}
                      </span>
                      <div>
                        <p className="text-sm font-bold">{place}</p>
                        <p className="mt-0.5 text-xs text-black/50">{status}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-4 text-xs">
                  <span className="text-black/50">Estimated delivery</span>
                  <span className="font-bold">28 July 2026</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-black/10 px-6 py-8 sm:grid-cols-4 lg:px-10">
            {[
              ["98.7%", "on-time delivery"],
              ["65+", "countries covered"],
              ["24/7", "shipment visibility"],
              ["12k+", "businesses served"],
            ].map(([value, label]) => (
              <div key={label} className="px-4 first:pl-0 last:pr-0 sm:px-8">
                <p className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-black/45">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff6208]">What we do</p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">One logistics partner. Every direction.</h2>
            <p className="mt-5 text-lg leading-8 text-black/55">From the first mile to the final doorstep, our network is designed to make complex movement feel simple.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {services.map(({ icon: Icon, title, text }) => (
              <article key={title} className="group rounded-xl border border-black/10 bg-white p-7 transition hover:-translate-y-1 hover:border-[#ff6208]/40 hover:shadow-xl">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#111113] text-[#ff6208] transition group-hover:bg-[#ff6208] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-8 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-black/55">{text}</p>
                <a href="#quote" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#ff6208]">Learn more <ArrowRight className="h-4 w-4" /></a>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="bg-[#111113] py-24 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff8a48]">The Premier standard</p>
                <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Shipping that keeps you in control.</h2>
                <p className="mt-5 leading-8 text-white/55">Clear communication, accountable teams, and technology that turns every handoff into a moment of confidence.</p>
                <div className="mt-8 flex items-center gap-3 text-sm text-white/70"><ShieldCheck className="h-5 w-5 text-[#ff6208]" /> Secure, validated, and built for scale</div>
                <div className="mt-4 flex items-center gap-3 text-sm text-white/70"><Headphones className="h-5 w-5 text-[#ff6208]" /> Human support when it matters</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {steps.map(([number, title, text]) => (
                  <div key={number} className="border-t border-white/20 pt-5">
                    <p className="font-mono text-sm text-[#ff6208]">{number}</p>
                    <h3 className="mt-10 text-xl font-bold">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/50">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="quote" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid overflow-hidden rounded-2xl bg-[#ff6208] text-white lg:grid-cols-[1fr_auto]">
            <div className="p-8 sm:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Ready when you are</p>
              <h2 className="mt-4 max-w-xl text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Let’s move your next shipment forward.</h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-white/75">Tell us where it needs to go. Our team will help you find the right route and service.</p>
              <a href="mailto:hello@premierlogistics.example" className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#111113] px-6 py-3.5 font-semibold transition hover:bg-white hover:text-[#111113]">Request a quote <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="hidden min-w-[260px] items-end justify-end p-12 lg:flex">
              <MapPin className="h-44 w-44 text-white/20" strokeWidth={1} />
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-black/50 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>
            <p className="font-bold tracking-[0.16em] text-[#111113]">PREMIER LOGISTICS</p>
            <p className="mt-1">Premier Logistics Management Platform</p>
          </div>
          <div className="flex gap-5">
            <Link href="/track" className="hover:text-[#ff6208]">Track shipment</Link>
            <Link href="/login" className="hover:text-[#ff6208]">Staff login</Link>
            <span>© 2026 Premier Logistics</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
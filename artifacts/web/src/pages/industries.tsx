import { Link } from "wouter";
import {
  ShoppingCart, HeartPulse, Factory, Building2, Plane, Leaf,
  Cpu, BookOpen, Hammer, Car, ArrowRight
} from "lucide-react";

const industries = [
  { icon: ShoppingCart, name: "Retail & E-Commerce", desc: "Fast, reliable last-mile delivery for online stores and retail chains. Real-time tracking keeps customers informed at every step." },
  { icon: HeartPulse, name: "Healthcare & Pharma", desc: "Temperature-controlled, chain-of-custody compliant logistics for medical supplies, devices, and pharmaceuticals." },
  { icon: Factory, name: "Manufacturing", desc: "Just-in-time delivery of raw materials and finished goods, integrated with your production schedules." },
  { icon: Building2, name: "Construction", desc: "Heavy freight and oversized load handling for building materials, machinery, and equipment nationwide." },
  { icon: Plane, name: "Aerospace & Defence", desc: "Certified handling of high-value, sensitive components with full documentation and customs compliance." },
  { icon: Leaf, name: "Food & Agriculture", desc: "Cold chain logistics from farm to shelf — keeping perishables fresh with temperature-monitored vehicles." },
  { icon: Cpu, name: "Technology & Electronics", desc: "Insured, ESD-safe handling for electronics, servers, and sensitive components with white-glove service options." },
  { icon: BookOpen, name: "Publishing & Media", desc: "Timely distribution of printed materials, promotional goods, and media packages across the country." },
  { icon: Hammer, name: "Industrial & Energy", desc: "Specialised transport for industrial equipment, generators, and energy-sector components including hazmat." },
  { icon: Car, name: "Automotive", desc: "Dealer-to-dealer transfers and parts distribution with secured loading and damage-free delivery guarantees." },
];

export default function Industries() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[#1a2744] text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Industries We Serve
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Tailored logistics solutions for businesses across every sector — from healthcare to heavy industry.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map(({ icon: Icon, name, desc }) => (
            <div key={name} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-muted/40 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see your industry?</h2>
          <p className="text-muted-foreground mb-8">We work with businesses of all types. Reach out to discuss a custom logistics solution for your sector.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Contact Us <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/quotes" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

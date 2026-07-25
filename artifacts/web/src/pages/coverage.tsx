import { Link } from "wouter";
import { MapPin, Globe, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

const regions = [
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    cities: ["London", "Manchester", "Birmingham", "Glasgow", "Leeds", "Bristol", "Liverpool", "Edinburgh"],
    sla: "Next-day standard, same-day express",
  },
  {
    name: "United States",
    flag: "🇺🇸",
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"],
    sla: "2–3 day standard, overnight express",
  },
  {
    name: "European Union",
    flag: "🇪🇺",
    cities: ["Paris", "Berlin", "Amsterdam", "Madrid", "Rome", "Brussels", "Vienna", "Warsaw"],
    sla: "3–5 day standard, 2-day express",
  },
  {
    name: "Asia Pacific",
    flag: "🌏",
    cities: ["Singapore", "Hong Kong", "Tokyo", "Sydney", "Dubai", "Mumbai", "Kuala Lumpur", "Bangkok"],
    sla: "5–7 day standard, 3-day express",
  },
  {
    name: "Canada",
    flag: "🇨🇦",
    cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg", "Halifax"],
    sla: "2–4 day standard, overnight express",
  },
  {
    name: "Africa",
    flag: "🌍",
    cities: ["Lagos", "Nairobi", "Johannesburg", "Cairo", "Accra", "Dar es Salaam", "Kigali", "Abidjan"],
    sla: "7–14 day standard, 5-day express",
  },
];

const stats = [
  { value: "150+", label: "Countries Served" },
  { value: "10,000+", label: "Delivery Points" },
  { value: "99.2%", label: "On-Time Rate" },
  { value: "24/7", label: "Support Coverage" },
];

export default function Coverage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[#1a2744] text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Coverage Areas
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Premier Logistics delivers to over 150 countries, with deep local networks in key markets worldwide.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-b border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-black text-primary">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Regions */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Key Regions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map(({ name, flag, cities, sla }) => (
              <div key={name} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{flag}</span>
                  <div>
                    <h3 className="font-bold text-lg">{name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />{sla}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cities.map(city => (
                    <span key={city} className="inline-flex items-center gap-1 text-xs bg-muted rounded-full px-2.5 py-1">
                      <MapPin className="h-2.5 w-2.5 text-primary" />{city}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 px-6 bg-muted/40 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">What's Included in Every Delivery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Real-time GPS tracking on every shipment",
              "Proof of delivery with recipient signature",
              "Customs clearance documentation support",
              "Insurance options up to full declared value",
              "24/7 customer support via phone and email",
              "Automatic status notifications by email",
              "Dedicated account manager for business clients",
              "Flexible pickup scheduling — same-day available",
            ].map(item => (
              <div key={item} className="flex items-start gap-3 bg-card border border-border rounded-lg p-4 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ship Anywhere in the World</h2>
          <p className="text-muted-foreground mb-8">Get an instant quote for your shipment — we'll handle the rest.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/track" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Track a Shipment <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

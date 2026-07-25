import { MapPin, Clock, Briefcase, ArrowRight, Heart, TrendingUp, Shield, Coffee } from "lucide-react";
import { Link } from "wouter";

const openRoles = [
  { title: "Senior Operations Manager", location: "London, UK", type: "Full-time", dept: "Operations", salary: "£55,000 – £70,000" },
  { title: "Logistics Coordinator", location: "Manchester, UK", type: "Full-time", dept: "Operations", salary: "£28,000 – £35,000" },
  { title: "Driver — Last Mile Delivery", location: "Birmingham, UK", type: "Full-time", dept: "Delivery", salary: "£26,000 – £32,000" },
  { title: "Customer Support Specialist", location: "Remote (UK)", type: "Full-time", dept: "Customer Success", salary: "£24,000 – £30,000" },
  { title: "Software Engineer (Full-Stack)", location: "Remote (UK / EU)", type: "Full-time", dept: "Technology", salary: "£65,000 – £90,000" },
  { title: "Warehouse Supervisor", location: "Leeds, UK", type: "Full-time", dept: "Warehouse", salary: "£30,000 – £38,000" },
  { title: "Business Development Manager", location: "London, UK", type: "Full-time", dept: "Sales", salary: "£45,000 + commission" },
  { title: "Data Analyst — Supply Chain", location: "Hybrid (London)", type: "Full-time", dept: "Analytics", salary: "£40,000 – £55,000" },
];

const benefits = [
  { icon: Heart, title: "Health & Wellbeing", desc: "Private health insurance, dental, and mental health support from day one." },
  { icon: TrendingUp, title: "Career Growth", desc: "Structured development plans, training budget, and internal promotion first policy." },
  { icon: Shield, title: "Job Security", desc: "Competitive salary, pension (5% employer match), and long-term stability in a growing company." },
  { icon: Coffee, title: "Work–Life Balance", desc: "Flexible working hours, remote options where applicable, and generous annual leave." },
];

const deptColors: Record<string, string> = {
  Operations: "bg-blue-100 text-blue-700",
  Delivery: "bg-yellow-100 text-yellow-700",
  "Customer Success": "bg-green-100 text-green-700",
  Technology: "bg-primary/10 text-primary",
  Warehouse: "bg-orange-100 text-orange-700",
  Sales: "bg-purple-100 text-purple-700",
  Analytics: "bg-teal-100 text-teal-700",
};

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[#1a2744] text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Join the Team
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Build your career at one of the UK's fastest-growing logistics companies. We're hiring across operations, technology, and customer success.
          </p>
          <div className="flex justify-center gap-8 mt-10">
            {[["8", "Open Roles"], ["200+", "Team Members"], ["12", "Offices Globally"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-black text-[#ff6208]">{val}</p>
                <p className="text-sm text-blue-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Why Work at Premier Logistics?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-5 shadow-sm text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
          <div className="space-y-4">
            {openRoles.map(({ title, location, type, dept, salary }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold">{title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${deptColors[dept] ?? "bg-gray-100 text-gray-700"}`}>{dept}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{type}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{salary}</span>
                  </div>
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0">
                  Apply Now <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-muted/40 border border-border rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Don't see the right role?</h3>
            <p className="text-muted-foreground text-sm mb-4">Send us your CV and we'll keep you in mind for future openings.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-border px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-card transition-colors">
              Send Speculative Application <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

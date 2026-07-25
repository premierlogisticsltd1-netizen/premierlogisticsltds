import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    title: "Operations Director",
    company: "TechFlow Solutions",
    avatar: "SM",
    rating: 5,
    text: "Premier Logistics has transformed how we handle our international shipments. The real-time tracking and proactive communication keep our clients informed at every stage. Delivery success rate is exceptional.",
  },
  {
    name: "James Okafor",
    title: "Supply Chain Manager",
    company: "Meridian Manufacturing",
    avatar: "JO",
    rating: 5,
    text: "We moved our entire freight operation to Premier Logistics 18 months ago and haven't looked back. On-time delivery is consistently above 98%, and their dedicated account management is outstanding.",
  },
  {
    name: "Priya Sharma",
    title: "E-Commerce Director",
    company: "StyleCrate UK",
    avatar: "PS",
    rating: 5,
    text: "Our customers love the live tracking updates. Returns are handled seamlessly. Premier Logistics feels like an extension of our own team — they genuinely care about the customer experience.",
  },
  {
    name: "Marcus Webb",
    title: "CEO",
    company: "Greenfields Organics",
    avatar: "MW",
    rating: 5,
    text: "Temperature-controlled logistics for perishables is notoriously difficult. Premier Logistics handles our cold chain with precision. Not a single spoilage incident in two years of partnership.",
  },
  {
    name: "Lisa Chen",
    title: "Procurement Lead",
    company: "Apex Electronics",
    avatar: "LC",
    rating: 5,
    text: "Fast, reliable, and always professional. Their ESD-safe handling for sensitive electronics gives us complete peace of mind. The online portal makes managing multiple shipments effortless.",
  },
  {
    name: "David Adekunle",
    title: "Logistics Manager",
    company: "BuildRight Construction",
    avatar: "DA",
    rating: 4,
    text: "Handling oversized building materials is no easy feat. Premier Logistics consistently delivers on time and their driver team are professional and communicative. Highly recommended for construction logistics.",
  },
  {
    name: "Emma Fitzgerald",
    title: "Head of Operations",
    company: "MedEquip Direct",
    avatar: "EF",
    rating: 5,
    text: "Healthcare logistics demands absolute reliability. Premier Logistics meets chain-of-custody requirements without fail. Their documentation is always complete and their response time is unmatched.",
  },
  {
    name: "Raj Patel",
    title: "Business Owner",
    company: "Patel Imports Ltd",
    avatar: "RP",
    rating: 5,
    text: "As a small business owner, I need a courier I can trust completely. Premier Logistics has never let me down. Competitive pricing, excellent communication, and my packages always arrive in perfect condition.",
  },
  {
    name: "Charlotte Nduka",
    title: "Marketing Manager",
    company: "Vivid Publishing",
    avatar: "CN",
    rating: 5,
    text: "We ship thousands of books and promotional materials monthly. Premier Logistics handles volume without sacrificing care or speed. The bulk shipping rates are very competitive for our industry.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[#1a2744] text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            What Our Clients Say
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Trusted by hundreds of businesses across the UK and worldwide. Here's what our clients think.
          </p>
          <div className="flex justify-center gap-8 mt-10">
            {[["4.9/5", "Average Rating"], ["500+", "Happy Clients"], ["99.2%", "On-Time Delivery"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-black text-[#ff6208]">{val}</p>
                <p className="text-sm text-blue-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map(({ name, title, company, avatar, rating, text }) => (
            <div key={name} className="break-inside-avoid bg-card border border-border rounded-xl p-6 shadow-sm mb-6 inline-block w-full">
              <Quote className="h-8 w-8 text-primary/20 mb-3" />
              <p className="text-sm leading-relaxed text-foreground/80 mb-4">{text}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{name}</p>
                  <p className="text-xs text-muted-foreground truncate">{title}, {company}</p>
                </div>
                <StarRating rating={rating} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#ff6208] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join hundreds of satisfied clients</h2>
          <p className="text-orange-100 mb-8">Get a quote today and experience the Premier Logistics difference.</p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-white text-[#ff6208] px-8 py-3 rounded-lg font-bold hover:bg-orange-50 transition-colors">
            Get Started Today
          </a>
        </div>
      </section>
    </div>
  );
}

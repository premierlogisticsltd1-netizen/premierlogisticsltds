import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "cold-chain-best-practices",
    title: "Cold Chain Logistics: Best Practices for 2026",
    excerpt: "Maintaining temperature integrity from warehouse to doorstep is non-negotiable in healthcare and food logistics. We share the processes that keep our cold chain success rate at 99.9%.",
    category: "Industry Insight",
    author: "Operations Team",
    date: "2026-07-10",
    readTime: "6 min read",
    image: "❄️",
  },
  {
    slug: "track-shipment-tips",
    title: "5 Ways to Get the Most from Real-Time Tracking",
    excerpt: "Our tracking platform gives you live visibility on every shipment. Here's how leading operations teams use it to proactively manage exceptions before they become problems.",
    category: "Tips & Guides",
    author: "Customer Success",
    date: "2026-06-28",
    readTime: "4 min read",
    image: "📍",
  },
  {
    slug: "ecommerce-fulfilment-guide",
    title: "The E-Commerce Fulfilment Guide: Scaling Without Sacrificing Speed",
    excerpt: "As order volumes grow, maintaining delivery speed and accuracy becomes the biggest challenge for online retailers. Here's how to structure your logistics for scale.",
    category: "E-Commerce",
    author: "Partnership Team",
    date: "2026-06-14",
    readTime: "8 min read",
    image: "📦",
  },
  {
    slug: "customs-clearance-explainer",
    title: "International Shipping: What You Need to Know About Customs",
    excerpt: "Customs delays are one of the most common causes of late deliveries in international logistics. We break down the documentation requirements for the world's busiest trade corridors.",
    category: "International",
    author: "Compliance Team",
    date: "2026-05-30",
    readTime: "7 min read",
    image: "🛃",
  },
  {
    slug: "last-mile-innovations",
    title: "Last-Mile Delivery Innovations Reshaping the Industry",
    excerpt: "From route optimisation AI to proof-of-delivery technology, the last mile is where logistics wins or loses. We look at the innovations changing the game in 2026.",
    category: "Technology",
    author: "Tech Team",
    date: "2026-05-15",
    readTime: "5 min read",
    image: "🚀",
  },
  {
    slug: "sustainable-logistics",
    title: "Our Commitment to Sustainable Logistics",
    excerpt: "Premier Logistics is working toward a net-zero fleet by 2030. Learn about our electric vehicle rollout, carbon offset partnerships, and green packaging initiatives.",
    category: "Sustainability",
    author: "ESG Team",
    date: "2026-04-22",
    readTime: "5 min read",
    image: "🌱",
  },
];

const categoryColors: Record<string, string> = {
  "Industry Insight": "bg-blue-100 text-blue-700",
  "Tips & Guides": "bg-green-100 text-green-700",
  "E-Commerce": "bg-yellow-100 text-yellow-700",
  "International": "bg-purple-100 text-purple-700",
  "Technology": "bg-primary/10 text-primary",
  "Sustainability": "bg-emerald-100 text-emerald-700",
};

export default function Blog() {
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[#1a2744] text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Logistics Insights
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Industry news, shipping guides, and expert advice from the Premier Logistics team.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Featured post */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-10 flex flex-col md:flex-row">
            <div className="bg-[#1a2744] flex items-center justify-center text-7xl p-12 md:w-72 shrink-0">
              {featured.image}
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[featured.category]}`}>{featured.category}</span>
                <span className="text-xs text-muted-foreground">Featured</span>
              </div>
              <h2 className="text-2xl font-bold mb-3">{featured.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(featured.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featured.readTime}</span>
              </div>
            </div>
          </div>

          {/* Post grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(({ title, excerpt, category, date, readTime, image }) => (
              <article key={title} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="bg-muted flex items-center justify-center text-5xl h-40">
                  {image}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[category]}`}>
                      <Tag className="h-2.5 w-2.5 inline mr-1" />{category}
                    </span>
                  </div>
                  <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-primary transition-colors">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">{excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-16 bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-6">Get our latest logistics insights delivered to your inbox monthly.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" className="flex-1 border border-input rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <button type="submit" className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 justify-center">
                Subscribe <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

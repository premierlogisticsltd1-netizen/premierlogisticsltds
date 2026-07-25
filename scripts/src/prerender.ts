import fs from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.resolve(import.meta.dirname, "../../artifacts/web/dist/public");
const INDEX_HTML = path.join(DIST_DIR, "index.html");

const ROUTES = [
  { path: "/", title: "Premier Logistics Management Platform", description: "Dependable shipping, real-time visibility, and global delivery operations." },
  { path: "/about", title: "About Us | Premier Logistics", description: "Connecting businesses and communities across six continents with dependable logistics services." },
  { path: "/services", title: "Logistics Services | Premier Logistics", description: "Road freight, air freight, ocean freight, parcel delivery, warehousing, and supply chain consulting." },
  { path: "/contact", title: "Contact Us | Premier Logistics", description: "Get in touch with Premier Logistics for quotes, support, and global shipping enquiries." },
  { path: "/pricing", title: "Pricing | Premier Logistics", description: "Transparent pricing plans for businesses of every size." },
  { path: "/faqs", title: "FAQs | Premier Logistics", description: "Quick answers to common questions about shipping, tracking, customs, and billing." },
  { path: "/privacy", title: "Privacy Policy | Premier Logistics", description: "Learn how Premier Logistics collects, uses, and protects your personal information." },
  { path: "/terms", title: "Terms of Service | Premier Logistics", description: "Terms and conditions for using the Premier Logistics platform and services." },
  { path: "/track", title: "Track Shipment | Premier Logistics", description: "Track your Premier Logistics shipment in real time with our public tracking tool." },
  { path: "/login", title: "Staff Login | Premier Logistics", description: "Secure staff login to the Premier Logistics management platform." },
];

async function main() {
  const baseHtml = await fs.readFile(INDEX_HTML, "utf-8");

  for (const route of ROUTES) {
    let html = baseHtml;

    // Replace generic title/meta with route-specific content
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`);
    html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${route.description}"`);
    html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${route.title}"`);
    html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${route.description}"`);
    html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${route.path}"`);
    html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${route.title}"`);
    html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${route.description}"`);

    // Add og:url if missing
    if (!html.includes('property="og:url"')) {
      html = html.replace(
        /<meta property="og:type" content="website" \/>/,
        `<meta property="og:type" content="website" />\n    <meta property="og:url" content="${route.path}" />`,
      );
    }

    // Add a canonical link if not already present
    if (!html.includes('rel="canonical"')) {
      html = html.replace(
        /<\/head>/,
        `    <link rel="canonical" href="${route.path}" />\n  </head>`,
      );
    }

    const outDir = route.path === "/" ? DIST_DIR : path.join(DIST_DIR, route.path.slice(1));
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, "index.html"), html, "utf-8");
  }

  console.log(`Prerendered ${ROUTES.length} routes into ${DIST_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

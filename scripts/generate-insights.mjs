#!/usr/bin/env node
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { insights } from "../content/insights.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const insightsRoot = path.resolve(publicRoot, "insights");

if (!insightsRoot.startsWith(path.resolve(publicRoot) + path.sep)) {
  throw new Error("Refusing to generate insights outside the public directory.");
}

rmSync(insightsRoot, { recursive: true, force: true });
mkdirSync(insightsRoot, { recursive: true });

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const styles = `
  :root{--ink:#101014;--ivory:#f3e8d2;--acid:#c8f000;--cyan:#00bcd8;--coral:#ff6048;--cobalt:#1649ff;--aubergine:#2a1930}
  *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ivory);background:var(--ink);font-family:Inter,Arial,sans-serif}
  a{color:inherit}.topbar{display:flex;align-items:center;justify-content:space-between;gap:28px;min-height:74px;padding:14px 5vw;border-bottom:1px solid rgba(243,232,210,.18);background:#09090b}
  .brand{text-decoration:none;font-weight:950;letter-spacing:.16em}.brand small{display:block;color:var(--cyan);font-size:8px;letter-spacing:.28em;margin-top:4px}
  .topbar nav{display:flex;gap:22px}.topbar nav a{text-decoration:none;font-size:11px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}
  .hero{padding:95px 5vw 78px;background:radial-gradient(circle at 80% 0,rgba(22,73,255,.32),transparent 32%),linear-gradient(135deg,#170f20,#07070a)}
  .eyebrow{color:var(--cyan);font-size:10px;font-weight:900;letter-spacing:.2em;text-transform:uppercase}
  h1,h2{font-family:Impact,"Arial Narrow",sans-serif;text-transform:uppercase;font-weight:500;letter-spacing:.015em;line-height:.92}
  h1{max-width:1050px;margin:22px 0;font-size:clamp(52px,7vw,112px)}h1 em,h2 em{color:var(--coral);font-style:normal}
  .hero>p:last-child{max-width:760px;color:rgba(243,232,210,.7);font-size:clamp(18px,2vw,25px);line-height:1.55}
  .articles{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;padding:70px 5vw 110px;background:var(--acid)}
  .card{display:flex;min-height:430px;flex-direction:column;padding:30px;color:var(--ink);background:var(--acid);border:2px solid var(--ink);text-decoration:none}
  .card time,.category{font-size:10px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.category{margin:40px 0 12px;color:var(--cobalt)}
  .card h2{margin:0 0 18px;font-size:clamp(29px,2.6vw,46px)}.card p{color:rgba(17,17,17,.68);line-height:1.65}.card strong{margin-top:auto;color:var(--aubergine);font-size:11px;letter-spacing:.12em;text-transform:uppercase}
  .article-head{padding:90px max(5vw,calc((100vw - 1120px)/2)) 72px;background:linear-gradient(135deg,#170f20,#091026)}
  .article-head h1{max-width:1100px}.meta{display:flex;gap:18px;color:rgba(243,232,210,.58);font-size:11px;letter-spacing:.1em;text-transform:uppercase}
  .lede{max-width:850px;margin:34px 0 0;color:rgba(243,232,210,.76);font-size:clamp(20px,2.2vw,30px);line-height:1.5}
  .article-body{display:grid;grid-template-columns:240px minmax(0,760px);gap:70px;justify-content:center;padding:80px 5vw 120px;color:var(--ink);background:var(--ivory)}
  .article-body aside{align-self:start;position:sticky;top:30px;padding-top:10px;border-top:3px solid var(--cobalt);font-size:11px;font-weight:850;line-height:1.7;letter-spacing:.1em;text-transform:uppercase}
  .article-body section{padding-bottom:38px;margin-bottom:42px;border-bottom:1px solid rgba(17,17,17,.2)}.article-body h2{font-size:clamp(36px,4vw,62px);color:var(--aubergine)}
  .article-body p{font-size:18px;line-height:1.85;color:rgba(17,17,17,.78)}.cta{padding:60px;background:var(--cobalt);color:white}.cta h2{margin:0 0 24px}.cta a{display:inline-block;padding:16px 22px;color:var(--ink);background:var(--acid);font-size:11px;font-weight:900;letter-spacing:.12em;text-decoration:none;text-transform:uppercase}
  footer{padding:45px 5vw;color:rgba(243,232,210,.52);background:#050505;font-size:11px;line-height:1.7}
  @media(max-width:850px){.articles{grid-template-columns:1fr}.card{min-height:330px}.article-body{grid-template-columns:1fr}.article-body aside{position:static}.topbar nav{display:none}.cta{padding:35px 24px}}
`;

function pageShell({ title, description, canonical, body, schema, type = "website" }) {
  const safeSchema = JSON.stringify(schema).replaceAll("<", "\\u003c");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="alternate" type="application/rss+xml" title="TALVUMI Market Insights" href="https://talvumi.com/feed.xml">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="TALVUMI">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://talvumi.com/assets/hero.png">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${safeSchema}</script>
  <style>${styles}</style>
</head>
<body>
  <header class="topbar"><a class="brand" href="/">TALVUMI<small>PET NUTRITION</small></a><nav><a href="/#range">Products</a><a href="/#partners">Partners</a><a href="/insights/">Insights</a><a href="/#apply">Apply</a></nav></header>
  ${body}
  <footer>© 2026 TALVUMI. Market insights are general commercial information, not legal, veterinary or regulatory advice. Product availability and commercial terms require written confirmation.</footer>
</body>
</html>`;
}

for (const article of insights) {
  const articleDir = path.join(insightsRoot, article.slug);
  mkdirSync(articleDir, { recursive: true });
  const canonical = `https://talvumi.com/insights/${article.slug}/`;
  const articleText = article.sections.flatMap((section) => section.paragraphs).join(" ");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonical}#article`,
        headline: article.title,
        description: article.excerpt,
        datePublished: article.date,
        dateModified: article.updated,
        mainEntityOfPage: canonical,
        articleSection: article.category,
        keywords: article.keywords.join(", "),
        author: { "@id": "https://talvumi.com/#organization" },
        publisher: { "@id": "https://talvumi.com/#organization" },
        image: "https://talvumi.com/assets/hero.png",
        articleBody: articleText
      },
      {
        "@type": "Organization",
        "@id": "https://talvumi.com/#organization",
        name: "TALVUMI",
        url: "https://talvumi.com/"
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://talvumi.com/" },
          { "@type": "ListItem", position: 2, name: "Market Insights", item: "https://talvumi.com/insights/" },
          { "@type": "ListItem", position: 3, name: article.title, item: canonical }
        ]
      }
    ]
  };
  const body = `
    <main>
      <header class="article-head">
        <p class="eyebrow">${escapeHtml(article.category)}</p>
        <h1>${escapeHtml(article.title)}</h1>
        <div class="meta"><time datetime="${article.date}">Published ${article.date}</time><span>Updated ${article.updated}</span><span>TALVUMI Market Desk</span></div>
        <p class="lede">${escapeHtml(article.excerpt)}</p>
      </header>
      <article class="article-body">
        <aside>For importers, distributors and pet retail operators evaluating a market launch.</aside>
        <div>${article.sections.map((section) => `<section><h2>${escapeHtml(section.heading)}</h2>${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</section>`).join("")}
          <div class="cta"><h2>Build TALVUMI in your market.</h2><a href="/#apply">Apply to become a distributor →</a></div>
        </div>
      </article>
    </main>`;
  writeFileSync(
    path.join(articleDir, "index.html"),
    pageShell({ title: `${article.title} | TALVUMI`, description: article.excerpt, canonical, body, schema, type: "article" }),
    "utf8"
  );
}

const indexCanonical = "https://talvumi.com/insights/";
const indexSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "TALVUMI Pet Food Market Insights",
  description: "Commercial guidance for pet food importers, distributors and retail partners.",
  url: indexCanonical,
  publisher: { "@id": "https://talvumi.com/#organization" },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: insights.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://talvumi.com/insights/${article.slug}/`,
      name: article.title
    }))
  }
};
const indexBody = `
  <main>
    <header class="hero"><p class="eyebrow">TALVUMI MARKET DESK · UPDATED DAILY</p><h1>Pet food distribution<br><em>insights that travel.</em></h1><p>Evidence-led guidance for importers, distributors, retail chains and ecommerce operators building pet food categories across markets.</p></header>
    <section class="articles">${insights.map((article) => `<a class="card" href="/insights/${article.slug}/"><time datetime="${article.date}">${article.date}</time><p class="category">${escapeHtml(article.category)}</p><h2>${escapeHtml(article.title)}</h2><p>${escapeHtml(article.excerpt)}</p><strong>Read analysis →</strong></a>`).join("")}</section>
  </main>`;
writeFileSync(
  path.join(insightsRoot, "index.html"),
  pageShell({
    title: "Pet Food Distributor & Market Insights | TALVUMI",
    description: "Daily commercial insights for pet food importers, distributors, retail chains and ecommerce partners.",
    canonical: indexCanonical,
    body: indexBody,
    schema: indexSchema
  }),
  "utf8"
);

const sitemapUrls = [
  { loc: "https://talvumi.com/", lastmod: insights[0]?.updated || "2026-07-30", priority: "1.0" },
  { loc: indexCanonical, lastmod: insights[0]?.updated || "2026-07-30", priority: "0.9" },
  ...insights.map((article) => ({ loc: `https://talvumi.com/insights/${article.slug}/`, lastmod: article.updated, priority: "0.8" }))
];
writeFileSync(path.join(publicRoot, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((item) => `  <url><loc>${item.loc}</loc><lastmod>${item.lastmod}</lastmod><changefreq>weekly</changefreq><priority>${item.priority}</priority></url>`).join("\n")}
</urlset>
`, "utf8");

writeFileSync(path.join(publicRoot, "feed.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>TALVUMI Pet Food Market Insights</title>
  <link>https://talvumi.com/insights/</link>
  <description>Commercial guidance for pet food importers, distributors and retail partners.</description>
  <language>en</language>
  ${insights.map((article) => `<item><title>${escapeHtml(article.title)}</title><link>https://talvumi.com/insights/${article.slug}/</link><guid>https://talvumi.com/insights/${article.slug}/</guid><pubDate>${new Date(`${article.date}T00:00:00Z`).toUTCString()}</pubDate><description>${escapeHtml(article.excerpt)}</description></item>`).join("")}
</channel></rss>
`, "utf8");

writeFileSync(path.join(publicRoot, "llms-full.txt"), `# TALVUMI Market Insights

Official article index: https://talvumi.com/insights/

${insights.map((article) => `## ${article.title}

- URL: https://talvumi.com/insights/${article.slug}/
- Published: ${article.date}
- Updated: ${article.updated}
- Category: ${article.category}
- Summary: ${article.excerpt}

${article.sections.map((section) => `### ${section.heading}\n\n${section.paragraphs.join("\n\n")}`).join("\n\n")}`).join("\n\n")}
`, "utf8");

console.log(`Generated ${insights.length} TALVUMI insight articles, index, RSS, sitemap and AI corpus.`);

#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { catalog } from "../content/catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const hero = "https://talvumi.com/assets/brand/talvumi-cat-dog-pet-food-brand-hero.webp";
const generatedOn = new Date().toISOString().slice(0, 10);

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const styles = `
:root{--ink:#101014;--ivory:#f3e8d2;--acid:#c8f000;--cyan:#00bcd8;--coral:#ff6048;--cobalt:#1649ff;--aubergine:#24152b;--line:rgba(243,232,210,.18)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ivory);background:var(--ink);font-family:Inter,Arial,sans-serif}a{color:inherit}
.topbar{display:flex;align-items:center;justify-content:space-between;gap:28px;min-height:74px;padding:14px 5vw;border-bottom:1px solid var(--line);background:#09090b}.brand{text-decoration:none;font-weight:950;letter-spacing:.16em}.brand small{display:block;color:var(--cyan);font-size:8px;letter-spacing:.28em;margin-top:4px}.topbar nav{display:flex;gap:22px}.topbar nav a{text-decoration:none;font-size:10px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}
.hero{display:grid;grid-template-columns:1.05fr .95fr;min-height:560px;background:radial-gradient(circle at 80% 0,rgba(22,73,255,.32),transparent 32%),linear-gradient(135deg,#170f20,#07070a)}.hero-copy{padding:90px 5vw}.hero-image{min-height:430px;background-size:cover;background-position:center}.eyebrow{color:var(--cyan);font-size:10px;font-weight:900;letter-spacing:.2em;text-transform:uppercase}
h1,h2,h3{font-family:Impact,"Arial Narrow",sans-serif;text-transform:uppercase;font-weight:500;letter-spacing:.015em;line-height:.94}h1{max-width:860px;margin:22px 0;font-size:clamp(52px,7vw,106px)}h1 em,h2 em{color:var(--coral);font-style:normal}.lede{max-width:760px;color:rgba(243,232,210,.72);font-size:18px;line-height:1.7}
.section{padding:80px 5vw}.ivory{color:var(--ink);background:var(--ivory)}.acid{color:var(--ink);background:var(--acid)}.blue{background:var(--cobalt)}.section h2{max-width:900px;font-size:clamp(42px,5vw,78px)}.section-intro{max-width:800px;font-size:18px;line-height:1.75}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:42px;border:2px solid currentColor}.card{padding:28px;border-right:1px solid currentColor}.card:last-child{border-right:0}.card h3{font-size:28px}.card p,.card li{line-height:1.65}.card small{display:block;color:var(--cobalt);font-size:9px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
.matrix{width:100%;margin-top:34px;border-collapse:collapse}.matrix th,.matrix td{padding:16px;text-align:left;border:1px solid rgba(17,17,17,.28);vertical-align:top}.matrix th{background:var(--cobalt);color:white;font-size:10px;letter-spacing:.1em;text-transform:uppercase}.status{color:var(--cobalt);font-weight:900}
.button{display:inline-block;margin-top:28px;padding:16px 22px;color:var(--ink);background:var(--acid);font-size:10px;font-weight:900;letter-spacing:.12em;text-decoration:none;text-transform:uppercase}.notice{margin-top:30px;padding:22px;border-left:4px solid var(--coral);background:rgba(255,96,72,.09);line-height:1.7}
.prose{max-width:900px}.prose h2{margin-top:56px;font-size:38px}.prose h3{margin-top:34px;font-size:25px}.prose p,.prose li{color:rgba(17,17,17,.75);font-size:16px;line-height:1.85}.prose a{color:var(--cobalt)}
footer{padding:45px 5vw;color:rgba(243,232,210,.52);background:#050505;font-size:11px;line-height:1.7}footer a{margin-right:18px}
@media(max-width:850px){.topbar nav{display:none}.hero{grid-template-columns:1fr}.hero-image{min-height:340px}.grid{grid-template-columns:1fr}.card{border-right:0;border-bottom:1px solid currentColor}.card:last-child{border-bottom:0}.matrix{font-size:12px}.section{padding:64px 22px}.hero-copy{padding:70px 22px}}
`;

function shell({ title, description, canonical, body, schema }) {
  const json = JSON.stringify(schema).replaceAll("<", "\\u003c");
  return `<!doctype html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${canonical}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta property="og:type" content="website"><meta property="og:site_name" content="TALVUMI"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${hero}"><meta property="og:image:width" content="1600"><meta property="og:image:height" content="1067"><meta property="og:image:alt" content="TALVUMI cat and dog pet nutrition brand visual"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${hero}">
<script type="application/ld+json">${json}</script><style>${styles}</style></head><body>
<header class="topbar"><a class="brand" href="/">TALVUMI<small>PET NUTRITION</small></a><nav><a href="/#range">Products</a><a href="/distributors/">Distributors</a><a href="/insights/">Insights</a><a href="/about/">About</a><a href="/#preorder">Build RFQ</a></nav></header>
${body}<footer><p><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/editorial-policy/">Editorial policy</a></p><p>© 2026 TALVUMI. Product availability, formulation, packaging and claims require written market-specific confirmation.</p></footer>
</body></html>`;
}

function writeRoute(route, html) {
  const dir = path.join(publicRoot, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), html, "utf8");
}

for (const product of catalog) {
  const slug = product.id === "cat-ocean-fish" ? "adult-cat-ocean-fish" : product.id === "dog-beef" ? "adult-dog-beef" : "kitten-ocean-fish";
  const canonical = `https://talvumi.com/products/${slug}/`;
  const description = `${product.lifeStage} ${product.species.toLowerCase()} ${product.name.toLowerCase()} commercial launch candidate in ${product.variants.map((v) => v.displaySize).join(" and ")} planning formats.`;
  const rows = [
    ["Legal product name", "Pending factory and market confirmation", "Required before final label"],
    ["Ingredients and additives", "Pending controlled manufacturer document", "Not published until reviewed"],
    ["Guaranteed analysis", "Pending product-specific evidence", "No values inferred from concept material"],
    ["Shelf life and storage", "Pending stability basis and final pack", "Must match commercial packaging"],
    ["GTIN / case pack / MOQ", "Pending commercial confirmation", "Confirmed in the written quote"],
    ["Market label and claims", "Reviewed market by market", "Importer and regulatory responsibility agreed in writing"],
  ];
  const body = `<main><section class="hero"><div class="hero-copy"><p class="eyebrow">${escapeHtml(product.type)} · COMMERCIAL CANDIDATE</p><h1>${escapeHtml(product.name)}<br><em>${escapeHtml(product.descriptor)}</em></h1><p class="lede">${escapeHtml(description)} TALVUMI publishes only the product facts approved for the destination market.</p><a class="button" href="/#preorder">Add to RFQ shortlist</a></div><div class="hero-image" style="background-image:linear-gradient(90deg,rgba(16,16,20,.15),rgba(22,73,255,.2)),url('${product.image}')"></div></section>
  <section class="section ivory"><p class="eyebrow">PLANNING VARIANTS</p><h2>Stable identifiers.<br><em>Commercial facts pending.</em></h2><div class="grid">${product.variants.map((variant) => `<article class="card"><small>Planning SKU</small><h3>${escapeHtml(variant.planningSku)}</h3><p><strong>${escapeHtml(variant.displaySize)}</strong></p><p>Price: market quote pending<br>Barcode: factory confirmation<br>Case pack: transit testing and channel confirmation</p></article>`).join("")}</div>
  <table class="matrix"><thead><tr><th>Decision field</th><th>Current status</th><th>Release rule</th></tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell, index) => `<td${index === 1 ? ' class="status"' : ""}>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table><p class="notice">This page is a buyer due-diligence page, not a final retail label or a guarantee of supply. Samples, registration and commercial terms start only after qualification.</p></section></main>`;
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", name: `${product.name} | TALVUMI`, description, url: canonical, isPartOf: { "@id": "https://talvumi.com/#website" }, about: { "@type": "Thing", name: `${product.lifeStage} ${product.species} food commercial candidate` } },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://talvumi.com/" },
      { "@type": "ListItem", position: 2, name: "Products", item: "https://talvumi.com/#range" },
      { "@type": "ListItem", position: 3, name: product.name, item: canonical },
    ] },
  ] };
  writeRoute(`products/${slug}`, shell({ title: `${product.name} ${product.lifeStage} ${product.species} | TALVUMI`, description, canonical, body, schema }));
}

const pages = [
  {
    route: "distributors",
    title: "Pet Food Distributor Partnerships | TALVUMI",
    description: "How qualified importers, distributors, retail chains and ecommerce operators evaluate a TALVUMI market launch.",
    eyebrow: "WHOLESALE FIRST",
    heading: "A distributor process<br><em>built around proof.</em>",
    lede: "TALVUMI qualifies the market, the partner, the product documentation and the supply route before commercial terms are agreed.",
    sections: [
      ["01 Apply", "Share your company, territory, active channels, import status and intended launch window."],
      ["02 Qualify", "We review legal readiness, channel reach, opening-order assumptions and brand-building capability."],
      ["03 Evaluate", "Qualified partners discuss candidate SKUs, samples, market documents and the route to registration."],
      ["04 Quote", "MOQ, lead time, trade basis, payment terms and price are confirmed in a dated written quotation."],
      ["05 Launch", "Supply starts only after specifications, registration responsibility, packaging and commercial terms are approved."],
    ],
    notice: "Territory exclusivity is never automatic. Any rights, targets, registration duties and renewal conditions require a signed agreement.",
  },
  {
    route: "about",
    title: "About TALVUMI Pet Nutrition",
    description: "TALVUMI is an export-facing pet nutrition brand building a focused cat and dog food range for international distribution partners.",
    eyebrow: "ABOUT TALVUMI",
    heading: "Distinctive at shelf.<br><em>Disciplined underneath.</em>",
    lede: "The brand is being built wholesale-first: one focused product architecture, a visible food story and market-specific evidence controls.",
    sections: [
      ["Brand role", "TALVUMI is the export-facing brand; it does not imply an automatic private-label or territory arrangement."],
      ["Product boundary", "Commercial candidates remain subject to manufacturer documentation, final packaging, market registration and written supply confirmation."],
      ["Partner promise", "Qualified partners receive clear status, a structured RFQ process and launch materials matched to the approved market."],
    ],
    notice: "The legal operating entity, public business contact and market-specific responsible party will be published before commercial intake or sales are activated.",
  },
  {
    route: "editorial-policy",
    title: "Editorial & Evidence Policy | TALVUMI",
    description: "How TALVUMI separates general market analysis from product claims, legal advice and unverified commercial information.",
    eyebrow: "EDITORIAL POLICY",
    heading: "Useful content.<br><em>Visible boundaries.</em>",
    lede: "TALVUMI Market Desk publishes practical distributor and launch guidance only after its commercial boundaries are reviewed.",
    sections: [
      ["Source discipline", "Current market, scientific or regulatory claims should link to identifiable primary or reputable sources and record the access date."],
      ["Product claims", "No formula, nutrition, certification, therapeutic, sustainability, price, inventory or availability claim is published without relevant evidence and approval."],
      ["Updates", "Articles show publication and update dates. Material corrections should be disclosed in the article update note."],
      ["Automation", "Automation may prepare drafts and run checks; high-risk legal, regulatory, product and health claims require human approval before publication."],
    ],
    notice: "Articles are general commercial information, not veterinary, nutritional, legal, customs or regulatory advice.",
  },
];

for (const page of pages) {
  const canonical = `https://talvumi.com/${page.route}/`;
  const body = `<main><section class="hero"><div class="hero-copy"><p class="eyebrow">${page.eyebrow}</p><h1>${page.heading}</h1><p class="lede">${page.lede}</p><a class="button" href="/#preorder">Start a qualified request</a></div><div class="hero-image" style="background-image:linear-gradient(90deg,rgba(16,16,20,.2),rgba(22,73,255,.25)),url('${hero}')"></div></section><section class="section ivory"><div class="grid">${page.sections.map(([title, text]) => `<article class="card"><h3>${title}</h3><p>${text}</p></article>`).join("")}</div><p class="notice">${page.notice}</p></section></main>`;
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: page.title, description: page.description, url: canonical, dateModified: generatedOn, publisher: { "@id": "https://talvumi.com/#organization" } };
  writeRoute(page.route, shell({ title: page.title, description: page.description, canonical, body, schema }));
}

const legalPages = [
  {
    route: "privacy",
    title: "Privacy Notice | TALVUMI",
    description: "Pre-launch privacy notice for TALVUMI distributor, quote and retail-interest forms.",
    heading: "Privacy notice",
    content: `
      <p><strong>Last updated:</strong> ${generatedOn}</p>
      <p>This is a pre-launch privacy notice. TALVUMI will not activate commercial lead storage until the responsible legal entity and a working privacy contact are published.</p>
      <h2>Information requested</h2><p>Distributor and quote forms may request business contact information, company and market details, channel capability, import status, product interest, expected order range and launch notes. Retail early-access forms request an email address, country and product interest.</p>
      <h2>Purpose</h2><p>The information is requested to assess a potential commercial relationship, respond to an RFQ, plan samples or notify a person about relevant retail availability. It is not used to create a paid order or reserve inventory.</p>
      <h2>Storage and processors</h2><p>When intake is activated, the form will send approved fields to the CRM or lead processor configured by the brand operator. If that service is not connected, the website returns an error and does not claim that the information was stored.</p>
      <h2>Retention and rights</h2><p>Retention periods, deletion requests, access, correction, objection and cross-border transfer details will be published with the legal entity and privacy contact before lead capture is activated. Do not submit sensitive personal information, identity documents or payment data through these forms.</p>
      <h2>Cookies</h2><p>The current shortlist may use browser storage on the visitor's device to remember selected planning SKUs. It is not a purchase basket and does not create an account.</p>`,
  },
  {
    route: "terms",
    title: "Website & Pre-launch Terms | TALVUMI",
    description: "Terms governing TALVUMI website content, planning SKUs, distributor enquiries and retail early access.",
    heading: "Website and pre-launch terms",
    content: `
      <p><strong>Last updated:</strong> ${generatedOn}</p>
      <h2>No offer or order</h2><p>Website content, planning SKUs, product shortlists, sample requests and RFQs are invitations to discuss a possible transaction. They are not an offer, order acceptance, inventory reservation, price commitment or delivery promise.</p>
      <h2>Product status</h2><p>Formulas, ingredients, nutrition, claims, pack sizes, packaging, barcodes, case packs, MOQ, shelf life, certifications, availability and market registrations require written confirmation for the destination market.</p>
      <h2>Commercial terms</h2><p>Prices, trade basis, payment, lead time, quality documents, samples, registration responsibility, territory, exclusivity and remedies are valid only in a dated written quotation or signed agreement issued by an authorised party.</p>
      <h2>Content use</h2><p>TALVUMI names, visual assets and packaging concepts may not be used as final market artwork or sales claims without written approval.</p>
      <h2>Advice boundary</h2><p>Market insights and packaging briefs are general information and do not replace veterinary, nutritional, legal, customs, testing or regulatory advice.</p>`,
  },
];

for (const page of legalPages) {
  const canonical = `https://talvumi.com/${page.route}/`;
  const body = `<main><section class="section ivory"><article class="prose"><p class="eyebrow">TALVUMI PRE-LAUNCH</p><h1>${page.heading}</h1>${page.content}<p class="notice">A market-ready legal notice with the responsible entity and contact details must replace this pre-launch notice before commercial intake, payment or fulfilment is activated.</p></article></section></main>`;
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: page.title, description: page.description, url: canonical, dateModified: generatedOn };
  writeRoute(page.route, shell({ title: page.title, description: page.description, canonical, body, schema }));
}

console.log("Generated TALVUMI product, distributor, company, editorial and legal pages.");

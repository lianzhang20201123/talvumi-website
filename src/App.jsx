import { useMemo, useState } from "react";
import { insights } from "../content/insights.mjs";

const products = [
  { id: "cat-ocean-fish", type: "CAT · ADULT", name: "Ocean Fish Recipe", descriptor: "with freeze-dried pieces", sizes: "1.5 kg · 10 kg", status: "Commercial specification pending", tone: "aubergine" },
  { id: "dog-beef", type: "DOG · ADULT", name: "Beef Recipe", descriptor: "with freeze-dried pieces", sizes: "1.5 kg · 10 kg", status: "Commercial specification pending", tone: "cobalt" },
  { id: "kitten-ocean-fish", type: "CAT · KITTEN", name: "Ocean Fish Recipe", descriptor: "growth-stage product", sizes: "1.5 kg · 8 kg", status: "Nutrition basis under verification", tone: "cyan" },
];

const partnerTypes = ["Importer", "National distributor", "Regional distributor", "Retail chain", "Specialist pet retailer", "Ecommerce operator", "Veterinary / specialty channel"];

const faqs = [
  ["Who can become a TALVUMI distribution partner?", "We welcome applications from qualified importers, national and regional pet food distributors, retail chains, specialist pet retailers and ecommerce operators."],
  ["Which pet food products are planned for launch?", "The initial commercial candidates include adult cat ocean fish recipe, adult dog beef recipe and kitten ocean fish recipe. Final formulas, pack sizes, claims and availability depend on manufacturer documentation and market registration."],
  ["Does TALVUMI offer private label pet food?", "TALVUMI is the export-facing brand. Separate OEM or private-label opportunities are assessed case by case and are not implied by a distributor appointment."],
  ["Are exclusive territories available?", "Territory rights are never automatic. Any exclusivity, targets, registration responsibilities and commercial terms require a written agreement after capability review."],
  ["What information should a distributor application include?", "Tell us your country, import status, active retail accounts, sales channels, priority cities and intended launch window. This lets both sides judge commercial fit before discussing samples or terms."],
];

function Monogram({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-label="TALVUMI monogram">
      <path d="M104 36A49 49 0 1 0 103 86" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="square" />
      <path d="M29 43h48M51 43v35M51 56l23 37 22-39" fill="none" stroke="currentColor" strokeWidth="9" strokeLinejoin="miter" />
      <path d="M102 78h13" fill="none" stroke="var(--cyan)" strokeWidth="9" />
    </svg>
  );
}

function PackConcept({ product, compact = false }) {
  return (
    <div className={`pack-concept ${product.tone} ${compact ? "compact" : ""}`} aria-label={`${product.name} packaging system concept`}>
      <span className="concept-label">DESIGN SYSTEM · NOT FINAL LABEL</span>
      <Monogram />
      <div className="pack-wordmark">TALVUMI</div>
      <div className="pack-species">{product.type}</div>
      <strong>{product.name}</strong>
      <small>{product.descriptor}</small>
      <i />
    </div>
  );
}

function ApplicationForm() {
  const [state, setState] = useState({ status: "idle", message: "" });

  async function submit(event) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    setState({ status: "sending", message: "Validating application…" });
    try {
      const response = await fetch("/api/partner-applications", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }
      if (!response.ok) throw new Error(result.message || "The partner intake is not connected yet.");
      event.currentTarget.reset();
      setState({ status: "success", message: `Application received. Reference: ${result.reference}` });
    } catch (error) {
      setState({ status: "pending", message: `${error.message} Your details were not stored. Commercial intake will open after the brand owner connects its CRM.` });
    }
  }

  return (
    <form className="partner-form" onSubmit={submit}>
      <div className="form-grid">
        <label>Company name<input name="company" autoComplete="organization" required /></label>
        <label>Country / territory<input name="country" autoComplete="country-name" required /></label>
        <label>Work email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Partner type<select name="partnerType" required defaultValue=""><option value="" disabled>Select one</option>{partnerTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Active retail accounts<select name="retailAccounts" required defaultValue=""><option value="" disabled>Select a range</option><option>1–25</option><option>26–100</option><option>101–300</option><option>301+</option></select></label>
        <label>Import licence status<select name="importLicence" required defaultValue=""><option value="" disabled>Select one</option><option>Active</option><option>In progress</option><option>Working with a licensed importer</option><option>Not yet available</option></select></label>
      </div>
      <label>Route to market and launch plan<textarea name="launchPlan" rows="4" placeholder="Tell us about your channels, cities and intended launch window." required /></label>
      <label className="consent"><input name="consent" type="checkbox" required /><span>I confirm that this information is accurate and may be used to assess a potential commercial relationship.</span></label>
      <button className="button button-primary" disabled={state.status === "sending"}>{state.status === "sending" ? "Submitting…" : "Apply to partner"}</button>
      {state.message && <p className={`form-message ${state.status}`}>{state.message}</p>}
    </form>
  );
}

export function App() {
  const [trace, setTrace] = useState("");
  const [traceMessage, setTraceMessage] = useState("");
  const year = useMemo(() => new Date().getFullYear(), []);

  function checkBatch(event) {
    event.preventDefault();
    setTraceMessage(trace.trim() ? "Batch verification will activate product by product after commercial production begins. No simulated result has been generated." : "Enter the lot code printed on an approved commercial pack.");
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="TALVUMI home"><Monogram /><span>TALVUMI<small>PET NUTRITION</small></span></a>
        <nav aria-label="Primary navigation"><a href="#range">Range</a><a href="#standard">Our standard</a><a href="#trace">Trace</a><a href="#partners">Partners</a></nav>
        <a className="button button-small" href="#apply">Become a distributor</a>
      </header>

      <section id="top" className="hero">
        <div className="hero-noise" />
        <div className="hero-copy">
          <p className="eyebrow">A GLOBAL PET NUTRITION CHALLENGER</p>
          <h1>Verified nutrition.<br /><em>Built to grow.</em></h1>
          <p className="hero-lede">Premium cat and dog food with clear product architecture, high-impact shelf presence and a partner-first route to market for importers and distributors.</p>
          <div className="hero-actions"><a className="button button-primary" href="#apply">Become a distributor</a><a className="text-link" href="#range">Explore the launch range <span>→</span></a></div>
          <div className="hero-proof"><span>01<br /><b>Clear by design</b></span><span>02<br /><b>Claims reviewed</b></span><span>03<br /><b>Partners first</b></span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-packs"><PackConcept product={products[0]} compact /><PackConcept product={products[1]} compact /></div>
          <p>Packaging system preview. Formula, legal copy and final print artwork require written approval.</p>
        </div>
      </section>

      <section className="marquee" aria-label="Brand principles"><div>VERIFIED <i>●</i> CLEAR <i>●</i> DISTINCTIVE <i>●</i> PARTNER-BUILT <i>●</i> VERIFIED <i>●</i> CLEAR</div></section>

      <section id="standard" className="standard section">
        <div className="section-heading"><p className="eyebrow">OUR STANDARD</p><h2>No mystery<br />in the bowl.</h2></div>
        <div className="standard-content"><p className="lead">Pet nutrition should be easier to understand and easier to trust. TALVUMI is building a focused range with disciplined product information and market-ready support.</p>
          <div className="principles"><article><strong>Verified</strong><p>Published claims are reviewed against the product and manufacturing documentation available for that market.</p></article><article><strong>Clear</strong><p>Products are organised by species, life stage, format and primary ingredient—without unnecessary complexity.</p></article><article><strong>Vital</strong><p>Distinctive packaging makes the range easier to find, explain and build at shelf.</p></article></div>
        </div>
      </section>

      <section id="range" className="range section">
        <div className="section-heading range-title"><p className="eyebrow">COMMERCIAL LAUNCH CANDIDATES</p><h2>One brand.<br /><em>A clearer range.</em></h2><p>Formats and specifications remain subject to final manufacturer documentation, market registration and written commercial confirmation.</p></div>
        <div className="product-grid">{products.map((product, index) => (
          <article className={`product-card ${product.tone}`} key={product.id}><div className="product-index">0{index + 1}</div><PackConcept product={product} />
            <div className="product-copy"><p>{product.type}</p><h3>{product.name}</h3><span>{product.descriptor}</span><dl><div><dt>Pack plan</dt><dd>{product.sizes}</dd></div><div><dt>Status</dt><dd>{product.status}</dd></div></dl><a href="#apply">Trade enquiry <span>→</span></a></div>
          </article>
        ))}</div>
      </section>

      <section id="trace" className="trace section">
        <div className="trace-mark"><Monogram /></div>
        <div className="trace-copy"><p className="eyebrow">TRACE THIS BATCH</p><h2>Every claim should<br />lead back to evidence.</h2><p>The TALVUMI batch-information experience will connect an approved commercial product with the documentation available for its production run.</p>
          <form onSubmit={checkBatch} className="trace-form"><input value={trace} onChange={(event) => setTrace(event.target.value)} placeholder="Enter batch / lot code" aria-label="Batch or lot code" /><button className="button button-cyan">Verify batch</button></form>{traceMessage && <p className="trace-message">{traceMessage}</p>}
        </div>
      </section>

      <section id="partners" className="partners section">
        <div className="partner-visual"><div className="partner-signal"><Monogram /><strong>CLAIMS → EVIDENCE<br />PRODUCT → MARKET<br />PARTNER → GROWTH</strong></div></div>
        <div className="partner-copy"><p className="eyebrow">DISTRIBUTOR PARTNERS WANTED</p><h2>Built for partners<br />who build markets.</h2><p>We are looking for importers, distributors and specialist retailers prepared to create lasting demand—not simply list another product.</p>
          <ul><li>Market-specific product information</li><li>Launch-ready brand assets</li><li>Product and sales training</li><li>Territory planning based on capability and agreed targets</li><li>Ongoing sell-through collaboration</li></ul><a className="button button-primary" href="#apply">Start your application</a>
        </div>
      </section>

      <section className="process section"><p className="eyebrow">HOW PARTNERSHIP STARTS</p><div className="process-grid">{[["01","Apply","Tell us about your company, territory and channels."],["02","Review","We assess channel capability and regulatory readiness."],["03","Evaluate","Qualified partners discuss products, samples and market fit."],["04","Plan","Both sides agree a practical market and launch plan."],["05","Launch","Commercial terms, registration and supply are confirmed in writing."]].map(([number,title,copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

      <section id="insights" className="insights section">
        <div className="insights-heading"><p className="eyebrow">MARKET INSIGHTS · UPDATED DAILY</p><h2>Useful signals.<br /><em>Commercial intent.</em></h2><p>Practical guidance for pet food importers, distributors and retail partners. New analysis is published as market evidence is verified.</p><a className="text-link" href="/insights/">View all insights <span>→</span></a></div>
        <div className="insight-grid">{insights.slice(0, 3).map((article, index) => <article className="insight-card" key={article.slug}><div><span>0{index + 1}</span><time dateTime={article.date}>{article.date}</time></div><p>{article.category}</p><h3><a href={`/insights/${article.slug}/`}>{article.title}</a></h3><p>{article.excerpt}</p><a href={`/insights/${article.slug}/`}>Read the analysis <span>→</span></a></article>)}</div>
      </section>

      <section id="faq" className="faq section">
        <div className="faq-heading"><p className="eyebrow">DISTRIBUTOR FAQ</p><h2>Facts before<br /><em>the first order.</em></h2><p>Direct answers for pet food importers, distributors and retail partners evaluating TALVUMI.</p></div>
        <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </section>

      <section id="apply" className="apply section">
        <div className="apply-heading"><p className="eyebrow">BUILD TALVUMI IN YOUR MARKET</p><h2>Tell us where<br />you can take it.</h2><p>Every application is reviewed for channel capability, regulatory readiness and long-term brand fit. Submission does not guarantee appointment, exclusivity, commercial terms or sample approval.</p></div>
        <ApplicationForm />
      </section>

      <section className="retail section"><div><p className="eyebrow">RETAIL AVAILABILITY</p><h2>Retail opens market by market.</h2></div><p>Buy Now will appear only where a product is legally registered, locally stocked and supported by approved pricing, payment, delivery, returns and customer service.</p><button className="button button-disabled" disabled>Retail launch pending</button></section>

      <footer><div className="footer-brand"><Monogram /><strong>TALVUMI</strong></div><p>Verified premium nutrition—clear for pet parents, built for partners.</p><div className="footer-links"><a href="#standard">Our standard</a><a href="#range">Products</a><a href="#partners">Partners</a><a href="/insights/">Insights</a><a href="#faq">FAQ</a><a href="#trace">Trace</a></div><small>© {year} TALVUMI. Product availability, formulation, packaging and claims may vary by market. Distributor appointments and commercial terms require written agreement.</small></footer>
    </main>
  );
}

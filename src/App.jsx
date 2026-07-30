import { useEffect, useMemo, useState } from "react";
import { insights } from "../content/insights.mjs";
import { catalog as products, commerceConfig, getVariant } from "../content/catalog.mjs";

const partnerTypes = ["Importer", "National distributor", "Regional distributor", "Retail chain", "Specialist pet retailer", "Ecommerce operator", "Veterinary / specialty channel"];
const launchWindows = ["Within 3 months", "3–6 months", "6–12 months", "Exploring / not fixed"];
const volumeBands = ["Samples / evaluation only", "Under 1 pallet", "1–5 pallets", "6–20 pallets", "20+ pallets", "Not yet estimated"];

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

function ProductShortlist() {
  const [selected, setSelected] = useState(() => Object.fromEntries(products.map((product) => [product.id, product.variants[0].id])));
  const [lines, setLines] = useState([]);
  const [buyerMode, setBuyerMode] = useState("trade");
  const [state, setState] = useState({ status: "idle", message: "" });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("talvumi-product-shortlist-v1") || "[]");
      if (Array.isArray(saved)) setLines(saved.filter((line) => getVariant(line.variantId)).slice(0, 12));
    } catch {
      localStorage.removeItem("talvumi-product-shortlist-v1");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("talvumi-product-shortlist-v1", JSON.stringify(lines));
  }, [lines]);

  function addVariant(variantId) {
    setLines((current) => current.some((line) => line.variantId === variantId) ? current : [...current, { variantId, requestedQty: 1, unit: "bags" }]);
    setState({ status: "idle", message: "" });
    requestAnimationFrame(() => document.querySelector("#shortlist")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }

  function updateLine(variantId, patch) {
    setLines((current) => current.map((line) => line.variantId === variantId ? { ...line, ...patch } : line));
  }

  function removeLine(variantId) {
    setLines((current) => current.filter((line) => line.variantId !== variantId));
  }

  async function submit(event) {
    event.preventDefault();
    if (!lines.length) {
      setState({ status: "pending", message: "Add at least one product specification before continuing." });
      return;
    }
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const isTrade = buyerMode === "trade";
    const payload = isTrade
      ? { ...data, lines, consent: data.consent === "on", privacyVersion: commerceConfig.privacyVersion, source: "homepage-product-shortlist" }
      : { email: data.email, country: data.country, variantIds: lines.map((line) => line.variantId), consent: data.consent === "on", privacyVersion: commerceConfig.privacyVersion, source: "homepage-product-shortlist" };
    setState({ status: "sending", message: isTrade ? "Validating trade request…" : "Validating early-access request…" });
    try {
      const response = await fetch(isTrade ? "/api/quote-requests" : "/api/early-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "The intake service is not connected yet.");
      setState({ status: "success", message: `Request received. Reference: ${result.reference}` });
      setLines([]);
      event.currentTarget.reset();
    } catch (error) {
      setState({ status: "pending", message: `${error.message} Your request has not been stored.` });
    }
  }

  return (
    <section id="preorder" className="commerce section">
      <div className="commerce-heading">
        <p className="eyebrow">PRE-LAUNCH PRODUCT CONFIGURATOR</p>
        <h2>Choose the range.<br /><em>Build the request.</em></h2>
        <div>
          <p>Select product candidates and pack sizes for a distributor quote or retail launch notification. No payment, price or stock commitment is created at this stage.</p>
          <span className="commerce-status">INTEREST MODE · PAYMENT DISABLED</span>
        </div>
      </div>

      <div className="commerce-grid">
        {products.map((product) => {
          const variant = product.variants.find((item) => item.id === selected[product.id]) || product.variants[0];
          const isAdded = lines.some((line) => line.variantId === variant.id);
          return (
            <article className={`commerce-card ${product.tone}`} key={product.id}>
              <div className="commerce-image">
                <img src={product.image} alt="" loading="lazy" decoding="async" style={{ objectPosition: product.imagePosition }} />
                <span>{product.type}</span>
              </div>
              <div className="commerce-card-copy">
                <p>{product.lifeStage} {product.species}</p>
                <h3>{product.name}</h3>
                <small>{product.descriptor}</small>
                <div className="variant-switch" aria-label={`Choose ${product.name} pack size`}>
                  {product.variants.map((item) => <button className={item.id === variant.id ? "active" : ""} type="button" key={item.id} onClick={() => setSelected((current) => ({ ...current, [product.id]: item.id }))}>{item.displaySize}</button>)}
                </div>
                <dl>
                  <div><dt>Planning SKU</dt><dd>{variant.planningSku}</dd></div>
                  <div><dt>Price</dt><dd>Market quote pending</dd></div>
                  <div><dt>Barcode / case pack</dt><dd>Factory confirmation</dd></div>
                </dl>
                <a className="product-data-link" href={product.productPath}>View buyer data page →</a>
                <button className={`button ${isAdded ? "button-disabled" : "button-primary"}`} type="button" disabled={isAdded} onClick={() => addVariant(variant.id)}>{isAdded ? "Added to shortlist" : "Add to product shortlist"}</button>
              </div>
            </article>
          );
        })}
      </div>

      <div id="shortlist" className="shortlist">
        <div className="shortlist-summary">
          <div className="shortlist-title"><p className="eyebrow">YOUR PRODUCT SHORTLIST</p><span>{lines.length} {lines.length === 1 ? "specification" : "specifications"}</span></div>
          {lines.length ? <div className="shortlist-lines">{lines.map((line) => {
            const variant = getVariant(line.variantId);
            return <article key={line.variantId}>
              <div><strong>{variant.productType}</strong><h3>{variant.productName} · {variant.displaySize}</h3><small>{variant.planningSku}</small></div>
              {buyerMode === "trade" && <div className="line-quantity"><input aria-label={`Quantity for ${variant.planningSku}`} type="number" min="1" max="99999" value={line.requestedQty} onChange={(event) => updateLine(line.variantId, { requestedQty: Math.max(1, Number(event.target.value) || 1) })} /><select aria-label={`Unit for ${variant.planningSku}`} value={line.unit} onChange={(event) => updateLine(line.variantId, { unit: event.target.value })}><option value="bags">bags</option><option value="cases">cases</option><option value="pallets">pallets</option></select></div>}
              <button type="button" onClick={() => removeLine(line.variantId)} aria-label={`Remove ${variant.planningSku}`}>Remove</button>
            </article>;
          })}</div> : <div className="shortlist-empty"><strong>No products selected yet.</strong><p>Choose one or more pack specifications above to build a trade request or join retail early access.</p></div>}
          <p className="shortlist-note">Planning SKUs are internal identifiers. GTIN, case pack, MOQ, price, inventory and delivery dates remain pending written confirmation.</p>
        </div>

        <form className="shortlist-form" onSubmit={submit}>
          <div className="buyer-toggle" aria-label="Choose request type"><button className={buyerMode === "trade" ? "active" : ""} type="button" onClick={() => setBuyerMode("trade")}>Wholesale quote</button><button className={buyerMode === "retail" ? "active" : ""} type="button" onClick={() => setBuyerMode("retail")}>Retail early access</button></div>
          {buyerMode === "trade" && <div className="form-grid"><label>Company name<input name="company" autoComplete="organization" required /></label><label>Contact name<input name="contactName" autoComplete="name" required /></label></div>}
          <div className="form-grid">
            <label>{buyerMode === "trade" ? "Work email" : "Email"}<input name="email" type="email" autoComplete="email" required /></label>
            <label>Country / territory<input name="country" autoComplete="country-name" required /></label>
            {buyerMode === "trade" && <><label>Partner type<select name="partnerType" required defaultValue=""><option value="" disabled>Select one</option>{partnerTypes.map((item) => <option key={item}>{item}</option>)}</select></label><label>Import status<select name="importStatus" required defaultValue=""><option value="" disabled>Select one</option><option>Active licence</option><option>In progress</option><option>Licensed importer partner</option><option>Not yet available</option></select></label></>}
          </div>
          {buyerMode === "trade" && <><div className="form-grid"><label>Target launch window<select name="launchWindow" required defaultValue=""><option value="" disabled>Select one</option>{launchWindows.map((item) => <option key={item}>{item}</option>)}</select></label><label>Expected opening order<select name="openingOrderBand" required defaultValue=""><option value="" disabled>Select one</option>{volumeBands.map((item) => <option key={item}>{item}</option>)}</select></label><label>Company website<input name="website" type="url" autoComplete="url" placeholder="https://" /></label><label>Phone / WhatsApp<input name="phone" type="tel" autoComplete="tel" /></label></div><label>Preferred trade basis<select name="incotermPreference" defaultValue=""><option value="">Discuss with TALVUMI</option><option>EXW — named place required</option><option>FOB — named port required</option><option>CIF — named destination port required</option></select></label><label>Launch plan / sample request<textarea name="notes" rows="4" placeholder="Share your target cities, channels, intended launch window and whether samples are required." /></label></>}
          <label className="honeypot" aria-hidden="true">Leave this field empty<input name="companyFax" tabIndex="-1" autoComplete="off" /></label>
          <label className="consent"><input name="consent" type="checkbox" required /><span>I agree that these details may be used to assess launch interest under the <a href="/privacy/">privacy notice</a>. This is not a purchase, reservation of inventory or price commitment.</span></label>
          <button className="button button-primary" disabled={state.status === "sending" || !lines.length}>{state.status === "sending" ? "Submitting…" : buyerMode === "trade" ? "Request trade review" : "Join retail early access"}</button>
          {state.message && <p aria-live="polite" className={`form-message ${state.status}`}>{state.message}</p>}
        </form>
      </div>
    </section>
  );
}

function LaunchReadiness() {
  const gates = [
    ["Product identity", "In factory verification", "Legal names, recipe references, life stage and final product documentation."],
    ["Commercial terms", "Quote by market", "MOQ, tier price, trade basis and lead time are confirmed in writing for each qualified request."],
    ["Packaging", "Engineering validation", "Final dimensions, barrier, seal window, case pack and transit performance require real-product testing."],
    ["Market access", "Partner-led review", "Registration, importer responsibility, label language and local claims approval are assessed market by market."],
  ];

  return (
    <section className="readiness section" aria-labelledby="readiness-title">
      <div className="readiness-heading">
        <div><p className="eyebrow">BUYER DUE-DILIGENCE VIEW</p><h2 id="readiness-title">Know what is ready.<br /><em>Know what comes next.</em></h2></div>
        <p>TALVUMI does not turn planning data into a sales promise. Qualified partners receive a written status review before samples, registration work or a commercial order is agreed.</p>
      </div>
      <div className="readiness-grid">
        {gates.map(([name, status, detail], index) => <article key={name}><span>0{index + 1}</span><div><strong>{name}</strong><small>{status}</small></div><p>{detail}</p></article>)}
      </div>
      <div className="readiness-actions"><a className="button button-primary" href="#preorder">Build an RFQ shortlist</a><a className="text-link" href="/distributors/">Read the distributor process <span>→</span></a></div>
    </section>
  );
}

function PackagingEngineering() {
  const packs = [
    {
      size: "1.5 kg",
      role: "Retail launch pack",
      bag: "Flat-bottom or press-to-close stand-up pouch",
      window: "RFQ window: 240–280 × 350–420 mm; gusset 80–110 mm",
      material: "Start point: PET 12 / VMPET 12 / food-contact mLLDPE 80–100 μm",
      features: "Tamper-evident top seal · easy tear · reclose zipper",
      transit: "Test 4 bags / case and 6 bags / case",
    },
    {
      size: "8 kg",
      role: "Family / channel pack",
      bag: "Flat-bottom or load-rated quad-seal bag",
      window: "RFQ window: 380–450 × 650–760 mm; gusset 120–180 mm",
      material: "Start point: PET 12 / PA 15 / VMPET 12 / mLLDPE 110–140 μm",
      features: "Tamper-evident seal · reinforced side handle · heavy-duty reclose",
      transit: "Start with one bag / corrugated shipper",
    },
    {
      size: "10 kg",
      role: "Large-format trade pack",
      bag: "Heavy-duty quad-seal or flat-bottom bag",
      window: "RFQ window: 420–500 × 700–850 mm; gusset 140–200 mm",
      material: "Start point: PET 12 / PA 15 / VMPET 12 / mLLDPE 130–160 μm",
      features: "Reinforced corners · side handle · load-rated zipper and top seal",
      transit: "One bag / shipper unless channel testing approves bulk palletisation",
    },
  ];

  return (
    <section id="packaging" className="packaging section">
      <div className="packaging-heading">
        <p className="eyebrow">PACKAGING ENGINEERING · RFQ START POINT</p>
        <h2>Designed to sell.<br /><em>Engineered to travel.</em></h2>
        <p>The selected C route combines high-impact colour and oversized type with an angular visible-food window. Window size, film structure, light exposure, barrier loss, seal performance and transit safety must be validated with the real product before artwork lock.</p>
      </div>
      <div className="packaging-visuals" aria-label="TALVUMI front, back and side pack design system concepts">
        {[
          ["Adult cat / ocean fish", "/assets/packaging/talvumi-adult-cat-ocean-fish-pack-concept.png"],
          ["Adult dog / beef", "/assets/packaging/talvumi-adult-dog-beef-pack-concept.png"],
          ["Kitten / ocean fish", "/assets/packaging/talvumi-kitten-ocean-fish-pack-concept.png"],
          ["Back panel information master", "/assets/packaging/talvumi-c-route-back-panel-master.png"],
          ["Left and right side-panel master", "/assets/packaging/talvumi-c-route-side-panels-master.png"],
        ].map(([label, image]) => <figure key={label}>
          <img src={image} width="1400" height="1800" alt={`TALVUMI ${label} packaging design system concept`} loading="lazy" decoding="async" />
          <figcaption><strong>{label}</strong><span>C route · visible-food window · not final label</span></figcaption>
        </figure>)}
      </div>
      <div className="packaging-grid">
        {packs.map((pack, index) => <article key={pack.size}>
          <div><span>0{index + 1}</span><strong>{pack.size}</strong></div>
          <p>{pack.role}</p>
          <h3>{pack.bag}</h3>
          <dl>
            <div><dt>Size brief</dt><dd>{pack.window}</dd></div>
            <div><dt>Laminate brief</dt><dd>{pack.material}</dd></div>
            <div><dt>Functional parts</dt><dd>{pack.features}</dd></div>
            <div><dt>Transit pack</dt><dd>{pack.transit}</dd></div>
          </dl>
        </article>)}
      </div>
      <div className="packaging-gates">
        <strong>Factory lock required</strong>
        <p>Kibble bulk density, largest particle, surface oil, target shelf life, nitrogen use, current film data, filling-line limits, seal settings, coder footprint, drop history and final pallet route.</p>
        <span>NO “RECYCLABLE”, BARRIER OR SHELF-LIFE CLAIM UNTIL TESTED</span>
      </div>
    </section>
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
        <label>Contact name<input name="contactName" autoComplete="name" required /></label>
        <label>Country / territory<input name="country" autoComplete="country-name" required /></label>
        <label>Work email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Partner type<select name="partnerType" required defaultValue=""><option value="" disabled>Select one</option>{partnerTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Active retail accounts<select name="retailAccounts" required defaultValue=""><option value="" disabled>Select a range</option><option>1–25</option><option>26–100</option><option>101–300</option><option>301+</option></select></label>
        <label>Import licence status<select name="importLicence" required defaultValue=""><option value="" disabled>Select one</option><option>Active</option><option>In progress</option><option>Working with a licensed importer</option><option>Not yet available</option></select></label>
        <label>Target launch window<select name="launchWindow" required defaultValue=""><option value="" disabled>Select one</option>{launchWindows.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Expected opening order<select name="openingOrderBand" required defaultValue=""><option value="" disabled>Select one</option>{volumeBands.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Company website<input name="website" type="url" autoComplete="url" placeholder="https://" /></label>
      </div>
      <label>Route to market and launch plan<textarea name="launchPlan" rows="4" placeholder="Tell us about your channels, cities and intended launch window." required /></label>
      <label className="honeypot" aria-hidden="true">Leave this field empty<input name="companyFax" tabIndex="-1" autoComplete="off" /></label>
      <label className="consent"><input name="consent" type="checkbox" required /><span>I confirm that this information is accurate and may be used to assess a potential commercial relationship under the <a href="/privacy/">privacy notice</a>.</span></label>
      <button className="button button-primary" disabled={state.status === "sending"}>{state.status === "sending" ? "Submitting…" : "Apply to partner"}</button>
      {state.message && <p aria-live="polite" className={`form-message ${state.status}`}>{state.message}</p>}
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
        <nav aria-label="Primary navigation"><a href="#range">Range</a><a href="#preorder">Pre-launch</a><a href="#packaging">Packaging</a><a href="#partners">Partners</a><a href="/resources/">Resources</a></nav>
        <a className="button button-small" href="#preorder">Build a product shortlist</a>
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
          <img
            src="/assets/brand/talvumi-cat-dog-pet-food-brand-hero.webp"
            width="1600"
            height="1067"
            alt="Cat and dog beside bowls of dry pet food in the TALVUMI brand studio"
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero-visual-caption">
            <span>CAT + DOG NUTRITION</span>
            <p>Brand campaign visual. Product formula, claims and final artwork remain subject to written approval.</p>
          </div>
        </div>
      </section>

      <section className="marquee" aria-label="Brand principles"><div>VERIFIED <i>●</i> CLEAR <i>●</i> DISTINCTIVE <i>●</i> PARTNER-BUILT <i>●</i> VERIFIED <i>●</i> CLEAR</div></section>

      <section id="standard" className="standard section">
        <div className="section-heading"><p className="eyebrow">OUR STANDARD</p><h2>No mystery<br />in the bowl.</h2></div>
        <div className="standard-content"><p className="lead">Pet nutrition should be easier to understand and easier to trust. TALVUMI is building a focused range with disciplined product information and market-ready support.</p>
          <div className="principles"><article><strong>Verified</strong><p>Published claims are reviewed against the product and manufacturing documentation available for that market.</p></article><article><strong>Clear</strong><p>Products are organised by species, life stage, format and primary ingredient—without unnecessary complexity.</p></article><article><strong>Vital</strong><p>Distinctive packaging makes the range easier to find, explain and build at shelf.</p></article></div>
        </div>
      </section>

      <section className="food-story section">
        <div className="food-story-media">
          <img
            src="/assets/brand/talvumi-dry-pet-food-texture.webp"
            width="1400"
            height="933"
            alt="Two bowls showing dry cat and dog food with freeze-dried pieces"
            loading="lazy"
            decoding="async"
          />
          <span>PRODUCT FORMAT VISUAL · FINAL APPEARANCE MAY VARY</span>
        </div>
        <div className="food-story-copy">
          <p className="eyebrow">THE PRODUCT, CLEARLY SEEN</p>
          <h2>Real food<br /><em>starts with detail.</em></h2>
          <p>Dry nutrition and freeze-dried pieces are made visible, not hidden behind vague lifestyle language. Final appearance, ingredients and claims will be confirmed product by product for each launch market.</p>
          <div className="food-story-points">
            <span><b>01</b> Cat and dog formats</span>
            <span><b>02</b> Life-stage architecture</span>
            <span><b>03</b> Market-reviewed information</span>
          </div>
        </div>
      </section>

      <section id="range" className="range section">
        <div className="section-heading range-title"><p className="eyebrow">COMMERCIAL LAUNCH CANDIDATES</p><h2>One brand.<br /><em>A clearer range.</em></h2><p>Formats and specifications remain subject to final manufacturer documentation, market registration and written commercial confirmation.</p></div>
        <div className="product-grid">{products.map((product, index) => (
          <article className={`product-card ${product.tone}`} key={product.id}><div className="product-index">0{index + 1}</div><PackConcept product={product} />
            <div className="product-copy"><p>{product.type}</p><h3>{product.name}</h3><span>{product.descriptor}</span><dl><div><dt>Pack plan</dt><dd>{product.variants.map((variant) => variant.displaySize).join(" · ")}</dd></div><div><dt>Status</dt><dd>{product.status}</dd></div></dl><a href="#preorder">Build a product shortlist <span>→</span></a></div>
          </article>
        ))}</div>
      </section>

      <ProductShortlist />
      <LaunchReadiness />
      <PackagingEngineering />

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
        <div className="insights-heading"><p className="eyebrow">MARKET INSIGHTS · EVIDENCE-REVIEWED</p><h2>Useful signals.<br /><em>Commercial intent.</em></h2><p>Practical guidance for pet food importers, distributors and retail partners. New analysis is published when its evidence and commercial boundaries have been reviewed.</p><a className="text-link" href="/insights/">View all insights <span>→</span></a></div>
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

      <footer><div className="footer-brand"><Monogram /><strong>TALVUMI</strong></div><p>Verified premium nutrition—clear for pet parents, built for partners.</p><div className="footer-links"><a href="/about/">About</a><a href="/distributors/">Distributors</a><a href="/resources/">Buyer resources</a><a href="/insights/">Insights</a><a href="/editorial-policy/">Editorial policy</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></div><small>© {year} TALVUMI. Product availability, formulation, packaging and claims may vary by market. Distributor appointments and commercial terms require written agreement.</small></footer>
    </main>
  );
}

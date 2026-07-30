import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { renderToString } from "react-dom/server";
const insights = [
  {
    slug: "pet-food-distributor-evaluation-checklist",
    date: "2026-07-30",
    updated: "2026-07-30",
    category: "Distributor Strategy",
    title: "Pet Food Distributor Evaluation Checklist for New Markets",
    excerpt: "A practical framework for comparing import readiness, retail reach, launch capability and long-term brand fit before appointing a pet food distributor.",
    keywords: ["pet food distributor", "pet food importer", "distribution partner", "pet food wholesale"],
    sections: [
      {
        heading: "Start with import readiness, not sales promises",
        paragraphs: [
          "A distributor may have strong relationships and still be unable to launch a pet food product legally or on schedule. The first review should establish who holds the import licence, who owns product registration, which documents are required and how long local approval typically takes.",
          "Ask for evidence of recent imports in the relevant category. The goal is not to collect impressive claims; it is to map each regulatory task to a responsible party, a document and a realistic date."
        ]
      },
      {
        heading: "Measure active distribution, not address-book size",
        paragraphs: [
          "An account list is useful only when it shows active relationships. Compare the number of stores currently ordering, the channel mix, geographic concentration, average reorder cycle and the field team assigned to pet specialists, chains and ecommerce.",
          "A focused regional distributor with dependable sell-through can be more valuable than a national operator that treats a new brand as one more catalogue line."
        ]
      },
      {
        heading: "Require a launch plan with owners and numbers",
        paragraphs: [
          "A credible plan identifies priority cities, target account types, first-order assumptions, sampling activity, staff training and the person responsible for each action. It should separate sell-in targets from consumer sell-through.",
          "Before discussing exclusivity, agree on a short validation period and measurable milestones. Territory rights should follow demonstrated capability, not precede it."
        ]
      },
      {
        heading: "Evaluate brand-building behaviour",
        paragraphs: [
          "The strongest partners protect pricing, report inventory accurately and share market feedback early. Review how the distributor handles education, merchandising, content localisation, returns and slow-moving stock.",
          "TALVUMI assesses prospective partners across regulatory readiness, active distribution, launch execution and long-term brand fit. Final appointments and commercial terms require written agreement."
        ]
      }
    ]
  },
  {
    slug: "private-label-vs-export-brand-pet-food",
    date: "2026-07-29",
    updated: "2026-07-30",
    category: "Brand Strategy",
    title: "Private Label or Export Brand? Choosing a Pet Food Route to Market",
    excerpt: "The commercial trade-offs between building a private-label pet food line and distributing an export-facing brand with shared market support.",
    keywords: ["private label pet food", "OEM pet food", "pet food brand distribution", "pet food route to market"],
    sections: [
      {
        heading: "The two models solve different business problems",
        paragraphs: [
          "Private label gives a buyer more control over naming, positioning and channel ownership. It also places more responsibility on that buyer for packaging decisions, demand creation, inventory and long-term brand investment.",
          "An export brand can provide a consistent identity, product architecture and reusable launch assets across markets. The distributor gives up some control but gains a platform designed to accumulate brand equity beyond a single account."
        ]
      },
      {
        heading: "Compare total launch workload",
        paragraphs: [
          "Unit cost is only one part of the decision. Buyers should compare artwork development, registration, translation, photography, product education, minimum production quantities, inventory risk and the cost of maintaining a content pipeline.",
          "A lower factory price does not automatically create a lower-cost launch if the buyer must build every commercial asset from the beginning."
        ]
      },
      {
        heading: "Choose based on channel advantage",
        paragraphs: [
          "Private label can fit retailers with captive traffic, strong category management and the ability to support their own brand. Distribution can fit importers and specialist operators that want a differentiated proposition with broader market-building support.",
          "TALVUMI is the export-facing brand. Separate OEM or private-label opportunities are assessed case by case and are not implied by a distributor appointment."
        ]
      }
    ]
  },
  {
    slug: "pet-food-launch-documentation-questions",
    date: "2026-07-28",
    updated: "2026-07-30",
    category: "Launch Readiness",
    title: "Pet Food Launch Documentation: Questions to Resolve Before First Order",
    excerpt: "A buyer-oriented list of formula, label, manufacturing and market-registration questions to close before confirming a commercial pet food order.",
    keywords: ["pet food documentation", "pet food import requirements", "pet food label review", "pet food first order"],
    sections: [
      {
        heading: "Separate product facts from marketing language",
        paragraphs: [
          "Every proposed claim should trace back to a formula, test, certificate or manufacturing record that is acceptable in the destination market. Product teams should maintain a simple claim register showing the wording, evidence source, review status and approved markets.",
          "Do not treat attractive packaging copy as final until the local regulatory reviewer and the brand owner have approved it in writing."
        ]
      },
      {
        heading: "Confirm the commercial specification",
        paragraphs: [
          "Before issuing a purchase order, confirm the exact recipe identifier, life stage, pack size, packaging material, shelf-life basis, storage instructions, batch coding and agreed quality documents.",
          "Samples and concept packaging are not substitutes for the signed commercial specification. Changes should be versioned so the importer, factory and brand owner are referring to the same product."
        ]
      },
      {
        heading: "Map ownership of registration and records",
        paragraphs: [
          "Clarify which party submits the registration, pays local fees, responds to regulator questions and controls the resulting approval. The distribution agreement should also cover access to records if the commercial relationship ends.",
          "TALVUMI publishes only claims reviewed against the product and manufacturing documentation available for the relevant market. Availability remains subject to registration and written commercial confirmation."
        ]
      }
    ]
  }
];
const commerceConfig = {
  privacyVersion: "2026-07-30"
};
const catalog = [
  {
    id: "cat-ocean-fish",
    productPath: "/products/adult-cat-ocean-fish/",
    type: "CAT · ADULT",
    species: "Cat",
    lifeStage: "Adult",
    name: "Ocean Fish Recipe",
    descriptor: "with freeze-dried pieces",
    tone: "aubergine",
    status: "Commercial specification pending",
    image: "/assets/brand/talvumi-cat-dog-pet-food-brand-hero.webp",
    imagePosition: "65% center",
    variants: [
      { id: "cat-ocean-fish-1500g", planningSku: "TVM-CA-AOF-1500", netWeightG: 1500, displaySize: "1.5 kg", gtin: null, casePack: null, priceStatus: "request_quote" },
      { id: "cat-ocean-fish-10000g", planningSku: "TVM-CA-AOF-10000", netWeightG: 1e4, displaySize: "10 kg", gtin: null, casePack: null, priceStatus: "request_quote" }
    ]
  },
  {
    id: "dog-beef",
    productPath: "/products/adult-dog-beef/",
    type: "DOG · ADULT",
    species: "Dog",
    lifeStage: "Adult",
    name: "Beef Recipe",
    descriptor: "with freeze-dried pieces",
    tone: "cobalt",
    status: "Commercial specification pending",
    image: "/assets/brand/talvumi-cat-dog-pet-food-brand-hero.webp",
    imagePosition: "89% center",
    variants: [
      { id: "dog-beef-1500g", planningSku: "TVM-DO-BEF-1500", netWeightG: 1500, displaySize: "1.5 kg", gtin: null, casePack: null, priceStatus: "request_quote" },
      { id: "dog-beef-10000g", planningSku: "TVM-DO-BEF-10000", netWeightG: 1e4, displaySize: "10 kg", gtin: null, casePack: null, priceStatus: "request_quote" }
    ]
  },
  {
    id: "kitten-ocean-fish",
    productPath: "/products/kitten-ocean-fish/",
    type: "CAT · KITTEN",
    species: "Cat",
    lifeStage: "Kitten",
    name: "Ocean Fish Recipe",
    descriptor: "growth-stage product",
    tone: "cyan",
    status: "Nutrition basis under verification",
    image: "/assets/brand/talvumi-dry-pet-food-texture.webp",
    imagePosition: "72% center",
    variants: [
      { id: "kitten-ocean-fish-1500g", planningSku: "TVM-KI-AOF-1500", netWeightG: 1500, displaySize: "1.5 kg", gtin: null, casePack: null, priceStatus: "request_quote" },
      { id: "kitten-ocean-fish-8000g", planningSku: "TVM-KI-AOF-8000", netWeightG: 8e3, displaySize: "8 kg", gtin: null, casePack: null, priceStatus: "request_quote" }
    ]
  }
];
const variantIndex = new Map(
  catalog.flatMap(
    (product) => product.variants.map((variant) => [
      variant.id,
      {
        ...variant,
        productId: product.id,
        productName: product.name,
        productType: product.type
      }
    ])
  )
);
function getVariant(variantId) {
  return variantIndex.get(variantId) || null;
}
const partnerTypes = ["Importer", "National distributor", "Regional distributor", "Retail chain", "Specialist pet retailer", "Ecommerce operator", "Veterinary / specialty channel"];
const launchWindows = ["Within 3 months", "3–6 months", "6–12 months", "Exploring / not fixed"];
const volumeBands = ["Samples / evaluation only", "Under 1 pallet", "1–5 pallets", "6–20 pallets", "20+ pallets", "Not yet estimated"];
const faqs = [
  ["Who can become a TALVUMI distribution partner?", "We welcome applications from qualified importers, national and regional pet food distributors, retail chains, specialist pet retailers and ecommerce operators."],
  ["Which pet food products are planned for launch?", "The initial commercial candidates include adult cat ocean fish recipe, adult dog beef recipe and kitten ocean fish recipe. Final formulas, pack sizes, claims and availability depend on manufacturer documentation and market registration."],
  ["Does TALVUMI offer private label pet food?", "TALVUMI is the export-facing brand. Separate OEM or private-label opportunities are assessed case by case and are not implied by a distributor appointment."],
  ["Are exclusive territories available?", "Territory rights are never automatic. Any exclusivity, targets, registration responsibilities and commercial terms require a written agreement after capability review."],
  ["What information should a distributor application include?", "Tell us your country, import status, active retail accounts, sales channels, priority cities and intended launch window. This lets both sides judge commercial fit before discussing samples or terms."]
];
function Monogram({ className = "" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 120 120", "aria-label": "TALVUMI monogram", children: [
    /* @__PURE__ */ jsx("path", { d: "M104 36A49 49 0 1 0 103 86", fill: "none", stroke: "currentColor", strokeWidth: "9", strokeLinecap: "square" }),
    /* @__PURE__ */ jsx("path", { d: "M29 43h48M51 43v35M51 56l23 37 22-39", fill: "none", stroke: "currentColor", strokeWidth: "9", strokeLinejoin: "miter" }),
    /* @__PURE__ */ jsx("path", { d: "M102 78h13", fill: "none", stroke: "var(--cyan)", strokeWidth: "9" })
  ] });
}
function PackConcept({ product, compact = false }) {
  return /* @__PURE__ */ jsxs("div", { className: `pack-concept ${product.tone} ${compact ? "compact" : ""}`, "aria-label": `${product.name} packaging system concept`, children: [
    /* @__PURE__ */ jsx("span", { className: "concept-label", children: "DESIGN SYSTEM · NOT FINAL LABEL" }),
    /* @__PURE__ */ jsx(Monogram, {}),
    /* @__PURE__ */ jsx("div", { className: "pack-wordmark", children: "TALVUMI" }),
    /* @__PURE__ */ jsx("div", { className: "pack-species", children: product.type }),
    /* @__PURE__ */ jsx("strong", { children: product.name }),
    /* @__PURE__ */ jsx("small", { children: product.descriptor }),
    /* @__PURE__ */ jsx("i", {})
  ] });
}
function ProductShortlist() {
  const [selected, setSelected] = useState(() => Object.fromEntries(catalog.map((product) => [product.id, product.variants[0].id])));
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
    requestAnimationFrame(() => {
      var _a;
      return (_a = document.querySelector("#shortlist")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "center" });
    });
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
    const payload = isTrade ? { ...data, lines, consent: data.consent === "on", privacyVersion: commerceConfig.privacyVersion, source: "homepage-product-shortlist" } : { email: data.email, country: data.country, variantIds: lines.map((line) => line.variantId), consent: data.consent === "on", privacyVersion: commerceConfig.privacyVersion, source: "homepage-product-shortlist" };
    setState({ status: "sending", message: isTrade ? "Validating trade request…" : "Validating early-access request…" });
    try {
      const response = await fetch(isTrade ? "/api/quote-requests" : "/api/early-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
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
  return /* @__PURE__ */ jsxs("section", { id: "preorder", className: "commerce section", children: [
    /* @__PURE__ */ jsxs("div", { className: "commerce-heading", children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "PRE-LAUNCH PRODUCT CONFIGURATOR" }),
      /* @__PURE__ */ jsxs("h2", { children: [
        "Choose the range.",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("em", { children: "Build the request." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { children: "Select product candidates and pack sizes for a distributor quote or retail launch notification. No payment, price or stock commitment is created at this stage." }),
        /* @__PURE__ */ jsx("span", { className: "commerce-status", children: "INTEREST MODE · PAYMENT DISABLED" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "commerce-grid", children: catalog.map((product) => {
      const variant = product.variants.find((item) => item.id === selected[product.id]) || product.variants[0];
      const isAdded = lines.some((line) => line.variantId === variant.id);
      return /* @__PURE__ */ jsxs("article", { className: `commerce-card ${product.tone}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "commerce-image", children: [
          /* @__PURE__ */ jsx("img", { src: product.image, alt: "", loading: "lazy", decoding: "async", style: { objectPosition: product.imagePosition } }),
          /* @__PURE__ */ jsx("span", { children: product.type })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "commerce-card-copy", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            product.lifeStage,
            " ",
            product.species
          ] }),
          /* @__PURE__ */ jsx("h3", { children: product.name }),
          /* @__PURE__ */ jsx("small", { children: product.descriptor }),
          /* @__PURE__ */ jsx("div", { className: "variant-switch", "aria-label": `Choose ${product.name} pack size`, children: product.variants.map((item) => /* @__PURE__ */ jsx("button", { className: item.id === variant.id ? "active" : "", type: "button", onClick: () => setSelected((current) => ({ ...current, [product.id]: item.id })), children: item.displaySize }, item.id)) }),
          /* @__PURE__ */ jsxs("dl", { children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("dt", { children: "Planning SKU" }),
              /* @__PURE__ */ jsx("dd", { children: variant.planningSku })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("dt", { children: "Price" }),
              /* @__PURE__ */ jsx("dd", { children: "Market quote pending" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("dt", { children: "Barcode / case pack" }),
              /* @__PURE__ */ jsx("dd", { children: "Factory confirmation" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("a", { className: "product-data-link", href: product.productPath, children: "View buyer data page →" }),
          /* @__PURE__ */ jsx("button", { className: `button ${isAdded ? "button-disabled" : "button-primary"}`, type: "button", disabled: isAdded, onClick: () => addVariant(variant.id), children: isAdded ? "Added to shortlist" : "Add to product shortlist" })
        ] })
      ] }, product.id);
    }) }),
    /* @__PURE__ */ jsxs("div", { id: "shortlist", className: "shortlist", children: [
      /* @__PURE__ */ jsxs("div", { className: "shortlist-summary", children: [
        /* @__PURE__ */ jsxs("div", { className: "shortlist-title", children: [
          /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "YOUR PRODUCT SHORTLIST" }),
          /* @__PURE__ */ jsxs("span", { children: [
            lines.length,
            " ",
            lines.length === 1 ? "specification" : "specifications"
          ] })
        ] }),
        lines.length ? /* @__PURE__ */ jsx("div", { className: "shortlist-lines", children: lines.map((line) => {
          const variant = getVariant(line.variantId);
          return /* @__PURE__ */ jsxs("article", { children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: variant.productType }),
              /* @__PURE__ */ jsxs("h3", { children: [
                variant.productName,
                " · ",
                variant.displaySize
              ] }),
              /* @__PURE__ */ jsx("small", { children: variant.planningSku })
            ] }),
            buyerMode === "trade" && /* @__PURE__ */ jsxs("div", { className: "line-quantity", children: [
              /* @__PURE__ */ jsx("input", { "aria-label": `Quantity for ${variant.planningSku}`, type: "number", min: "1", max: "99999", value: line.requestedQty, onChange: (event) => updateLine(line.variantId, { requestedQty: Math.max(1, Number(event.target.value) || 1) }) }),
              /* @__PURE__ */ jsxs("select", { "aria-label": `Unit for ${variant.planningSku}`, value: line.unit, onChange: (event) => updateLine(line.variantId, { unit: event.target.value }), children: [
                /* @__PURE__ */ jsx("option", { value: "bags", children: "bags" }),
                /* @__PURE__ */ jsx("option", { value: "cases", children: "cases" }),
                /* @__PURE__ */ jsx("option", { value: "pallets", children: "pallets" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeLine(line.variantId), "aria-label": `Remove ${variant.planningSku}`, children: "Remove" })
          ] }, line.variantId);
        }) }) : /* @__PURE__ */ jsxs("div", { className: "shortlist-empty", children: [
          /* @__PURE__ */ jsx("strong", { children: "No products selected yet." }),
          /* @__PURE__ */ jsx("p", { children: "Choose one or more pack specifications above to build a trade request or join retail early access." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "shortlist-note", children: "Planning SKUs are internal identifiers. GTIN, case pack, MOQ, price, inventory and delivery dates remain pending written confirmation." })
      ] }),
      /* @__PURE__ */ jsxs("form", { className: "shortlist-form", onSubmit: submit, children: [
        /* @__PURE__ */ jsxs("div", { className: "buyer-toggle", "aria-label": "Choose request type", children: [
          /* @__PURE__ */ jsx("button", { className: buyerMode === "trade" ? "active" : "", type: "button", onClick: () => setBuyerMode("trade"), children: "Wholesale quote" }),
          /* @__PURE__ */ jsx("button", { className: buyerMode === "retail" ? "active" : "", type: "button", onClick: () => setBuyerMode("retail"), children: "Retail early access" })
        ] }),
        buyerMode === "trade" && /* @__PURE__ */ jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ jsxs("label", { children: [
            "Company name",
            /* @__PURE__ */ jsx("input", { name: "company", autoComplete: "organization", required: true })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            "Contact name",
            /* @__PURE__ */ jsx("input", { name: "contactName", autoComplete: "name", required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-grid", children: [
          /* @__PURE__ */ jsxs("label", { children: [
            buyerMode === "trade" ? "Work email" : "Email",
            /* @__PURE__ */ jsx("input", { name: "email", type: "email", autoComplete: "email", required: true })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            "Country / territory",
            /* @__PURE__ */ jsx("input", { name: "country", autoComplete: "country-name", required: true })
          ] }),
          buyerMode === "trade" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("label", { children: [
              "Partner type",
              /* @__PURE__ */ jsxs("select", { name: "partnerType", required: true, defaultValue: "", children: [
                /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select one" }),
                partnerTypes.map((item) => /* @__PURE__ */ jsx("option", { children: item }, item))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("label", { children: [
              "Import status",
              /* @__PURE__ */ jsxs("select", { name: "importStatus", required: true, defaultValue: "", children: [
                /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select one" }),
                /* @__PURE__ */ jsx("option", { children: "Active licence" }),
                /* @__PURE__ */ jsx("option", { children: "In progress" }),
                /* @__PURE__ */ jsx("option", { children: "Licensed importer partner" }),
                /* @__PURE__ */ jsx("option", { children: "Not yet available" })
              ] })
            ] })
          ] })
        ] }),
        buyerMode === "trade" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ jsxs("label", { children: [
              "Target launch window",
              /* @__PURE__ */ jsxs("select", { name: "launchWindow", required: true, defaultValue: "", children: [
                /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select one" }),
                launchWindows.map((item) => /* @__PURE__ */ jsx("option", { children: item }, item))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("label", { children: [
              "Expected opening order",
              /* @__PURE__ */ jsxs("select", { name: "openingOrderBand", required: true, defaultValue: "", children: [
                /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select one" }),
                volumeBands.map((item) => /* @__PURE__ */ jsx("option", { children: item }, item))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("label", { children: [
              "Company website",
              /* @__PURE__ */ jsx("input", { name: "website", type: "url", autoComplete: "url", placeholder: "https://" })
            ] }),
            /* @__PURE__ */ jsxs("label", { children: [
              "Phone / WhatsApp",
              /* @__PURE__ */ jsx("input", { name: "phone", type: "tel", autoComplete: "tel" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            "Preferred trade basis",
            /* @__PURE__ */ jsxs("select", { name: "incotermPreference", defaultValue: "", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Discuss with TALVUMI" }),
              /* @__PURE__ */ jsx("option", { children: "EXW — named place required" }),
              /* @__PURE__ */ jsx("option", { children: "FOB — named port required" }),
              /* @__PURE__ */ jsx("option", { children: "CIF — named destination port required" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            "Launch plan / sample request",
            /* @__PURE__ */ jsx("textarea", { name: "notes", rows: "4", placeholder: "Share your target cities, channels, intended launch window and whether samples are required." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "honeypot", "aria-hidden": "true", children: [
          "Leave this field empty",
          /* @__PURE__ */ jsx("input", { name: "companyFax", tabIndex: "-1", autoComplete: "off" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "consent", children: [
          /* @__PURE__ */ jsx("input", { name: "consent", type: "checkbox", required: true }),
          /* @__PURE__ */ jsxs("span", { children: [
            "I agree that these details may be used to assess launch interest under the ",
            /* @__PURE__ */ jsx("a", { href: "/privacy/", children: "privacy notice" }),
            ". This is not a purchase, reservation of inventory or price commitment."
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "button button-primary", disabled: state.status === "sending" || !lines.length, children: state.status === "sending" ? "Submitting…" : buyerMode === "trade" ? "Request trade review" : "Join retail early access" }),
        state.message && /* @__PURE__ */ jsx("p", { "aria-live": "polite", className: `form-message ${state.status}`, children: state.message })
      ] })
    ] })
  ] });
}
function LaunchReadiness() {
  const gates = [
    ["Product identity", "In factory verification", "Legal names, recipe references, life stage and final product documentation."],
    ["Commercial terms", "Quote by market", "MOQ, tier price, trade basis and lead time are confirmed in writing for each qualified request."],
    ["Packaging", "Engineering validation", "Final dimensions, barrier, seal window, case pack and transit performance require real-product testing."],
    ["Market access", "Partner-led review", "Registration, importer responsibility, label language and local claims approval are assessed market by market."]
  ];
  return /* @__PURE__ */ jsxs("section", { className: "readiness section", "aria-labelledby": "readiness-title", children: [
    /* @__PURE__ */ jsxs("div", { className: "readiness-heading", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "BUYER DUE-DILIGENCE VIEW" }),
        /* @__PURE__ */ jsxs("h2", { id: "readiness-title", children: [
          "Know what is ready.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("em", { children: "Know what comes next." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "TALVUMI does not turn planning data into a sales promise. Qualified partners receive a written status review before samples, registration work or a commercial order is agreed." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "readiness-grid", children: gates.map(([name, status, detail], index) => /* @__PURE__ */ jsxs("article", { children: [
      /* @__PURE__ */ jsxs("span", { children: [
        "0",
        index + 1
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("strong", { children: name }),
        /* @__PURE__ */ jsx("small", { children: status })
      ] }),
      /* @__PURE__ */ jsx("p", { children: detail })
    ] }, name)) }),
    /* @__PURE__ */ jsxs("div", { className: "readiness-actions", children: [
      /* @__PURE__ */ jsx("a", { className: "button button-primary", href: "#preorder", children: "Build an RFQ shortlist" }),
      /* @__PURE__ */ jsxs("a", { className: "text-link", href: "/distributors/", children: [
        "Read the distributor process ",
        /* @__PURE__ */ jsx("span", { children: "→" })
      ] })
    ] })
  ] });
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
      transit: "Test 4 bags / case and 6 bags / case"
    },
    {
      size: "8 kg",
      role: "Family / channel pack",
      bag: "Flat-bottom or load-rated quad-seal bag",
      window: "RFQ window: 380–450 × 650–760 mm; gusset 120–180 mm",
      material: "Start point: PET 12 / PA 15 / VMPET 12 / mLLDPE 110–140 μm",
      features: "Tamper-evident seal · reinforced side handle · heavy-duty reclose",
      transit: "Start with one bag / corrugated shipper"
    },
    {
      size: "10 kg",
      role: "Large-format trade pack",
      bag: "Heavy-duty quad-seal or flat-bottom bag",
      window: "RFQ window: 420–500 × 700–850 mm; gusset 140–200 mm",
      material: "Start point: PET 12 / PA 15 / VMPET 12 / mLLDPE 130–160 μm",
      features: "Reinforced corners · side handle · load-rated zipper and top seal",
      transit: "One bag / shipper unless channel testing approves bulk palletisation"
    }
  ];
  return /* @__PURE__ */ jsxs("section", { id: "packaging", className: "packaging section", children: [
    /* @__PURE__ */ jsxs("div", { className: "packaging-heading", children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "PACKAGING ENGINEERING · RFQ START POINT" }),
      /* @__PURE__ */ jsxs("h2", { children: [
        "Designed to sell.",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("em", { children: "Engineered to travel." })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "These parameters are a disciplined starting brief for the factory and converter—not final production claims. Finished dimensions, laminate, barrier, seal window and case pack must be validated with the real kibble, filling line and target-market distribution test." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "packaging-grid", children: packs.map((pack, index) => /* @__PURE__ */ jsxs("article", { children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx("strong", { children: pack.size })
      ] }),
      /* @__PURE__ */ jsx("p", { children: pack.role }),
      /* @__PURE__ */ jsx("h3", { children: pack.bag }),
      /* @__PURE__ */ jsxs("dl", { children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("dt", { children: "Size brief" }),
          /* @__PURE__ */ jsx("dd", { children: pack.window })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("dt", { children: "Laminate brief" }),
          /* @__PURE__ */ jsx("dd", { children: pack.material })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("dt", { children: "Functional parts" }),
          /* @__PURE__ */ jsx("dd", { children: pack.features })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("dt", { children: "Transit pack" }),
          /* @__PURE__ */ jsx("dd", { children: pack.transit })
        ] })
      ] })
    ] }, pack.size)) }),
    /* @__PURE__ */ jsxs("div", { className: "packaging-gates", children: [
      /* @__PURE__ */ jsx("strong", { children: "Factory lock required" }),
      /* @__PURE__ */ jsx("p", { children: "Kibble bulk density, largest particle, surface oil, target shelf life, nitrogen use, current film data, filling-line limits, seal settings, coder footprint, drop history and final pallet route." }),
      /* @__PURE__ */ jsx("span", { children: "NO “RECYCLABLE”, BARRIER OR SHELF-LIFE CLAIM UNTIL TESTED" })
    ] })
  ] });
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
        body: JSON.stringify(payload)
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
  return /* @__PURE__ */ jsxs("form", { className: "partner-form", onSubmit: submit, children: [
    /* @__PURE__ */ jsxs("div", { className: "form-grid", children: [
      /* @__PURE__ */ jsxs("label", { children: [
        "Company name",
        /* @__PURE__ */ jsx("input", { name: "company", autoComplete: "organization", required: true })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Contact name",
        /* @__PURE__ */ jsx("input", { name: "contactName", autoComplete: "name", required: true })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Country / territory",
        /* @__PURE__ */ jsx("input", { name: "country", autoComplete: "country-name", required: true })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Work email",
        /* @__PURE__ */ jsx("input", { name: "email", type: "email", autoComplete: "email", required: true })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Partner type",
        /* @__PURE__ */ jsxs("select", { name: "partnerType", required: true, defaultValue: "", children: [
          /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select one" }),
          partnerTypes.map((item) => /* @__PURE__ */ jsx("option", { children: item }, item))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Active retail accounts",
        /* @__PURE__ */ jsxs("select", { name: "retailAccounts", required: true, defaultValue: "", children: [
          /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select a range" }),
          /* @__PURE__ */ jsx("option", { children: "1–25" }),
          /* @__PURE__ */ jsx("option", { children: "26–100" }),
          /* @__PURE__ */ jsx("option", { children: "101–300" }),
          /* @__PURE__ */ jsx("option", { children: "301+" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Import licence status",
        /* @__PURE__ */ jsxs("select", { name: "importLicence", required: true, defaultValue: "", children: [
          /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select one" }),
          /* @__PURE__ */ jsx("option", { children: "Active" }),
          /* @__PURE__ */ jsx("option", { children: "In progress" }),
          /* @__PURE__ */ jsx("option", { children: "Working with a licensed importer" }),
          /* @__PURE__ */ jsx("option", { children: "Not yet available" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Target launch window",
        /* @__PURE__ */ jsxs("select", { name: "launchWindow", required: true, defaultValue: "", children: [
          /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select one" }),
          launchWindows.map((item) => /* @__PURE__ */ jsx("option", { children: item }, item))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Expected opening order",
        /* @__PURE__ */ jsxs("select", { name: "openingOrderBand", required: true, defaultValue: "", children: [
          /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select one" }),
          volumeBands.map((item) => /* @__PURE__ */ jsx("option", { children: item }, item))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Company website",
        /* @__PURE__ */ jsx("input", { name: "website", type: "url", autoComplete: "url", placeholder: "https://" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("label", { children: [
      "Route to market and launch plan",
      /* @__PURE__ */ jsx("textarea", { name: "launchPlan", rows: "4", placeholder: "Tell us about your channels, cities and intended launch window.", required: true })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "honeypot", "aria-hidden": "true", children: [
      "Leave this field empty",
      /* @__PURE__ */ jsx("input", { name: "companyFax", tabIndex: "-1", autoComplete: "off" })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "consent", children: [
      /* @__PURE__ */ jsx("input", { name: "consent", type: "checkbox", required: true }),
      /* @__PURE__ */ jsxs("span", { children: [
        "I confirm that this information is accurate and may be used to assess a potential commercial relationship under the ",
        /* @__PURE__ */ jsx("a", { href: "/privacy/", children: "privacy notice" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsx("button", { className: "button button-primary", disabled: state.status === "sending", children: state.status === "sending" ? "Submitting…" : "Apply to partner" }),
    state.message && /* @__PURE__ */ jsx("p", { "aria-live": "polite", className: `form-message ${state.status}`, children: state.message })
  ] });
}
function App() {
  const [trace, setTrace] = useState("");
  const [traceMessage, setTraceMessage] = useState("");
  const year = useMemo(() => (/* @__PURE__ */ new Date()).getFullYear(), []);
  function checkBatch(event) {
    event.preventDefault();
    setTraceMessage(trace.trim() ? "Batch verification will activate product by product after commercial production begins. No simulated result has been generated." : "Enter the lot code printed on an approved commercial pack.");
  }
  return /* @__PURE__ */ jsxs("main", { children: [
    /* @__PURE__ */ jsxs("header", { className: "site-header", children: [
      /* @__PURE__ */ jsxs("a", { className: "brand", href: "#top", "aria-label": "TALVUMI home", children: [
        /* @__PURE__ */ jsx(Monogram, {}),
        /* @__PURE__ */ jsxs("span", { children: [
          "TALVUMI",
          /* @__PURE__ */ jsx("small", { children: "PET NUTRITION" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Primary navigation", children: [
        /* @__PURE__ */ jsx("a", { href: "#range", children: "Range" }),
        /* @__PURE__ */ jsx("a", { href: "#preorder", children: "Pre-launch" }),
        /* @__PURE__ */ jsx("a", { href: "#packaging", children: "Packaging" }),
        /* @__PURE__ */ jsx("a", { href: "#partners", children: "Partners" })
      ] }),
      /* @__PURE__ */ jsx("a", { className: "button button-small", href: "#preorder", children: "Build a product shortlist" })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "top", className: "hero", children: [
      /* @__PURE__ */ jsx("div", { className: "hero-noise" }),
      /* @__PURE__ */ jsxs("div", { className: "hero-copy", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "A GLOBAL PET NUTRITION CHALLENGER" }),
        /* @__PURE__ */ jsxs("h1", { children: [
          "Verified nutrition.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("em", { children: "Built to grow." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "hero-lede", children: "Premium cat and dog food with clear product architecture, high-impact shelf presence and a partner-first route to market for importers and distributors." }),
        /* @__PURE__ */ jsxs("div", { className: "hero-actions", children: [
          /* @__PURE__ */ jsx("a", { className: "button button-primary", href: "#apply", children: "Become a distributor" }),
          /* @__PURE__ */ jsxs("a", { className: "text-link", href: "#range", children: [
            "Explore the launch range ",
            /* @__PURE__ */ jsx("span", { children: "→" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hero-proof", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "01",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("b", { children: "Clear by design" })
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "02",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("b", { children: "Claims reviewed" })
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "03",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("b", { children: "Partners first" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hero-visual", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/assets/brand/talvumi-cat-dog-pet-food-brand-hero.webp",
            width: "1600",
            height: "1067",
            alt: "Cat and dog beside bowls of dry pet food in the TALVUMI brand studio",
            fetchPriority: "high",
            decoding: "async"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "hero-visual-caption", children: [
          /* @__PURE__ */ jsx("span", { children: "CAT + DOG NUTRITION" }),
          /* @__PURE__ */ jsx("p", { children: "Brand campaign visual. Product formula, claims and final artwork remain subject to written approval." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "marquee", "aria-label": "Brand principles", children: /* @__PURE__ */ jsxs("div", { children: [
      "VERIFIED ",
      /* @__PURE__ */ jsx("i", { children: "●" }),
      " CLEAR ",
      /* @__PURE__ */ jsx("i", { children: "●" }),
      " DISTINCTIVE ",
      /* @__PURE__ */ jsx("i", { children: "●" }),
      " PARTNER-BUILT ",
      /* @__PURE__ */ jsx("i", { children: "●" }),
      " VERIFIED ",
      /* @__PURE__ */ jsx("i", { children: "●" }),
      " CLEAR"
    ] }) }),
    /* @__PURE__ */ jsxs("section", { id: "standard", className: "standard section", children: [
      /* @__PURE__ */ jsxs("div", { className: "section-heading", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "OUR STANDARD" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "No mystery",
          /* @__PURE__ */ jsx("br", {}),
          "in the bowl."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "standard-content", children: [
        /* @__PURE__ */ jsx("p", { className: "lead", children: "Pet nutrition should be easier to understand and easier to trust. TALVUMI is building a focused range with disciplined product information and market-ready support." }),
        /* @__PURE__ */ jsxs("div", { className: "principles", children: [
          /* @__PURE__ */ jsxs("article", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Verified" }),
            /* @__PURE__ */ jsx("p", { children: "Published claims are reviewed against the product and manufacturing documentation available for that market." })
          ] }),
          /* @__PURE__ */ jsxs("article", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Clear" }),
            /* @__PURE__ */ jsx("p", { children: "Products are organised by species, life stage, format and primary ingredient—without unnecessary complexity." })
          ] }),
          /* @__PURE__ */ jsxs("article", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Vital" }),
            /* @__PURE__ */ jsx("p", { children: "Distinctive packaging makes the range easier to find, explain and build at shelf." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "food-story section", children: [
      /* @__PURE__ */ jsxs("div", { className: "food-story-media", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/assets/brand/talvumi-dry-pet-food-texture.webp",
            width: "1400",
            height: "933",
            alt: "Two bowls showing dry cat and dog food with freeze-dried pieces",
            loading: "lazy",
            decoding: "async"
          }
        ),
        /* @__PURE__ */ jsx("span", { children: "PRODUCT FORMAT VISUAL · FINAL APPEARANCE MAY VARY" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "food-story-copy", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "THE PRODUCT, CLEARLY SEEN" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "Real food",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("em", { children: "starts with detail." })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Dry nutrition and freeze-dried pieces are made visible, not hidden behind vague lifestyle language. Final appearance, ingredients and claims will be confirmed product by product for each launch market." }),
        /* @__PURE__ */ jsxs("div", { className: "food-story-points", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("b", { children: "01" }),
            " Cat and dog formats"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("b", { children: "02" }),
            " Life-stage architecture"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("b", { children: "03" }),
            " Market-reviewed information"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "range", className: "range section", children: [
      /* @__PURE__ */ jsxs("div", { className: "section-heading range-title", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "COMMERCIAL LAUNCH CANDIDATES" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "One brand.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("em", { children: "A clearer range." })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Formats and specifications remain subject to final manufacturer documentation, market registration and written commercial confirmation." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "product-grid", children: catalog.map((product, index) => /* @__PURE__ */ jsxs("article", { className: `product-card ${product.tone}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "product-index", children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsx(PackConcept, { product }),
        /* @__PURE__ */ jsxs("div", { className: "product-copy", children: [
          /* @__PURE__ */ jsx("p", { children: product.type }),
          /* @__PURE__ */ jsx("h3", { children: product.name }),
          /* @__PURE__ */ jsx("span", { children: product.descriptor }),
          /* @__PURE__ */ jsxs("dl", { children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("dt", { children: "Pack plan" }),
              /* @__PURE__ */ jsx("dd", { children: product.variants.map((variant) => variant.displaySize).join(" · ") })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("dt", { children: "Status" }),
              /* @__PURE__ */ jsx("dd", { children: product.status })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: "#preorder", children: [
            "Build a product shortlist ",
            /* @__PURE__ */ jsx("span", { children: "→" })
          ] })
        ] })
      ] }, product.id)) })
    ] }),
    /* @__PURE__ */ jsx(ProductShortlist, {}),
    /* @__PURE__ */ jsx(LaunchReadiness, {}),
    /* @__PURE__ */ jsx(PackagingEngineering, {}),
    /* @__PURE__ */ jsxs("section", { id: "trace", className: "trace section", children: [
      /* @__PURE__ */ jsx("div", { className: "trace-mark", children: /* @__PURE__ */ jsx(Monogram, {}) }),
      /* @__PURE__ */ jsxs("div", { className: "trace-copy", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "TRACE THIS BATCH" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "Every claim should",
          /* @__PURE__ */ jsx("br", {}),
          "lead back to evidence."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "The TALVUMI batch-information experience will connect an approved commercial product with the documentation available for its production run." }),
        /* @__PURE__ */ jsxs("form", { onSubmit: checkBatch, className: "trace-form", children: [
          /* @__PURE__ */ jsx("input", { value: trace, onChange: (event) => setTrace(event.target.value), placeholder: "Enter batch / lot code", "aria-label": "Batch or lot code" }),
          /* @__PURE__ */ jsx("button", { className: "button button-cyan", children: "Verify batch" })
        ] }),
        traceMessage && /* @__PURE__ */ jsx("p", { className: "trace-message", children: traceMessage })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "partners", className: "partners section", children: [
      /* @__PURE__ */ jsx("div", { className: "partner-visual", children: /* @__PURE__ */ jsxs("div", { className: "partner-signal", children: [
        /* @__PURE__ */ jsx(Monogram, {}),
        /* @__PURE__ */ jsxs("strong", { children: [
          "CLAIMS → EVIDENCE",
          /* @__PURE__ */ jsx("br", {}),
          "PRODUCT → MARKET",
          /* @__PURE__ */ jsx("br", {}),
          "PARTNER → GROWTH"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "partner-copy", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "DISTRIBUTOR PARTNERS WANTED" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "Built for partners",
          /* @__PURE__ */ jsx("br", {}),
          "who build markets."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "We are looking for importers, distributors and specialist retailers prepared to create lasting demand—not simply list another product." }),
        /* @__PURE__ */ jsxs("ul", { children: [
          /* @__PURE__ */ jsx("li", { children: "Market-specific product information" }),
          /* @__PURE__ */ jsx("li", { children: "Launch-ready brand assets" }),
          /* @__PURE__ */ jsx("li", { children: "Product and sales training" }),
          /* @__PURE__ */ jsx("li", { children: "Territory planning based on capability and agreed targets" }),
          /* @__PURE__ */ jsx("li", { children: "Ongoing sell-through collaboration" })
        ] }),
        /* @__PURE__ */ jsx("a", { className: "button button-primary", href: "#apply", children: "Start your application" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "process section", children: [
      /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "HOW PARTNERSHIP STARTS" }),
      /* @__PURE__ */ jsx("div", { className: "process-grid", children: [["01", "Apply", "Tell us about your company, territory and channels."], ["02", "Review", "We assess channel capability and regulatory readiness."], ["03", "Evaluate", "Qualified partners discuss products, samples and market fit."], ["04", "Plan", "Both sides agree a practical market and launch plan."], ["05", "Launch", "Commercial terms, registration and supply are confirmed in writing."]].map(([number, title, copy]) => /* @__PURE__ */ jsxs("article", { children: [
        /* @__PURE__ */ jsx("span", { children: number }),
        /* @__PURE__ */ jsx("h3", { children: title }),
        /* @__PURE__ */ jsx("p", { children: copy })
      ] }, number)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "insights", className: "insights section", children: [
      /* @__PURE__ */ jsxs("div", { className: "insights-heading", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "MARKET INSIGHTS · EVIDENCE-REVIEWED" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "Useful signals.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("em", { children: "Commercial intent." })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Practical guidance for pet food importers, distributors and retail partners. New analysis is published when its evidence and commercial boundaries have been reviewed." }),
        /* @__PURE__ */ jsxs("a", { className: "text-link", href: "/insights/", children: [
          "View all insights ",
          /* @__PURE__ */ jsx("span", { children: "→" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "insight-grid", children: insights.slice(0, 3).map((article, index) => /* @__PURE__ */ jsxs("article", { className: "insight-card", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "0",
            index + 1
          ] }),
          /* @__PURE__ */ jsx("time", { dateTime: article.date, children: article.date })
        ] }),
        /* @__PURE__ */ jsx("p", { children: article.category }),
        /* @__PURE__ */ jsx("h3", { children: /* @__PURE__ */ jsx("a", { href: `/insights/${article.slug}/`, children: article.title }) }),
        /* @__PURE__ */ jsx("p", { children: article.excerpt }),
        /* @__PURE__ */ jsxs("a", { href: `/insights/${article.slug}/`, children: [
          "Read the analysis ",
          /* @__PURE__ */ jsx("span", { children: "→" })
        ] })
      ] }, article.slug)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "faq", className: "faq section", children: [
      /* @__PURE__ */ jsxs("div", { className: "faq-heading", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "DISTRIBUTOR FAQ" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "Facts before",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("em", { children: "the first order." })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Direct answers for pet food importers, distributors and retail partners evaluating TALVUMI." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "faq-list", children: faqs.map(([question, answer]) => /* @__PURE__ */ jsxs("details", { children: [
        /* @__PURE__ */ jsx("summary", { children: question }),
        /* @__PURE__ */ jsx("p", { children: answer })
      ] }, question)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "apply", className: "apply section", children: [
      /* @__PURE__ */ jsxs("div", { className: "apply-heading", children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "BUILD TALVUMI IN YOUR MARKET" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "Tell us where",
          /* @__PURE__ */ jsx("br", {}),
          "you can take it."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Every application is reviewed for channel capability, regulatory readiness and long-term brand fit. Submission does not guarantee appointment, exclusivity, commercial terms or sample approval." })
      ] }),
      /* @__PURE__ */ jsx(ApplicationForm, {})
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "retail section", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "eyebrow", children: "RETAIL AVAILABILITY" }),
        /* @__PURE__ */ jsx("h2", { children: "Retail opens market by market." })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Buy Now will appear only where a product is legally registered, locally stocked and supported by approved pricing, payment, delivery, returns and customer service." }),
      /* @__PURE__ */ jsx("button", { className: "button button-disabled", disabled: true, children: "Retail launch pending" })
    ] }),
    /* @__PURE__ */ jsxs("footer", { children: [
      /* @__PURE__ */ jsxs("div", { className: "footer-brand", children: [
        /* @__PURE__ */ jsx(Monogram, {}),
        /* @__PURE__ */ jsx("strong", { children: "TALVUMI" })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Verified premium nutrition—clear for pet parents, built for partners." }),
      /* @__PURE__ */ jsxs("div", { className: "footer-links", children: [
        /* @__PURE__ */ jsx("a", { href: "/about/", children: "About" }),
        /* @__PURE__ */ jsx("a", { href: "/distributors/", children: "Distributors" }),
        /* @__PURE__ */ jsx("a", { href: "/insights/", children: "Insights" }),
        /* @__PURE__ */ jsx("a", { href: "/editorial-policy/", children: "Editorial policy" }),
        /* @__PURE__ */ jsx("a", { href: "/privacy/", children: "Privacy" }),
        /* @__PURE__ */ jsx("a", { href: "/terms/", children: "Terms" })
      ] }),
      /* @__PURE__ */ jsxs("small", { children: [
        "© ",
        year,
        " TALVUMI. Product availability, formulation, packaging and claims may vary by market. Distributor appointments and commercial terms require written agreement."
      ] })
    ] })
  ] });
}
function render() {
  return renderToString(/* @__PURE__ */ jsx(App, {}));
}
export {
  render
};

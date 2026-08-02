import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { renderToString } from "react-dom/server";
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
new Map(
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
const partnerTypes = ["Importer", "National distributor", "Regional distributor", "Retail chain", "Specialist pet retailer", "Ecommerce operator"];
const launchWindows = ["Within 3 months", "3–6 months", "6–12 months", "Exploring"];
function PartnerForm() {
  const [state, setState] = useState({ status: "idle", message: "" });
  async function submit(event) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    setState({ status: "sending", message: "Sending your introduction…" });
    try {
      const response = await fetch("/api/partner-applications", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "The form is temporarily unavailable.");
      event.currentTarget.reset();
      setState({ status: "success", message: `Thank you. Your reference is ${result.reference}.` });
    } catch (error) {
      setState({ status: "pending", message: `${error.message} Please email your introduction to our commercial team when direct contact details are published.` });
    }
  }
  return /* @__PURE__ */ jsxs("form", { className: "public-form", onSubmit: submit, children: [
    /* @__PURE__ */ jsxs("div", { className: "public-form-grid", children: [
      /* @__PURE__ */ jsxs("label", { children: [
        "Company",
        /* @__PURE__ */ jsx("input", { name: "company", autoComplete: "organization", required: true })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Your name",
        /* @__PURE__ */ jsx("input", { name: "contactName", autoComplete: "name", required: true })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Business email",
        /* @__PURE__ */ jsx("input", { name: "email", type: "email", autoComplete: "email", required: true })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Country / territory",
        /* @__PURE__ */ jsx("input", { name: "country", autoComplete: "country-name", required: true })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Business type",
        /* @__PURE__ */ jsxs("select", { name: "partnerType", defaultValue: "", required: true, children: [
          /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Choose one" }),
          partnerTypes.map((item) => /* @__PURE__ */ jsx("option", { children: item }, item))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        "Preferred launch timing",
        /* @__PURE__ */ jsxs("select", { name: "launchWindow", defaultValue: "", required: true, children: [
          /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Choose one" }),
          launchWindows.map((item) => /* @__PURE__ */ jsx("option", { children: item }, item))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("label", { children: [
      "Tell us about your market",
      /* @__PURE__ */ jsx("textarea", { name: "launchPlan", rows: "4", placeholder: "Your channels, cities, current pet food portfolio and the products you want to discuss.", required: true })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "honeypot", "aria-hidden": "true", children: [
      "Leave blank",
      /* @__PURE__ */ jsx("input", { name: "companyFax", tabIndex: "-1", autoComplete: "off" })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "consent", children: [
      /* @__PURE__ */ jsx("input", { name: "consent", type: "checkbox", required: true }),
      /* @__PURE__ */ jsxs("span", { children: [
        "I agree that TALVUMI may use these business details to discuss a potential partnership under the ",
        /* @__PURE__ */ jsx("a", { href: "/privacy/", children: "privacy notice" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsx("button", { className: "public-button public-button-dark", disabled: state.status === "sending", children: state.status === "sending" ? "Sending…" : "Introduce your company" }),
    state.message && /* @__PURE__ */ jsx("p", { className: `form-message ${state.status}`, "aria-live": "polite", children: state.message })
  ] });
}
function AppPublic() {
  const year = useMemo(() => (/* @__PURE__ */ new Date()).getFullYear(), []);
  return /* @__PURE__ */ jsxs("main", { className: "public-site", children: [
    /* @__PURE__ */ jsxs("header", { className: "public-header", children: [
      /* @__PURE__ */ jsxs("a", { className: "public-brand", href: "#top", children: [
        /* @__PURE__ */ jsx("strong", { children: "TALVUMI" }),
        /* @__PURE__ */ jsx("small", { children: "PET NUTRITION" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Primary navigation", children: [
        /* @__PURE__ */ jsx("a", { href: "#range", children: "Products" }),
        /* @__PURE__ */ jsx("a", { href: "#brand", children: "Our difference" }),
        /* @__PURE__ */ jsx("a", { href: "#partners", children: "Partners" }),
        /* @__PURE__ */ jsx("a", { href: "/insights/", children: "Insights" }),
        /* @__PURE__ */ jsx("a", { className: "language-link", href: "/zh/", lang: "zh-CN", children: "中文" })
      ] }),
      /* @__PURE__ */ jsx("a", { className: "public-button", href: "#contact", children: "Talk to us" })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "top", className: "public-hero", children: [
      /* @__PURE__ */ jsxs("div", { className: "public-hero-copy", children: [
        /* @__PURE__ */ jsx("p", { className: "public-kicker", children: "CAT + DOG NUTRITION FOR MODERN PET RETAIL" }),
        /* @__PURE__ */ jsxs("h1", { children: [
          "Good food.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("em", { children: "Impossible to miss." })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "TALVUMI brings together quality pet nutrition, bold shelf presence and a wholesale-first model designed for ambitious importers and distributors." }),
        /* @__PURE__ */ jsxs("div", { className: "public-actions", children: [
          /* @__PURE__ */ jsx("a", { className: "public-button public-button-acid", href: "#range", children: "Discover the range" }),
          /* @__PURE__ */ jsxs("a", { href: "#contact", children: [
            "Become a partner ",
            /* @__PURE__ */ jsx("span", { children: "→" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "public-hero-image", children: [
        /* @__PURE__ */ jsx("img", { src: "/assets/brand/talvumi-cat-dog-pet-food-brand-hero.webp", width: "1600", height: "1067", alt: "Cat and dog beside bowls of dry pet food", fetchPriority: "high" }),
        /* @__PURE__ */ jsx("span", { children: "CAT + DOG · DRY FOOD · FREEZE-DRIED PIECES" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "public-strip", children: [
      "BOLD AT SHELF ",
      /* @__PURE__ */ jsx("i", { children: "●" }),
      " CLEAR BY RANGE ",
      /* @__PURE__ */ jsx("i", { children: "●" }),
      " BUILT WITH PARTNERS ",
      /* @__PURE__ */ jsx("i", { children: "●" }),
      " READY TO TRAVEL"
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "brand", className: "public-story public-section", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "public-kicker", children: "WHY TALVUMI" }),
        /* @__PURE__ */ jsx("h2", { children: "A pet food brand people can understand in seconds." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "public-story-copy", children: [
        /* @__PURE__ */ jsx("p", { className: "public-lede", children: "Pet parents want confidence. Retailers want a range that is easy to explain. Distributors want a brand with enough character to earn attention. TALVUMI is built for all three." }),
        /* @__PURE__ */ jsxs("div", { className: "public-pillars", children: [
          /* @__PURE__ */ jsxs("article", { children: [
            /* @__PURE__ */ jsx("b", { children: "01" }),
            /* @__PURE__ */ jsx("h3", { children: "Clear range" }),
            /* @__PURE__ */ jsx("p", { children: "Species, life stage and recipe are easy to recognise across every pack." })
          ] }),
          /* @__PURE__ */ jsxs("article", { children: [
            /* @__PURE__ */ jsx("b", { children: "02" }),
            /* @__PURE__ */ jsx("h3", { children: "Visible product" }),
            /* @__PURE__ */ jsx("p", { children: "Food texture and freeze-dried pieces become part of the shelf story." })
          ] }),
          /* @__PURE__ */ jsxs("article", { children: [
            /* @__PURE__ */ jsx("b", { children: "03" }),
            /* @__PURE__ */ jsx("h3", { children: "Distinctive identity" }),
            /* @__PURE__ */ jsx("p", { children: "Strong colour, oversized type and a consistent system create recall." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "range", className: "public-range public-section", children: [
      /* @__PURE__ */ jsxs("div", { className: "public-heading", children: [
        /* @__PURE__ */ jsx("p", { className: "public-kicker", children: "OPENING COLLECTION" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "Three focused products.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("em", { children: "One unmistakable family." })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Created to give partners a simple starting range across adult cat, adult dog and kitten nutrition." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "public-product-grid", children: catalog.map((product, index) => /* @__PURE__ */ jsxs("article", { className: `public-product ${product.tone}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "public-product-image", children: [
          /* @__PURE__ */ jsx("img", { src: product.image, alt: `${product.lifeStage} ${product.species} pet food`, loading: "lazy", style: { objectPosition: product.imagePosition } }),
          /* @__PURE__ */ jsxs("span", { children: [
            "0",
            index + 1
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("small", { children: product.type }),
          /* @__PURE__ */ jsx("h3", { children: product.name }),
          /* @__PURE__ */ jsx("p", { children: product.descriptor }),
          /* @__PURE__ */ jsx("strong", { children: product.variants.map((variant) => variant.displaySize).join(" · ") }),
          /* @__PURE__ */ jsx("a", { href: "#contact", children: "Discuss this product →" })
        ] })
      ] }, product.id)) }),
      /* @__PURE__ */ jsx("p", { className: "public-fineprint", children: "Final recipe, pack format and market availability are confirmed with each appointed partner." })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "public-food public-section", children: [
      /* @__PURE__ */ jsx("div", { className: "public-food-image", children: /* @__PURE__ */ jsx("img", { src: "/assets/brand/talvumi-dry-pet-food-texture.webp", width: "1400", height: "933", alt: "Bowls of dry cat and dog food with freeze-dried pieces", loading: "lazy" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "public-kicker", children: "SHOW THE FOOD" }),
        /* @__PURE__ */ jsx("h2", { children: "Let the product do the talking." }),
        /* @__PURE__ */ jsx("p", { children: "Dry nutrition and freeze-dried pieces are part of the experience, not something hidden behind generic lifestyle claims. TALVUMI makes texture, recipe and feeding occasion easier to see and easier to sell." }),
        /* @__PURE__ */ jsx("a", { href: "#contact", children: "Request a product conversation →" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "public-packaging public-section", children: [
      /* @__PURE__ */ jsxs("div", { className: "public-heading", children: [
        /* @__PURE__ */ jsx("p", { className: "public-kicker", children: "PACKAGING SYSTEM" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "Designed to stop the scroll.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("em", { children: "Built to own the shelf." })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "A consistent visual language creates one brand family while giving every recipe its own colour and personality." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "public-pack-grid", children: [["Adult cat · Ocean fish", "/assets/packaging/talvumi-adult-cat-ocean-fish-pack-concept.png"], ["Adult dog · Beef", "/assets/packaging/talvumi-adult-dog-beef-pack-concept.png"], ["Kitten · Ocean fish", "/assets/packaging/talvumi-kitten-ocean-fish-pack-concept.png"]].map(([label, src]) => /* @__PURE__ */ jsxs("figure", { children: [
        /* @__PURE__ */ jsx("img", { src, alt: `TALVUMI ${label} packaging direction`, loading: "lazy" }),
        /* @__PURE__ */ jsx("figcaption", { children: label })
      ] }, label)) }),
      /* @__PURE__ */ jsx("p", { className: "public-fineprint light", children: "Packaging shown is the selected brand direction; final market labels are prepared for each approved product and destination." })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "partners", className: "public-partners public-section", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "public-kicker", children: "WHOLESALE FIRST" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "More than a product list.",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("em", { children: "A brand to build." })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "We are looking for importers, distributors and specialist retailers who want to create lasting demand in their market." }),
        /* @__PURE__ */ jsx("a", { className: "public-button public-button-acid", href: "#contact", children: "Start the conversation" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "public-partner-list", children: [
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("span", { children: "01" }),
          /* @__PURE__ */ jsx("h3", { children: "A focused opening range" }),
          /* @__PURE__ */ jsx("p", { children: "Start with a clear product family, then expand around real market demand." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("span", { children: "02" }),
          /* @__PURE__ */ jsx("h3", { children: "Launch-ready brand assets" }),
          /* @__PURE__ */ jsx("p", { children: "Packaging direction, product storytelling and campaign materials built to work together." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("span", { children: "03" }),
          /* @__PURE__ */ jsx("h3", { children: "Channel collaboration" }),
          /* @__PURE__ */ jsx("p", { children: "Work directly on assortment, launch timing, retail presentation and local content." })
        ] }),
        /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsx("span", { children: "04" }),
          /* @__PURE__ */ jsx("h3", { children: "Long-term market building" }),
          /* @__PURE__ */ jsx("p", { children: "Territory discussions are based on capability, commitment and an agreed growth plan." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "public-journey public-section", children: [
      /* @__PURE__ */ jsx("p", { className: "public-kicker", children: "HOW IT STARTS" }),
      /* @__PURE__ */ jsx("div", { children: [["01", "Introduce", "Tell us about your company and market."], ["02", "Explore", "Review products, positioning and market fit."], ["03", "Sample", "Evaluate the selected recipes and formats."], ["04", "Plan", "Agree the range, route to market and launch."], ["05", "Build", "Create demand together in your territory."]].map(([num, title, copy]) => /* @__PURE__ */ jsxs("article", { children: [
        /* @__PURE__ */ jsx("span", { children: num }),
        /* @__PURE__ */ jsx("h3", { children: title }),
        /* @__PURE__ */ jsx("p", { children: copy })
      ] }, num)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { id: "contact", className: "public-contact public-section", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "public-kicker", children: "BRING TALVUMI TO YOUR MARKET" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "Tell us what",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("em", { children: "you can build." })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Share your market, channels and launch ambition. We will use that introduction to start a direct commercial conversation." })
      ] }),
      /* @__PURE__ */ jsx(PartnerForm, {})
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "public-faq public-section", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "public-kicker", children: "QUICK ANSWERS" }),
        /* @__PURE__ */ jsx("h2", { children: "Before we talk." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("details", { open: true, children: [
          /* @__PURE__ */ jsx("summary", { children: "Who should contact TALVUMI?" }),
          /* @__PURE__ */ jsx("p", { children: "Pet food importers, national or regional distributors, retail chains, specialist pet retailers and established ecommerce operators." })
        ] }),
        /* @__PURE__ */ jsxs("details", { children: [
          /* @__PURE__ */ jsx("summary", { children: "Can we discuss territory rights?" }),
          /* @__PURE__ */ jsx("p", { children: "Yes. Territory is discussed after both sides understand the market plan, channel capability and commercial expectations." })
        ] }),
        /* @__PURE__ */ jsxs("details", { children: [
          /* @__PURE__ */ jsx("summary", { children: "Can consumers buy online today?" }),
          /* @__PURE__ */ jsx("p", { children: "Retail availability will open market by market through appointed channels. The current website is focused on partner conversations." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "public-footer", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("strong", { children: "TALVUMI" }),
        /* @__PURE__ */ jsx("span", { children: "PET NUTRITION" })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Good food. Impossible to miss." }),
      /* @__PURE__ */ jsxs("nav", { children: [
        /* @__PURE__ */ jsx("a", { href: "/about/", children: "About" }),
        /* @__PURE__ */ jsx("a", { href: "/insights/", children: "Insights" }),
        /* @__PURE__ */ jsx("a", { href: "/privacy/", children: "Privacy" }),
        /* @__PURE__ */ jsx("a", { href: "/terms/", children: "Terms" }),
        /* @__PURE__ */ jsx("a", { href: "/zh/", children: "中文" })
      ] }),
      /* @__PURE__ */ jsxs("small", { children: [
        "© ",
        year,
        " TALVUMI. Product details and availability vary by market."
      ] })
    ] })
  ] });
}
function render() {
  return renderToString(/* @__PURE__ */ jsx(AppPublic, {}));
}
export {
  render
};

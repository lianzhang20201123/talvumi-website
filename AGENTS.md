# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## TALVUMI durable decisions

- Wholesale-first, retail-secondary. The primary conversion is distributor qualification.
- Master brand direction: sculptural open-circle TV monogram plus ingredient-orbit packaging.
- Visual system must be high-impact at six metres and legible at 48px; do not revert to conservative clinical or generic black-gold pet-food styling.
- Current commercial launch candidates are manufacturer-backed concepts only: adult cat ocean-fish recipe with freeze-dried pieces (1.5kg/10kg), adult dog beef recipe with freeze-dried pieces (1.5kg/10kg), and kitten ocean-fish recipe (1.5kg/8kg).
- Never publish unverified nutrition values, certifications, formula percentages, prices, inventory, retailer availability, medical claims, or complete-and-balanced claims.
- Do not show Buy Now until market-specific legal, inventory, pricing, payment, shipping, returns, importer, and customer-support gates are complete.
- Independent single-ingredient freeze-dried treats remain a future concept, not a currently verified launch SKU.
- The website must identify as a pet-food brand at first glance through original cat, dog and visible-food imagery; retain the high-impact sculptural brand system and distributor-first tone.
- Never publish legacy concept images that show unverified "BATCH VERIFIED" language, incorrect recipes or pack sizes, or independent freeze-dried treats as current launch products.
- Until market gates pass, the commerce experience is a Product Shortlist: wholesale RFQ plus retail early access. It must state that no payment, price, inventory or delivery commitment is created.
- Internal planning SKUs may be published as stable identifiers; GTIN/EAN/UPC, case pack, MOQ and commercial price remain null until written confirmation.
- Packaging dimensions, laminate stacks and case packs shown on the website are RFQ starting points only. Final specifications require factory filling-line compatibility, real-product density, barrier, seal, shelf-life and transit testing.
- Packaging visual direction is the previously selected "C" route: high-impact colour and oversized typography combined with a prominent transparent food window so kibble/freeze-dried pieces remain visible in shelf, thumbnail and livestream views. Any window must stay a concept until real product appearance, barrier loss, light oxidation, seal, drop and transit performance are validated.

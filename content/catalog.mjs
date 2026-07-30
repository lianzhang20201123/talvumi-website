export const commerceConfig = {
  mode: "interest_only",
  privacyVersion: "2026-07-30",
  paymentEnabled: false,
  publicPriceEnabled: false,
  checkoutEnabled: false,
  launchMarkets: [],
};

export const catalog = [
  {
    id: "cat-ocean-fish",
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
      { id: "cat-ocean-fish-10000g", planningSku: "TVM-CA-AOF-10000", netWeightG: 10000, displaySize: "10 kg", gtin: null, casePack: null, priceStatus: "request_quote" },
    ],
  },
  {
    id: "dog-beef",
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
      { id: "dog-beef-1500g", planningSku: "TVM-DA-BEF-1500", netWeightG: 1500, displaySize: "1.5 kg", gtin: null, casePack: null, priceStatus: "request_quote" },
      { id: "dog-beef-10000g", planningSku: "TVM-DA-BEF-10000", netWeightG: 10000, displaySize: "10 kg", gtin: null, casePack: null, priceStatus: "request_quote" },
    ],
  },
  {
    id: "kitten-ocean-fish",
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
      { id: "kitten-ocean-fish-1500g", planningSku: "TVM-CK-KOF-1500", netWeightG: 1500, displaySize: "1.5 kg", gtin: null, casePack: null, priceStatus: "request_quote" },
      { id: "kitten-ocean-fish-8000g", planningSku: "TVM-CK-KOF-8000", netWeightG: 8000, displaySize: "8 kg", gtin: null, casePack: null, priceStatus: "request_quote" },
    ],
  },
];

export const variantIndex = new Map(
  catalog.flatMap((product) =>
    product.variants.map((variant) => [
      variant.id,
      {
        ...variant,
        productId: product.id,
        productName: product.name,
        productType: product.type,
      },
    ]),
  ),
);

export function getVariant(variantId) {
  return variantIndex.get(variantId) || null;
}


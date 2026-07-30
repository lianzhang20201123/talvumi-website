import assert from "node:assert/strict";
import test from "node:test";
import earlyAccess from "../api/early-access.js";
import quoteRequest from "../api/quote-requests.js";
import { catalog, getVariant } from "../content/catalog.mjs";

function responseRecorder() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    },
  };
}

test("catalog exposes six unique planning variants without public prices", () => {
  const variants = catalog.flatMap((product) => product.variants);
  assert.equal(variants.length, 6);
  assert.equal(new Set(variants.map((variant) => variant.id)).size, 6);
  assert.equal(new Set(variants.map((variant) => variant.planningSku)).size, 6);
  assert.ok(variants.every((variant) => variant.priceStatus === "request_quote"));
  assert.ok(variants.every((variant) => variant.gtin === null && variant.casePack === null));
});

test("early access rejects unknown variants", async () => {
  const response = responseRecorder();
  await earlyAccess({
    method: "POST",
    body: { email: "buyer@example.com", country: "Singapore", variantIds: ["not-a-product"], consent: true },
  }, response);
  assert.equal(response.statusCode, 400);
});

test("early access never claims storage when its CRM is disconnected", async () => {
  delete process.env.EARLY_ACCESS_WEBHOOK_URL;
  const response = responseRecorder();
  await earlyAccess({
    method: "POST",
    body: { email: "buyer@example.com", country: "Singapore", variantIds: ["cat-ocean-fish-1500g"], consent: true },
  }, response);
  assert.equal(response.statusCode, 503);
  assert.equal(response.body.ok, false);
});

test("trade quotes whitelist products and ignore client-side price fields", async () => {
  delete process.env.QUOTE_WEBHOOK_URL;
  const response = responseRecorder();
  await quoteRequest({
    method: "POST",
    body: {
      company: "Example Distribution",
      email: "trade@example.com",
      country: "Singapore",
      partnerType: "Importer",
      lines: [{ variantId: "dog-beef-10000g", requestedQty: 5, unit: "pallets", price: 1 }],
      consent: true,
    },
  }, response);
  assert.equal(response.statusCode, 503);
  assert.ok(getVariant("dog-beef-10000g"));
});


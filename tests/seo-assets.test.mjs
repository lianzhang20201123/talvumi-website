import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const client = path.join(root, "dist", "client");

test("sitemap URLs resolve to generated files", async () => {
  const sitemap = await readFile(path.join(client, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>https:\/\/talvumi\.com(.*?)<\/loc>/g)].map((match) => match[1] || "/");
  assert.ok(urls.length >= 10);
  for (const url of urls) {
    const relative = url === "/" ? "index.html" : path.join(url.replace(/^\/|\/$/g, ""), "index.html");
    await access(path.join(client, relative));
  }
});

test("generated HTML has valid JSON-LD, one canonical and real social images", async () => {
  const samples = [
    "index.html",
    "products/adult-cat-ocean-fish/index.html",
    "distributors/index.html",
    "resources/index.html",
    "privacy/index.html",
    "insights/pet-food-distributor-evaluation-checklist/index.html",
    "insights/complete-and-balanced-pet-food-label-questions/index.html",
  ];
  for (const relative of samples) {
    const html = await readFile(path.join(client, relative), "utf8");
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1, relative);
    assert.ok(!html.includes("/assets/hero.png"), relative);
    assert.ok(!html.includes("UPDATED DAILY"), relative);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      assert.doesNotThrow(() => JSON.parse(match[1]), relative);
    }
  }
  await access(path.join(client, "assets/brand/talvumi-cat-dog-pet-food-brand-hero.webp"));
  await access(path.join(client, "downloads/talvumi-buyer-due-diligence-checklist.csv"));
  await access(path.join(client, "downloads/talvumi-product-specification-request.csv"));
  await access(path.join(client, "downloads/talvumi-market-launch-gates.csv"));
});

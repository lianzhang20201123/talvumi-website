#!/usr/bin/env node
import { appendFileSync } from "node:fs";
import { insights } from "../content/insights.mjs";

const DAY_MS = 24 * 60 * 60 * 1000;
const now = new Date();
const dated = insights.map((article) => ({
  ...article,
  updatedAt: new Date(`${article.updated}T00:00:00Z`),
}));

const invalidDates = dated.filter((article) => Number.isNaN(article.updatedAt.getTime()));
if (invalidDates.length) {
  throw new Error(`Invalid insight update dates: ${invalidDates.map((article) => article.slug).join(", ")}`);
}

const latest = dated.sort((a, b) => b.updatedAt - a.updatedAt)[0];
const ageDays = Math.floor((now - latest.updatedAt) / DAY_MS);
const sourceBacked = insights.filter((article) => article.sources?.length);
const unsafeSources = sourceBacked.flatMap((article) =>
  article.sources
    .filter((source) => !/^https:\/\//.test(source.url))
    .map((source) => `${article.slug}: ${source.url}`),
);

if (unsafeSources.length) {
  throw new Error(`Insight sources must use HTTPS:\n${unsafeSources.join("\n")}`);
}

const summary = [
  "# TALVUMI content freshness",
  "",
  `- Articles: ${insights.length}`,
  `- Source-backed articles: ${sourceBacked.length}`,
  `- Latest reviewed article: ${latest.updated}`,
  `- Age at workflow run: ${ageDays} day(s)`,
  "- Policy: scheduled automation checks freshness and evidence hygiene; it does not fabricate or auto-publish product claims.",
  "",
].join("\n");

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary, "utf8");
}

if (ageDays > 14) {
  throw new Error(`Editorial review required: newest reviewed article is ${ageDays} days old.`);
}

console.log(summary);

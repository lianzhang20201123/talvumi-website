import { scheduledInsights } from "../content/scheduled-insights.mjs";

const requiredCount = 30;
const slugs = new Set(scheduledInsights.map((item) => item.slug));
const dates = new Set(scheduledInsights.map((item) => item.date));
const failures = [];

if (scheduledInsights.length !== requiredCount) failures.push(`Expected ${requiredCount} scheduled articles, found ${scheduledInsights.length}.`);
if (slugs.size !== requiredCount) failures.push("Scheduled article slugs must be unique.");
if (dates.size !== requiredCount) failures.push("Scheduled release dates must be unique.");
for (const item of scheduledInsights) {
  if (!item.sources?.length) failures.push(`${item.slug}: missing sources.`);
  if (item.sections?.length < 3) failures.push(`${item.slug}: needs at least three answer-first sections.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) failures.push(`${item.slug}: invalid date.`);
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Editorial calendar OK: ${requiredCount} unique, source-backed daily releases.`);

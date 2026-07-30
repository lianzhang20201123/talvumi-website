const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL = /^https?:\/\/[^\s.]+\.[^\s]+$/i;

export function clean(value, max = 240) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, max);
}

export function isHoneypotTriggered(body) {
  return clean(body?.companyFax, 40).length > 0;
}

export function validateEmail(value) {
  return EMAIL.test(clean(value, 160));
}

export function validateWebsite(value) {
  const website = clean(value, 240);
  return !website || URL.test(website);
}

export function scoreTradeLead(payload) {
  let score = 0;
  if (["Active licence", "Active"].includes(payload.importStatus || payload.importLicence)) score += 25;
  if (["Importer", "National distributor", "Retail chain"].includes(payload.partnerType)) score += 20;
  if (["6–20 pallets", "20+ pallets"].includes(payload.openingOrderBand)) score += 20;
  if (["Within 3 months", "3–6 months"].includes(payload.launchWindow)) score += 15;
  if (payload.website) score += 10;
  if (payload.phone) score += 5;
  if (payload.notes || payload.launchPlan) score += 5;
  return Math.min(score, 100);
}

export function normalizePartner(body) {
  const payload = {
    company: clean(body.company, 120),
    contactName: clean(body.contactName, 120),
    country: clean(body.country, 80),
    email: clean(body.email, 160).toLowerCase(),
    partnerType: clean(body.partnerType, 80),
    retailAccounts: clean(body.retailAccounts, 40),
    importLicence: clean(body.importLicence, 80),
    launchWindow: clean(body.launchWindow, 80),
    openingOrderBand: clean(body.openingOrderBand, 80),
    website: clean(body.website, 240),
    launchPlan: clean(body.launchPlan, 1600),
    consent: body.consent === true || body.consent === "on",
  };
  const missing = ["company", "contactName", "country", "email", "partnerType", "retailAccounts", "importLicence", "launchWindow", "openingOrderBand", "launchPlan"].filter((key) => !payload[key]);
  if (missing.length) return { ok: false, message: `Missing required fields: ${missing.join(", ")}` };
  if (!validateEmail(payload.email)) return { ok: false, message: "Enter a valid work email." };
  if (!validateWebsite(payload.website)) return { ok: false, message: "Company website must start with http:// or https://." };
  if (!payload.consent) return { ok: false, message: "Consent is required." };
  payload.leadScore = scoreTradeLead(payload);
  return { ok: true, payload };
}

export function normalizeQuote(body, getVariant) {
  const payload = {
    company: clean(body.company, 120),
    contactName: clean(body.contactName, 120),
    email: clean(body.email, 160).toLowerCase(),
    country: clean(body.country, 80),
    partnerType: clean(body.partnerType, 80),
    importStatus: clean(body.importStatus, 80),
    launchWindow: clean(body.launchWindow, 80),
    openingOrderBand: clean(body.openingOrderBand, 80),
    website: clean(body.website, 240),
    phone: clean(body.phone, 80),
    incotermPreference: clean(body.incotermPreference, 80),
    notes: clean(body.notes, 1600),
    privacyVersion: clean(body.privacyVersion, 32),
    source: clean(body.source, 80),
    consent: body.consent === true,
    lines: Array.isArray(body.lines)
      ? body.lines.slice(0, 12).map((line) => ({
          variantId: clean(line.variantId, 80),
          requestedQty: Math.max(1, Math.min(99999, Number.parseInt(line.requestedQty, 10) || 1)),
          unit: ["bags", "cases", "pallets"].includes(line.unit) ? line.unit : "bags",
        })).filter((line) => getVariant(line.variantId))
      : [],
  };
  const missing = ["company", "contactName", "email", "country", "partnerType", "importStatus", "launchWindow", "openingOrderBand"].filter((key) => !payload[key]);
  if (missing.length || !payload.lines.length) return { ok: false, message: "Complete the buyer profile and add at least one valid product." };
  if (!validateEmail(payload.email)) return { ok: false, message: "Enter a valid work email." };
  if (!validateWebsite(payload.website)) return { ok: false, message: "Company website must start with http:// or https://." };
  if (!payload.consent) return { ok: false, message: "Consent is required." };
  payload.leadScore = scoreTradeLead(payload);
  return { ok: true, payload };
}

export function requestContext(headers = {}) {
  const get = (name) => typeof headers.get === "function" ? headers.get(name) : headers[name] || headers[name.toLowerCase()];
  return {
    userAgent: clean(get?.("user-agent"), 320),
    referrer: clean(get?.("referer"), 500),
    utmSource: clean(get?.("x-talvumi-utm-source"), 120),
  };
}

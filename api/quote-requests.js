import { getVariant } from "../content/catalog.mjs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, max = 240) {
  return String(value || "").trim().slice(0, max);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false, message: "Method not allowed." });
  }

  const body = request.body || {};
  const company = clean(body.company, 120);
  const email = clean(body.email, 160);
  const country = clean(body.country, 80);
  const partnerType = clean(body.partnerType, 80);
  const lines = Array.isArray(body.lines)
    ? body.lines.slice(0, 12).map((line) => ({
        variantId: clean(line.variantId, 80),
        requestedQty: Math.max(1, Math.min(99999, Number.parseInt(line.requestedQty, 10) || 1)),
        unit: ["bags", "cases", "pallets"].includes(line.unit) ? line.unit : "bags",
      })).filter((line) => getVariant(line.variantId))
    : [];

  if (!company || !EMAIL.test(email) || !country || !partnerType || !lines.length || body.consent !== true) {
    return response.status(400).json({ ok: false, message: "Company, work email, country, partner type, valid product lines and consent are required." });
  }

  const webhookUrl = process.env.QUOTE_WEBHOOK_URL;
  if (!webhookUrl) {
    return response.status(503).json({ ok: false, message: "Trade quote intake is awaiting the brand owner's CRM connection." });
  }

  const reference = `RFQ-${Date.now().toString(36).toUpperCase()}`;
  const payload = {
    reference,
    type: "trade_quote_request",
    company,
    email,
    country,
    partnerType,
    importStatus: clean(body.importStatus, 80),
    incotermPreference: clean(body.incotermPreference, 80),
    notes: clean(body.notes, 1200),
    lines,
    privacyVersion: clean(body.privacyVersion, 32),
    source: clean(body.source, 80),
    submittedAt: new Date().toISOString(),
  };

  const upstream = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.QUOTE_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.QUOTE_WEBHOOK_TOKEN}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!upstream.ok) {
    return response.status(502).json({ ok: false, message: "Trade quote intake is temporarily unavailable. No confirmation was created." });
  }

  return response.status(201).json({ ok: true, reference });
}


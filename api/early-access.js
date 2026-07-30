import { getVariant } from "../content/catalog.mjs";
import { isHoneypotTriggered, requestContext } from "../lib/intake-validation.mjs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, max = 160) {
  return String(value || "").trim().slice(0, max);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false, message: "Method not allowed." });
  }

  const body = request.body || {};
  if (isHoneypotTriggered(body)) return response.status(202).json({ ok: true });
  const email = clean(body.email);
  const country = clean(body.country, 80);
  const variantIds = Array.isArray(body.variantIds) ? [...new Set(body.variantIds.map((value) => clean(value, 80)))] : [];
  const validVariants = variantIds.filter((id) => getVariant(id));

  if (!EMAIL.test(email) || !country || !validVariants.length || body.consent !== true) {
    return response.status(400).json({ ok: false, message: "Email, country, at least one valid product and consent are required." });
  }

  const webhookUrl = process.env.EARLY_ACCESS_WEBHOOK_URL;
  if (!webhookUrl) {
    return response.status(503).json({ ok: false, message: "Retail early access is awaiting the brand owner's CRM connection." });
  }

  const reference = `EA-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
  const payload = {
    reference,
    type: "retail_early_access",
    email,
    country,
    variantIds: validVariants,
    privacyVersion: clean(body.privacyVersion, 32),
    source: clean(body.source, 80),
    requestContext: requestContext(request.headers || {}),
    submittedAt: new Date().toISOString(),
  };

  let upstream;
  try {
    upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.EARLY_ACCESS_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.EARLY_ACCESS_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return response.status(502).json({ ok: false, message: "Early-access intake did not respond. No confirmation was created." });
  }

  if (!upstream.ok) {
    return response.status(502).json({ ok: false, message: "Early-access intake is temporarily unavailable. No confirmation was created." });
  }

  return response.status(201).json({ ok: true, reference });
}

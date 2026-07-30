import { getVariant } from "../content/catalog.mjs";
import { clean, isHoneypotTriggered, normalizePartner, normalizeQuote, requestContext, validateEmail } from "../lib/intake-validation.mjs";

async function forward(env, key, payload, tokenKey) {
  const webhookUrl = env[key];
  if (!webhookUrl) return { ok: false, status: 503, message: "Commercial intake is awaiting the brand owner's CRM connection." };
  let upstream;
  try {
    upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(env[tokenKey] ? { authorization: `Bearer ${env[tokenKey]}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return { ok: false, status: 502, message: "The commercial intake service did not respond. No confirmation was created." };
  }
  if (!upstream.ok) return { ok: false, status: 502, message: "The commercial intake service is temporarily unavailable." };
  return { ok: true };
}

async function handlePartner(request, env, body) {
  const normalized = normalizePartner(body);
  if (!normalized.ok) return Response.json({ ok: false, message: normalized.message }, { status: 400 });
  const reference = `TLV-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
  const delivered = await forward(env, "PARTNER_WEBHOOK_URL", {
    ...normalized.payload,
    reference,
    type: "partner_application",
    source: "talvumi-site",
    requestContext: requestContext(request.headers),
    submittedAt: new Date().toISOString(),
  }, "PARTNER_WEBHOOK_TOKEN");
  if (!delivered.ok) return Response.json({ ok: false, message: delivered.message }, { status: delivered.status });
  return Response.json({ ok: true, reference }, { status: 201 });
}

async function handleQuote(request, env, body) {
  const normalized = normalizeQuote(body, getVariant);
  if (!normalized.ok) return Response.json({ ok: false, message: normalized.message }, { status: 400 });
  const reference = `RFQ-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
  const delivered = await forward(env, "QUOTE_WEBHOOK_URL", {
    ...normalized.payload,
    reference,
    type: "trade_quote_request",
    requestContext: requestContext(request.headers),
    submittedAt: new Date().toISOString(),
  }, "QUOTE_WEBHOOK_TOKEN");
  if (!delivered.ok) return Response.json({ ok: false, message: delivered.message }, { status: delivered.status });
  return Response.json({ ok: true, reference }, { status: 201 });
}

async function handleEarlyAccess(request, env, body) {
  const email = clean(body.email, 160).toLowerCase();
  const country = clean(body.country, 80);
  const variantIds = Array.isArray(body.variantIds) ? [...new Set(body.variantIds.map((value) => clean(value, 80)))].filter((id) => getVariant(id)) : [];
  if (!validateEmail(email) || !country || !variantIds.length || body.consent !== true) {
    return Response.json({ ok: false, message: "Email, country, at least one valid product and consent are required." }, { status: 400 });
  }
  const reference = `EA-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
  const delivered = await forward(env, "EARLY_ACCESS_WEBHOOK_URL", {
    reference,
    type: "retail_early_access",
    email,
    country,
    variantIds,
    privacyVersion: clean(body.privacyVersion, 32),
    source: clean(body.source, 80),
    requestContext: requestContext(request.headers),
    submittedAt: new Date().toISOString(),
  }, "EARLY_ACCESS_WEBHOOK_TOKEN");
  if (!delivered.ok) return Response.json({ ok: false, message: delivered.message }, { status: delivered.status });
  return Response.json({ ok: true, reference }, { status: 201 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const intakeHandlers = {
      "/api/partner-applications": handlePartner,
      "/api/quote-requests": handleQuote,
      "/api/early-access": handleEarlyAccess,
    };

    if (url.pathname in intakeHandlers) {
      if (request.method !== "POST") return Response.json({ ok: false, message: "Method not allowed." }, { status: 405, headers: { Allow: "POST" } });
      if (Number(request.headers.get("content-length") || 0) > 32000) return Response.json({ ok: false, message: "Request payload is too large." }, { status: 413 });
      let body;
      try {
        body = await request.json();
      } catch {
        return Response.json({ ok: false, message: "Invalid request payload." }, { status: 400 });
      }
      if (isHoneypotTriggered(body)) return Response.json({ ok: true }, { status: 202 });
      return intakeHandlers[url.pathname](request, env, body);
    }

    return env.ASSETS.fetch(request);
  },
};

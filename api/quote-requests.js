import { getVariant } from "../content/catalog.mjs";
import { isHoneypotTriggered, normalizeQuote, requestContext } from "../lib/intake-validation.mjs";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false, message: "Method not allowed." });
  }

  const body = request.body || {};
  if (isHoneypotTriggered(body)) return response.status(202).json({ ok: true });
  const normalized = normalizeQuote(body, getVariant);
  if (!normalized.ok) return response.status(400).json({ ok: false, message: normalized.message });

  const webhookUrl = process.env.QUOTE_WEBHOOK_URL;
  if (!webhookUrl) {
    return response.status(503).json({ ok: false, message: "Trade quote intake is awaiting the brand owner's CRM connection." });
  }

  const reference = `RFQ-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
  const payload = {
    ...normalized.payload,
    reference,
    type: "trade_quote_request",
    requestContext: requestContext(request.headers || {}),
    submittedAt: new Date().toISOString(),
  };

  let upstream;
  try {
    upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.QUOTE_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.QUOTE_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return response.status(502).json({ ok: false, message: "Trade quote intake did not respond. No confirmation was created." });
  }

  if (!upstream.ok) {
    return response.status(502).json({ ok: false, message: "Trade quote intake is temporarily unavailable. No confirmation was created." });
  }

  return response.status(201).json({ ok: true, reference });
}

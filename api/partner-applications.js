import { isHoneypotTriggered, normalizePartner, requestContext } from "../lib/intake-validation.mjs";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Method not allowed." });
  }

  let payload;
  try {
    payload = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
  } catch {
    return response.status(400).json({ message: "Invalid application payload." });
  }

  if (isHoneypotTriggered(payload)) return response.status(202).json({ ok: true });
  const normalized = normalizePartner(payload || {});
  if (!normalized.ok) return response.status(400).json({ ok: false, message: normalized.message });

  if (!process.env.PARTNER_WEBHOOK_URL) {
    return response.status(503).json({ message: "Partner intake is awaiting the brand owner's CRM connection." });
  }

  const reference = `TLV-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
  let upstream;
  try {
    upstream = await fetch(process.env.PARTNER_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.PARTNER_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.PARTNER_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify({ ...normalized.payload, reference, source: "talvumi-site", requestContext: requestContext(request.headers || {}), submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return response.status(502).json({ ok: false, message: "The commercial intake service did not respond. No confirmation was created." });
  }

  if (!upstream.ok) {
    return response.status(502).json({ message: "The commercial intake service is temporarily unavailable." });
  }

  return response.status(200).json({ ok: true, reference });
}

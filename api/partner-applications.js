const requiredFields = ["company", "country", "email", "partnerType", "retailAccounts", "importLicence", "launchPlan", "consent"];

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

  const missing = requiredFields.filter((key) => !String(payload?.[key] || "").trim());
  if (missing.length) {
    return response.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
  }

  if (!process.env.PARTNER_WEBHOOK_URL) {
    return response.status(503).json({ message: "Partner intake is awaiting the brand owner's CRM connection." });
  }

  const reference = `TLV-${Date.now().toString(36).toUpperCase()}`;
  const upstream = await fetch(process.env.PARTNER_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.PARTNER_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.PARTNER_WEBHOOK_TOKEN}` } : {}),
    },
    body: JSON.stringify({ ...payload, reference, source: "talvumi-site" }),
  });

  if (!upstream.ok) {
    return response.status(502).json({ message: "The commercial intake service is temporarily unavailable." });
  }

  return response.status(200).json({ ok: true, reference });
}

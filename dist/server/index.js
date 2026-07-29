export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/partner-applications" && request.method === "POST") {
      let payload;
      try {
        payload = await request.json();
      } catch {
        return Response.json({ message: "Invalid application payload." }, { status: 400 });
      }

      const required = ["company", "country", "email", "partnerType", "retailAccounts", "importLicence", "launchPlan", "consent"];
      const missing = required.filter((key) => !String(payload[key] || "").trim());
      if (missing.length) {
        return Response.json({ message: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
      }

      if (!env.PARTNER_WEBHOOK_URL) {
        return Response.json(
          { message: "Partner intake is awaiting the brand owner's CRM connection." },
          { status: 503 },
        );
      }

      const reference = `TLV-${Date.now().toString(36).toUpperCase()}`;
      const upstream = await fetch(env.PARTNER_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(env.PARTNER_WEBHOOK_TOKEN ? { authorization: `Bearer ${env.PARTNER_WEBHOOK_TOKEN}` } : {}),
        },
        body: JSON.stringify({ ...payload, reference, source: "talvumi-site" }),
      });

      if (!upstream.ok) {
        return Response.json({ message: "The commercial intake service is temporarily unavailable." }, { status: 502 });
      }

      return Response.json({ ok: true, reference });
    }

    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};

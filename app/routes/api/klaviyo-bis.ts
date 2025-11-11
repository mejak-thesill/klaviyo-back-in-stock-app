// app/routes/api/klaviyo-bis.ts
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

const EXTERNAL_URL =
  "https://yhzyjwu742.execute-api.us-east-1.amazonaws.com/default/klaviyo_bis_product";

export const action = async ({ request }: ActionArgs) => {
  try {
    // Preserve body as JSON
    const body = await request.json();

    // Basic validation (avoid forwarding garbage)
    if (!body?.email || !body?.product_id) {
      return json({ error: "Missing email or product_id" }, { status: 400 });
    }

    // Forward to the external API from server-side
    const resp = await fetch(EXTERNAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If the external API expects auth, add it here (server-side-only).
        // "Authorization": `Bearer ${process.env.KLAVIYO_SECRET}`
      },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    // Try to forward the content-type back
    const contentType = resp.headers.get("content-type") ?? "text/plain";

    return new Response(text, {
      status: resp.status,
      headers: { "Content-Type": contentType },
    });
  } catch (err: any) {
    console.error("Proxy error:", err);
    return json({ error: "Server error" }, { status: 500 });
  }
};

// app/routes/api/klaviyo-bis.ts
import { json } from "@remix-run/node";

// External Klaviyo API URL
const EXTERNAL_URL =
  "https://yhzyjwu742.execute-api.us-east-1.amazonaws.com/default/klaviyo_bis_product";

// Replace with your Shopify store domain
const ALLOWED_ORIGIN = "https://www.thesill.com";

// Loader handles preflight OPTIONS requests
export const loader = async ({ request }: { request: Request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  return json({ message: "Method not allowed" }, { status: 405 });
};

// Action handles POST requests
export const action = async ({ request }: { request: Request }) => {
  try {
    const body = await request.json();

    if (!body?.email || !body?.product_id) {
      return json(
        { error: "Missing email or product_id" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
          },
        }
      );
    }

    // Forward request to Klaviyo
    const resp = await fetch(EXTERNAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${process.env.KLAVIYO_SECRET}` // optional
      },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    const contentType = resp.headers.get("content-type") ?? "text/plain";

    return new Response(text, {
      status: resp.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  } catch (err: any) {
    console.error("Proxy error:", err);
    return json(
      { error: "Server error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
      }
    );
  }
};

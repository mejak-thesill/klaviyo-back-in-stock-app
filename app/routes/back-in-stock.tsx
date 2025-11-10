import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import crypto from "crypto";
import fetch from "node-fetch";

const SHOPIFY_SHARED_SECRET = process.env.SHOPIFY_SHARED_SECRET || '';

/**
 * Verify Shopify HMAC
 * @param queryParams The query string parameters as an object
 * @returns boolean
 */
function verifyShopifyHmac(queryParams: Record<string, string>) {
  const { hmac, ...rest } = queryParams;

  // Build message string by sorting params alphabetically
  const message = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join("&");

  // Create hash
  const generatedHmac = crypto
    .createHmac("sha256", SHOPIFY_SHARED_SECRET)
    .update(message)
    .digest("hex");

  // Compare
  return crypto.timingSafeEqual(Buffer.from(generatedHmac, "utf-8"), Buffer.from(hmac || "", "utf-8"));
}

export const action: ActionFunction = async ({ request }) => {
  try {
    // Optional: Check HMAC query if submitted via GET parameters (for extra security)
    const url = new URL(request.url);
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => (queryParams[key] = value));

    if (Object.keys(queryParams).length > 0 && !verifyShopifyHmac(queryParams)) {
      return json({ error: "Unauthorized request (invalid HMAC)" }, { status: 403 });
    }

    const body = await request.json();
    const { email, product_id, action: act, product_url } = body;

    if (!email || !product_id) {
      return json({ error: "Missing email or product_id" }, { status: 400 });
    }

    // Forward to AWS Lambda
    const lambdaResponse = await fetch(
      "https://yhzyjwu742.execute-api.us-east-1.amazonaws.com/default/klaviyo_bis_product",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          product_id,
          action: act || "signup",
          product_url,
        }),
      }
    );

    const data = await lambdaResponse.text();

    return new Response(data, { status: lambdaResponse.status });
  } catch (err) {
    console.error("Error submitting Back in Stock signup:", err);
    return json({ error: "Server error submitting Back in Stock signup" }, { status: 500 });
  }
};

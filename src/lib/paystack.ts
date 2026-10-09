import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const API = "https://api.paystack.co";
const secret = () => process.env.PAYSTACK_SECRET_KEY || "";

export const paystackEnabled = () => secret().length > 0;

type InitInput = {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
};

/** Server-side only: the secret key never reaches the browser. */
export async function initializeTransaction(input: InitInput): Promise<{ authorizationUrl: string } | { error: string }> {
  try {
    const res = await fetch(`${API}/transaction/initialize`, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: input.email,
        amount: input.amountKobo,
        currency: "NGN",
        reference: input.reference,
        callback_url: input.callbackUrl,
        channels: ["card", "bank", "ussd", "bank_transfer"],
        metadata: input.metadata,
      }),
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || !json.status) return { error: json.message || "Could not start payment." };
    return { authorizationUrl: json.data.authorization_url as string };
  } catch {
    return { error: "Could not reach the payment provider." };
  }
}

export type VerifiedTransaction = {
  status: string;
  reference: string;
  amount: number;
  channel: string;
  paidAt: string | null;
  metadata: Record<string, unknown> | null;
};

export async function verifyTransaction(reference: string): Promise<VerifiedTransaction | null> {
  if (!paystackEnabled()) return null;
  try {
    const res = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret()}` },
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || !json.status) return null;
    const d = json.data;
    return {
      status: d.status,
      reference: d.reference,
      amount: d.amount,
      channel: d.channel,
      paidAt: d.paid_at ?? d.paidAt ?? null,
      metadata: typeof d.metadata === "string" ? safeJson(d.metadata) : d.metadata,
    };
  } catch {
    return null;
  }
}

/** Paystack signs webhook bodies with HMAC-SHA512 of the secret key. */
export function validWebhookSignature(rawBody: string, signature: string | null) {
  if (!signature || !paystackEnabled()) return false;
  const expected = createHmac("sha512", secret()).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

function safeJson(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

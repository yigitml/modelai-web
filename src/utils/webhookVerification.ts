import crypto from "crypto";

export function verifyWebhookSignature(
  payload: string,
  signature: string | null,
): boolean {
  if (!signature) return false;

  const secret = process.env.REPLICATE_WEBHOOK_SECRET;
  if (!secret) throw new Error("REPLICATE_WEBHOOK_SECRET is not set");

  const hmac = crypto.createHmac("sha256", secret);
  const expectedSignature = hmac.update(payload).digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

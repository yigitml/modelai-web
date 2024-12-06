import crypto from "crypto";

export function verifyWebhookSignature(
  payload: string,
  signature: string | null,
): boolean {
  if (!signature) {
    console.warn("Missing webhook signature");
    return false;
  }

  const secret = process.env.REPLICATE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("REPLICATE_WEBHOOK_SECRET is not set");
    return false;
  }

  try {
    const hmac = crypto.createHmac("sha256", secret);
    const expectedSignature = hmac.update(payload).digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

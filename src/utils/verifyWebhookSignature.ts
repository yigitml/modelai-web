import crypto from "crypto";

export function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  webhookId: string | null,
  webhookTimestamp: string | null
): boolean {
  // TODO: Fix this
  if (!signature || !webhookId || !webhookTimestamp) {
    console.warn("Missing required webhook headers");
    return false;
  }

  const secret = process.env.REPLICATE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("REPLICATE_WEBHOOK_SECRET is not set");
    return false;
  }

  try {
    const signedContent = `${webhookId}.${webhookTimestamp}.${payload}`;

    const secretKey = secret.startsWith("whsec_") ? secret.substring(6) : secret;
    
    const hmac = crypto.createHmac("sha256", secretKey);
    
    const computedSignature = hmac.update(signedContent).digest("base64");

    const actualSignature = signature.startsWith("v1,") ? signature.substring(3) : signature;

    return computedSignature === actualSignature;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}
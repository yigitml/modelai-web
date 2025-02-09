import { NextRequest, NextResponse } from "next/server";

const ALLOWED_IPS = process.env.REPLICATE_WEBHOOK_IPS?.split(",")!;

export const ipWhitelist = (handler: (req: NextRequest) => Promise<NextResponse>) => {
  return async (request: NextRequest) => {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!ALLOWED_IPS.includes(ip)) {
      return NextResponse.json({ error: "Unauthorized IP" }, );
    }
    return handler(request);
  };
};
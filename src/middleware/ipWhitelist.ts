import { NextResponse } from "next/server";

const ALLOWED_IPS = process.env.ALLOWED_WEBHOOK_IPS?.split(",") || [];

export function ipWhitelist(handler: (req: Request) => Promise<NextResponse>) {
  return async (req: Request) => {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!ALLOWED_IPS.includes(ip)) {
      return NextResponse.json({ error: "Unauthorized IP" }, { status: 403 });
    }
    return handler(req);
  };
}

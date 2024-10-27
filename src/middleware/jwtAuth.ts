import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export function jwtAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        isMobile?: boolean;
        deviceId?: string;
      };

      // Add mobile-specific validation if needed
      if (decoded.isMobile && !decoded.deviceId) {
        throw new Error("Invalid mobile token");
      }

      return handler(req);
    } catch (error) {
      console.error("Token verification error:", error);
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}

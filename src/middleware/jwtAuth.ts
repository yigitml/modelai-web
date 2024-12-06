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
        email: string;
        isMobile?: boolean;
        deviceId?: string;
      };

      const requestWithUser = new Request(req.url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      }) as NextRequest;

      Object.defineProperties(requestWithUser, {
        user: {
          value: {
            id: decoded.userId,
            email: decoded.email,
            isMobile: decoded.isMobile,
            deviceId: decoded.deviceId,
          },
          writable: false,
          configurable: false,
        },
      });

      return handler(requestWithUser);
    } catch (error) {
      console.error("Token verification error:", error);
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}

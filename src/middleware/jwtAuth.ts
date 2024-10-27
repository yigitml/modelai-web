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
      const decoded = verify(token, process.env.JWT_SECRET!);
      // You can add the decoded user info to the request here if needed
      console.log("decoded", decoded);
      return handler(req);
    } catch (error) {
      console.error("error", error);
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}

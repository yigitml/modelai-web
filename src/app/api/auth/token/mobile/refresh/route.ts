import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jwtAuth } from "@/middleware/jwtAuth";

export const POST = jwtAuth(async (request: NextRequest) => {
  try {
    // Get the current token from the authorization header
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Verify and decode the current token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      deviceId: string;
      isMobile: boolean;
    };

    // Generate new token with the same claims
    const expiresIn = "30d";
    const expiresAt = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        deviceId: decoded.deviceId,
        isMobile: true,
      },
      process.env.JWT_SECRET!,
      { expiresIn },
    );

    return NextResponse.json({
      token: newToken,
      expiresAt,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 401 },
    );
  }
});

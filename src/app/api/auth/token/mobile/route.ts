import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/*
interface MobileAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
  };
}
*/

// 1. Mobile app initiates Google Sign-In using native SDK
// 2. Receives Google ID token
// 3. Sends to your backend endpoint

// New endpoint for mobile authentication
export async function POST(request: NextRequest) {
  try {
    const { idToken, deviceId } = await request.json();

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Find or create user (similar to your existing logic)
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email!,
          name: payload.name,
          googleId: payload.sub,
          image: payload.picture,
        },
      });
    }

    // Generate JWT with additional mobile-specific claims
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        deviceId,
        isMobile: true,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }, // Longer expiration for mobile
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.image,
      },
    });
  } catch (error) {
    console.error("Mobile auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}

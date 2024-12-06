import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    const expiresIn = "30d";
    const expiresAt = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // Unix timestamp
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        deviceId,
        isMobile: true,
      },
      process.env.JWT_SECRET!,
      { expiresIn }, // Using the variable
    );

    return NextResponse.json({
      token,
      expiresAt, // Unix timestamp of expiration
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

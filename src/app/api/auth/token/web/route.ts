import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { idToken } = body;

    if (!idToken) {
      console.error("Missing ID token in request body");
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Find or create user in your database
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

    const expiresIn = "1d";
    const expiresAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // Unix timestamp for 1 day

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn },
    );

    return NextResponse.json({
      token,
      expiresIn,
      expiresAt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.image,
      },
    });
  } catch (error) {
    console.error("Error in token generation:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}

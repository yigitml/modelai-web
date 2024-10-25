import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (id) {
      const user = await prisma.user.findUnique({
        where: { id: id },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user);
    } else if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return NextResponse.json(user);
    } else {
      /*
      return NextResponse.json(
        { error: "Missing user id or email" },
        { status: 400 },
      );
      */
      const users = await prisma.user.findMany();
      return NextResponse.json(users);
    }
  } catch (error) {
    console.error("Error fetching user(s):", error);
    return NextResponse.json(
      { error: "Failed to fetch user(s)" },
      { status: 500 },
    );
  }
}

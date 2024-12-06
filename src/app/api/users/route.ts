import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtAuth } from "@/middleware/jwtAuth";

export const GET = jwtAuth(async (request: NextRequest) => {
  let authenticatedUserId;
  try {
    authenticatedUserId = request.user?.id;
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 },
    );
  }

  try {
    if (authenticatedUserId) {
      const user = await prisma.user.findUnique({
        where: { id: authenticatedUserId },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user);
    } else {
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
});

export const PUT = jwtAuth(async (request: NextRequest) => {
  let authenticatedUserId;
  try {
    authenticatedUserId = request.user?.id;
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 },
    );
  }

  try {
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    const body = await request.json();

    const updateData = {
      name: body.name,
      email: body.email,
      image: body.image,
    };

    const updatedUser = await prisma.user.update({
      where: { id: authenticatedUserId },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
});

export const DELETE = jwtAuth(async (request: NextRequest) => {
  let authenticatedUserId;
  try {
    authenticatedUserId = request.user?.id;
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 },
    );
  }

  if (!authenticatedUserId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  try {
    await prisma.user.delete({
      where: { id: authenticatedUserId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
});

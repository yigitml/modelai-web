import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtAuth } from "@/middleware/jwtAuth";

export const GET = jwtAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  let authenticatedUserId;
  try {
    authenticatedUserId = request.user?.id;
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error authenticating:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 },
    );
  }

  try {
    if (id) {
      const model = await prisma.model.findUnique({
        where: { id: id },
      });
      if (model) {
        return NextResponse.json(model);
      } else {
        return NextResponse.json({ error: "Model not found" }, { status: 404 });
      }
    } else if (authenticatedUserId) {
      const models = await prisma.model.findMany({
        where: { userId: authenticatedUserId },
      });
      return NextResponse.json(models);
    } else {
      return NextResponse.json(
        { error: "Missing model or user id" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 },
    );
  }
});

export const POST = jwtAuth(async (request: NextRequest) => {
  let authenticatedUserId;
  try {
    authenticatedUserId = request.user?.id;
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error creating model:", error);
    return NextResponse.json(
      { error: "Failed to create model" },
      { status: 500 },
    );
  }

  try {
    const data = await request.json();
    const model = await prisma.model.create({
      data: {
        ...data,
      },
    });
    return NextResponse.json(model);
  } catch (error) {
    console.error("Error creating model:", error);
    return NextResponse.json(
      { error: "Failed to create model" },
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
    console.error("Error updating model:", error);
    return NextResponse.json(
      { error: "Failed to update model" },
      { status: 500 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing model id" }, { status: 400 });
    }

    const data = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { photos: _photos, ...modelData } = data;

    const updatedModel = await prisma.model.update({
      where: { id: id },
      data: modelData,
      include: {
        photos: true, // Include photos in the response
      },
    });

    return NextResponse.json(updatedModel);
  } catch (error) {
    console.error("Error updating model:", error);
    return NextResponse.json(
      { error: "Failed to update model" },
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
    console.error("Error deleting model:", error);
    return NextResponse.json(
      { error: "Failed to delete model" },
      { status: 500 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing model id" }, { status: 400 });
    }

    await prisma.model.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Model deleted successfully" });
  } catch (error) {
    console.error("Error deleting model:", error);
    return NextResponse.json(
      { error: "Failed to delete model" },
      { status: 500 },
    );
  }
});

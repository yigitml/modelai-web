import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");

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
    } else if (userId) {
      const models = await prisma.model.findMany({
        where: { userId: userId },
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
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const model = await prisma.model.create({
      data: {
        ...data,
        // Add any default fields or transformations here if needed
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
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const modelId = searchParams.get("modelId");
  const userId = searchParams.get("userId");

  try {
    if (id) {
      const photo = await prisma.photo.findUnique({
        where: { id: id },
      });

      if (photo) {
        return NextResponse.json(photo);
      } else {
        return NextResponse.json({ error: "Photo not found" }, { status: 404 });
      }
    } else if (modelId) {
      const photos = await prisma.photo.findMany({
        where: { modelId: modelId },
      });
      return NextResponse.json(photos);
    } else if (userId) {
      const photos = await prisma.photo.findMany({
        where: { userId: userId },
      });
      return NextResponse.json(photos);
    } else {
      return NextResponse.json(
        { error: "Missing modelId or photo id" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const photoData = await request.json();

    const newPhoto = await prisma.photo.create({
      data: photoData,
    });

    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    console.error("Error creating photo:", error);
    return NextResponse.json(
      { error: "Failed to create photo" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing photo id" }, { status: 400 });
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json(
      { error: "Failed to update photo" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing photo id" }, { status: 400 });
    }

    await prisma.photo.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 },
    );
  }
}

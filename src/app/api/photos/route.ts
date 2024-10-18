import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

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
    } else {
      const photos = await prisma.photo.findMany();
      return NextResponse.json(photos);
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

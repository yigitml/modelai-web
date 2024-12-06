import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/replicate";
import { jwtAuth } from "@/middleware/jwtAuth";
import prisma from "@/lib/prisma";

export const GET = jwtAuth(async (request: NextRequest) => {
  try {
    const authenticatedUserId = request.user?.id;
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const files = await prisma.file.findMany({
      where: {
        userId: authenticatedUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
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
    console.error("Error authenticating:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const uploadedFile = await uploadFile(formData);

    const file = await prisma.file.create({
      data: {
        url: uploadedFile.urls[0],
        type: "OTHER",
        size: uploadedFile.size || 0,
        userId: authenticatedUserId,
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
});

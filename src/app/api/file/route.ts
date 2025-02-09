import { NextRequest } from "next/server";
import { withProtectedRoute } from "@/middleware/jwtAuth";
import { ApiResponse } from "@/types/api/apiResponse";
import { uploadFile } from "@/lib/fal";
import prisma from "@/lib/prisma";

export const GET = withProtectedRoute(async (request: NextRequest) => {
  try {
    const authenticatedUserId = request.user!.id;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const file = await prisma.file.findUnique({
        where: {
          id: id,
          userId: authenticatedUserId,
        },
      });

      return ApiResponse.success(file).toResponse();
    } else {
      const files = await prisma.file.findMany({
        where: {
        userId: authenticatedUserId,
      },
      orderBy: {
        createdAt: "desc",
        },
      });

      return ApiResponse.success(files).toResponse();
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    return ApiResponse.error("Failed to fetch files", 500).toResponse();
  }
});

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");

    if (!contentType?.includes("multipart/form-data")) {
      return ApiResponse.error(
        `Invalid content type: ${contentType}. Must be multipart/form-data`,
        400
      ).toResponse();
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const modelId = formData.get("modelId") as string;
    const photoCount = parseInt(formData.get("photoCount") as string);
    const authenticatedUserId = formData.get("userId") as string

    if (!file) {
      return ApiResponse.error("File is required", 400).toResponse();
    }

    if (!modelId) {
      return ApiResponse.error("Model ID is required", 400).toResponse();
    }

    if (!file.name.toLowerCase().endsWith('.zip')) {
      return ApiResponse.error("File must be a ZIP file", 400).toResponse();
    }

    const url = await uploadFile(file);

    const newFile = await prisma.file.create({
      data: {
        url: url,
        size: file.size,
        userId: authenticatedUserId,
        modelId: modelId,
        photoCount: photoCount,
      },
    });

    return ApiResponse.success(
      newFile,
      "File uploaded successfully",
      201
    ).toResponse();

  } catch (error) {
    console.log("vnjf");
    console.error("Error uploading file to fal:", error);
    return ApiResponse.error(
      "Failed to upload file",
      500
    ).toResponse();
  }
}
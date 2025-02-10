import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withProtectedRoute } from "@/middleware/jwtAuth";
import { ApiResponse } from "@/types/api/apiResponse";
import type { 
  PhotoPostRequest, 
  PhotoPutRequest, 
  PhotoDeleteRequest 
} from "@/types/api/apiRequest";

export const GET = withProtectedRoute(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const modelId = searchParams.get("modelId");
    const authenticatedUserId = request.user!.id;

    if (id) {
      const photo = await prisma.photo.findFirst({
        where: { id, userId: authenticatedUserId },
      });

      if (photo) {
        return ApiResponse.success(photo).toResponse();
      }
      return ApiResponse.error("Photo not found", 404).toResponse();
    }

    if (modelId) {
      const photos = await prisma.photo.findMany({
        where: { modelId, userId: authenticatedUserId },
      });
      return ApiResponse.success(photos).toResponse();
    }

    const photos = await prisma.photo.findMany({
      where: { userId: authenticatedUserId },
    });
    return ApiResponse.success(photos).toResponse();
  } catch (error) {
    console.error("Error fetching photos:", error);
    return ApiResponse.error("Failed to fetch photos", 500).toResponse();
  }
});

export const PUT = withProtectedRoute(async (request: NextRequest) => {
  try {
    const authenticatedUserId = request.user!.id;
    const updateData: PhotoPutRequest = await request.json();

    if (!updateData.id) {
      return ApiResponse.error("Photo ID is required", 400).toResponse();
    }

    const updatedPhoto = await prisma.photo.updateMany({
      where: { id: updateData.id, userId: authenticatedUserId },
      data: {
        url: updateData.url
      },
    });

    if (updatedPhoto.count === 0) {
      return ApiResponse.error("Photo not found or unauthorized", 404).toResponse();
    }

    const photo = await prisma.photo.findFirst({
      where: { id: updateData.id, userId: authenticatedUserId },
    });

    return ApiResponse.success(photo, "Photo updated successfully").toResponse();
  } catch (error) {
    console.error("Error updating photo:", error);
    return ApiResponse.error("Failed to update photo", 500).toResponse();
  }
});

export const DELETE = withProtectedRoute(async (request: NextRequest) => {
  try {
    const { id } = await request.json() as PhotoDeleteRequest;
    const authenticatedUserId = request.user!.id;

    if (!id) {
      return ApiResponse.error("Photo ID is required", 400).toResponse();
    }

    const deletedPhoto = await prisma.photo.update({
      where: { id, userId: authenticatedUserId },
      data: {
        deletedAt: new Date(),
      },
    });

    if (!deletedPhoto) {
      return ApiResponse.error("Photo not found or unauthorized", 404).toResponse();
    }

    return ApiResponse.success({ message: "Photo deleted successfully" }).toResponse();
  } catch (error) {
    console.error("Error deleting photo:", error);
    return ApiResponse.error("Failed to delete photo", 500).toResponse();
  }
});
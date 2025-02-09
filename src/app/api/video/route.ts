import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withProtectedRoute } from "@/middleware/jwtAuth";
import { ApiResponse } from "@/types/api/apiResponse";
import type { 
  VideoPutRequest, 
  VideoDeleteRequest 
} from "@/types/api/apiRequest";

export const GET = withProtectedRoute(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const photoId = searchParams.get("photoId");
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

    if (photoId) {
      const videos = await prisma.video.findMany({
        where: { photoId: photoId, userId: authenticatedUserId },
      });
      return ApiResponse.success(videos).toResponse();
    }

    const videos = await prisma.video.findMany({
      where: { userId: authenticatedUserId },
    });
    return ApiResponse.success(videos).toResponse();
  } catch (error) {
    console.error("Error fetching videos:", error);
    return ApiResponse.error("Failed to fetch videos", 500).toResponse();
  }
});

// TODO put and delete
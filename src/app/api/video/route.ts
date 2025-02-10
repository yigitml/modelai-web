import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withProtectedRoute } from "@/middleware/jwtAuth";
import { ApiResponse } from "@/types/api/apiResponse";
import type { 
  VideoPutRequest, 
} from "@/types/api/apiRequest";
import { Video } from "@prisma/client";

export const GET = withProtectedRoute(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const photoId = searchParams.get("photoId");
    const modelId = searchParams.get("modelId");
    const authenticatedUserId = request.user!.id;

    if (id) {
      const video = await prisma.video.findFirst({
        where: { id, userId: authenticatedUserId },
      });

      if (video) {
        return ApiResponse.success(video).toResponse();
      }
      return ApiResponse.error("Video not found", 404).toResponse();
    }

    if (photoId) {
      const videos = await prisma.video.findMany({
        where: { photoId: photoId, userId: authenticatedUserId },
      });
      return ApiResponse.success(videos).toResponse();
    }

    if (modelId) {
      try {
        const photos = await prisma.photo.findMany({
          where: { modelId: modelId, userId: authenticatedUserId },
        });
        const videos: Video[] = [];
        for (const photo of photos) {
          const video = await prisma.video.findFirst({
            where: { photoId: photo.id, userId: authenticatedUserId },
          });
          if (video) {
            videos.push(video);
          }
        }
        return ApiResponse.success(videos).toResponse();
      } catch (prismaError) {
        console.error("Prisma Error Full Object:", JSON.stringify(prismaError, null, 2));
        if (prismaError instanceof Error) {
          console.error("Error name:", prismaError.name);
          console.error("Error message:", prismaError.message);
          console.error("Error stack:", prismaError.stack);
        }
        throw prismaError;
      }
    }

    const videos = await prisma.video.findMany({
      where: { userId: authenticatedUserId },
    });
    return ApiResponse.success(videos).toResponse();
  } catch (error) {
    console.error("Outer catch - Full error:", error);
    console.error("Error type:", typeof error);
    console.error("Is Error instance:", error instanceof Error);
    
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
      return ApiResponse.error(`Database error: ${error.message}`, 500).toResponse();
    }
    
    return ApiResponse.error("An unexpected error occurred", 500).toResponse();
  }
});
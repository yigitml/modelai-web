import { NextRequest } from "next/server";
import { withProtectedRoute } from "@/middleware/jwtAuth";
import { ApiResponse } from "@/types/api/apiResponse";
import { requestKlingImageToVideo } from "@/lib/fal";
import { KlingImageToVideoInput } from "@/types/fal";
import { VideoPredictionPostRequest } from "@/types/api/apiRequest";
import { CreditType } from "@prisma/client";
import { consumeUserCredits } from "@/utils/consumeUserCredits";
import prisma from "@/lib/prisma";

export const GET = withProtectedRoute(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const authenticatedUserId = request.user!.id;

    if (!id) {
      const videoPredictions = await prisma.videoPrediction.findMany({
        where: { userId: authenticatedUserId },
        include: {
          video: {
            include: {
              videoPrediction: true,
            },
          },
        },
      });
      return ApiResponse.success(videoPredictions).toResponse();
    } else {
      const videoPredictions = await prisma.videoPrediction.findMany({
        where: { userId: authenticatedUserId },
      });
      return ApiResponse.success(videoPredictions).toResponse();
    }
  } catch (error) {
    console.error("Error fetching video predictions:", error);
    return ApiResponse.error("Failed to fetch video predictions", 500).toResponse();
  }
});

export const POST = withProtectedRoute(async (request: NextRequest) => {
  try {
    const authenticatedUserId = request.user!.id;
    const body: VideoPredictionPostRequest = await request.json();

    const photo = await prisma.photo.findUnique({
      where: { id: body.photoId },
    });

    if (!photo) {
      return ApiResponse.error("Photo not found", 404).toResponse();
    }

    const input: KlingImageToVideoInput = {
      image_url: photo.url,
      prompt: body.prompt,
      duration: body.duration,
      aspect_ratio: body.aspectRatio,
    };

    if (!input.image_url) {
      return ApiResponse.error(
        "image_url is required",
        400
      ).toResponse();
    }

    const webhookUrl = `${process.env.WEBHOOK_DELIVERY_URL}/api/webhook/kling-video`;

    const sufficientCredits = await consumeUserCredits(authenticatedUserId, CreditType.VIDEO, 1);

    if (!sufficientCredits) {
      return ApiResponse.error("Insufficient credits", 400).toResponse();
    }

    const requestId = await requestKlingImageToVideo(
      input,
      webhookUrl
    );

    const videoPrediction = await prisma.videoPrediction.create({
      data: {
        requestId,
        userId: authenticatedUserId,
        photoId: photo.id,
      },
    });

    return ApiResponse.success(
      videoPrediction,
      "Video generation job submitted",
      201
    ).toResponse();

  } catch (error) {
    console.error("Error processing video generation:", error);
    return ApiResponse.error(
      "Failed to process video generation",
      500
    ).toResponse();
  }
});

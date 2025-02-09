import { NextRequest } from "next/server";
import { withProtectedRoute } from "@/middleware/jwtAuth";
import { ApiResponse } from "@/types/api/apiResponse";
import { requestKlingImageToVideo } from "@/lib/fal";
import { KlingImageToVideoInput } from "@/types/fal";
import { VideoPredictionPostRequest } from "@/types/api/apiRequest";
import { CreditType } from "@prisma/client";
import { consumeUserCredits } from "@/utils/consumeUserCredits";

export const POST = withProtectedRoute(async (request: NextRequest) => {
  try {
    const authenticatedUserId = request.user!.id;
    const body: VideoPredictionPostRequest = await request.json();
    
    const input: KlingImageToVideoInput = {
      image_url: body.photoId,
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

    const webhookUrl = `${process.env.WEBHOOK_DELIVERY_URL}/webhook/kling-video`;

    const sufficientCredits = await consumeUserCredits(authenticatedUserId, CreditType.VIDEO, 1);

    if (!sufficientCredits) {
      return ApiResponse.error("Insufficient credits", 400).toResponse();
    }

    const result = await requestKlingImageToVideo(
      input,
      webhookUrl || undefined,
      undefined,
      true
    );

    // TODO

    return ApiResponse.success(
      result,
      webhookUrl ? "Video generation job submitted" : "Video generation completed",
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

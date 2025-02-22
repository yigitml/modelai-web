import { NextRequest } from "next/server";
import { withProtectedRoute } from "@/middleware/jwtAuth";
import { ApiResponse } from "@/types/api/apiResponse";
import { PhotoPredictionPostRequest } from "@/types/api/apiRequest";
import { requestFluxLora } from "@/lib/fal";
import prisma from "@/lib/prisma";
import { FluxLoraInput } from "@/types/fal";
import { consumeUserCredits } from "@/utils/consumeUserCredits";
import { CreditType } from "@prisma/client";

export const GET = withProtectedRoute(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const authenticatedUserId = request.user!.id;

    if (!id) {
      const predictions = await prisma.photoPrediction.findMany({
        where: { userId: authenticatedUserId },
        include: {
          user: { select: { id: true, name: true, email: true } },
          photos: { select: { id: true, url: true } },
        }
      });
      return ApiResponse.success(predictions).toResponse();
    } else {
      const predictions = await prisma.photoPrediction.findMany({
        where: { userId: authenticatedUserId },
        include: {
          user: { select: { id: true, name: true, email: true } },
          photos: { select: { id: true, url: true } },
        }
      });
      return ApiResponse.success(predictions).toResponse();
    }
  } catch (error) {
    console.error("Error generating image with Flux LoRA:", error);
    return ApiResponse.error(
      "Failed to get prediction",
      500
    ).toResponse();
  }
});

export const POST = withProtectedRoute(async (request: NextRequest) => {
  try {
    const authenticatedUserId = request.user!.id;
    const data: PhotoPredictionPostRequest = await request.json();
    
    if (!data.modelId || !data.prompt || !data.numOutputs || !data.guidanceScale) {
      return ApiResponse.error(
        "Missing required fields for prediction creation",
        400
      ).toResponse();
    }

    const model = await prisma.model.findUnique({
      where: {
        id: data.modelId,
        userId: authenticatedUserId,
      },
    });

    if (!model?.loraWeights) {
      return ApiResponse.error(
        "Model lora weights not found",
        404
      ).toResponse();
    }

    const webhookUrl = `${process.env.WEBHOOK_DELIVERY_URL}/api/webhook/flux-lora`;

    const input: FluxLoraInput = {
      prompt: data.prompt,
      image_size: {
        width: 1400,
        height: 1400,
      },
      guidance_scale: data.guidanceScale,
      num_images: data.numOutputs,
      enable_safety_checker: false,
      loras: [{ path: model.loraWeights, scale: 1 }],
    };

    const sufficientCredits = await consumeUserCredits(authenticatedUserId, CreditType.PHOTO, data.numOutputs);

    if (!sufficientCredits) {
      return ApiResponse.error("Insufficient credits", 400).toResponse();
    }

    const requestId = await requestFluxLora(input, webhookUrl);

    const prediction = await prisma.photoPrediction.create({
      data: {
        requestId,
        userId: authenticatedUserId,
        modelId: data.modelId,
      },
    });

    return ApiResponse.success(
      prediction,
      "Image generated successfully",
      201
    ).toResponse();
  } catch (error) {
    console.error("Error generating image with Flux LoRA:", error);
    return ApiResponse.error(
      "Failed to generate image",
      500
    ).toResponse();
  }
});

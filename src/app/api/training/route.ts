import { NextRequest } from "next/server";
import { withProtectedRoute } from "@/middleware/jwtAuth";
import { ApiResponse } from "@/types/api/apiResponse";
import { requestFluxLoraPortraitTrainer } from "@/lib/fal";
import { TrainingPostRequest } from "@/types/api/apiRequest";
import { FluxLoraPortraitTrainerInput } from "@/types/fal";
import prisma from "@/lib/prisma";
import { CreditType } from "@prisma/client";
import { consumeUserCredits } from "@/utils/consumeUserCredits";

export const GET = withProtectedRoute(async (request: NextRequest) => {
  try {
    const authenticatedUserId = request.user!.id;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const training = await prisma.training.findUnique({
        where: { id, userId: authenticatedUserId },
      });
      return ApiResponse.success(training).toResponse();
    } else {
      const trainings = await prisma.training.findMany({
        where: {
          userId: authenticatedUserId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return ApiResponse.success(trainings, "Trainings fetched successfully", 200).toResponse();
  }
  } catch (error) {
    console.error("Error fetching trainings:", error);
    return ApiResponse.error("Failed to fetch trainings", 500).toResponse();
  }
});

export const POST = withProtectedRoute(async (request: NextRequest) => {
  try {
    const authenticatedUserId = request.user!.id;
    const data: TrainingPostRequest = await request.json();

    if (!data.inputImages || !data.modelId) {
      return ApiResponse.error("Missing required training data", 400).toResponse();
    }

    const model = await prisma.model.findUnique({
      where: {
        id: data.modelId,
      },
      include: {
        files: true,
      },
    });

    if (!model) {
      return ApiResponse.error("Model not found", 404).toResponse();
    }

    if (model?.loraWeights) {
      return ApiResponse.error("This model is already trained", 404).toResponse();
    }

    const photoCount = model.files.length === 1 ? model.files[0].photoCount || 0 : 0;

    const webhookUrl = `${process.env.WEBHOOK_DELIVERY_URL}/api/webhook/flux-lora-trainer`;

    const input: FluxLoraPortraitTrainerInput = {
      images_data_url: data.inputImages,
      steps: photoCount !== 0 ? photoCount * 100 : 2000,
    };

    const sufficientCredits = await consumeUserCredits(authenticatedUserId, CreditType.MODEL, 1);

    if (!sufficientCredits) {
      return ApiResponse.error("Insufficient credits", 400).toResponse();
    }

    const requestId = await requestFluxLoraPortraitTrainer(input, webhookUrl);

    const training = await prisma.training.create({
      data: {
        requestId,
        userId: authenticatedUserId,
        modelId: data.modelId,
        createdAt: new Date(),
      },
    });

    return ApiResponse.success(
      training,
      "LoRA training initiated successfully",
      201
    ).toResponse();

  } catch (error) {
    console.error("Error initiating LoRA training:", error);
    return ApiResponse.error(
      `Failed to initiate LoRA training: ${error}`,
      500
    ).toResponse();
  }
});

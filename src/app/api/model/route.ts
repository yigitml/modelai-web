import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withProtectedRoute } from "@/middleware/jwtAuth";
import { CreateModelRequest as ReplicateCreateModelRequest } from "@/types/replicate/replicateRequest";
import { createModel } from "@/lib/replicate";
import { ApiResponse } from "@/types/api/apiResponse";
import type { 
  ModelPostRequest,
  ModelPutRequest, 
  ModelDeleteRequest 
} from "@/types/api/apiRequest";

export const GET = withProtectedRoute(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const authenticatedUserId = request.user!.id;

    if (id) {
      const model = await prisma.model.findFirst({
        where: { id, userId: authenticatedUserId },
      });
      if (model) {
        return ApiResponse.success(model).toResponse();
      }
      return ApiResponse.error("Model not found", 404).toResponse();
    } else {
      const models = await prisma.model.findMany({
        where: { userId: authenticatedUserId },
      });
      return ApiResponse.success(models).toResponse();
    }
    
  } catch (error) {
    console.error("Error fetching models:", error);
    return ApiResponse.error("Failed to fetch models", 500).toResponse();
  }
});

export const POST = withProtectedRoute(async (request: NextRequest) => {
  try {
    const authenticatedUserId = request.user!.id;
    const data: ModelPostRequest = await request.json();

    const sanitizedName = data.name.toLowerCase().replace(/[^a-z0-9-_.]/g, "");

    const existingModel = await prisma.model.findFirst({
      where: {
        name: sanitizedName,
        userId: authenticatedUserId,
      },
    });

    if (existingModel) {
      return ApiResponse.error("Model with this name already exists", 409).toResponse();
    }

    /*
    const replicateModelData: ReplicateCreateModelRequest = {
      owner: "yigitml",
      name: sanitizedName,
      visibility: "private",
      hardware: "gpu-a100-large",
      description: data.description || "",
    };

    const replicateModel = await createModel(replicateModelData);
    */


    const model = await prisma.model.create({
      data: {
        name: sanitizedName,
        description: data.description || "",
        userId: authenticatedUserId
      },
    });

    return ApiResponse.success(model, "Model created successfully", 200).toResponse();
  } catch (error) {
    console.error("Error processing POST /api/model:", 
      error instanceof Error ? error.message : 'Unknown error'
    );
    return ApiResponse.error("Failed to process request", 500).toResponse();
  }
});

export const PUT = withProtectedRoute(async (request: NextRequest) => {
  try {
    const authenticatedUserId = request.user!.id;
    const data: ModelPutRequest = await request.json();
    const { id, ...modelData } = data;

    if (!id) {
      return ApiResponse.error("Model ID is required", 400).toResponse();
    }

    const updatedModel = await prisma.model.updateMany({
      where: { id, userId: authenticatedUserId },
      data: modelData,
    });

    if (updatedModel.count === 0) {
      return ApiResponse.error("Model not found or unauthorized", 404).toResponse();
    }

    const model = await prisma.model.findFirst({
      where: { id, userId: authenticatedUserId },
    });

    return ApiResponse.success(model, "Model updated successfully").toResponse();
  } catch (error) {
    console.error("Error updating model:", error);
    return ApiResponse.error("Failed to update model", 500).toResponse();
  }
});

export const DELETE = withProtectedRoute(async (request: NextRequest) => {
  try {
    const { id } = await request.json() as ModelDeleteRequest;
    const authenticatedUserId = request.user!.id;

    if (!id) {
      return ApiResponse.error("Model ID is required", 400).toResponse();
    }

    const deletedModel = await prisma.model.update({
      where: { id, userId: authenticatedUserId },
      data: {
        deletedAt: new Date(),
      },
    });

    if (!deletedModel) {
      return ApiResponse.error("Model not found or unauthorized", 404).toResponse();
    }

    return ApiResponse.success({ message: "Model deleted successfully" }).toResponse();
  } catch (error) {
    console.error("Error deleting model:", error);
    return ApiResponse.error("Failed to delete model", 500).toResponse();
  }
});

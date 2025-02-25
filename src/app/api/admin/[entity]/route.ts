import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api/apiResponse";
import { withAdminRoute } from "@/middleware/adminAuth";
const ALLOWED_ENTITIES = [
  "user",
  "model",
  "photo",
  "video",
  "subscription",
  "userCredit",
  "training",
  "photoPrediction",
  "videoPrediction",
  "userSession",
  "userDevice",
  "file",
];

export const GET = withAdminRoute(async (request: NextRequest) => {
  try {
    const entity = request.url.split("/").pop();

    if (!ALLOWED_ENTITIES.includes(entity!)) {
      return ApiResponse.error("Invalid entity", 400).toResponse();
    }

    const data = await (prisma as any)[entity!].findMany({
    });

    return ApiResponse.success(data).toResponse();
  } catch (error) {
    console.error("Error in admin GET:", error);
    return ApiResponse.error("Internal server error", 500).toResponse();
  }
});

export const DELETE = withAdminRoute(async (request: NextRequest) => {
  try {
    const urlParts = request.url.split("/");
    const entity = urlParts[urlParts.length - 1];

    const { id } = await request.json();

    if (!id) {
      return ApiResponse.error("ID is required", 400).toResponse();
    }
  
    if (!ALLOWED_ENTITIES.includes(entity)) {
      return ApiResponse.error("Invalid entity", 400).toResponse();
    }

    await (prisma as any)[entity].update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return ApiResponse.success(null, "Item deleted successfully").toResponse();
  } catch (error) {
    console.error("Error in admin DELETE:", error);
    return ApiResponse.error("Internal server error", 500).toResponse();
  }
});

export const PUT = withAdminRoute(async (request: NextRequest) => {
  try {
    const urlParts = request.url.split("/");
    const entity = urlParts[urlParts.length - 1];

    const body = await request.json();
    const { id, ...rest } = body;

    if (!id) {
      return ApiResponse.error("ID is required", 400).toResponse();
    }
  
    if (!ALLOWED_ENTITIES.includes(entity)) {
      return ApiResponse.error("Invalid entity", 400).toResponse();
    }
    
    const protectedFields = ['createdAt', 'updatedAt', 'deletedAt'];
    const sanitizedData = Object.fromEntries(
      Object.entries(rest).filter(([key]) => !protectedFields.includes(key))
    );

    const updatedItem = await (prisma as any)[entity].update({
      where: { id },
      data: sanitizedData,
    });

    return ApiResponse.success(updatedItem, "Item updated successfully").toResponse();
  } catch (error) {
    console.error("Error in admin PUT:", error);
    return ApiResponse.error("Internal server error", 500).toResponse();
  }
});
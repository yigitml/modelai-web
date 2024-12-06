import { NextRequest, NextResponse } from "next/server";
import { cancelPrediction, createPrediction } from "@/lib/replicate";
import type { CreatePredictionRequest } from "@/types/api";
import { jwtAuth } from "@/middleware/jwtAuth";
import prisma from "@/lib/prisma";

export const GET = jwtAuth(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  try {
    if (id) {
      const prediction = await prisma.prediction.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          model: {
            select: {
              id: true,
              name: true,
              replicateId: true,
              versionId: true,
            },
          },
        },
      });

      if (!prediction) {
        return NextResponse.json(
          { error: "Prediction not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(prediction);
    } else {
      return NextResponse.json(
        { error: "Missing prediction id" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return NextResponse.json(
      { error: "Failed to fetch predictions" },
      { status: 500 },
    );
  }
});

export const POST = jwtAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    if (body.action === "cancel") {
      const { id } = body;
      await cancelPrediction(id);
      return NextResponse.json({
        message: "Prediction cancelled successfully",
      });
    } else if (body.action === "create") {
      const predictionData: CreatePredictionRequest = {
        version: body.version,
        input: body.input,
      };
      try {
        const prediction = await createPrediction(predictionData);
        return NextResponse.json(prediction);
      } catch (error) {
        if (error instanceof Error) {
          return NextResponse.json({ error: error.message }, { status: 422 });
        } else {
          return NextResponse.json(
            { error: "An unknown error occurred" },
            { status: 500 },
          );
        }
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 },
      );
    }
  }
});

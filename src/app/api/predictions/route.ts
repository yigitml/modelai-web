import { NextRequest, NextResponse } from "next/server";
import {
  cancelPrediction,
  getPredictionById,
  createPrediction,
} from "@/lib/replicate";
import type { CreatePredictionRequest } from "@/types/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  try {
    if (id) {
      const prediction = await getPredictionById(id);
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
}

export async function POST(request: NextRequest) {
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
        console.error("Error creating prediction:", error);
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
    console.error("Error processing prediction request:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 },
      );
    }
  }
}

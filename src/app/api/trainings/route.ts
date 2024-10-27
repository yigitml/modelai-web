import { NextRequest, NextResponse } from "next/server";
import { trainModel } from "@/lib/replicate";
import { TrainModelRequest } from "@/types/api";
import { jwtAuth } from "@/middleware/jwtAuth";

export const POST = jwtAuth(async (request: NextRequest) => {
  try {
    const data: TrainModelRequest = await request.json();
    const training = await trainModel(data);
    return NextResponse.json(training);
  } catch (error) {
    console.error("Error starting training:", error);
    return NextResponse.json(
      { error: "Failed to start training" },
      { status: 500 },
    );
  }
});

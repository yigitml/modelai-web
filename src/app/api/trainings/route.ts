import { NextRequest, NextResponse } from "next/server";
import { trainModel } from "@/lib/replicate";
import { TrainModelRequest } from "@/types/api";

export async function POST(request: NextRequest) {
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
}

import { NextRequest, NextResponse } from "next/server";
import { trainModel } from "@/lib/replicate";
import { TrainModelRequest } from "@/types/api";
import { jwtAuth } from "@/middleware/jwtAuth";
import prisma from "@/lib/prisma";

export const POST = jwtAuth(async (request: NextRequest) => {
  let authenticatedUserId;
  try {
    authenticatedUserId = request.user?.id;
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error starting training:", error);
    return NextResponse.json(
      { error: "Failed to start training" },
      { status: 500 },
    );
  }
  try {
    const data: TrainModelRequest = await request.json();
    const replicateTraining = await trainModel(data);

    // Create training record in database
    const training = await prisma.training.create({
      data: {
        id: replicateTraining.id,
        version: replicateTraining.version,
        status: "starting",
        input: JSON.stringify(replicateTraining.input || {}),
        output: JSON.stringify(replicateTraining.output || {}),
        logs: "",
        urls: JSON.stringify(replicateTraining.urls || {}),
        createdAt: new Date(),
        userId: authenticatedUserId,
        modelId: data.modelId,
      },
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

    return NextResponse.json(training);
  } catch (error) {
    console.error("Error starting training:", error);
    return NextResponse.json(
      { error: "Failed to start training" },
      { status: 500 },
    );
  }
});

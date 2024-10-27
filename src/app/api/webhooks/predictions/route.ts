import { NextResponse } from "next/server";
import { getPredictionById } from "@/lib/replicate";
import prisma from "@/lib/prisma";
import { verifyWebhookSignature } from "@/utils/webhookVerification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const signature = request.headers.get("replicate-signature");

    if (!verifyWebhookSignature(JSON.stringify(body), signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const predictionId = body.id;

    if (!predictionId) {
      return NextResponse.json(
        { error: "Missing prediction ID" },
        { status: 400 },
      );
    }

    const prediction = await getPredictionById(predictionId);

    if (prediction.status === "succeeded" && Array.isArray(prediction.output)) {
      const model = await prisma.model.findFirst({
        where: { replicateId: prediction.version.split(":")[0] },
      });

      if (!model) {
        return NextResponse.json(
          { error: "Associated model not found" },
          { status: 404 },
        );
      }

      const photoPromises = prediction.output.map((url: string) =>
        prisma.photo.create({
          data: {
            url,
            modelId: model.id,
            userId: model.userId,
          },
        }),
      );

      await Promise.all(photoPromises);

      return NextResponse.json(
        { message: "Prediction processed and photos saved successfully" },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: "Prediction not yet completed or has no output" },
        { status: 202 },
      );
    }
  } catch (error) {
    console.error("Error processing prediction webhook:", error);
    return NextResponse.json(
      { error: "Failed to process prediction webhook" },
      { status: 500 },
    );
  }
}

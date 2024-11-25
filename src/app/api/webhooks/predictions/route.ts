import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
//import { verifyWebhookSignature } from "@/utils/webhookVerification";
import fs from "fs/promises";
import path from "path";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    //const signature = request.headers.get("replicate-signature");
    const predictionId = body.id; // Get the prediction ID from the webhook

    if (body.status !== "succeeded") {
      return NextResponse.json(
        { message: `Prediction status: ${body.status}`, predictionId },
        { status: 202 },
      );
    }

    if (!body.output || !Array.isArray(body.output)) {
      return NextResponse.json(
        { message: "Prediction has no valid output", predictionId },
        { status: 202 },
      );
    }

    const model = await prisma.model.findFirst({
      where: { versionId: body.version },
    });

    if (!model) {
      return NextResponse.json(
        { error: "Associated model not found" },
        { status: 404 },
      );
    }

    // Create photos from output URLs
    const photoPromises = body.output.map(async (url: string) => {
      const photo = await prisma.photo.create({
        data: {
          url,
          modelId: model.id,
          userId: model.userId,
        },
      });

      const fileName = `${model.userId}_${model.id}_${photo.id}.png`;
      const outputDir = path.join(process.cwd(), "public", "outputs");
      const filePath = path.join(outputDir, fileName);

      await fs.mkdir(outputDir, { recursive: true });
      const response = await axios.get(url, { responseType: "arraybuffer" });
      await fs.writeFile(filePath, response.data);

      return prisma.photo.update({
        where: { id: photo.id },
        data: { url: `/outputs/${fileName}` },
      });
    });

    const createdPhotos = await Promise.all(photoPromises);

    return NextResponse.json(
      {
        message: "Prediction processed and photos saved successfully",
        predictionId,
        photos: createdPhotos,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing prediction webhook:", error);
    return NextResponse.json(
      { error: "Failed to process prediction webhook" },
      { status: 500 },
    );
  }
}

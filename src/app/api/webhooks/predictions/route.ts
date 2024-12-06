import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ipWhitelist } from "@/middleware/ipWhitelist";
import { verifyWebhookSignature } from "@/utils/webhookVerification";
import fs from "fs/promises";
import path from "path";
import axios from "axios";

export const POST = ipWhitelist(async (request: Request) => {
  try {
    const signature = request.headers.get("replicate-signature");
    const body = await request.json();
    const payload = JSON.stringify(body);

    if (!verifyWebhookSignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const predictionId = body.id;

    if (body.status !== "succeeded") {
      return NextResponse.json(
        { message: `Prediction status: ${body.status}`, predictionId },
        { status: 202 },
      );
    }

    // Update prediction record with new status and output
    await prisma.prediction.update({
      where: { id: predictionId },
      data: {
        status: body.status,
        output: JSON.stringify(body.output),
        completedAt: new Date(),
        metrics: JSON.stringify(body.metrics || {}),
        logs: body.logs || "",
        urls: JSON.stringify(body.urls || {}),
      },
    });

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
});

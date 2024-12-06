import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getModelById } from "@/lib/replicate";
import { ipWhitelist } from "@/middleware/ipWhitelist";
import { verifyWebhookSignature } from "@/utils/webhookVerification";

export const POST = ipWhitelist(async (request: Request) => {
  try {
    const signature = request.headers.get("replicate-signature");
    const body = await request.json();
    const payload = JSON.stringify(body);

    if (!verifyWebhookSignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const trainingId = body.id;

    if (!trainingId) {
      return NextResponse.json(
        { error: "Missing training ID" },
        { status: 400 },
      );
    }

    if (body.status === "succeeded") {
      const modelDetails = await getModelById(body.owner, body.name);

      if (!modelDetails) {
        return NextResponse.json({ error: "Model not found" }, { status: 404 });
      }

      await prisma.model.create({
        data: {
          replicateId: body.model,
          versionId: body.version,
          name: modelDetails.name,
          description: modelDetails.description || "",
          avatarUrl: modelDetails.cover_image_url || null,
          userId: modelDetails.owner.split("/")[1],
        },
      });
      return NextResponse.json({
        message: "Training succeeded and model entry created",
      });
    } else if (body.status === "failed" || body.status === "canceled") {
      return NextResponse.json({ message: `Training ${body.status}` });
    } else {
      return NextResponse.json({ message: "Training still in progress" });
    }
  } catch (error) {
    console.error("Error processing training webhook:", error);
    return NextResponse.json(
      { error: "Failed to process training webhook" },
      { status: 500 },
    );
  }
});

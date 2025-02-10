import { NextResponse } from 'next/server';
import { FalAIWebhookRequest, FluxLoraOutput } from '@/types/fal';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const webhookData: FalAIWebhookRequest<FluxLoraOutput> = await request.json();

    if (!webhookData.request_id || !webhookData.status) {
      return NextResponse.json(
        { error: 'Invalid webhook payload structure' },
        { status: 400 }
      );
    }

    switch (webhookData.status) {
      case 'OK':
        const photoPrediction = await prisma.photoPrediction.findUnique({
          where: {
            requestId: webhookData.request_id,
          },
        });

        if (photoPrediction) {
          const { images } = webhookData.payload;
          for (const image of images) {
            await prisma.photo.create({
              data: {
                url: image.url,
                modelId: photoPrediction.modelId,
                userId: photoPrediction.userId,
                photoPredictionId: photoPrediction.id,
              },
            });
          }
          await prisma.photoPrediction.update({
            where: {
              id: photoPrediction.id,
            },
            data: {
              status: webhookData.status,
            },
          });
          return NextResponse.json(
            { success: true },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { error: 'Photo prediction not found' },
            { status: 404 }
          );
        }
      case 'ERROR':
        prisma.photoPrediction.update({
          where: {
            requestId: webhookData.request_id,
          },
          data: {
            status: webhookData.status,
          },
        });

        console.error('Webhook error:', webhookData.error);
        return NextResponse.json(
          { error: 'Error generating images' },
          { status: 500 }
        );
      default:
        return NextResponse.json(
          { error: 'Unhandled webhook status' },
          { status: 500 }
        );
    }

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
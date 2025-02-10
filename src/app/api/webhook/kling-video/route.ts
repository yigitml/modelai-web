import { NextResponse } from 'next/server';
import { FalAIWebhookRequest, KlingImageToVideoOutput } from '@/types/fal';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const webhookData: FalAIWebhookRequest<KlingImageToVideoOutput> = await request.json();
    
    if (!webhookData.request_id || !webhookData.status) {
      return NextResponse.json(
        { error: 'Invalid webhook payload structure' },
        { status: 400 }
      );
    }

    switch (webhookData.status) {
      case 'OK':
        const videoPrediction = await prisma.videoPrediction.findUnique({
          where: {
            requestId: webhookData.request_id,
          },
        });


        if (videoPrediction) {
          const { video } = webhookData.payload;

          await prisma.video.create({
            data: {
              url: video.url,
              userId: videoPrediction.userId,
              videoPredictionId: videoPrediction.id,
              photoId: videoPrediction.photoId,
            },
          });
          
          await prisma.videoPrediction.update({
            where: {
              id: videoPrediction.id,
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
            { error: 'Video prediction not found' },
            { status: 404 }
          );
        }

      case 'ERROR':
        await prisma.videoPrediction.update({
          where: {
            requestId: webhookData.request_id,
          },
          data: {
            status: webhookData.status,
          },
        });

        console.error('Webhook error:', webhookData.error);
        return NextResponse.json(
          { error: 'Error processing video' },
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
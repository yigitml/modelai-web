import { NextResponse } from 'next/server';
import { FalAIWebhookRequest, FluxLoraPortraitTrainerOutput } from '@/types/fal';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const webhookData: FalAIWebhookRequest<FluxLoraPortraitTrainerOutput> = await request.json();
    
    if (!webhookData.request_id || !webhookData.status) {
      return NextResponse.json(
        { error: 'Invalid webhook payload structure' },
        { status: 400 }
      );
    }

    switch (webhookData.status) {
      case 'OK':
        const training = await prisma.training.findUnique({
          where: {
            requestId: webhookData.request_id,
          },
        });

        if (training) {
          const { diffusers_lora_file } = webhookData.payload;
          await prisma.model.update({
            where: {
              id: training.modelId,
            },
            data: {
              loraWeights: diffusers_lora_file.url,
              userId: training.userId,
              training: {
                update: {
                  status: webhookData.status,
                },
              },
            },
          });
          
          await prisma.training.update({
            where: {
              id: training.id,
            },
            data: {
              status: webhookData.status
            },
          });
          
          return NextResponse.json(
            { success: true },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { error: 'Model training not found' },
            { status: 404 }
          );
        }

      case 'ERROR':
        await prisma.training.update({
          where: {
            requestId: webhookData.request_id,
          },
          data: {
            status: webhookData.status,
          },
        });
        
        console.error('Webhook error:', webhookData.error);
        return NextResponse.json(
          { error: 'Error training model' },
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

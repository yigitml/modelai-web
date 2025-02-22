import { FluxLoraInput, FluxLoraPortraitTrainerInput, FluxLoraPortraitTrainerResult, FluxLoraResult, KlingImageToVideoInput, KlingImageToVideoResult, QueueUpdate } from "@/types/fal";
import { fal } from "@fal-ai/client";

/**
 * Uploads a file to the fal storage and returns the URL.
 *
 * @param file - The file to be uploaded.
 * @returns A promise that resolves to the URL of the uploaded file.
 */
export async function uploadFile(file: File): Promise<string> {
  try {
    fal.config({
      credentials: process.env.FAL_API_KEY
    });

    const url = await fal.storage.upload(file);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

/**
 * Request the Flux LoRA Portrait Trainer API.
 * 
 * @param input - The input parameters for training the model.
 * @param onQueueUpdate - Optional callback function to receive updates on the request queue status.
 * @param logs - Whether to enable logging for the request (default: false).
 * @returns A promise that resolves to the API result containing the model files and the requestId.
 */
export async function requestFluxLoraPortraitTrainer(
  input: FluxLoraPortraitTrainerInput,
  webhookUrl: string
): Promise<string> {
  try {
    fal.config({
      credentials: process.env.FAL_API_KEY
    });

    const { request_id } = await fal.queue.submit("fal-ai/flux-lora-portrait-trainer", {
      input,
      webhookUrl,
    });
    return request_id;
  } catch (error) {
    console.error("Error requesting Flux LoRA Portrait Trainer:", error);
    throw error;
  }
}

/**
 * Request the Flux LoRA inference API to generate images using trained LoRA weights.
 *
 * @param input - The input parameters for generating an image.
 * @param onQueueUpdate - Optional callback to receive updates on the request status.
 * @param logs - Whether to enable logging (default: false).
 * @returns A promise that resolves to the API result containing the generated images and a requestId.
 */
export async function requestFluxLora(
  input: FluxLoraInput,
  webhookUrl: string
): Promise<string> {
  try {
    fal.config({
      credentials: process.env.FAL_API_KEY
    });

    const { request_id } = await fal.queue.submit("fal-ai/flux-lora", {
      input,
      webhookUrl,
    });
    return request_id;
  } catch (error) {
    console.error("Error requesting Flux LoRA:", error);
    throw error;
  }
}

/**
 * Request the Kling 1.6 Image to Video API.
 *
 * When a webhookUrl is provided, this function uses fal.queue.submit to submit the job,
 * and returns an object with a { request_id } property. Without a webhookUrl, it uses
 * fal.subscribe to wait for the result and returns the complete response.
 *
 * @param input - The input parameters.
 * @param webhookUrl - (Optional) The webhook endpoint to receive the result.
 * @param onQueueUpdate - (Optional) Callback to receive request queue status updates.
 * @param logs - Whether to enable logging (default: false).
 * @returns A promise that resolves either to the complete result or to a { request_id } object.
 */
export async function requestKlingImageToVideo(
  input: KlingImageToVideoInput,
  webhookUrl: string
): Promise<string> {
  try {
    fal.config({
      credentials: process.env.FAL_API_KEY
    });

    const { request_id } = await fal.queue.submit("fal-ai/kling-video/v1.6/pro/image-to-video", {
      input,
      webhookUrl,
    });
    return request_id;
  } catch (error) {
    console.error("Error requesting Kling Image to Video:", error);
    throw error;
  }
}
import Replicate, {
  Model,
  Prediction,
  Training,
  WebhookEventType,
} from "replicate";
import {
  CreateModelRequest,
  CreatePredictionRequest,
  TrainModelRequest,
} from "@/types/api";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
//const MODEL_OWNER = process.env.REPLICATE_MODEL_OWNER;

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
  userAgent: "modeai-web/1.0.0",
});

interface UploadResponse {
  urls: string[];
  size?: number;
}

export const uploadFile = async (data: FormData): Promise<UploadResponse> => {
  try {
    const file = data.get("file");
    if (!file || !(file instanceof File))
      throw new Error("No valid file provided");
    const response = await replicate.files.create(file);
    return {
      urls: [response.urls.get],
      size: response.size,
    };
  } catch (error) {
    handleApiError(error, "Error uploading file");
    throw error;
  }
};

export const createModel = async (data: CreateModelRequest): Promise<Model> => {
  try {
    const response = await replicate.models.create(data.owner, data.name, {
      visibility: data.visibility || "private",
      hardware: data.hardware || "cpu",
      description: data.description,
    });
    // Transform the response to match ModelResponse type
    return response;
  } catch (error) {
    handleApiError(error, "Error creating model");
    throw error;
  }
};

export const getModelById = async (
  owner: string,
  name: string,
): Promise<Model> => {
  try {
    return await replicate.models.get(owner, name);
  } catch (error) {
    handleApiError(error, `Error fetching model ${owner}/${name}`);
    throw error;
  }
};

export const trainModel = async (
  data: TrainModelRequest,
): Promise<Training> => {
  try {
    //const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/trainings`;
    const webhookUrl = `${process.env.NEXT_PUBLIC_WEBHOOK_DELIVERY_URL}/api/webhooks/trainings`;
    return await replicate.trainings.create(
      data.owner,
      data.name,
      data.version,
      {
        destination: `${data.destination.owner}/${data.destination.name}`, // Format as "owner/name"
        input: data.input,
        webhook: webhookUrl,
        webhook_events_filter: webhookUrl
          ? (["completed"] as WebhookEventType[])
          : undefined,
      },
    );
  } catch (error) {
    handleApiError(error, "Error starting training");
    throw error;
  }
};

export const createPrediction = async (
  data: CreatePredictionRequest,
): Promise<Prediction> => {
  try {
    const webhookUrl = `${process.env.NEXT_PUBLIC_WEBHOOK_DELIVERY_URL}/api/webhooks/predictions`;

    return await replicate.predictions.create({
      version: data.version,
      input: data.input,
      webhook: webhookUrl,
      webhook_events_filter: webhookUrl
        ? (["completed"] as WebhookEventType[])
        : undefined,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error creating prediction: ${error.message}`);
    }
    throw new Error("An unknown error occurred while creating the prediction");
  }
};

export const getPredictionById = async (
  predictionId: string,
): Promise<Prediction> => {
  try {
    return await replicate.predictions.get(predictionId);
  } catch (error) {
    handleApiError(error, "Error fetching prediction");
    throw error;
  }
};

export const cancelPrediction = async (predictionId: string): Promise<void> => {
  try {
    await replicate.predictions.cancel(predictionId);
  } catch (error) {
    handleApiError(error, "Error canceling prediction");
    throw error;
  }
};

const handleApiError = (error: unknown, message: string) => {
  if (error instanceof Error) {
    console.error(message, error.message);
  } else {
    console.error(message, error);
  }
};

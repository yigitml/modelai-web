import { Model, Prediction } from "@/types/replicate";
import {
  CreateModelRequest,
  CreatePredictionRequest,
  TrainModelRequest,
} from "@/types/api";
import axios from "axios";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const MODEL_OWNER = process.env.REPLICATE_MODEL_OWNER;

const api = axios.create({
  baseURL: "https://api.replicate.com/v1",
  headers: {
    Authorization: `Token ${REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const uploadFile = async (data: FormData) => {
  try {
    const response = await api.post("/files", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Error uploading file");
    throw error;
  }
};

export const createModel = async (data: CreateModelRequest): Promise<Model> => {
  try {
    const response = await api.post("/models", data);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error creating model");
    throw error;
  }
};

export const getModelById = async (id: string): Promise<Model | null> => {
  try {
    const url = `/models/${MODEL_OWNER}/${id}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    handleApiError(error, `Error fetching model ${id}`);
    throw error;
  }
};

export const trainModel = async (data: TrainModelRequest) => {
  try {
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/trainings`;
    const response = await api.post("/trainings", {
      ...data,
      webhook: webhookUrl,
      webhook_events_filter: ["completed", "failed"],
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Error starting training");
    throw error;
  }
};

export const createPrediction = async (
  data: CreatePredictionRequest,
): Promise<Prediction> => {
  try {
    const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/predictions`
      : undefined;

    const requestData: {
      version: string;
      input: Record<string, unknown>;
      webhook?: string;
      webhook_events_filter?: string[];
    } = {
      ...data,
    };

    if (webhookUrl) {
      requestData.webhook = webhookUrl;
      requestData.webhook_events_filter = ["completed", "failed"];
    }

    const response = await api.post("/predictions", requestData, {
      headers: {
        Prefer: "wait=5",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data.detail || JSON.stringify(error.response.data);
      throw new Error(`Error creating prediction: ${errorMessage}`);
    }
    throw new Error("An unknown error occurred while creating the prediction");
  }
};

export const getPredictionById = async (
  predictionId: string,
): Promise<Prediction> => {
  try {
    const response = await api.get(`/predictions/${predictionId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error fetching prediction");
    throw error;
  }
};

export const cancelPrediction = async (predictionId: string): Promise<void> => {
  try {
    await api.post(`/predictions/${predictionId}/cancel`);
  } catch (error) {
    handleApiError(error, "Error canceling prediction");
    throw error;
  }
};

const handleApiError = (error: unknown, message: string) => {
  console.error(message);
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    console.error(`Stack trace: ${error.stack}`);
  } else {
    console.error(`Unknown error: ${error}`);
  }
};

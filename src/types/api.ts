import { Prediction } from "./replicate";

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PredictionsResponse {
  results: Prediction[];
  next?: string;
}

export interface CreateModelRequest {
  owner: string;
  name: string;
  description: string;
  visibility: "public" | "private";
  hardware: string;
}

export interface UploadFileRequest {
  content: File;
}

export interface TrainModelRequest {
  model: string;
  version: string;
  input: {
    instance_prompt: string;
    class_prompt: string;
    instance_data: string;
    max_train_steps: number;
    num_class_images: number;
    learning_rate: number;
    [key: string]: unknown;
  };
}

export interface CreatePredictionRequest {
  version: string;
  input: Record<string, unknown>;
}

import { WebhookEventType } from "replicate";

export interface CreateModelRequest {
  owner: string;
  name: string;
  visibility?: "public" | "private";
  hardware?: "cpu" | "gpu" | "gpu-t4" | "gpu-a100";
  description?: string;
}

export interface TrainModelRequest {
  owner: string;
  name: string;
  version: string;
  destination: {
    owner: string;
    name: string;
  };
  input: {
    [key: string]: any;
  };
}

export interface CreatePredictionRequest {
  version: string;
  input: {
    [key: string]: any;
  };
  webhook?: string;
  webhook_events_filter?: WebhookEventType[];
}

import { WebhookEventType } from "replicate";

interface WebhookConfig {
  webhook?: string;
  webhook_events_filter?: WebhookEventType[];
}

type HardwareType = "gpu-a100-large";
type VisibilityType = "public" | "private";

export interface CreateModelRequest {
  owner: string;
  name: string;
  visibility?: VisibilityType;
  hardware?: HardwareType;
  description?: string;
}

export interface TrainingInput {
  steps?: number;
  lora_rank?: number;
  optimizer?: "adamw8bit";
  batch_size?: number;
  resolution?: string;
  autocaption?: boolean;
  input_images: string;
  trigger_word: string;
  learning_rate?: number;
  wandb_project?: string;
  wandb_save_interval?: number;
  caption_dropout_rate?: number;
  cache_latents_to_disk?: boolean;
  wandb_sample_interval?: number;
}

export interface TrainModelRequest extends WebhookConfig {
  owner: string;
  name: string;
  version: string;
  destination: {
    owner: string;
    name: string;
  };
  input: TrainingInput;
}

export interface CreatePredictionRequest extends WebhookConfig {
  version: string;
  input: Record<string, unknown>;
  stream?: boolean;
  wait?: number;
}

export interface CreateDeploymentRequest {
  name: string;
  model: string;
  version: string;
  hardware: HardwareType;
  min_instances?: number;
  max_instances?: number;
}

export interface UpdateDeploymentRequest {
  model?: string;
  version?: string;
  hardware?: HardwareType;
  min_instances?: number;
  max_instances?: number;
}

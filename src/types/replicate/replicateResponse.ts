import { WebhookEventType } from "replicate";

export type Status = "starting" | "processing" | "succeeded" | "failed" | "canceled";

export interface ModelResponse {
  url: string;
  owner: string;
  name: string;
  description?: string;
  visibility: "public" | "private";
  github_url?: string;
  paper_url?: string;
  license_url?: string;
  run_count?: number;
  cover_image_url?: string;
  latest_version?: {
    id: string;
    created_at: string;
  };
}

export interface TrainingResponse {
  id: string;
  version: string;
  status: Status;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  logs?: string;
  webhook_completed?: string;
  metrics?: {
    predict_time?: number;
    training_time?: number;
  };
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export interface PredictionResponse {
  id: string;
  version: string;
  status: Status;
  input: Record<string, unknown>;
  output?: unknown;
  error?: string;
  logs?: string;
  metrics?: {
    predict_time: number;
  };
  created_at: string;
  started_at?: string;
  completed_at?: string;
  webhook?: string;
  webhook_events_filter?: WebhookEventType[];
  urls: {
    get: string;
    cancel: string;
    stream?: string;
  };
}

export interface FileResponse {
  id: string;
  name: string;
  content_type: string;
  size: number;
  etag: string;
  checksums: {
    sha256: string;
    md5: string;
  };
  metadata?: Record<string, unknown>;
  created_at: string;
  expires_at: string;
  urls: {
    get: string;
  };
}

export interface DeploymentResponse {
  owner: string;
  name: string;
  current_release: {
    number: number;
    model: string;
    version: string;
    created_at: string;
    created_by: {
      type: string;
      username: string;
      name: string;
      github_url?: string;
    };
    configuration: {
      hardware: string;
      min_instances: number;
      max_instances: number;
    };
  };
}

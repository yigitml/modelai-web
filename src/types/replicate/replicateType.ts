export interface Model {
  url: string;
  owner: string;
  name: string;
  description: string;
  visibility: "public" | "private";
  github_url: string | null;
  paper_url: string | null;
  license_url: string | null;
  run_count: number;
  cover_image_url: string | null;
  default_example: Prediction | null;
  latest_version: ModelVersion | null;
}

export interface ModelVersion {
  id: string;
  created_at: string;
  cog_version: string;
  openapi_schema: object;
}

export interface Prediction {
  id: string;
  version: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  input: Record<string, unknown>;
  output: unknown;
  error: string | null;
  logs: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  metrics: {
    predict_time: number;
  } | null;
  urls: {
    get: string;
    cancel: string;
    stream?: string;
  };
  model: string;
}

export interface Training {
  id: string;
  model: string;
  version: string;
  input: Record<string, unknown>;
  output: unknown;
  error: string | null;
  logs: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  metrics: {
    predict_time: number;
  } | null;
  urls: {
    get: string;
    cancel: string;
  };
}

export interface Deployment {
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
      github_url: string | null;
    };
    configuration: {
      hardware: string;
      min_instances: number;
      max_instances: number;
    };
  };
}

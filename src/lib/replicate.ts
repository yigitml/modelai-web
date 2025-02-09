import Replicate, {WebhookEventType } from "replicate";
import {
  CreateModelRequest,
  CreatePredictionRequest,
  TrainingInput,
} from "@/types/replicate/replicateRequest";
import {
  ModelResponse,
  PredictionResponse,
  TrainingResponse,
  FileResponse,
} from "@/types/replicate/replicateResponse";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ReplicateConfig {
  auth?: string;
  userAgent?: string;
  baseUrl?: string;
  fileEncodingStrategy?: "default" | "upload" | "data-uri";
  useFileOutput?: boolean;
}

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
  userAgent: "modeai-web/1.0.0",
  fileEncodingStrategy: "default",
  useFileOutput: true,
});

export const uploadFile = async (data: FormData): Promise<FileResponse> => {
  try {
    const file = data.get("file");
    if (!file || !(file instanceof File)) {
      throw new Error("No valid file provided");
    }
    const fileObject = await replicate.files.create(file);
    return {
      id: fileObject.id,
      name: fileObject.name,
      content_type: fileObject.content_type,
      size: fileObject.size,
      etag: fileObject.etag,
      checksums: {
        sha256: fileObject.checksum,
        md5: fileObject.checksum,
      },
      created_at: fileObject.created_at,
      expires_at: fileObject.expires_at || "",
      urls: fileObject.urls,
    };
  } catch (error) {
    handleApiError(error, "Error uploading file");
    throw error;
  }
};

export const createModel = async (
  data: CreateModelRequest
): Promise<ModelResponse> => {
  try {
    return await replicate.models.create(data.owner, data.name, {
      visibility: data.visibility || "private",
      hardware: data.hardware || "gpu-a100-large",
      description: data.description,
    });;
  } catch (error) {
    handleApiError(error, "Error creating model");
    throw error;
  }
};

export const getModelById = async (
  owner: string,
  name: string
): Promise<ModelResponse> => {
  try {
    return await replicate.models.get(owner, name);
  } catch (error) {
    handleApiError(error, `Error fetching model ${owner}/${name}`);
    throw error;
  }
};

export const trainFluxLoraModel = async (
  modelName: string,
  inputImages: string,
): Promise<TrainingResponse> => {
  try {
    const webhookUrl = `${process.env.NEXT_PUBLIC_WEBHOOK_DELIVERY_URL}/api/webhook/training`;

    const defaultTrainingInput: TrainingInput = {
      steps: 1000,
      lora_rank: 16,
      optimizer: "adamw8bit",
      batch_size: 1,
      resolution: "512,768,1024",
      autocaption: true,
      trigger_word: "C3X",
      learning_rate: 0.0004,
      wandb_project: "flux_train_replicate",
      wandb_save_interval: 100,
      caption_dropout_rate: 0.05,
      cache_latents_to_disk: false,
      wandb_sample_interval: 100,
      input_images: inputImages,
    };

    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "4ffd32160efd92e956d39c5338a9b8fbafca58e03f791f6d8011f3e20e8ea6fa",
      {
        destination: `yigitml/${modelName}`,
        input: defaultTrainingInput,
        webhook: webhookUrl,
        webhook_events_filter: webhookUrl
          ? (["completed"] as WebhookEventType[])
          : undefined,
      }
    );
    return {
      id: training.id,
      version: training.version,
      status: training.status,
      input: training.input as Record<string, unknown>,
      output: training.output,
      error: training.error as string | undefined,
      created_at: training.created_at,
      started_at: training.started_at,
      completed_at: training.completed_at,
    };
  } catch (error) {
    handleApiError(error, "Error starting training");
    throw error;
  }
};

export const createPrediction = async (
  data: CreatePredictionRequest
): Promise<PredictionResponse> => {
  try {
    const webhookUrl = `${process.env.NEXT_PUBLIC_WEBHOOK_DELIVERY_URL}/api/webhook/prediction`;

    const prediction = await replicate.predictions.create({
      version: data.version,
      input: data.input,
      stream: data.stream,
      webhook: webhookUrl,
      webhook_events_filter: webhookUrl
        ? (["completed", "output"] as WebhookEventType[])
        : undefined,
    });
    return {
      id: prediction.id,
      version: prediction.version,
      status: prediction.status,
      input: prediction.input as Record<string, unknown>,
      output: prediction.output,
      error: prediction.error as string | undefined,
      logs: prediction.logs,
      metrics: prediction.metrics as { predict_time: number } | undefined,
      created_at: prediction.created_at,
      started_at: prediction.started_at,
      completed_at: prediction.completed_at,
      webhook: prediction.webhook,
      urls: {
        get: prediction.urls.get,
        cancel: prediction.urls.cancel,
        stream: prediction.urls.stream,
      },
    };
  } catch (error) {
    handleApiError(error, "Error creating prediction");
    throw error;
  }
};

export const getPredictionById = async (
  predictionId: string
): Promise<PredictionResponse> => {
  try {
    const prediction = await replicate.predictions.get(predictionId);
    return {
      id: prediction.id,
      version: prediction.version,
      status: prediction.status,
      input: prediction.input as Record<string, unknown>,
      output: prediction.output,
      error: prediction.error as string | undefined,
      logs: prediction.logs,
      metrics: prediction.metrics as { predict_time: number } | undefined,
      created_at: prediction.created_at,
      started_at: prediction.started_at,
      completed_at: prediction.completed_at,
      urls: {
        get: prediction.urls.get,
        cancel: prediction.urls.cancel,
        stream: prediction.urls.stream,
      },
    };
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

export const streamPrediction = async (
  data: CreatePredictionRequest,
  onEvent: (event: string, data: unknown) => void
): Promise<void> => {
  try {
    const prediction = await createPrediction({ ...data, stream: true });
    
    if (prediction.urls?.stream) {
      const source = new EventSource(prediction.urls.stream, { withCredentials: true });
      
      source.addEventListener("output", (e: MessageEvent) => onEvent("output", e.data));
      source.addEventListener("error", (e: MessageEvent) => onEvent("error", JSON.parse(e.data)));
      source.addEventListener("done", (e: MessageEvent) => {
        source.close();
        onEvent("done", JSON.parse(e.data));
      });
    }
  } catch (error) {
    handleApiError(error, "Error streaming prediction");
    throw error;
  }
};

const handleApiError = (error: unknown, message: string): never => {
  if (error instanceof Error) {
    console.error(message, error.message);
    throw new Error(`${message}: ${error.message}`);
  }
  console.error(message, error);
  throw new Error(message);
};

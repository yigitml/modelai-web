/**
 * Interface representing the output file returned by the API.
 */
export interface FileOutput {
  url: string;
  content_type?: string;
  file_name?: string;
  file_size?: number;
  file_data?: string;
}

/**
 * Input type for the Flux LoRA Portrait Trainer API.
 * 
 * - images_data_url: URL to a zip archive with images of a consistent style (required).
 * - webhook_endpoint: Optional webhook URL to receive callback notifications.
 * - trigger_phrase: Trigger phrase to be used in the captions (optional).
 * - learning_rate: Learning rate to use for training (optional, default: 0.00009).
 * - steps: Number of training steps (optional, default: 2500).
 * - multiresolution_training: Whether multiresolution training is enabled (optional, default: true).
 * - subject_crop: Whether to crop the subject from the image (optional, default: true).
 * - data_archive_format: Format of the archive (optional).
 * - resume_from_checkpoint: URL to a checkpoint to resume training (optional).
 */
export interface FluxLoraPortraitTrainerInput {
  images_data_url: string;
  webhook_endpoint?: string;
  trigger_phrase?: string;
  learning_rate?: number;
  steps?: number;
  multiresolution_training?: boolean;
  subject_crop?: boolean;
  data_archive_format?: string;
  resume_from_checkpoint?: string;
}

/**
 * Output type for the Flux LoRA Portrait Trainer API.
 * 
 * - diffusers_lora_file: Contains the URL and metadata of the trained diffusers LoRA weights.
 * - config_file: Contains the URL and metadata of the training configuration file.
 */
export interface FluxLoraPortraitTrainerOutput {
  diffusers_lora_file: FileOutput;
  config_file: FileOutput;
}

/**
 * The overall shape of the response returned by the API.
 */
export interface FluxLoraPortraitTrainerResult {
  data: FluxLoraPortraitTrainerOutput;
  requestId: string;
}

/**
 * Interface for log messages returned in the queue update.
 */
export interface QueueLog {
  message: string;
}

/**
 * Interface for queue updates during the processing of long-running requests.
 */
export interface QueueUpdate {
  status: string; // E.g., "IN_PROGRESS", "COMPLETED", etc.
  logs?: QueueLog[];
}

/**
 * Type representing a LoRA weight for image generation.
 * - path: URL or path to the LoRA weights.
 * - scale: Optional scale factor for the weight (default is 1).
 */
export interface LoraWeight {
  path: string;
  scale?: number;
}

/**
 * The allowed image size options.
 * You can also pass a custom size as an object with width and height.
 */
export type ImageSize =
  | "square_hd"
  | "square"
  | "portrait_4_3"
  | "portrait_16_9"
  | "landscape_4_3"
  | "landscape_16_9"
  | {
      width: number;
      height: number;
    };

/**
 * Input type for the Flux LoRA inference API.
 *
 * - prompt: The text prompt used for generating the image (required).
 * - image_size: The size of the generated image (optional, default provided by the API).
 * - num_inference_steps: Number of inference steps (optional).
 * - seed: Seed to ensure reproducibility (optional).
 * - loras: An array of LoRA weights to be merged for the inference (optional).
 * - guidance_scale: Determines how closely the image should follow the prompt (optional).
 * - sync_mode: Wait for the image upload and return the image directly (optional).
 * - num_images: Number of images to generate (optional).
 * - enable_safety_checker: Whether to enable the NSFW safety checker (optional).
 * - output_format: The desired output format ("jpeg" or "png").
 */
export interface FluxLoraInput {
  prompt: string;
  image_size?: ImageSize;
  num_inference_steps?: number;
  seed?: number;
  loras?: LoraWeight[];
  guidance_scale?: number;
  sync_mode?: boolean;
  num_images?: number;
  enable_safety_checker?: boolean;
  output_format?: "jpeg" | "png";
  webhook_endpoint?: string;
}

/**
 * Represents an individual generated image.
 *
 * - url: URL of the generated image.
 * - width: Width of the image.
 * - height: Height of the image.
 * - content_type: (Optional) MIME type of the image.
 */
export interface FluxLoraImage {
  url: string;
  width: number;
  height: number;
  content_type?: string;
}

/**
 * Output type for the Flux LoRA inference API.
 *
 * - images: An array containing the generated images info.
 * - timings: Timing information (optional).
 * - seed: The seed used for generating the images.
 * - has_nsfw_concepts: Flag(s) indicating potential NSFW content (optional).
 * - prompt: The prompt that was used.
 */
export interface FluxLoraOutput {
  images: FluxLoraImage[];
  timings?: any;
  seed: number;
  has_nsfw_concepts?: boolean[];
  prompt: string;
}

/**
 * The overall shape of the inference response.
 *
 * - data: The output data from the API.
 * - requestId: The unique identifier for the request.
 */
export interface FluxLoraResult {
  data: FluxLoraOutput;
  requestId: string;
}

/**
 * Input type for the Kling 1.6 Image to Video API.
 * - prompt: The text prompt for the video (required).
 * - image_url: The URL of the image to be used (required).
 * - duration: Duration of the generated video in seconds (optional, default: "5").
 * - aspect_ratio: Aspect ratio of the video frame (optional, default: "16:9").
 */
export interface KlingImageToVideoInput {
  prompt: string;
  image_url: string;
  duration?: "5" | "10";
  aspect_ratio?: "16:9" | "9:16" | "1:1";
}

/**
 * Output type for the Kling 1.6 Image to Video API.
 * - video: Contains the URL (and optional metadata) of the generated video.
 */
export interface KlingImageToVideoOutput {
  video: FileOutput;
}

/**
 * The overall shape of the inference response when not using webhooks.
 */
export interface KlingImageToVideoResult {
  data: KlingImageToVideoOutput;
  requestId: string;
}
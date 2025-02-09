export interface KlingApiResponse {
  code: number;
  data: {
    task_id: string;
    model: string;
    task_type: string;
    status: "Completed" | "Processing" | "Pending" | "Failed" | "Staged";
    input: Record<string, any>;
    output: {
      video_url?: string;
    };
    meta: Record<string, any>;
    detail: null;
    logs: Array<Record<string, any>>;
    error: {
      code: number;
      raw_message: string;
      message: string;
      detail: null;
    };
  };
  message: string;
}
  
export interface CameraControl {
    type: "simple";
    config: {
      horizontal: number;
      vertical: number;
      pan: number;
      tilt: number;
      roll: number;
      zoom: number;
    };
}
  
export interface KlingBaseRequest {
  model: "kling";
  config?: {
    service_mode?: "public" | "private";
    webhook_config?: {
      endpoint: string;
      secret: string;
    };
  };
}
  
export interface ImageToVideoRequest extends KlingBaseRequest {
  task_type: "video_generation";
  input: {
    prompt?: string;
    negative_prompt?: string;
    cfg_scale?: number;
    duration?: 5 | 10;
    aspect_ratio?: "16:9" | "9:16" | "1:1";
    camera_control?: CameraControl;
    mode?: "std" | "pro";
    version?: "1.0" | "1.5" | "1.6";
    image_url: string;
    image_tail_url?: string;
  };
}
  
export interface VirtualTryOnRequest extends KlingBaseRequest {
  task_type: "virtual_tryon";
  input: {
    image_url: string;
    garment_url: string;
    preserve_head?: boolean;
  };
}
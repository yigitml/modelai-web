export interface AuthWebPostRequest {
  accessToken: string;
  sessionId: string;
}

export interface AuthMobilePostRequest {
  accessToken: string;
  deviceId: string;
}

export interface FileGetRequest {
  id?: string;
}

export interface FilePostRequest {
  modelId: string;
  photoCount: number;
}

export interface FileDeleteRequest {
  id: string;
}

export interface ModelGetRequest {
  id?: string;
}

export interface ModelPostRequest {
  name: string;
  description?: string;
}

export interface ModelPutRequest {
  id: string;
  name?: string;
  description?: string;
  avatarUrl?: string;
}

export interface ModelDeleteRequest {
  id: string;
}

export interface PhotoGetRequest {
  id?: string;
  modelId?: string;
}

export interface PhotoPostRequest {
  url: string;
  modelId: string;
}

export interface PhotoPutRequest {
  id: string;
  url?: string;
}

export interface PhotoDeleteRequest {
  id: string;
}

export interface TrainingGetRequest {
  id?: string;
}

export interface TrainingPostRequest {
  inputImages: string;
  modelId: string;
}

export interface PhotoPredictionGetRequest {
  id?: string;
}

export interface PhotoPredictionPostRequest {
  prompt: string;
  modelId: string;
  numOutputs: number;
  guidanceScale: number;
}

export interface SubscriptionGetRequest {
  id?: string;
}

export interface SubscriptionDeleteRequest {
  id: string;
}

export interface UserPostRequest {
  name: string;
}

export interface UserPutRequest {
  name?: string;
  image?: string;
}

export interface VideoGetRequest {
  id?: string;
  photoId?: string;
  modelId?: string;
}

export interface VideoPostRequest {
  url: string;
  photoId: string;
}

export interface VideoPutRequest {
  id: string;
  url?: string;
}

export interface VideoPredictionGetRequest {
  id?: string;
}

export interface VideoPredictionPostRequest {
  prompt: string;
  photoId: string;
  duration?: "5" | "10";
  aspectRatio?: "16:9" | "9:16" | "1:1";
}
export interface User {
  id: string;
  name: string;
  email: string;
  googleId: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  models: Model[];
}

export interface Model {
  id: string;
  replicateId: string;
  versionId: string;
  name: string;
  description: string;
  avatarUrl: string;
  createdAt: string;
  userId: string;
  photos: Photo[];
}

export interface Photo {
  id: string;
  url: string;
  modelId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoStatus {
  id: string;
  predictionId: string;
  status: "loading" | "completed" | "failed";
  url?: string;
}

export interface AppState {
  models: Model[];
  selectedModel: Model | null;
  photos: Photo[];
}

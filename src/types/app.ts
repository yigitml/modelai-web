export interface User {
  id: number;
  name: string;
  email: string;
  googleId: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  models: Model[];
}

export interface Model {
  id: number;
  replicateId: string;
  versionId: string;
  name: string;
  description: string;
  avatarUrl: string;
  createdAt: string;
  userId: number;
  photoIds: number[];
}

export interface Photo {
  id: string;
  url: string;
  createdAt: string;
  modelId: number;
}

export interface AppState {
  models: Model[];
  selectedModel: Model | null;
  photos: Photo[];
}

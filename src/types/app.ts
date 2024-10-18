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
  createdAt: string;
  modelId: string;
}

export interface AppState {
  models: Model[];
  selectedModel: Model | null;
  photos: Photo[];
}

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect
} from "react";
import { 
  Model,
  Photo,
  User,
  Training,
  UserCredit,
  Subscription,
  File,
  PhotoPrediction,
  VideoPrediction
} from "@prisma/client";

import {
  AuthWebPostRequest,
  UserPutRequest,
  ModelGetRequest,
  ModelPostRequest,
  ModelPutRequest,
  ModelDeleteRequest,
  PhotoGetRequest,
  PhotoPostRequest,
  PhotoPutRequest,
  PhotoDeleteRequest,
  TrainingPostRequest,
  PhotoPredictionGetRequest,
  PhotoPredictionPostRequest,
  CreditPutRequest,
} from "@/types/api/apiRequest";
import Loading from "@/components/Loading";
import { cookies } from "next/headers";

interface AppState {
  isInitialized: boolean;
  error: Error | null;

  activeTab: string;
  tabs: { name: string; text: [string, string] }[];
  
  accessToken: string | null;
  user: User | null;

  models: Model[];
  selectedModel: Model | null;

  photos: Photo[];
  selectedPhoto: Photo | null;
  
  credits: UserCredit[];
  subscription: Subscription | null;
}

interface AppContextType extends AppState {
  setActiveTab: (tab: string) => void;

  login: (data: AuthWebPostRequest) => Promise<User>;
  logout: () => Promise<void>;

  fetchUser: () => Promise<User>;
  updateUser: (data: UserPutRequest) => Promise<User>;

  fetchModels: (params?: ModelGetRequest) => Promise<Model[]>;
  createModel: (data: ModelPostRequest) => Promise<Model>;
  selectModel: (model: Model) => Promise<void>;
  updateModel: (data: ModelPutRequest) => Promise<Model>;
  deleteModel: (data: ModelDeleteRequest) => Promise<void>;

  fetchPhotos: (params?: PhotoGetRequest) => Promise<Photo[]>;
  uploadPhoto: (data: PhotoPostRequest) => Promise<Photo>;
  selectPhoto: (photo: Photo) => Promise<void>;
  deletePhoto: (data: PhotoDeleteRequest) => Promise<void>;

  createTraining: (data: TrainingPostRequest) => Promise<Training>;

  createFile: (data: FormData) => Promise<File>;

  getPhotoPrediction: (params: PhotoPredictionGetRequest) => Promise<PhotoPrediction>;
  createPhotoPrediction: (data: PhotoPredictionPostRequest) => Promise<PhotoPrediction>;

  fetchCredits: () => Promise<UserCredit[]>;
  updateCredit: (data: CreditPutRequest) => Promise<UserCredit>;

  fetchSubscription: () => Promise<Subscription>;
}

const API_ENDPOINTS = {
  TOKEN: "/api/auth/web",
  REFRESH: "/api/auth/web/refresh",
  LOGOUT: "/api/auth/web/logout",
  USER: "/api/user",
  MODEL: "/api/model",
  PHOTO: "/api/photo",
  FILE: "/api/file",
  TRAINING: "/api/training",
  PHOTO_PREDICTION: "/api/photo-prediction",
  VIDEO_PREDICTION: "/api/video-prediction",
  SUBSCRIPTION: "/api/subscription",
  CREDIT: "/api/credit",
} as const;

const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  EXPIRES_AT: "expiresAt",
  ACTIVE_TAB: "activeTab",
} as const;

const createApiClient = (getToken: () => string | null) => {
  const getDefaultHeaders = (isFileUpload = false) => {
    const headers: Record<string, string> = {};

    const accessToken = getToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    if (!isFileUpload) {
      headers["Content-Type"] = "application/json";
      headers.Accept = "application/json";
    }

    console.log('Request Headers:', {
      isFileUpload,
      headers,
      hasToken: !!accessToken
    });

    return headers;
  };

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      let errorMessage = "An unexpected error occurred";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `${response.status} ${response.statusText}`;
      } catch (e) {
        errorMessage = `${response.status} ${response.statusText}`;
      }

      const error = new Error(errorMessage);
      error.name = "ApiError";
      // @ts-ignore
      error.status = response.status;
      
      console.error(`API Error (${response.status}):`, {
        endpoint: response.url,
        message: errorMessage,
        status: response.status
      });

      throw error;
    }
    return await response.json();
  };

  const buildUrl = (endpoint: string, params?: Record<string, any>) => {
    if (!params) return endpoint;
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return queryString ? `${endpoint}?${queryString}` : endpoint;
  };

  return {
    get: async <T extends Record<string, any>>(endpoint: string, params?: T) => {
      const url = buildUrl(endpoint, params);
      const response = await fetch(url, {
        headers: getDefaultHeaders(),
        method: "GET",
        credentials: "include",
      });
      return handleResponse(response);
    },
    post: async (endpoint: string, data?: any) => {
      const isFileUpload = data instanceof FormData;
      const response = await fetch(endpoint, {
        headers: getDefaultHeaders(isFileUpload),
        method: "POST",
        body: isFileUpload ? data : JSON.stringify(data),
        credentials: "include",
      });
      return handleResponse(response);
    },
    put: async (endpoint: string, data?: any) => {
      const response = await fetch(endpoint, {
        headers: getDefaultHeaders(),
        method: "PUT",
        body: JSON.stringify(data),
        credentials: "include",
      });
      return handleResponse(response);
    },
    delete: async (endpoint: string, data?: any) => {
      const response = await fetch(endpoint, {
        headers: getDefaultHeaders(),
        method: "DELETE",
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
      });
      return handleResponse(response);
    },
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    accessToken: null,
    models: [],
    selectedModel: null,
    selectedPhoto: null,
    photos: [],
    user: null,
    error: null,
    credits: [],
    subscription: null,
    isInitialized: false,
    activeTab: "Camera",
    tabs: [
      { name: "Packs", text: ["Ready", "Packs"] },
      { name: "Prompts", text: ["Ready", "Prompts"] },
      { name: "Camera", text: ["Your", "Photos"] },
      { name: "Models", text: ["Your", "Models"] },
      { name: "Deleted", text: ["Deleted", "Models"] }
    ]
  });

  const getAccessToken = useCallback(() => state.accessToken, [state.accessToken]);

  const api = useMemo(() => createApiClient(getAccessToken), [getAccessToken]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post(API_ENDPOINTS.REFRESH);
      const newToken = response.data.token;
      const newExpiresAt = response.data.expiresAt;
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, newToken);
      localStorage.setItem(LOCAL_STORAGE_KEYS.EXPIRES_AT, newExpiresAt);
      setState(prevState => ({ ...prevState, accessToken: newToken }));
    } catch (error) {
      console.error("Refresh token error:", error);
      await logout();
    }
  }, [api]);
  
  const setActiveTab = useCallback((tab: string) => {
    setState(prevState => ({ ...prevState, activeTab: tab }));
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_TAB, tab);
  }, []);

  const login = useCallback(async (data: AuthWebPostRequest) => {
    const response = await api.post(API_ENDPOINTS.TOKEN, data);
    const token = response.data.token;
    const expiresAt = response.data.expiresAt;
    localStorage.setItem(LOCAL_STORAGE_KEYS.EXPIRES_AT, expiresAt);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token);
    setState(prevState => ({ ...prevState, accessToken: token, user: response.data.user }));
    return response.data;
  }, [api]);

  const logout = useCallback(async () => {
    const response = await api.post(API_ENDPOINTS.LOGOUT);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.EXPIRES_AT);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACTIVE_TAB);
    
    setState(prevState => ({
      ...prevState,
      accessToken: null,
      user: null,
      error: null,
      credits: [],
      subscription: null,
      tabs: [],
      models: [],
      selectedModel: null,
      photos: [],
      selectedPhoto: null,
      activeTab: "",
    }));
    return response.data;
  }, [api]);

  const fetchUser = useCallback(async () => {
    const response = await api.get(API_ENDPOINTS.USER);
    setState(prevState => ({ ...prevState, user: response.data }));
    fetchModels();
    fetchCredits();
    return response.data;
  }, [api]);

  const updateUser = useCallback(async (data: UserPutRequest) => {
    const response = await api.put(API_ENDPOINTS.USER, data);
    setState(prevState => ({ ...prevState, user: response.data }));
    return response.data;
  }, [api]);

  const fetchModels = useCallback(async (params?: ModelGetRequest) => {
    const response = await api.get(API_ENDPOINTS.MODEL, params);
    setState(prevState => ({ ...prevState, models: response.data }));
    return response.data;
  }, [api]);

  const createModel = useCallback(async (data: ModelPostRequest) => {
    const response = await api.post(API_ENDPOINTS.MODEL, data);
    setState(prevState => ({ ...prevState, models: response.data }));
    return response.data;
  }, [api]);

  const selectModel = useCallback(async (model: Model) => {
    setState(prevState => ({ ...prevState, selectedModel: model }));
  }, []);

  const updateModel = useCallback(async (data: ModelPutRequest) => {
    const response = await api.put(API_ENDPOINTS.MODEL, data);
    setState(prevState => ({ ...prevState, models: response.data }));
    return response.data;
  }, [api]);

  const deleteModel = useCallback(async (data: ModelDeleteRequest) => {
    const response = await api.delete(API_ENDPOINTS.MODEL, data);
    setState(prevState => ({ ...prevState, models: response.data }));
    return response.data;
  }, [api]);

  const fetchPhotos = useCallback(async (params?: PhotoGetRequest) => {
    const response = await api.get(API_ENDPOINTS.PHOTO, params);
    setState(prevState => ({ ...prevState, photos: response.data }));
    return response.data;
  }, [api]);

  const uploadPhoto = useCallback(async (data: PhotoPostRequest) => {
    const response = await api.post(API_ENDPOINTS.PHOTO, data);
    setState(prevState => ({ ...prevState, photos: response.data }));
    return response.data;
  }, [api]);

  const selectPhoto = useCallback(async (photo: Photo) => {
    setState(prevState => ({ ...prevState, selectedPhoto: photo }));
  }, []);

  const updatePhoto = useCallback(async (data: PhotoPutRequest) => {
    const response = await api.put(API_ENDPOINTS.PHOTO, data);
    setState(prevState => ({ ...prevState, photos: response.data }));
    return response.data;
  }, [api]);

  const deletePhoto = useCallback(async (data: PhotoDeleteRequest) => {
    const response = await api.delete(API_ENDPOINTS.PHOTO, data);
    setState(prevState => ({ ...prevState, photos: response.data }));
    return response.data;
  }, [api]);

  const fetchTrainings = useCallback(async () => {
    const response = await api.get(API_ENDPOINTS.TRAINING);
    setState(prevState => ({ ...prevState, trainings: response.data }));
    return response.data;
  }, [api]);

  const createTraining = useCallback(async (data: TrainingPostRequest) => {
    const response = await api.post(API_ENDPOINTS.TRAINING, data);
    setState(prevState => ({ ...prevState, trainings: response.data }));
    return response.data;
  }, [api]);

  const createFile = useCallback(async (data: FormData) => {
    const response = await api.post(API_ENDPOINTS.FILE, data);
    setState(prevState => ({ ...prevState, files: response.data }));
    return response.data;
  }, [api]);

  const getPhotoPrediction = useCallback(async (params: PhotoPredictionGetRequest) => {
    const response = await api.get(API_ENDPOINTS.PHOTO_PREDICTION, params);
    setState(prevState => ({ ...prevState, predictions: response.data }));
    return response.data;
  }, [api]);

  const createPhotoPrediction = useCallback(async (data: PhotoPredictionPostRequest) => {
    const response = await api.post(API_ENDPOINTS.PHOTO_PREDICTION, data);
    setState(prevState => ({ ...prevState, predictions: response.data }));
    return response.data;
  }, [api]);

  const fetchCredits = useCallback(async () => {
    const response = await api.get(API_ENDPOINTS.CREDIT);
    setState(prevState => ({ ...prevState, credits: response.data }));
    return response.data;
  }, [api]);

  const updateCredit = useCallback(async (data: CreditPutRequest) => {
    const response = await api.put(API_ENDPOINTS.CREDIT, data);
    setState(prevState => ({ ...prevState, credits: response.data }));
    return response.data;
  }, [api]);

  const fetchSubscription = useCallback(async () => {
    const response = await api.get(API_ENDPOINTS.SUBSCRIPTION);
    setState(prevState => ({ ...prevState, subscription: response.data }));
    return response.data;
  }, [api]);

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      const expiresAt = localStorage.getItem(LOCAL_STORAGE_KEYS.EXPIRES_AT);
      if (expiresAt) {
        const timeUntilExpiry = parseInt(expiresAt) * 1000 - Date.now();
        if (timeUntilExpiry > 7 * 24 * 60 * 60 * 1000) {
          refreshToken();
        }
      }
      setState(prevState => ({ ...prevState, accessToken: token }));
    }
    
    setState(prevState => ({ ...prevState, isInitialized: true }));
  }, []);

  useEffect(() => {
    if (state.accessToken) fetchUser();
  }, [state.accessToken, fetchUser]);

  useEffect(() => {
    const savedTab = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVE_TAB);
    if (savedTab) {
      setState(prev => ({ ...prev, activeTab: savedTab }));
    }
  }, []);

  const value: AppContextType = useMemo(() => ({
    ...state,
    setActiveTab,

    login,
    logout,

    fetchUser,
    updateUser,
    
    fetchModels,
    selectModel,
    createModel,
    updateModel,
    deleteModel,
    fetchPhotos,
    uploadPhoto,
    selectPhoto,
    updatePhoto,
    deletePhoto,

    createTraining,

    createFile,

    getPhotoPrediction,
    createPhotoPrediction,

    fetchCredits,
    updateCredit,

    fetchSubscription,
  }), [state, login, logout, fetchUser, updateUser, fetchModels, selectModel, createModel, updateModel, deleteModel, fetchPhotos, uploadPhoto, selectPhoto, updatePhoto, deletePhoto, fetchTrainings, createTraining, createFile, getPhotoPrediction, createPhotoPrediction, fetchCredits, updateCredit, fetchSubscription, setActiveTab]);

  if (!state.isInitialized) {
    return <Loading />;
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
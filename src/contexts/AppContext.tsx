"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { Model as AppModel, Photo } from "@/types/app";
import { CreatePredictionRequest } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

interface AppState {
  models: AppModel[];
  selectedModel: AppModel | null;
  photos: Photo[];
  user: {
    name: string;
    email: string;
    image: string;
  } | null;
}

interface AppContextType extends AppState {
  setSelectedModel: (model: AppModel) => void;
  createModel: () => Promise<void>;
  fetchModels: () => Promise<void>;
  takePhotos: (data: CreatePredictionRequest) => Promise<void>;
  fetchPhotos: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [state, setState] = useState<AppState>({
    models: [],
    selectedModel: null,
    photos: [],
    user: null,
  });

  const { data: modelsData, refetch: refetchModels } = useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      const response = await fetch("/api/models", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    enabled: false,
  });

  const { data: photosData, refetch: refetchPhotos } = useQuery({
    queryKey: ["photos", state.selectedModel?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/photos${state.selectedModel?.id ? `/${state.selectedModel?.id}` : ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    enabled: false,
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setState((prevState) => ({
        ...prevState,
        user: {
          name: session.user?.name || "",
          email: session.user?.email || "",
          image: session.user?.image || "",
        },
      }));
    }
  }, [session, status]);

  const setSelectedModel = (model: AppModel) => {
    setState((prevState) => ({ ...prevState, selectedModel: model }));
  };

  const createModel = useCallback(async () => {
    try {
      const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/trainings`;
      const response = await fetch("/api/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          owner: process.env.NEXT_PUBLIC_REPLICATE_MODEL_OWNER,
          name: "LUV",
          description: "A new model created with webhooks",
          visibility: "public",
          hardware: "cpu",
          webhook: webhookUrl,
          webhook_events_filter: ["completed", "failed"],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newModel = await response.json();
      setState((prevState) => ({
        ...prevState,
        models: [...prevState.models, newModel],
      }));

      console.log("Model created successfully:", newModel);
    } catch (error) {
      console.error("Failed to create model:", error);
    }
  }, []);

  const fetchModels = useCallback(async () => {
    try {
      await refetchModels();
      const models: AppModel[] = modelsData?.results || [];

      setState((prevState) => ({ ...prevState, models: models }));
    } catch (error) {
      console.error("Failed to fetch models:", error);
      setState((prevState) => ({ ...prevState, models: [] }));
    }
  }, [modelsData, refetchModels]);

  const takePhotos = useCallback(async (data: CreatePredictionRequest) => {
    try {
      setState((prevState) => ({
        ...prevState,
      }));

      const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/predictions`;

      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          action: "create",
          version: data.version,
          input: data.input,
          webhook: webhookUrl,
          webhook_events_filter: ["completed", "failed"],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const predictionData = await response.json();
      console.log(predictionData);
    } catch (error) {
      console.error("Failed to take photos:", error);
      setState((prevState) => ({
        ...prevState,
      }));
    }
  }, []);

  const fetchPhotos = useCallback(async () => {
    try {
      await refetchPhotos();
      const allPhotos: Photo[] = photosData?.results || [];
      setState((prevState) => ({ ...prevState, photos: allPhotos }));
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    }
  }, [photosData, refetchPhotos]);

  useEffect(() => {
    fetchModels();
    fetchPhotos();
  }, [fetchModels, fetchPhotos]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setSelectedModel,
        createModel,
        fetchModels,
        takePhotos,
        fetchPhotos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

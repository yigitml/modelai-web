"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { Model as AppModel, Photo, User } from "@/types/app";
import { CreatePredictionRequest } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

interface AppState {
  models: AppModel[];
  selectedModel: AppModel | null;
  photos: Photo[];
  user: User | null;
  jwtToken: string | null;
  isLoading: boolean;
  error: Error | null;
}

const API_ENDPOINTS = {
  TOKEN: "/api/auth/token/web",
  USERS: "/api/users",
  MODELS: "/api/models",
  PHOTOS: "/api/photos",
  PREDICTIONS: "/api/predictions",
  PREDICTION_WEBHOOK: "/api/webhooks/predictions",
  TRAINING_WEBHOOK: "/api/webhooks/trainings",
} as const;

interface AppContextType extends AppState {
  setJwtToken: (token: string | null) => void;
  getUser: () => Promise<void>;
  createModel: (newModel: AppModel) => Promise<void>;
  getModels: () => Promise<void>;
  setSelectedModel: (model: AppModel) => void;
  createPhotos: (data: CreatePredictionRequest) => Promise<void>;
  getPhotos: () => Promise<void>;
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
    jwtToken: null,
    isLoading: false,
    error: null,
  });

  const getJwtToken = async () => {
    try {
      if (!session?.idToken) {
        console.error("No ID token available in the session");
        return;
      }
      const response = await fetch(API_ENDPOINTS.TOKEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: session.idToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setJwtToken(data.token);
    } catch (error) {
      console.error("Error fetching JWT token:", error);
    }
  };

  const setJwtToken = (token: string | null) => {
    setState((prevState) => ({ ...prevState, jwtToken: token }));
  };

  const {
    /* data: userData */
  } = useQuery({
    queryKey: ["user", session?.user?.email, state.jwtToken],
    enabled: !!session?.user?.email && !!state.jwtToken,
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.USERS}?email=${session?.user?.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${state.jwtToken}`,
          },
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setState((prevState) => ({
        ...prevState,
        user: {
          id: data.id || "",
          name: data.name || session?.user?.name || "",
          email: data.email || session?.user?.email || "",
          googleId: data.googleId || "",
          avatarUrl: data.avatarUrl || session?.user?.image || "",
          createdAt: data.createdAt || "",
          updatedAt: data.updatedAt || "",
          models: data.models || [],
        },
      }));
      return data;
    },
  });

  const { /* data: modelsData, */ refetch: refetchModels } = useQuery({
    queryKey: ["models", state.user?.id],
    queryFn: async () => {
      if (!state.user?.id) {
        return [];
      }
      const response = await fetch(
        API_ENDPOINTS.MODELS + "?userId=" + state.user.id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${state.jwtToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setState((prevState) => ({ ...prevState, models: data }));
      return data;
    },
    enabled: !!state.user?.id && !!state.jwtToken,
  });

  const { /* data: photosData, */ refetch: refetchPhotos } = useQuery({
    queryKey: ["photos", state.selectedModel?.id],
    queryFn: async () => {
      if (!state.selectedModel?.id) {
        return [];
      }
      const response = await fetch(
        API_ENDPOINTS.PHOTOS + "?modelId=" + state.selectedModel.id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${state.jwtToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setState((prevState) => ({ ...prevState, photos: data }));
      return data;
    },
    enabled: !!state.selectedModel?.id && !!state.jwtToken,
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      getJwtToken();
    }
  }, [session, status]);

  const getUser = useCallback(async () => {
    if (state.jwtToken) {
      const response = await fetch(
        API_ENDPOINTS.USERS + "?email=" + session?.user?.email,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${state.jwtToken}`,
          },
        },
      );
      if (response.ok) {
        const userData = await response.json();
        setState((prevState) => ({ ...prevState, user: userData }));
      }
    }
  }, [state.jwtToken]);

  const createModel = useCallback(async (newModel: AppModel) => {
    try {
      const response = await fetch(API_ENDPOINTS.MODELS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${state.jwtToken}`,
        },
        body: JSON.stringify(newModel),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdModel = await response.json();
      setState((prevState) => ({
        ...prevState,
        models: [...prevState.models, createdModel],
      }));
    } catch (error) {
      console.error("Error creating model:", error);
    }
  }, []);

  /*
  const trainModel = useCallback(async (modelId: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.MODELS}/${modelId}/train`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${state.jwtToken}`,
        },
      });
    } catch (error) {
      console.error("Error training model:", error);
    }
  }, []);
  */

  const getModels = useCallback(async () => {
    try {
      await refetchModels();
    } catch (error) {
      console.error("Error fetching models:", error);
      setState((prevState) => ({ ...prevState, models: [] }));
    }
  }, [refetchModels]);

  const setSelectedModel = (model: AppModel) => {
    setState((prevState) => ({ ...prevState, selectedModel: model }));
  };

  const createPhotos = useCallback(
    async (data: CreatePredictionRequest) => {
      try {
        const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${API_ENDPOINTS.PREDICTION_WEBHOOK}`;

        const response = await fetch(API_ENDPOINTS.PREDICTIONS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${state.jwtToken}`,
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

        await refetchPhotos();
      } catch (error) {
        console.error("Error taking photos:", error);
      }
    },
    [refetchPhotos, state.jwtToken],
  );

  const getPhotos = useCallback(async () => {
    try {
      await refetchPhotos();
    } catch (error) {
      console.error("Error fetching photos:", error);
      setState((prevState) => ({ ...prevState, photos: [] }));
    }
  }, [refetchPhotos]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setJwtToken,
        getUser,
        createModel,
        getModels,
        setSelectedModel,
        createPhotos,
        getPhotos,
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

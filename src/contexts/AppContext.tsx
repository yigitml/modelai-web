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
import axios from "axios";

interface AppState {
  models: AppModel[];
  selectedModel: AppModel | null;
  photos: Photo[];
  user: User | null;
  jwtToken: string | null;
}

interface AppContextType extends AppState {
  setJwtToken: (token: string | null) => void;
  setSelectedModel: (model: AppModel) => void;
  createModel: () => Promise<void>;
  fetchModels: () => Promise<void>;
  takePhotos: (data: CreatePredictionRequest) => Promise<void>;
  fetchPhotos: () => Promise<void>;
  fetchUser: () => Promise<void>;
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
  });

  const setJwtToken = (token: string | null) => {
    setState((prevState) => ({ ...prevState, jwtToken: token }));
  };

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) {
        return null;
      }
      const response = await fetch("/api/users?email=" + session?.user?.email, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${state.jwtToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!session?.user?.email,
  });

  const { data: modelsData, refetch: refetchModels } = useQuery({
    queryKey: ["models", state.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/models?userId=" + state.user?.id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${state.jwtToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    enabled: false,
  });

  const { data: photosData } = useQuery({
    queryKey: ["photos", state.selectedModel?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/photos?modelId=${state.selectedModel?.id}`,
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
      return response.json();
    },
    enabled: false,
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchJwtToken();
    }
  }, [session, status]);

  const fetchJwtToken = async () => {
    try {
      if (!session?.idToken) {
        console.error("No ID token available in the session");
        return;
      }
      const response = await axios.post("/api/auth/token", {
        idToken: session.idToken,
      });
      const jwtToken = response.data.token;
      setJwtToken(jwtToken);
    } catch (error) {
      console.error("Error fetching JWT token:", error);
    }
  };

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user &&
      userData &&
      !isUserLoading
    ) {
      setState((prevState) => ({
        ...prevState,
        user: {
          id: userData.id || "",
          name: userData.name || session.user?.name || "",
          email: userData.email || session.user?.email || "",
          googleId: userData.googleId || "",
          avatarUrl: userData.avatarUrl || session.user?.image || "",
          createdAt: userData.createdAt || "",
          updatedAt: userData.updatedAt || "",
          models: userData.models || [],
        },
      }));
    }
  }, [session, status, userData, isUserLoading]);

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
          Authorization: `Bearer ${state.jwtToken}`,
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
    } catch (error) {
      console.error("Error creating model:", error);
    }
  }, []);

  const fetchModels = useCallback(async () => {
    try {
      await refetchModels();
      if (Array.isArray(modelsData)) {
        setState((prevState) => ({ ...prevState, models: modelsData }));
      } else {
        console.error("Unexpected modelsData format:", modelsData);
        setState((prevState) => ({ ...prevState, models: [] }));
      }
    } catch (error) {
      console.error("Error fetching models:", error);
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
    } catch (error) {
      console.error("Error taking photos:", error);
      setState((prevState) => ({
        ...prevState,
      }));
    }
  }, []);

  const fetchPhotos = useCallback(async () => {
    try {
      if (Array.isArray(photosData)) {
        setState((prevState) => ({ ...prevState, photos: photosData }));
      } else if (
        photosData &&
        typeof photosData === "object" &&
        "results" in photosData
      ) {
        setState((prevState) => ({ ...prevState, photos: photosData.results }));
      } else {
        console.error("Unexpected photosData format:", photosData);
        setState((prevState) => ({ ...prevState, photos: [] }));
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      setState((prevState) => ({ ...prevState, photos: [] }));
    }
  }, [photosData]);

  const fetchUser = useCallback(async () => {
    if (state.jwtToken) {
      const response = await fetch("/api/users?email=" + session?.user?.email, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${state.jwtToken}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setState((prevState) => ({ ...prevState, user: userData }));
      }
    }
  }, [state.jwtToken]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setJwtToken,
        fetchUser,
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

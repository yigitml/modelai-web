"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, AlertCircle, Loader2 } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Model } from "@prisma/client";

export const ModelSelector: React.FC = () => {
  const { 
    selectedModel, 
    selectModel, 
    fetchModels,
    models 
  } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(false);
        setError(null);
        await fetchModels();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load models'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadModels();
  }, [fetchModels]);

  const handleModelSelect = (model: Model) => {
    selectModel(model);
    setIsDropdownOpen(false);
  };

  // Helper to render models list or empty state
  const renderModelsList = (models: Model[]) => {
    if (Array.isArray(models) && models.length > 0) {
      return models.map((model) => (
        <div
          key={model.id}
          className={`flex flex-col hover:bg-accent cursor-pointer rounded-md overflow-hidden ${
            model.id === selectedModel?.id ? "bg-accent" : ""
          }`}
          onClick={() => handleModelSelect(model)}
        >
          <div className="w-full aspect-square overflow-hidden relative">
            {model.avatarUrl ? (
              <Image
                src={model.avatarUrl}
                alt={model.name}
                className="w-full h-full object-cover"
                height={128}
                width={128}
                layout="responsive"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm text-gray-500">No Image</span>
              </div>
            )}
            {!model.loraWeights && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                <div className="h-full text-xs text-white text-center mb-1">
                  Model is not trained yet
                </div>
              </div>
            )}
          </div>
          <span className="p-1 text-sm text-center truncate">
            {model.name}
          </span>
        </div>
      ));
    } else {
      return (
        <div className="col-span-full text-center space-y-4 p-4">
          <div>No models available</div>
            <Button
              variant="outline"
              className="flex w-full h-16 items-center text-sm sm:text-base px-2 sm:px-4"
              onClick={() => router.push("/new-model")}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-flow">
                New Model
              </span>
            </Button>
        </div>
      );
    }
  };

  // Render dropdown content based on loading/error state
  const renderDropdownContent = () => {
    if (isLoading) {
      return (
        <div className="col-span-full flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading models...</p>
        </div>
      );
    }
      
    if (error) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center p-8 text-destructive">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p>Error loading models</p>
          <p className="text-sm mt-2">{error.message}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => fetchModels()}
          >
            Try Again
          </Button>
        </div>
      );
    }
      
    return renderModelsList(models);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="relative">
          <div
            className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer"
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 relative">
              {selectedModel && selectedModel.avatarUrl && (
                <Image
                  src={selectedModel?.avatarUrl}
                  alt={selectedModel?.name ?? "No model selected"}
                  className="w-full h-full object-cover"
                  height={48}
                  width={48}
                />
              )}
            </div>
            <div className="flex justify-between items-center flex-1">
              <span className="text-lg font-semibold pl-1">
                {selectedModel?.name ?? "Select model"}
              </span>
              <ChevronDown
                className={`transition-transform duration-300 ${isDropdownOpen ? "transform rotate-180" : ""}`}
              />
            </div>
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            )}
            {error && (
              <AlertCircle className="h-4 w-4 text-destructive ml-2" />
            )}
          </div>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full mt-2 bg-background border rounded-lg shadow-lg p-2 max-h-65 overflow-y-auto"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {renderDropdownContent()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

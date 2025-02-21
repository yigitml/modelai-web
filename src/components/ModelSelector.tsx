"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const ModelSelector: React.FC = () => {
  const { models, selectedModel, selectModel } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    if (isFirstRender && models.length > 0 && !selectedModel) {
      const validModels = models.filter(model => model.loraWeights);
      if (validModels.length > 0) {
        selectModel(validModels[0]);
      }
      if (isFirstRender) {
        setIsFirstRender(false);
      }
    }
  }, [models, selectedModel, selectModel, isFirstRender]);

  const handleModelSelect = (model: (typeof models)[0]) => {
    selectModel(model);
    setIsDropdownOpen(false);
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
                  {Array.isArray(models) && models.length > 0 ? (
                    models.map((model) => (
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
                    ))
                  ) : (
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
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

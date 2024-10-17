"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

export const ModelSelector: React.FC = () => {
  const { models, selectedModel, setSelectedModel } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0]);
    }
  }, [models, selectedModel, setSelectedModel]);

  const handleModelSelect = (model: (typeof models)[0]) => {
    setSelectedModel(model);
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="relative">
          <div
            className="flex flex-col p-2 border rounded-lg cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-full aspect-square mb-2 rounded-md overflow-hidden">
              <Image
                src={
                  selectedModel?.avatarUrl ?? "/images/sample_images/defne.webp"
                }
                alt={selectedModel?.name ?? "No model selected"}
                className="w-full h-full object-cover"
                height={256}
                width={256}
                layout="responsive"
              />
            </div>
            <div className="flex justify-between items-center">
              <span>{selectedModel?.name ?? "Select a model"}</span>
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
                  {models.map((model) => (
                    <div
                      key={model.id}
                      className={`flex flex-col hover:bg-accent cursor-pointer rounded-md overflow-hidden ${
                        model.id === selectedModel?.id ? "bg-accent" : ""
                      }`}
                      onClick={() => handleModelSelect(model)}
                    >
                      <div className="w-full aspect-square overflow-hidden">
                        <Image
                          src={model.avatarUrl}
                          alt={model.name}
                          className="w-full h-full object-cover"
                          height={128}
                          width={128}
                          layout="responsive"
                        />
                      </div>
                      <span className="p-1 text-sm text-center truncate">
                        {model.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import UnifiedDialog from "./UnifiedDialog";
import { ChevronDown, ChevronUp } from "lucide-react";

export const ParametersForm: React.FC = () => {
  const { createPhotoPrediction, selectedModel, fetchPhotos, fetchCredits } = useAppContext();
  const [prompt, setPrompt] = useState("");
  const [orientation, setOrientation] = useState("portrait");
  const [photoCount, setPhotoCount] = useState("1");
  const [isCreating, setIsCreating] = useState(false);
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);

  const photoCountOptions = [1, 2, 3, 4];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel) {
      return;
    }
    setIsCreating(true);
    try {
      await createPhotoPrediction({
        prompt: prompt,
        modelId: selectedModel.id!,
        numOutputs: parseInt(photoCount),
        guidanceScale: 3.5,
      });

      const pollDuration = parseInt(photoCount) * 12000;
      const pollInterval = 3000;
      const startTime = Date.now();

      const pollTimer = setInterval(async () => {
        try {
          await fetchPhotos({modelId: selectedModel.id})

          if (Date.now() - startTime >= pollDuration) {
            clearInterval(pollTimer);
          }
        } catch (error) {
          console.error("Error fetching photos:", error);
          clearInterval(pollTimer);
        }
      }, pollInterval);

      fetchCredits();

    } catch (error) {
      console.error("Error creating photo prediction:", error);
      UnifiedDialog({
        open: true,
        onClose: () => {},
        title: "Error",
        description: "Error creating photo prediction: " + error,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col overflow-y-auto relative">
      <form className="space-y-2 md:space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2 md:space-y-4">
          <h2 className="font-bold mb-1 pt-2 md:mb-4 md:pt-8">Parameters</h2>
          <div className="px-1">
            <Label htmlFor="prompt" className="mb-1 md:mb-2">Prompt</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="py-1 md:py-2"
            />
          </div>
          
          <div className="md:hidden px-1">
            <Button
              type="button"
              variant="outline"
              className="w-full flex justify-between items-center py-1"
              onClick={() => setShowAdvancedParams(!showAdvancedParams)}
            >
              <span>Advanced Parameters</span>
              {showAdvancedParams ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
          
          <div className={`space-y-2 md:space-y-4 md:block ${showAdvancedParams ? 'block' : 'hidden'}`}>
            <div className="px-1">
              <Label>Orientation</Label>
              <RadioGroup value={orientation} onValueChange={setOrientation} className="flex md:block space-x-4 md:space-x-0">
                <div className="flex items-center space-x-1 md:space-x-2">
                  <RadioGroupItem value="portrait" id="portrait" />
                  <Label htmlFor="portrait">Portrait</Label>
                </div>
                <div className="flex items-center space-x-1 md:space-x-2">
                  <RadioGroupItem value="landscape" id="landscape" />
                  <Label htmlFor="landscape">Landscape</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="px-1">
              <Label htmlFor="photoCount" className="mb-1 md:mb-2">Number of Photos</Label>
              <div className="flex items-center">
                <Select value={photoCount} onValueChange={setPhotoCount}>
                  <SelectTrigger id="photoCount" className="w-full py-1 md:py-2">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {photoCountOptions.map((count) => (
                      <SelectItem key={count} value={count.toString()}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="bg-transparent p-2 mt-2 md:p-4 md:mt-4">
        <Button
          onClick={handleSubmit}
          className="w-full font-bold relative overflow-hidden group transition-transform duration-200 ease-in-out hover:scale-105"
          disabled={!selectedModel || isCreating}
        >
          <span className="absolute top-0 left-0 w-full h-full  bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 animate-flow"></span>
          <span className="relative z-10 flex items-center justify-center text-white">
            {isCreating
              ? "Creating..."
              : `Take ${photoCount} photo${parseInt(photoCount) !== 1 ? "s" : ""}`}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ParametersForm;

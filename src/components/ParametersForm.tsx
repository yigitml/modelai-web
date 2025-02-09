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

export const ParametersForm: React.FC = () => {
  const { createPhotoPrediction, selectedModel } = useAppContext();
  const [prompt, setPrompt] = useState("");
  const [orientation, setOrientation] = useState("portrait");
  const [photoCount, setPhotoCount] = useState("1");
  const [isCreating, setIsCreating] = useState(false);

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
        guidanceScale: 3,
      });
    } catch (error) {
      console.error("Error creating photo prediction:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto relative">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <h2 className="font-bold mb-4 pt-8">Parameters</h2>
          <div className="px-1">
            <Label htmlFor="prompt">Prompt</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div className="px-1">
            <Label>Orientation</Label>
            <RadioGroup value={orientation} onValueChange={setOrientation}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="portrait" id="portrait" />
                <Label htmlFor="portrait">Portrait</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="landscape" id="landscape" />
                <Label htmlFor="landscape">Landscape</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="px-1">
            <Label htmlFor="photoCount">Number of Photos</Label>
            <div className="flex items-center space-x-2">
              <Select value={photoCount} onValueChange={setPhotoCount}>
                <SelectTrigger id="photoCount" className="w-full">
                  <SelectValue placeholder="Select number of photos" />
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
      </form>

      <div className="bg-transparent p-4">
        <Button
          onClick={handleSubmit}
          className="w-full h-14 text-white font-bold relative overflow-hidden group transition-transform duration-200 ease-in-out hover:scale-105"
          disabled={!selectedModel || isCreating}
        >
          <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 animate-flow"></span>
          <span className="relative z-10 flex items-center justify-center">
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

"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";
import JSZip from "jszip";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { TrainingPostRequest } from "@/types/api/apiRequest";
import { Header } from "@/components/Header";
const MIN_TRAINING_IMAGES = 15;

export default function NewModelPage() {
  const { createModel, createTraining, createFile, user } = useAppContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    const lowercaseOnly = inputValue.replace(/[^a-z]/g, "");
    
    if (inputValue !== lowercaseOnly) {
      setNameError("Model name can only contain lowercase letters (a-z)");
    } else {
      setNameError("");
    }

    setName(lowercaseOnly);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length < MIN_TRAINING_IMAGES) {
      setImageError(`Please select at least ${MIN_TRAINING_IMAGES} images for training`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    
    setImageError("");
    setSelectedFiles(files); 

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length < MIN_TRAINING_IMAGES) {
      setImageError(`Please select at least ${MIN_TRAINING_IMAGES} images for training`);
      return;
    }

    if (nameError || !name.trim()) {
      setNameError("Please enter a valid model name");
      return;
    }

    try {
      const createdModel = await createModel({ name: name, description: description });

      const zip = new JSZip();
    
      selectedFiles.forEach((file, index) => {
        zip.file(`image_${index + 1}${file.name.substring(file.name.lastIndexOf("."))}`, file);
      });

      const zipContent = await zip.generateAsync({ type: "blob" });
      
      const zipFile = new File([zipContent], "training_images.zip", { type: "application/zip" });

      const formData = new FormData();
      formData.append("file", zipFile);
      formData.append("modelId", createdModel.id);
      formData.append("photoCount", selectedFiles.length.toString());
      formData.append("userId", user!.id);

      const uploadedZip = await createFile(formData);

      const trainingData: TrainingPostRequest = {
        inputImages: uploadedZip.url,
        modelId: createdModel.id,
      };
      await createTraining(trainingData);

      setName("");
      setDescription("");
      setSelectedFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setShowNotification(true);
    } catch (error) {
      console.error("Error in model creation process:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center tracking-tight">
          Create New <span className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Model</span>
        </h1>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-white/5 backdrop-blur-sm border-0 p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Model Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  required
                  className={`h-16 text-lg bg-white/5 border-0 hover:bg-white/10 transition-all duration-300 ${
                    nameError ? "border-red-500" : ""
                  }`}
                />
                {nameError && (
                  <p className="text-red-500 text-sm mt-1">{nameError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="h-16 text-lg bg-white/5 border-0 hover:bg-white/10 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">
                  Training Images (minimum {MIN_TRAINING_IMAGES})
                </Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  required
                  className={`flex items-center text-m bg-white/5 border-0 hover:bg-white/10 transition-all duration-300 ${
                    imageError ? "border-red-500" : ""
                  }`}
                />
                {imageError && (
                  <p className="text-red-500 text-sm mt-1">{imageError}</p>
                )}
                <p className="text-m text-gray-400">
                  Selected: {selectedFiles.length} images
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {previewUrls.map((url, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative pt-[100%] rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>

              <Button
                type="submit"
                className="w-full h-16 font-semibold text-white border-3 border-transparent bg-transparent hover:bg-white/5 transition-all duration-300 ease-in-out transform hover:scale-105 relative
                  before:absolute before:inset-0 before:p-[2px] before:rounded-md before:bg-gradient-to-r before:from-sky-500 before:via-purple-500 before:to-pink-500 before:content-[''] before:-z-10 before:mask-button text-xl"
                disabled={selectedFiles.length < MIN_TRAINING_IMAGES || !!nameError}
              >
                Create Model
              </Button>
            </div>
          </Card>
        </form>
      </div>

      {/* Notification Dialog */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full shadow-xl"
            >
              <h3 className="text-lg font-semibold mb-4 text-white">Model Creation Started!</h3>
              <p className="text-gray-300 mb-6">
                This can take up to 5 minutes. Go grab a tea and then come back! 🍵
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowNotification(false)}
                  className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
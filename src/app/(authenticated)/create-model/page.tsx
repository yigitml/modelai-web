"use client";

import React, { useState, useRef } from "react";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";

const MIN_TRAINING_IMAGES = 15;
//const MAX_TRAINING_IMAGES = 35;

export default function CreateModelPage() {
  const { jwtToken } = useAppContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length < MIN_TRAINING_IMAGES) {
      alert("Please select at least MIN_TRAINING_IMAGES images for training");
      return;
    }

    setSelectedFiles(files);

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length < MIN_TRAINING_IMAGES) {
      alert("Please select at least MIN_TRAINING_IMAGES images for training");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    selectedFiles.forEach((file) => {
      formData.append("trainingImages", file);
    });

    try {
      const response = await fetch("/api/models/train", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create model");
      }

      // Reset form
      setName("");
      setDescription("");
      setSelectedFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert("Model creation started successfully!");
    } catch (error) {
      console.error("Error creating model:", error);
      alert("Failed to create model. Please try again.");
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Model</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Model Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">
              Training Images (minimum MIN_TRAINING_IMAGES)
            </Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileSelect}
              required
            />
            <p className="text-sm text-gray-500">
              Selected: {selectedFiles.length} images
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={selectedFiles.length < MIN_TRAINING_IMAGES}
          >
            Create Model
          </Button>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}

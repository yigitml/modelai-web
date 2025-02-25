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
import { ChevronRight, Trash2, Check, X } from "lucide-react";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useRouter } from "next/navigation";
import UnifiedDialog from "@/components/UnifiedDialog";

const MIN_TRAINING_IMAGES = 15;

export default function NewModelPage() {
  const { createModel, createTraining, createFile, user, updateUser } = useAppContext();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Placeholder array for the 10x1 grid.
  // A value of "true" means the photo is considered good (green tick) while "false" shows a red x.
  const placeholderPhotos = [true, true, false, true, false, true, true, false, false, true];

  const validateName = (value: string): string => {
    // Check for consecutive spaces immediately
    if (/\s\s/.test(value)) {
      return "Consecutive spaces are not allowed";
    }

    // Check for special characters or disallowed inputs immediately
    const currentChar = value.slice(-1);
    const specialCharPattern = /[^A-Za-zÄäÜüÖöİıĞğŞşÇçÂâÎîÛûÊêÔô0-9\s]/;
    if (specialCharPattern.test(currentChar)) {
      return "Special characters are not allowed";
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return "Model name cannot be empty or just spaces";
    }
    if (trimmed.length > 30) {
      return "Model name must be at most 30 characters";
    }
    return "";
  };

  const validateDescription = (value: string): string => {
    // Check for consecutive spaces immediately
    if (/\s\s/.test(value)) {
      return "Consecutive spaces are not allowed";
    }

    // Check for special characters or disallowed inputs immediately
    const currentChar = value.slice(-1);
    const specialCharPattern = /[^A-Za-zÄäÜüÖöİıĞğŞşÇçÂâÎîÛûÊêÔô0-9\s]/;
    if (specialCharPattern.test(currentChar)) {
      return "Special characters are not allowed";
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return "Description cannot be empty or just spaces";
    }
    if (trimmed.length > 100) {
      return "Description must be at most 100 characters";
    }
    return "";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    const lastChar = inputValue.slice(-1);
    
    // Check if the last character is not allowed (excluding Turkish/German special chars)
    if (lastChar && !/[A-Za-zÄäÜüÖöİıĞğŞşÇçÂâÎîÛûÊêÔô0-9\s]/.test(lastChar)) {
      setNameError("Only letters (including Turkish/German characters) and numbers are allowed");
      // Remove the invalid character
      inputValue = inputValue.slice(0, -1);
    } else {
      // Only allow letters (including special chars), numbers, and single spaces
      // Replace consecutive spaces with a single space
      inputValue = inputValue.replace(/\s+/g, ' ');
      inputValue = inputValue.replace(/[^A-Za-zÄäÜüÖöİıĞğŞşÇçÂâÎîÛûÊêÔô0-9\s]/g, '');
      
      const error = validateName(inputValue);
      setNameError(error);
    }
    
    setName(inputValue);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value;
    const lastChar = inputValue.slice(-1);
    
    // Check if the last character is not allowed (excluding Turkish/German special chars)
    if (lastChar && !/[A-Za-zÄäÜüÖöİıĞğŞşÇçÂâÎîÛûÊêÔô0-9\s]/.test(lastChar)) {
      setDescriptionError("Only letters (including Turkish/German characters) and numbers are allowed");
      // Remove the invalid character
      inputValue = inputValue.slice(0, -1);
    } else {
      // Only allow letters (including special chars), numbers, and single spaces
      // Replace consecutive spaces with a single space
      inputValue = inputValue.replace(/\s+/g, ' ');
      inputValue = inputValue.replace(/[^A-Za-zÄäÜüÖöİıĞğŞşÇçÂâÎîÛûÊêÔô0-9\s]/g, '');
      
      const error = validateDescription(inputValue);
      setDescriptionError(error);
    }
    
    setDescription(inputValue);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    let newFiles = [...selectedFiles];
    let newUrls: string[] = [...previewUrls];

    // Check if total would exceed 50
    if (newFiles.length + files.length > 50) {
      const remainingSlots = Math.max(0, 50 - newFiles.length);
      newFiles = [...newFiles, ...files.slice(0, remainingSlots)];
      newUrls = [...newUrls, ...files.slice(0, remainingSlots).map(file => URL.createObjectURL(file))];
      setImageError("Maximum 50 images allowed. Some images were not added.");
    } else {
      newFiles = [...newFiles, ...files];
      newUrls = [...newUrls, ...files.map(file => URL.createObjectURL(file))];
      if (newFiles.length < MIN_TRAINING_IMAGES) {
        setImageError(`Please select at least ${MIN_TRAINING_IMAGES} images for training`);
      } else {
        setImageError("");
      }
    }
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
    if (newFiles.length < MIN_TRAINING_IMAGES) {
      setImageError(`Please select at least ${MIN_TRAINING_IMAGES} images for training`);
    } else {
      setImageError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate inputs before submission
    const nameValidationError = validateName(name);
    const descriptionValidationError = validateDescription(description);
    setNameError(nameValidationError);
    setDescriptionError(descriptionValidationError);
    if (nameValidationError || descriptionValidationError) {
      return;
    }
    // Even if image count is less than MIN_TRAINING_IMAGES, we continue
    if (selectedFiles.length < MIN_TRAINING_IMAGES) {
      setImageError(`Warning: It is recommended to have at least ${MIN_TRAINING_IMAGES} images for training`);
      return;
    }

    try {
      const createdModel = await createModel({ name, description });

      if (!createdModel) {
        throw new Error("Failed to create model");
      }

      const zip = new JSZip();
      selectedFiles.forEach((file, index) => {
        zip.file(
          `image_${index + 1}${file.name.substring(file.name.lastIndexOf("."))}`,
          file
        );
      });
      const zipContent = await zip.generateAsync({ type: "blob" });
      const zipFile = new File([zipContent], "training_images.zip", { type: "application/zip" });

      const formData = new FormData();
      formData.append("file", zipFile);
      formData.append("modelId", createdModel.id);
      formData.append("photoCount", selectedFiles.length.toString());
      formData.append("userId", user!.id);

      const uploadedZip = await createFile(formData);

      if (!uploadedZip) {
        throw new Error("Failed to upload zip file");
      }

      const trainingData: TrainingPostRequest = {
        inputImages: uploadedZip.url,
        modelId: createdModel.id,
      };

      const training = await createTraining(trainingData);
      if (training) {
        setName("");
        setDescription("");
        setSelectedFiles([]);
        setPreviewUrls([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setShowNotification(true);
      } else {
        throw new Error("Failed to create training");
      }
    } catch (error) {
      UnifiedDialog({
        open: true,
        onClose: () => {},
        title: "Error",
        description: "Error creating model: " + error,
      });
      console.error("Error in model creation process:", error);
    }
  };

  const handleSkip = async () => {
    try {
      const user = await updateUser({ isFirstModelCreated: true });
      if (user) {
        router.push("/home");
      }
    } catch (error) {
      console.error("Error skipping model creation", error);
    }
  };

  // Add this function to check if form is valid
  const isFormValid = () => {
    const nameIsValid = name.trim() !== '' && !nameError;
    const descriptionIsValid = description.trim() !== '' && !descriptionError;
    const hasEnoughImages = selectedFiles.length >= MIN_TRAINING_IMAGES;
    
    return nameIsValid && descriptionIsValid && hasEnoughImages;
  };

  return (
    <AuthenticatedLayout>
      <div>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center tracking-tight">
              Create New{" "}
              <span className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                Model
              </span>
            </h1>
            {user && !user.isFirstModelCreated && (
              <p className="text-white mb-8 text-lg text-center">
                It seems that you haven't created a model yet. To proceed with the app you have to create a model.
                <span 
                  onClick={handleSkip}
                  className="bg-green-500 text-background px-2 py-0.5 ml-2 cursor-pointer rounded-full font-semibold"
                >
                  Skip this for now
                </span>
              </p>
            )}
            <form onSubmit={handleSubmit}>
              <Card className="bg-white/5 backdrop-blur-sm border-0 p-6">
                <div className="flex flex-col gap-6">
                  {/* Top Section: Model Details */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <Label htmlFor="name" className="mb-3 text-xl font-bold">
                        Model Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                        required
                        className="w-full h-16 mt-2 text-lg bg-white/5 border-0 hover:bg-white/10 transition-all duration-300 resize-none"
                        maxLength={30}
                      />
                      {nameError && (
                        <p className="text-red-500 text-sm mt-1">{nameError}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="description" className="mb-3 text-xl font-bold">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        required
                        className="w-full h-16 mt-2 text-lg bg-white/5 border-0 hover:bg-white/10 transition-all duration-300 resize-none"
                        maxLength={100}
                      />
                      {descriptionError && (
                        <p className="text-red-500 text-sm mt-1">{descriptionError}</p>
                      )}
                    </div>
                  </div>

                  {/* Middle Section: Tips & Images */}
                  <div className="flex flex-col md:flex-row flex-1 gap-8">
                    {/* Left Side: Tips and Upload Button */}
                    <div className="w-full md:w-1/2 flex flex-col">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          Tips for Selecting Training Images:
                        </h3>
                        <ul className="list-none space-y-1">
                          <li className="flex items-center text-gray-300">
                            <ChevronRight className="mr-2 h-4 w-4" />
                            Use high-resolution images.
                          </li>
                          <li className="flex items-center text-gray-300">
                            <ChevronRight className="mr-2 h-4 w-4" />
                            Ensure good lighting.
                          </li>
                          <li className="flex items-center text-gray-300">
                            <ChevronRight className="mr-2 h-4 w-4" />
                            Provide varied angles.
                          </li>
                        </ul>
                      </div>

                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-14 py-4 bg-white text-black hover:bg-gray-200 transition-all"
                      >
                        {selectedFiles.length > 0 ? "Add Images" : "Select Images"}
                      </Button>
                      {/* Image count and dispose button */}
                      {selectedFiles.length > 0 && (
                        <div className="flex items-center justify-between mt-4">
                          <p className="text-m text-gray-400">
                            {selectedFiles.length} images selected
                          </p>
                          <Button
                            type="button"
                            onClick={() => {
                              setSelectedFiles([]);
                              setPreviewUrls([]);
                              setImageError(`Please select at least ${MIN_TRAINING_IMAGES} images for training`);
                            }}
                            className="bg-red-600 text-white hover:bg-red-700 transition-all flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Dispose All
                          </Button>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      {imageError && (
                        <p className="text-red-500 text-sm mt-1">{imageError}</p>
                      )}
                    </div>

                    {/* Right Side: Image Grid with Placeholder and Selected Images */}
                    <div className="w-full md:w-1/2">
                      {/* Good/Bad Images Grid */}
                      <div className="mb-4">
                        <div className="w-full overflow-x-auto">
                          <div className="grid grid-rows-1 auto-cols-[120px] grid-flow-col gap-2">
                            {placeholderPhotos.map((isGood, index) => (
                              <div
                                key={index}
                                className="relative h-28 w-[120px] rounded-lg bg-gray-700 border border-white/10 flex items-center justify-center"
                              >
                                <span className="text-white">Img {index + 1}</span>
                                <div className="absolute bottom-1 right-1">
                                  {isGood ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-500" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Selected Images Grid */}
                      <div className="h-72">
                        <div className="w-full h-full overflow-x-auto">
                          <div className="grid grid-rows-2 auto-cols-[120px] grid-flow-col gap-2 h-full">
                            {previewUrls.length > 0 ? (
                              <>
                                <div
                                  onClick={() => fileInputRef.current?.click()}
                                  className="h-32 w-[120px] rounded-lg bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all"
                                >
                                  <span className="text-3xl text-white/50">+</span>
                                </div>
                                {previewUrls.map((url, index) => (
                                  <div
                                    key={index}
                                    className="relative h-32 w-[120px] rounded-lg overflow-hidden group"
                                  >
                                    <button
                                      onClick={() => removeImage(index)}
                                      className="absolute top-1 right-1 z-10 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity"
                                    >
                                      <span className="text-white text-sm">x</span>
                                    </button>
                                    <Image
                                      src={url}
                                      alt={`Preview ${index + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                              </>
                            ) : (
                              // Placeholder grid items with a plus sign (12 items)
                              Array.from({ length: 12 }).map((_, index) => (
                                <div
                                  key={index}
                                  onClick={() => fileInputRef.current?.click()}
                                  className="h-28 w-[120px] rounded-lg bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all"
                                >
                                  <span className="text-3xl text-white/50">+</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section: Create Model Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid()}
                    className={`w-full h-22 ms-2 mx-8 py-6 font-semibold text-white transition-all duration-300 ease-in-out ${
                      isFormValid()
                        ? 'bg-transparent hover:bg-white bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 animate-flow'
                        : 'bg-transparent hover:bg-white bg-gradient-to-r from-sky-500/50 via-purple-500/50 to-pink-500/50'
                    }`}
                  >
                    Create Model
                  </Button>
                </div>
              </Card>
            </form>
          </div>

          {/* Notification Dialog */}
          {showNotification && (
            <UnifiedDialog
              open={showNotification}
              onClose={() => setShowNotification(false)}
              title="Model Creation Started!"
              description="This can take up to 5 minutes. Go grab a tea and then come back! 🍵"
              confirmText="Got it!"
            />
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
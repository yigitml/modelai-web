"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Pen } from "lucide-react";
import { format } from "date-fns";

export default function ModelsContent() {
  const { models, updateModel, photos, fetchPhotos } = useAppContext();

  // Holds the details for the model we are editing (or null)
  const [editingModel, setEditingModel] = useState<
    | null
    | {
        id: string;
        avatarUrl: string;
        name: string;
        description: string;
      }
  >(null);

  // Controls whether the photo picker dialog is open
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  const sortedModels = models.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Save all updates to model (avatar, name, description)
  const handleSave = async () => {
    if (!editingModel) return;
    try {
      await updateModel({
        id: editingModel.id,
        avatarUrl: editingModel.avatarUrl,
        name: editingModel.name,
        description: editingModel.description,
      });
      setEditingModel(null);
    } catch (error) {
      console.error("Error updating model:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <AnimatePresence mode="sync">
        {sortedModels.map((model) => {
          const isEditing =
            editingModel !== null && editingModel.id === model.id;
          return (
            <motion.div
              key={model.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative flex items-start shadow-md rounded-lg p-4 space-x-4 mb-4"
            >
              <div className="relative">
                <div className="h-36 w-36 relative rounded-full overflow-hidden bg-zinc-800">
                  {isEditing ? (
                    editingModel!.avatarUrl ? (
                      <Image
                        src={editingModel!.avatarUrl}
                        alt="Avatar"
                        width={192}
                        height={192}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-sm text-gray-500">No Image</span>
                      </div>
                    )
                  ) : model.avatarUrl ? (
                    <Image
                      src={model.avatarUrl}
                      alt="Avatar"
                      width={192}
                      height={192}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-sm text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  // Move the pen button outside the avatar container so it isn't clipped.
                  <button
                    onClick={() => setShowPhotoPicker(true)}
                    className="absolute -bottom-2 -left-2 p-1 bg-zinc-800 border border-zinc-700 rounded-full hover:bg-zinc-700"
                  >
                    <Pen className="h-4 w-4 m-1" />
                  </button>
                )}
              </div>

              <div className="flex-grow">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editingModel!.name}
                      onChange={(e) =>
                        setEditingModel({
                          ...editingModel!,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter model name"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-xl font-bold text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={editingModel!.description}
                      onChange={(e) =>
                        setEditingModel({
                          ...editingModel!,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter model description"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded mt-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-transparent"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{model.name}</h2>
                    <p className="mt-2">
                      {model.description || "No description available"}
                    </p>
                  </>
                )}
                <div className="mt-2 text-sm">
                  Created on:{" "}
                  {format(new Date(model.createdAt), "MMM d, yyyy")}
                </div>
                {isEditing && (
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => setEditingModel(null)}
                      className="top-2 right-2 px-4 py-2 rounded border border-zinc-700 hover:border-zinc-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="top-2 right-2 px-4 py-2 rounded border border-blue-500 hover:border-blue-600 transition-colors"
                      >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {!isEditing && (
                // In non-editing mode, show the "Edit" button at the card's top-right.
                <button
                  onClick={async () => {
                    setEditingModel({
                      id: model.id,
                      avatarUrl: model.avatarUrl || "",
                      name: model.name,
                      description: model.description || "",
                    });
                    // Fetch photos for the selected model using the context function.
                    await fetchPhotos({ modelId: model.id });
                  }}
                  className="absolute top-2 right-2 px-4 py-2 rounded border border-zinc-700 hover:border-zinc-500 transition-colors"
                >
                  Edit
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Photo Picker Dialog */}
      {showPhotoPicker && editingModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
            <h3 className="text-lg font-bold text-white mb-4">
              Select a Photo
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {photos.filter((photo) => photo.modelId === editingModel.id)
                .length ? (
                photos
                  .filter((photo) => photo.modelId === editingModel.id)
                  .map((photo) => (
                    <div
                      key={photo.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setEditingModel({
                          ...editingModel,
                          avatarUrl: photo.url,
                        });
                        setShowPhotoPicker(false);
                      }}
                    >
                      <Image
                        src={photo.url}
                        alt="Photo"
                        width={80}
                        height={80}
                        className="rounded"
                      />
                    </div>
                  ))
              ) : (
                <div className="col-span-3 text-center text-white">
                  No photos available.
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPhotoPicker(false)}
                className="top-2 right-2 px-4 py-2 rounded border border-zinc-700 hover:border-zinc-500 transition-colors"
                >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

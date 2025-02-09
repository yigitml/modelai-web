"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Pen } from "lucide-react";
import { format } from "date-fns";

export default function ModelsContent() {
  const { models, updateModel } = useAppContext();
  const [editingModel, setEditingModel] = useState<string | null>(null);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  const sortedModels = models
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const handleEditAvatar = async (modelId: string, url: string) => {
    try {
      await updateModel({ id: modelId, avatarUrl: url });
      setEditingModel(null);
      setNewAvatarUrl("");
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <AnimatePresence mode="sync">
        {sortedModels.map((model) => (
          <motion.div
            key={model.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center shadow-md rounded-lg p-4 space-x-4"
          >

            <div className="relative group">
              <div className="h-36 w-36 relative rounded-full overflow-hidden bg-zinc-800">
                {model.avatarUrl ? (
                  <Image
                    src={model.avatarUrl}
                    alt=""
                    width={192}
                    height={192}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setEditingModel(model.id)}
                className="absolute bottom-0 left-0 p-1 bg-zinc-800 rounded-full border border-zinc-700 hover:bg-zinc-700"
                  >
                  <Pen className="h-4 w-4 m-1" />
              </button>
              </div>

            <div className="flex-grow">
              <h2 className="text-xl font-bold">{model.name}</h2>
              <p className="mt-2">{model.description || "No description available"}</p>
              <div className="mt-2 text-sm">
                Created on: {format(new Date(model.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {editingModel && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-white">Edit Avatar URL</h3>
            <input
              type="text"
              value={newAvatarUrl}
              onChange={(e) => setNewAvatarUrl(e.target.value)}
              placeholder="Enter new avatar URL"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setEditingModel(null);
                  setNewAvatarUrl("");
                }}
                className="px-4 py-2 rounded border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditAvatar(editingModel, newAvatarUrl)}
                className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-500 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

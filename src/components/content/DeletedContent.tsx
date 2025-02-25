"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import UnifiedDialog from "@/components/UnifiedDialog";

export default function DeletedContent() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [photoToRestore, setPhotoToRestore] = useState<string | null>(null);

  const { 
    selectedModel, 
    photos, 
    fetchPhotos,
    updatePhoto
  } = useAppContext();

  useEffect(() => {
    if (selectedModel?.id) {
      // Fetch deleted photos by passing isDeleted: true
      fetchPhotos({ modelId: selectedModel.id, isDeleted: true });
    }
  }, [selectedModel, fetchPhotos]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleRestore = async (photoId: string) => {
    try {
      await updatePhoto({
        id: photoId,
        isDeleted: false
      });
      // Refresh the deleted photos list
      if (selectedModel?.id) {
        fetchPhotos({ modelId: selectedModel.id, isDeleted: true });
      }
      setRestoreDialogOpen(false);
    } catch (error) {
      console.error("Error restoring photo:", error);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Sort photos by creation date (newest first)
  const sortedPhotos = photos
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((photo) => ({
      id: photo.id,
      url: photo.url,
      status: "completed" as const,
    }));

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        {sortedPhotos.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-400">No deleted photos found</h3>
            <p className="text-gray-500 mt-2">Photos you delete will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="sync">
              {sortedPhotos.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="relative pt-[100%] rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <div onClick={() => setSelectedImage(item.url)} className="cursor-pointer">
                    <Image
                      src={item.url}
                      alt="Deleted image"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      priority={true}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setPhotoToRestore(item.id);
                      setRestoreDialogOpen(true);
                    }}
                    className="absolute bottom-2 left-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm transition-all duration-300"
                  >
                    Restore Photo
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <UnifiedDialog
        open={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
        title="Restore Photo"
        description="Are you sure you want to restore this photo?"
        confirmText="Restore"
        cancelText="Cancel"
        onConfirm={() => {
          if (photoToRestore) {
            handleRestore(photoToRestore);
          }
        }}
      />

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-[90vw] h-[90vh]"
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(selectedImage, 'photo.png');
                  }}
                  className="bg-black/50 hover:bg-black/70 text-white px-4 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  Download
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  ✕
                </button>
              </div>
              <Image
                src={selectedImage}
                alt="Selected image"
                fill
                className="object-contain"
                priority={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

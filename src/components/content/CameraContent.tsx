"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import UnifiedDialog from "@/components/UnifiedDialog";
import OnboardingOverlay from "@/components/OnboardingOverlay";

export default function CameraContent() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<any[]>([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [showNotification, setShowNotification] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [currentPhotoId, setCurrentPhotoId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);

  const { 
    selectedModel, 
    photos, 
    videos, 
    fetchPhotos, 
    fetchVideos,
    createVideoPrediction,
    fetchCredits,
    deletePhoto
  } = useAppContext();

  useEffect(() => {
    if (selectedModel?.id) {
      fetchPhotos({ modelId: selectedModel.id });
      fetchVideos({ modelId: selectedModel.id });
    }
  }, [selectedModel, fetchPhotos, fetchVideos]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
        setSelectedVideos([]);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const photoVideosMap = useMemo(() => {
    const map = new Map();
    videos.forEach((video) => {
      if (video.photoId) {
        if (!map.has(video.photoId)) {
          map.set(video.photoId, []);
        }
        map.get(video.photoId).push(video);
      }
    });
    return map;
  }, [videos]);

  const sortedPhotos = photos
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((photo) => ({
      id: photo.id,
      url: photo.url,
      status: "completed" as const,
      hasVideos: photoVideosMap.has(photo.id),
      videoCount: photoVideosMap.get(photo.id)?.length || 0,
    }));

  const allItems = [...sortedPhotos].sort((a, b) => {
    if ("position" in a && "position" in b) {
      return (a as { position: number }).position - (b as { position: number }).position;
    }
    return 0;
  });

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

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="sync">
            {allItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative pt-[100%] rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                {item.status === "completed" && (
                  <>
                    <div onClick={() => setSelectedImage(item.url)} className="cursor-pointer">
                      <Image
                        src={item.url}
                        alt="Generated image"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        priority={true}
                      />
                    </div>
                    <button
                      onClick={() => {
                        setPhotoToDelete(item.id);
                        setDeleteDialogOpen(true);
                      }}
                      className="absolute bottom-2 left-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    {item.hasVideos ? (
                      <button
                        onClick={() => {
                          const videos = photoVideosMap.get(item.id) || [];
                          setSelectedVideos(videos);
                          setSelectedVideoIndex(0);
                        }}
                        className="absolute bottom-2 right-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm transition-all duration-300"
                      >
                        Watch Video{item.videoCount > 1 ? "s" : ""} ({item.videoCount})
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setCurrentPhotoId(item.id);
                          setVideoDialogOpen(true);
                        }}
                        className="absolute bottom-2 right-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm transition-all duration-300"
                      >
                        Create Video
                      </button>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <UnifiedDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Photo"
        description="Are you sure you want to delete this photo?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (photoToDelete) {
            deletePhoto({ id: photoToDelete });
            setDeleteDialogOpen(false);
          }
        }}
      />

      <UnifiedDialog
        open={videoDialogOpen}
        onClose={() => setVideoDialogOpen(false)}
        title="Create Video"
        description="Enter a prompt for the video prediction."
        inputs={[
          {
            name: "prompt",
            label: "Video Prompt",
            placeholder: "Enter video prompt here",
          },
        ]}
        confirmText="Submit"
        cancelText="Cancel"
        onConfirm={async (values) => {
          if (currentPhotoId) {
            try {
              await createVideoPrediction({
                photoId: currentPhotoId,
                prompt: values?.prompt || "",
                duration: "5",
                aspectRatio: "16:9",
            });
            fetchCredits();
            setVideoDialogOpen(false);
            setShowNotification(true);
            } catch (error) {
              console.error("Error creating video prediction:", error);
              UnifiedDialog({
                open: true,
                onClose: () => {},
                title: "Error",
                description: "Error creating video prediction: " + error,
              });
            }
          }
        }}
      />

      <UnifiedDialog
        open={showNotification}
        onClose={() => setShowNotification(false)}
        title="Video Creation Started!"
        description="This can take up to 5 minutes. Go grab a tea and then come back! 🍵"
        confirmText="Got it!"
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

      <AnimatePresence>
        {selectedVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideos([])}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[90vw] h-[90vh]"
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(selectedVideos[selectedVideoIndex]?.url, 'video.mp4');
                  }}
                  className="bg-black/50 hover:bg-black/70 text-white px-4 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  Download
                </button>
                <button
                  onClick={() => setSelectedVideos([])}
                  className="bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                >
                  ✕
                </button>
              </div>
              <video
                src={selectedVideos[selectedVideoIndex]?.url}
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
              {selectedVideos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {selectedVideos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVideoIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === selectedVideoIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding tour overlay */}
    </>
  );
}

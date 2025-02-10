"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CameraContent() {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [selectedVideos, setSelectedVideos] = React.useState<any[]>([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = React.useState<number>(0);
  const [showNotification, setShowNotification] = React.useState(false);
  
  const { 
    selectedModel, 
    photos, 
    videos, 
    fetchPhotos, 
    fetchVideos,
    createVideoPrediction 
  } = useAppContext();

  useEffect(() => {
    if (selectedModel?.id) {
      fetchPhotos({ modelId: selectedModel.id });
      fetchVideos({ modelId: selectedModel.id });
    }
  }, [selectedModel, fetchPhotos, fetchVideos]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
        setSelectedVideos([]);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const photoVideosMap = useMemo(() => {
    const map = new Map();
    videos.forEach(video => {
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
      videoCount: photoVideosMap.get(photo.id)?.length || 0
    }));

  const allItems = [...sortedPhotos].sort((a, b) => {
    if ("position" in a && "position" in b) {
      return (a as { position: number }).position - (b as { position: number }).position;
    }
    return 0;
  });

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
                        alt={`Generated image`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        priority={true}
                      />
                    </div>
                    {item.hasVideos ? (
                      <button
                        onClick={() => {
                          const videos = photoVideosMap.get(item.id) || [];
                          setSelectedVideos(videos);
                          setSelectedVideoIndex(0);
                        }}
                        className="absolute bottom-2 left-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm transition-all duration-300"
                      >
                        Watch Video{item.videoCount > 1 ? 's' : ''} ({item.videoCount})
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          createVideoPrediction({ 
                            photoId: item.id, 
                            prompt: "", 
                            duration: "5", 
                            aspectRatio: "16:9" 
                          });
                          setShowNotification(true);
                        }}
                        className="absolute bottom-2 left-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm transition-all duration-300"
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

      {/* Add Video Modal */}
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
              <button
                onClick={() => setSelectedVideos([])}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              >
                ✕
              </button>
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
                        index === selectedVideoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
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
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              >
                ✕
              </button>
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
              <h3 className="text-lg font-semibold mb-4 text-white">Video Creation Started!</h3>
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
    </>
  );
}

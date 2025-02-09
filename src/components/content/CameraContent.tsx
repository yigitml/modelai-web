"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CameraContent() {
  const { selectedModel, photos, fetchPhotos } = useAppContext();

  useEffect(() => {
    if (
      selectedModel?.id
    ) {
      fetchPhotos({});
    }
  }, [selectedModel, fetchPhotos]);

  const sortedPhotos = photos
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map((photo) => ({
      id: photo.id,
      url: photo.url,
      status: "completed" as const,
    }));

  const allItems = [...sortedPhotos].sort((a, b) => {
    if ("position" in a && "position" in b) {
      return (
        (a as { position: number }).position -
        (b as { position: number }).position
      );
    }
    return 0;
  });

  return (
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
                  <Image
                    src={item.url}
                    alt={`Generated image`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    priority={true}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { AuthenticatedLayout } from "../../../components/layout/AuthenticatedLayout";
import { useAppContext } from "@/contexts/AppContext";
//import { LoadingPhoto } from "@/components/LoadingPhoto";
import { motion, AnimatePresence } from "framer-motion";

export default function CameraPage() {
  const { selectedModel, photos, getPhotos } = useAppContext();
  const fetchedModelRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      selectedModel?.id &&
      selectedModel.id.toString() !== fetchedModelRef.current
    ) {
      getPhotos();
      fetchedModelRef.current = selectedModel.id.toString();
    }
  }, [selectedModel]);

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
    <AuthenticatedLayout activeTab="Camera">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <AnimatePresence mode="sync">
          {allItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative w-full pt-[100%]"
            >
              {item.status === "completed" && (
                <Image
                  src={item.url}
                  alt={`Generated image`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="rounded-lg object-cover"
                  priority={true}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AuthenticatedLayout>
  );
}

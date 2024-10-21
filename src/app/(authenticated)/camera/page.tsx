"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { AuthenticatedLayout } from "../../../components/layout/AuthenticatedLayout";
import { useAppContext } from "@/contexts/AppContext";

export default function CameraPage() {
  const { selectedModel, photos, fetchPhotos } = useAppContext();
  const fetchedModelRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      selectedModel &&
      selectedModel.id.toString() !== fetchedModelRef.current
    ) {
      fetchPhotos();
      fetchedModelRef.current = selectedModel.id.toString();
    }
  }, [selectedModel, fetchPhotos, photos]);

  const images = photos
    .flatMap((photo) => (Array.isArray(photo.url) ? photo.url : [photo.url]))
    .filter(Boolean);

  return (
    <AuthenticatedLayout activeTab="Camera">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, index) => (
          <div key={`image-${index}`} className="relative w-full pt-[100%]">
            <Image
              src={src}
              alt={`Generated image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="rounded-lg object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </AuthenticatedLayout>
  );
}

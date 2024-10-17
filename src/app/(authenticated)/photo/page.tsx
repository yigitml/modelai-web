"use client";

import React from "react";
import Image from "next/image";
import { AuthenticatedLayout } from "../../../components/layout/AuthenticatedLayout";

export default function PhotoPage() {
  return (
    <AuthenticatedLayout activeTab="Photo">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="relative w-full pt-[100%]">
          <Image
            src="/images/photo.png"
            alt="Photo"
            fill={true}
            className="rounded-lg absolute top-0 left-0 object-cover"
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

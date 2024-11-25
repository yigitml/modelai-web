import React from "react";

export const LoadingPhoto: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-accent rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

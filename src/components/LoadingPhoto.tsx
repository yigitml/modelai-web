import React, { useState, useEffect } from "react";

export const LoadingPhoto: React.FC = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full pt-[100%] bg-gray-200 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
        {seconds.toFixed(1)}s
      </div>
    </div>
  );
};

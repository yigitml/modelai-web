"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Welcome to Your Gallery",
    content: "Here you can see all your created photos and videos. Use the gallery to review your work."
  },
  {
    title: "Capture New Photos",
    content: "Tap the Camera button to take new photos. Explore different angles and lighting for best results."
  },
  {
    title: "Select Your Model",
    content: "Use the Model Selector to change the AI model you are working with. Different models generate unique effects."
  },
  {
    title: "View Predictions",
    content: "Check out your AI-generated photos and videos in your timeline. Detailed stats and previews are available."
  }
];

interface OnboardingOverlayProps {
  onFinish: () => void;
}

export default function OnboardingOverlay({ onFinish }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="bg-gray-900 p-6 rounded-lg max-w-md w-full"
        >
          <h3 className="text-xl font-bold mb-2">{steps[currentStep].title}</h3>
          <p className="mb-4">{steps[currentStep].content}</p>
          <div className="flex justify-between">
              <Button onClick={handlePrev} disabled={currentStep === 0}>
                Prev
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
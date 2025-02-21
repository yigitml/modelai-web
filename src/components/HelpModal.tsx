"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full shadow-xl"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <h3 className="text-xl font-bold mb-4">Help Center</h3>
          <p className="mb-4">
            Here are some frequently asked questions and helpful guides to get you started:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li>
              <strong>How do I create models?</strong> Click on the "New Model" button to start building your AI model.
            </li>
            <li>
              <strong>How do I generate photos?</strong> After creating a model, navigate to the Camera page and follow the prompts.
            </li>
            <li>
              <strong>Free vs Premium?</strong> Freemium users have access to free base models, while premium users enjoy exclusive features.
            </li>
          </ul>
          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 
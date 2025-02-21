import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export interface InputField {
  name: string;
  label?: string;
  defaultValue?: string;
  type?: string; // e.g. "text", "number", etc.
  placeholder?: string;
}

export interface UnifiedDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  /**
   * Provide an array of input fields. If empty or omitted,
   * the component only shows the notification.
   */
  inputs?: InputField[];
  /**
   * Called when the user clicks Confirm.
   * For input dialogs, an object mapping input names to values is returned.
   * For notification dialogs, no parameters are passed.
   */
  onConfirm?: (values?: { [key: string]: string }) => void;
  confirmText?: string;
  cancelText?: string;
}

export default function UnifiedDialog({
  open,
  onClose,
  title,
  description,
  inputs = [],
  onConfirm,
  confirmText = "Got it!",
  cancelText = "Cancel",
}: UnifiedDialogProps) {
  // Build initial values for each input from the passed defaultValue (if any)
  const initialValues = inputs.reduce((acc, input) => {
    acc[input.name] = input.defaultValue || "";
    return acc;
  }, {} as { [key: string]: string });

  const [values, setValues] = useState<{ [key: string]: string }>(initialValues);

  // Reset the dialog state when it opens.
  useEffect(() => {
    if (open) {
      setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    if (onConfirm) {
      // If there are input fields, pass back the object of values.
      if (inputs.length > 0) {
        onConfirm(values);
      } else {
        onConfirm();
      }
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full shadow-xl"
          >
            {title && (
              <h3 className="text-lg font-semibold mb-4 text-white">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-gray-300 mb-6">
                {description}
              </p>
            )}

            {inputs.length > 0 && (
              <div className="flex flex-col gap-4 mb-6">
                {inputs.map((input, index) => (
                  <div key={index}>
                    {input.label && (
                      <label className="block text-sm font-medium text-white mb-1">
                        {input.label}
                      </label>
                    )}
                    <input
                      type={input.type || "text"}
                      placeholder={input.placeholder || ""}
                      value={values[input.name]}
                      onChange={(e) =>
                        handleChange(input.name, e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-sky-500"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2">
              {inputs.length > 0 && (
                <Button type="button" variant="ghost" onClick={onClose}>
                  {cancelText}
                </Button>
              )}
              <Button type="button" onClick={handleConfirm}>
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
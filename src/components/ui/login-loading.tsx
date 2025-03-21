"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoginLoadingAnimationProps {
  isLoading?: boolean;
  text?: string;
  onComplete?: () => void;
  duration?: number;
  fullScreen?: boolean;
}

export default function LoginLoadingAnimation({
  isLoading = true,
  text = "Logging in",
  onComplete,
  duration = 3000,
  fullScreen = true,
}: LoginLoadingAnimationProps) {
  const [dots, setDots] = useState("");
  useEffect(() => {
    if (!isLoading) return;
    const dotInterval = setInterval(function () {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 400);
    const completeTimer = setTimeout(function () {
      if (onComplete) onComplete();
    }, duration);
    return () => {
      clearInterval(dotInterval);
      clearTimeout(completeTimer);
    };
  }, [isLoading, duration, onComplete]);
  if (!isLoading) return null;
  const containerClasses = fullScreen
    ? "fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
    : "flex items-center justify-center";
  return (
    <div className={containerClasses}>
      <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="text-primary"
            >
              <Loader2 className="h-12 w-12 stroke-primary" />
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="h-3 w-3 rounded-full bg-primary" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-center"
          >
            <h3 className="text-xl font-medium text-foreground mb-2">
              {text}
              {dots}
            </h3>
            <p className="text-muted-foreground text-sm">
              Please wait while we verify your credentials
            </p>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: duration / 1000, ease: "easeInOut" }}
            className="h-1 bg-primary rounded-full w-full"
          />
        </div>
      </div>
    </div>
  );
}

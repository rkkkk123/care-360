"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity } from "lucide-react";

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  React.useEffect(() => {
    // Auto-complete after 15 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 15000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Activity className="h-24 w-24 text-primary" />
        </motion.div>
        
        <motion.h1
          className="mt-8 text-4xl md:text-5xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Care360
        </motion.h1>
        
        <motion.p
          className="mt-4 text-xl text-muted-foreground max-w-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Your complete healthcare companion. Initializing your experience...
        </motion.p>
      </div>

      <motion.button
        onClick={onComplete}
        className="absolute bottom-10 px-6 py-2 border border-primary/20 rounded-full text-sm hover:bg-primary/10 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        Skip Intro
      </motion.button>
    </motion.div>
  );
}

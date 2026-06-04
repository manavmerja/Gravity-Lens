"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
}: {
  text: string;
  words: string[];
  duration?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <>
      <motion.span
        layoutId="subtext"
        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-lg text-white"
      >
        {text}
      </motion.span>

      <motion.span
        layout
        className="relative w-fit overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-white/5"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -30, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{ y: 30, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 18,
            }}
            className={cn(
              "inline-block whitespace-nowrap bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            )}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
};

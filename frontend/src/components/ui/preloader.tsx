"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobiusLoopIcon } from "@/components/ui/mobius-loop-icon";

export function Preloader() {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Clean, fast preloader sequence of 3.5 seconds
    const timer = setTimeout(() => {
      setIsComplete(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            transition: { duration: 0.5, ease: "easeOut" } 
          }}
          style={{ willChange: "opacity" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030303] select-none overflow-hidden"
        >
          {/* Glowing Aura Effect */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none z-10" 
          />

          {/* Typographic Content Wrapper */}
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              transition: { duration: 0.3, ease: "easeOut" } 
            }}
            style={{ willChange: "opacity" }}
            className="relative flex flex-col items-center z-50"
          >
            {/* Big Logo Ring Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 120, 
                damping: 18,
                duration: 1.0 
              }}
              className="relative w-32 h-32 mb-6 flex items-center justify-center"
            >
              {/* Pulsating shadow ring behind the logo */}
              <div className="absolute inset-0 rounded-full bg-indigo-500/5 animate-pulse blur-lg scale-110" />
              <MobiusLoopIcon className="w-24 h-24" />
            </motion.div>

            {/* Brand Title */}
            <motion.span 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl font-extrabold tracking-[0.2em] text-white font-sans uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 text-center px-6"
            >
              Welcome to GravityLens
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

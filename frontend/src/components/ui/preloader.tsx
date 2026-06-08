"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobiusLoopIcon } from "@/components/ui/mobius-loop-icon";
import { usePathname } from "next/navigation";

interface PreloaderProps {
  isSecondary?: boolean;
}

let globalPreloaderShown = false;

export function Preloader({ isSecondary = false }: PreloaderProps) {
  const [isComplete, setIsComplete] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [localIsSecondary, setLocalIsSecondary] = useState(isSecondary);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    
    // Check cookie on the client side to override any layout SSR cache
    const cookieString = document.cookie;
    const clientHasShown = cookieString.includes("gravity-preloader-shown=true");
    const isSec = isSecondary || clientHasShown;
    setLocalIsSecondary(isSec);

    // Do not run the preloader animation again if it has already run once during this session
    // or if we are not on the root page "/"
    if (globalPreloaderShown || pathname !== "/") {
      setIsComplete(true);
      globalPreloaderShown = true;
      document.cookie = "gravity-preloader-shown=true; path=/; max-age=31536000";
      return;
    }

    // Set cookie and global tracker immediately so subsequent navigations do not trigger it
    globalPreloaderShown = true;
    document.cookie = "gravity-preloader-shown=true; path=/; max-age=31536000";
    setIsComplete(false);

    // Shorter duration (4.0s) for subsequent refreshes, 5.0s for first-time layout
    const duration = isSec ? 4000 : 5000;

    const timer = setTimeout(() => {
      setIsComplete(true);
    }, duration);

    return () => clearTimeout(timer);
  }, [pathname, isSecondary]);

  if (!mounted) {
    // Render static loader placeholder on SSR to avoid white flash on first load
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030303] select-none">
        <div className="relative flex flex-col items-center z-50">
          <div className="w-32 h-32 mb-6 flex items-center justify-center">
            <MobiusLoopIcon className="w-24 h-24" />
          </div>
          {!isSecondary && (
            <span className="text-2xl font-extrabold tracking-[0.2em] text-white/40 uppercase text-center px-6">
              Welcome to GravityLens
            </span>
          )}
        </div>
      </div>
    );
  }

  if (isComplete) return null;

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

            {/* Brand Title (Only shown on first-time load) */}
            {!localIsSecondary && (
              <motion.span 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl font-extrabold tracking-[0.2em] text-white font-sans uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 text-center px-6"
              >
                Welcome to GravityLens
              </motion.span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

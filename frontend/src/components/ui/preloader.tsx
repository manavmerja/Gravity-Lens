"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing curve (easeOutPower3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * 100));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        setTimeout(() => {
          setIsComplete(true);
        }, 300);
      }
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -100, 
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] bg-[#0A0A0F] flex flex-col items-center justify-center select-none"
        >
          {/* Glowing background aura */}
          <div className="absolute w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Loader Wrapper */}
          <div className="relative flex flex-col items-center">
            
            {/* Circular Progress Ring */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              
              {/* Outer rotating dashed ring */}
              <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  stroke="#6366F1"
                  strokeWidth="2.5"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * count) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-75 ease-out shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                  style={{
                    filter: "drop-shadow(0px 0px 6px rgba(99, 102, 241, 0.6))"
                  }}
                />
              </svg>

              {/* Central counter */}
              <div className="flex flex-col items-center justify-center font-mono">
                <span className="text-4xl font-extrabold text-white tracking-tighter">
                  {count}
                </span>
                <span className="text-[10px] text-zinc-500 font-semibold tracking-widest mt-1">
                  %
                </span>
              </div>
            </div>

            {/* Ingestion status text below */}
            <div className="mt-8 flex flex-col items-center text-center">
              <span className="text-sm font-bold text-white tracking-[0.25em] uppercase font-sans">
                GravityLens
              </span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-widest mt-2 uppercase animate-pulse">
                {count < 30 ? "Booting services..." : count < 70 ? "Connecting AWS SDK..." : count < 95 ? "Ingesting infrastructure..." : "Assembling nodes..."}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

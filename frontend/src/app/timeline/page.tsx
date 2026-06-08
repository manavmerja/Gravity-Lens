"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StarsBackground } from "@/components/ui/stars-background";

function MoveLeftArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400 group-hover:text-white transition-colors"
    >
      <motion.g>
        <motion.path
          d="M19 12H5"
          animate={{
            d: ["M19 12H5", "M12 12H5", "M19 12H5"],
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 3.0,
          }}
        />
        <motion.path
          d="M12 19l-7-7 7-7"
          animate={{
            d: ["M12 19l-7-7 7-7", "M8 19l-3-3 3-3", "M12 19l-7-7 7-7"],
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 3.0,
          }}
        />
      </motion.g>
    </svg>
  );
}

export default function TimelinePage() {
  return (
    <main className="min-h-screen bg-[#030303] text-white relative overflow-hidden flex flex-col items-center justify-center">
      <StarsBackground className="absolute inset-0 z-0 bg-[#030303]" />
      
      {/* Premium organic aurora background glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[#0025cc]/25 blur-[120px] animate-pulse duration-[8000ms]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[#42000b]/40 blur-[120px] animate-pulse duration-[6000ms]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-3xl select-none">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-8 text-gray-400 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 px-4 py-2 rounded-full transition-all flex items-center gap-2 group text-xs font-semibold"
        >
          <MoveLeftArrow />
          <span>Back to Home</span>
        </Link>

        {/* Big Premium Header & Subtext */}
        <span className="text-[11px] font-bold tracking-[0.3em] text-indigo-400 uppercase mb-4">
          GravityLens Engine
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter leading-none text-white mb-6">
          Timeline <span className="aurora-text">Feature</span> Coming Soon
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-md leading-relaxed">
          We are building a real-time historical ledger to map and replay infrastructure drift across your cloud setup. Stay tuned.
        </p>
      </div>
    </main>
  );
}

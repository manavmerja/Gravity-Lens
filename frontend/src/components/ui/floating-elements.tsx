"use client";

import { motion } from "framer-motion";
import { 
  IconBrandAws, 
  IconBrandAzure, 
  IconBrandGoogle, 
  IconBrandArc, 
  IconBrandCloudflare 
} from "@tabler/icons-react";

import StatusIndicator from "@/components/8starlabs-ui/status-indicator";

export function FloatingElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* 1. Sarah | Cloud Arch Cursor Tag (Top Left Area) */}
      <motion.div
        initial={{ x: "15vw", y: "22vh", opacity: 0, scale: 0.8 }}
        animate={{
          y: ["22vh", "20vh", "22vh"],
          opacity: 1,
          scale: 1,
        }}
        transition={{
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
          opacity: { duration: 1 },
          scale: { duration: 1 },
        }}
        className="absolute top-0 left-0 select-none active:scale-95 transition-transform"
      >
        <div className="relative">
          {/* Custom cursor arrow pointer at the top-left corner */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#0070F3] absolute -top-3.5 -left-2.5 drop-shadow-md z-20 pointer-events-none"
          >
            <path
              d="M5.5 3.21V19.33C5.5 19.86 6.07 20.19 6.53 19.92L11.53 16.92C11.75 16.79 12.01 16.75 12.26 16.82L17.75 18.28C18.29 18.42 18.8 17.95 18.67 17.41L15.26 3.79C15.14 3.32 14.63 3.09 14.2 3.32L5.94 7.62C5.66 7.76 5.5 8.05 5.5 8.36"
              fill="currentColor"
            />
          </svg>
          {/* Badge Capsule */}
          <div className="flex items-center gap-1.5 bg-[#0070F3] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-[0_8px_30px_rgb(0,112,243,0.3)] border border-[#0070F3]/30">
            <StatusIndicator state="active" size="sm" />
            Sarah | Cloud Arch
          </div>
        </div>
      </motion.div>

      {/* 2. Azure Card (Top Right Area) */}
      <motion.div
        initial={{ x: "82vw", y: "20vh", opacity: 0, scale: 0.8, rotate: 12 }}
        animate={{
          y: ["20vh", "22vh", "20vh"],
          opacity: 1,
          scale: 1,
          rotate: [12, 10, 12],
        }}
        transition={{
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
          opacity: { duration: 1 },
          scale: { duration: 1 },
        }}
        className="absolute top-0 left-0 flex items-center justify-center p-5 rounded-2xl bg-[#121218]/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md cursor-pointer hover:border-sky-500/50 hover:shadow-[0_0_25px_rgba(14,165,233,0.25)] transition-all duration-300"
      >
        <IconBrandAzure className="w-12 h-12 text-[#50e6ff]" stroke={1.5} />
      </motion.div>

      {/* 3. AWS Card (Bottom Left Area) */}
      <motion.div
        initial={{ x: "12vw", y: "62vh", opacity: 0, scale: 0.8, rotate: -8 }}
        animate={{
          y: ["62vh", "60vh", "62vh"],
          opacity: 1,
          scale: 1,
          rotate: [-8, -10, -8],
        }}
        transition={{
          y: {
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          },
          rotate: {
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          },
          opacity: { duration: 1 },
          scale: { duration: 1 },
        }}
        className="absolute top-0 left-0 flex items-center justify-center p-5 rounded-2xl bg-[#121218]/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md cursor-pointer hover:border-orange-500/50 hover:shadow-[0_0_25px_rgba(249,115,22,0.25)] transition-all duration-300"
      >
        <IconBrandAws className="w-12 h-12 text-[#FF9900]" stroke={1.5} />
      </motion.div>

      {/* 4. Google Card (Middle Right Area) */}
      <motion.div
        initial={{ x: "80vw", y: "48vh", opacity: 0, scale: 0.8, rotate: -6 }}
        animate={{
          y: ["48vh", "46vh", "48vh"],
          opacity: 1,
          scale: 1,
          rotate: [-6, -4, -6],
        }}
        transition={{
          y: {
            duration: 5.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          },
          rotate: {
            duration: 5.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          },
          opacity: { duration: 1 },
          scale: { duration: 1 },
        }}
        className="absolute top-0 left-0 flex items-center justify-center p-5 rounded-2xl bg-[#121218]/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md cursor-pointer hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-all duration-300"
      >
        <IconBrandGoogle className="w-12 h-12 text-[#4285F4]" stroke={1.5} />
      </motion.div>

      {/* 5. Arc Card (Bottom Right Area) */}
      <motion.div
        initial={{ x: "72vw", y: "74vh", opacity: 0, scale: 0.8, rotate: 10 }}
        animate={{
          y: ["74vh", "76vh", "74vh"],
          opacity: 1,
          scale: 1,
          rotate: [10, 8, 10],
        }}
        transition={{
          y: {
            duration: 6.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          },
          rotate: {
            duration: 6.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          },
          opacity: { duration: 1 },
          scale: { duration: 1 },
        }}
        className="absolute top-0 left-0 flex items-center justify-center p-5 rounded-2xl bg-[#121218]/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md cursor-pointer hover:border-red-500/50 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] transition-all duration-300"
      >
        <IconBrandArc className="w-12 h-12 text-[#F80000]" stroke={1.5} />
      </motion.div>

      {/* 6. Cloudflare Card (Middle Left Area) */}
      <motion.div
        initial={{ x: "8vw", y: "40vh", opacity: 0, scale: 0.8, rotate: -12 }}
        animate={{
          y: ["40vh", "42vh", "40vh"],
          opacity: 1,
          scale: 1,
          rotate: [-12, -15, -12],
        }}
        transition={{
          y: {
            duration: 5.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.1,
          },
          rotate: {
            duration: 5.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.1,
          },
          opacity: { duration: 1 },
          scale: { duration: 1 },
        }}
        className="absolute top-0 left-0 flex items-center justify-center p-5 rounded-2xl bg-[#121218]/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md cursor-pointer hover:border-orange-400/50 hover:shadow-[0_0_25px_rgba(251,146,60,0.25)] transition-all duration-300"
      >
        <IconBrandCloudflare className="w-12 h-12 text-[#F38020]" stroke={1.5} />
      </motion.div>
    </div>
  );
}

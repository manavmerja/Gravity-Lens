"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LiquidButton } from "@/components/ui/liquid-button";

function MoveLeftArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400 group-hover:text-white transition-colors"
    >
      <motion.g>
        <motion.path
          d="M2 12H22"
          animate={{
            d: ["M2 12H22", "M12 12H22", "M2 12H22"],
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 4.4,
          }}
        />
        <motion.path
          d="M6 8L2 12L6 16"
          animate={{
            d: ["M6 8L2 12L6 16", "M15 8L11 12L15 16", "M6 8L2 12L6 16"],
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 4.4,
          }}
        />
      </motion.g>
    </svg>
  );
}

export default function ConnectAWSPage() {
  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col lg:flex-row relative">
      {/* Left side: Video Component Placeholder & Info */}
      <div className="w-full lg:w-[48%] bg-[#030303] flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden shrink-0 border-r border-white/5 z-10">
        
        {/* Brand Link & Back Button */}
        <div className="flex items-center justify-between w-full z-10">
          <Link
            href="/"
            className="flex items-center gap-3 text-white font-bold text-xl tracking-wider hover:opacity-90 transition-opacity"
          >
            <div className="relative h-9 w-9 shrink-0">
              <Image
                src="/logo.png"
                alt="GravityLens Logo"
                fill
                className="object-contain invert"
                sizes="36px"
                priority
              />
            </div>
            <span>GravityLens</span>
          </Link>
          <Link
            href="/"
            className="text-gray-400 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 p-2 rounded-xl transition-all flex items-center justify-center group"
            aria-label="Back to Home"
          >
            <MoveLeftArrow />
          </Link>
        </div>

        {/* Video component placeholder (to be replaced by their video element next time) */}
        <div className="my-auto py-8 flex flex-col items-center justify-center z-10 w-full">
          <div className="w-full max-w-lg aspect-video rounded-2xl border border-white/5 bg-[#09090D] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center gap-3 group/video">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/video:bg-white/10 transition-all duration-300">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-gray-300 ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            
            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              How to Connect AWS Video Tutorial
            </span>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-xs text-gray-600 z-10">
          &copy; {new Date().getFullYear()} GravityLens Inc. All rights reserved.
        </p>
      </div>

      {/* Right side: Connect AWS Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 bg-[#030303] relative overflow-hidden z-10">
        {/* Slowly-shifting organic Aurora blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[15%] -right-[15%] w-[500px] h-[500px] rounded-full bg-[#0025cc]/35 blur-[90px] animate-aurora-1" />
          <div className="absolute -bottom-[15%] -left-[15%] w-[500px] h-[500px] rounded-full bg-[#00687a]/45 blur-[90px] animate-aurora-2" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="border border-white/5 bg-[#09090D] shadow-2xl overflow-hidden rounded-2xl relative w-full flex flex-col p-6 gap-6"
          >
            <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />
            
            <div className="flex flex-col space-y-1">
              <h3 className="text-xl font-bold text-white">Connect your AWS Account</h3>
              <p className="text-xs text-gray-500">
                Provide your role ARN and project details to start tracking drift.
              </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="aws-arn">AWS Role ARN</Label>
                <Input id="aws-arn" type="text" placeholder="arn:aws:iam::123456789012:role/GravityLensAccess" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" type="text" placeholder="My-Cloud-Infrastructure" />
              </div>
              
              <div className="pt-2">
                <LiquidButton
                  className="w-full bg-white text-black hover:bg-transparent hover:text-white border-transparent"
                  size="sm"
                  style={{ "--liquid-color": "#111111", "--liquid-underline": "transparent" } as React.CSSProperties}
                  type="submit"
                >
                  Connect AWS
                </LiquidButton>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

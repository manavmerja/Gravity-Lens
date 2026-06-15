"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LiquidButton } from "@/components/ui/liquid-button";
import { Backlight } from "@/components/ui/backlight";

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
      {/* Left side: Form & Branding */}
      <div className="w-full lg:w-[48%] bg-[#030303] flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden shrink-0 border-r border-white/5 z-10">
        {/* Slowly-shifting organic Aurora blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[15%] -right-[15%] w-[500px] h-[500px] rounded-full bg-[#0025cc]/35 blur-[90px] animate-aurora-1" />
          <div className="absolute -bottom-[15%] -left-[15%] w-[500px] h-[500px] rounded-full bg-[#42000b]/80 blur-[90px] animate-aurora-2" />
        </div>
        
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

        
        {/* Connect AWS Form */}
        <div className="my-auto py-8 flex items-center justify-center z-10 w-full">
          <div className="w-full max-w-md">
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

        {/* Footer text */}
        <p className="text-xs text-gray-600 z-10">
          &copy; {new Date().getFullYear()} GravityLens Inc. All rights reserved.
        </p>
      </div>

      {/* Right side: Video component with backlight */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 bg-[#030303] relative overflow-hidden z-10">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none z-0" />

        {/* Video component with premium backlight glow */}
        <div className="my-auto py-8 flex flex-col items-center justify-center z-10 w-full px-4">
          
          {/* Header instructing the user */}
          <div className="text-center max-w-lg mb-6 z-10 flex flex-col items-center justify-center gap-1.5 select-none">
            <span className="text-[10px] font-bold tracking-[0.25em] text-indigo-400 uppercase">
              Step-by-Step Guide
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              Watch this video tutorial before filling up the form
            </h2>
          </div>

          <Backlight blur={40} className="w-full max-w-lg">
            <iframe
              className="w-full aspect-video rounded-2xl border border-white/10 bg-[#09090D] shadow-2xl"
              src="https://www.youtube.com/embed/9CJLtzzUphU"
              title="How to Connect AWS Video Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </Backlight>

          {/* Quick Steps Guide */}
          <div className="w-full max-w-lg mt-8 border border-white/5 bg-[#09090D]/60 backdrop-blur-md p-6 rounded-2xl flex flex-col gap-4 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-px left-5 right-5 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Quick Setup</h4>
            <ul className="flex flex-col gap-3 text-xs text-gray-400">
              <li className="flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-300 font-semibold mt-0.5 shrink-0 group-hover:border-indigo-500/30 transition-colors">1</span>
                <span>Select <strong>AWS Account</strong> trust entity in your IAM Console.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-300 font-semibold mt-0.5 shrink-0 group-hover:border-indigo-500/30 transition-colors">2</span>
                <span>Attach <strong>ReadOnlyAccess</strong> to grant discovery permissions.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-300 font-semibold mt-0.5 shrink-0 group-hover:border-indigo-500/30 transition-colors">3</span>
                <span>Copy <strong>Role ARN</strong> and paste into the configuration form.</span>
              </li>
            </ul>
          </div>


          
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { AnimatedBadge } from "@/components/ui/animated-badge";
import { StarsBackground } from "@/components/ui/stars-background";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { FloatingElements } from "@/components/ui/floating-elements";
import { LiquidButton } from "@/components/ui/liquid-button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { BentoGrid } from "@/components/sections/bento-grid";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function Home() {
  const [typewriterKey, setTypewriterKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTypewriterKey((prev) => prev + 1);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const taglineWords = [
    { text: "Map," },
    { text: "track," },
    { text: "and" },
    { text: "reconstruct" },
    { text: "your" },
    { text: "cloud" },
    { text: "setup" },
    { text: "in" },
    { text: "real-time.", className: "text-[#6366F1] font-bold" },
  ];

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white relative overflow-hidden">
      {/* Hero Home Screen Section (with Stars & Glows) */}
      <div className="relative min-h-screen w-full">
        <StarsBackground className="min-h-screen flex flex-col items-center justify-start pt-36 relative w-full bg-[#0A0A0F]">
          <Spotlight />
          <FloatingElements />
          {/* Subtle background glow grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />
          
          {/* Top/Center Indigo Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

          {/* Bottom Purple Glow Aura */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[250px] bg-purple-600/15 rounded-t-full blur-[100px] pointer-events-none z-0" />

          {/* Hero Content Container */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* Animated Badge */}
            <div className="mb-8">
              <AnimatedBadge 
                text="Introducing GravityLens" 
                color="#6366F1" 
                href="/dashboard"
              />
            </div>

            {/* Headline with Flipping Text */}
            <div className="flex flex-col items-center justify-center text-center max-w-5xl select-none">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none text-white sm:whitespace-nowrap">
                Your <span className="aurora-text">Cloud</span> Infrastructure
              </h1>
              <div className="flex flex-row items-center justify-center gap-3 mt-4 flex-wrap">
                <LayoutTextFlip
                  text="Has a"
                  words={["Story.", "Timeline.", "Map.", "History.", "Blueprint."]}
                />
              </div>
            </div>

            {/* Typewriter Subtitle */}
            <div className="mt-4">
              <TypewriterEffectSmooth 
                key={typewriterKey}
                words={taglineWords} 
                className="text-xs sm:text-sm md:text-base font-normal my-0"
                cursorClassName="bg-[#6366F1] h-4 sm:h-5 lg:h-6"
              />
            </div>

            {/* Action Button - Moved further down to bottom area */}
            <div className="mt-28">
              <LiquidButton size="lg" className="shadow-[0_8px_30px_rgb(99,102,241,0.15)]">
                Jump Into Gravity <span className="ml-1 group-hover:translate-x-1 transition-transform duration-200">→</span>
              </LiquidButton>
            </div>
          </div>
        </StarsBackground>
      </div>

      {/* Subsequent Scroll Sections on solid dark black background */}
      <div className="relative bg-[#0A0A0F] z-20">
        <BentoGrid />
      </div>
    </main>
  );
}
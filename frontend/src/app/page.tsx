"use client";

import { AnimatedBadge } from "@/components/ui/animated-badge";
import { StarsBackground } from "@/components/ui/stars-background";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white relative overflow-hidden">
      <StarsBackground className="min-h-screen flex flex-col items-center justify-start pt-36 relative w-full bg-[#0A0A0F]">
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

          {/* Headline */}
         <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl leading-tight sm:leading-none">
            Your Cloud Infrastructure <br />
            <span className="text-gradient">Has a Story.</span>
          </h1>
        </div>
      </StarsBackground>
    </main>
  );
}
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { 
  IconBrandAws, 
  IconBrandGoogle, 
  IconBrandAzure, 
  IconBrandGithub, 
  IconBrandVercel, 
  IconBrandCloudflare,
  IconBrandDocker,
  IconBrandGit,
  IconTerminal
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
  index?: number;
  startAnimationDelay?: number;
}

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 40,
  speed = 1,
  index = 0,
  startAnimationDelay = 0,
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isInView) {
      setShouldAnimate(true);
    }
  }, [isInView]);

  return (
    <>
      {path && (
        <div ref={ref} className="absolute inset-0 pointer-events-none">
          {shouldAnimate && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1],
                delay: index * 0.2 + startAnimationDelay,
                type: "spring",
                stiffness: 120,
                damping: 18,
              }}
              className="absolute pointer-events-none"
              style={{
                width: radius * 2,
                height: radius * 2,
                left: `calc(50% - ${radius}px)`,
                top: `calc(50% - ${radius}px)`,
              }}
            >
              <div
                className={cn(
                  "size-full rounded-full",
                  "border border-white/[0.08]",
                  "bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent",
                  className
                )}
              />
            </motion.div>
          )}
        </div>
      )}
      {shouldAnimate &&
        React.Children.map(children, (child, idx) => {
          const count = React.Children.count(children);
          const angle = (360 / count) * idx;
          return (
            <div
              style={
                {
                  "--duration": `${calculatedDuration}s`,
                  "--radius": `${radius}px`,
                  "--angle": `${angle}deg`,
                  "--icon-size": `${iconSize}px`,
                } as React.CSSProperties
              }
              className={cn(
                "animate-orbit absolute z-20 flex size-[var(--icon-size)] items-center justify-center rounded-full p-1 bg-neutral-900 border border-white/10 shadow-lg text-white",
                reverse ? "[animation-direction:reverse]" : "",
                className
              )}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + idx * 0.2 + startAnimationDelay,
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                }}
              >
                {child}
              </motion.div>
            </div>
          );
        })}
    </>
  );
}

const OrbitingCirclesAnimation = () => {
  return (
    <div className="absolute inset-0 z-0 flex flex-col overflow-visible pointer-events-none" aria-hidden>
      <div className="relative flex h-[50%] min-h-[240px] w-full shrink-0 items-center justify-center overflow-visible">
        {/* Soft edge shading */}
        <div className="from-[#0A0A0F] pointer-events-none absolute bottom-0 left-0 z-20 h-20 w-full bg-gradient-to-t to-transparent" />
        <div className="from-[#0A0A0F] pointer-events-none absolute top-0 left-0 z-20 h-10 w-full bg-gradient-to-b to-transparent" />
        
        <div className="relative -mt-60 flex h-full w-full items-center justify-center">
          {/* Inner Circle (Radius: 150) */}
          <OrbitingCircles index={0} iconSize={44} radius={150} reverse speed={0.8}>
            <IconBrandAws className="w-6 h-6 text-[#FF9900]" />
            <IconBrandGoogle className="w-6 h-6 text-[#4285F4]" />
            <IconBrandAzure className="w-6 h-6 text-[#0078D4]" />
          </OrbitingCircles>

          {/* Middle Circle (Radius: 300) */}
          <OrbitingCircles index={1} iconSize={44} radius={300} speed={0.5}>
            <IconBrandGithub className="w-6 h-6 text-white" />
            <IconBrandVercel className="w-6 h-6 text-white" />
            <IconBrandCloudflare className="w-6 h-6 text-[#F38020]" />
          </OrbitingCircles>

          {/* Outer Circle (Radius: 440) */}
          <OrbitingCircles index={2} iconSize={44} radius={440} reverse speed={0.3}>
            <IconBrandDocker className="w-6 h-6 text-[#2496ED]" />
            <IconBrandGit className="w-6 h-6 text-[#F05032]" />
            <IconTerminal className="w-6 h-6 text-indigo-400" />
          </OrbitingCircles>
        </div>
      </div>
    </div>
  );
};

export function CTASection() {
  return (
    <section className="relative min-h-[30rem] w-full overflow-hidden bg-[#0A0A0F] py-20 flex flex-col items-center justify-center border-t border-white/5">
      <OrbitingCirclesAnimation />
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="via-[#0A0A0F]/20 to-[#0A0A0F]/90 pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent from-20% via-60% to-100% backdrop-blur-[0.5px]" aria-hidden />

      <div className="relative z-20 flex flex-col items-center justify-center gap-8 px-6 text-center max-w-3xl">
        <h2 className="text-white text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl leading-tight">
          Connect your Current Stack<br />and Start Automating
        </h2>
        <Link 
          href="/dashboard"
          className="px-8 py-4 bg-white text-black hover:bg-neutral-200 rounded-xl font-bold text-base shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all cursor-pointer select-none"
        >
          Start Building for Free
        </Link>
      </div>

      <style>{`
        @keyframes orbit {
          0% {
            transform: rotate(var(--angle)) translate(var(--radius)) rotate(calc(-1 * var(--angle)));
          }
          100% {
            transform: rotate(calc(var(--angle) + 360deg)) translate(var(--radius)) rotate(calc(-1 * (var(--angle) + 360deg)));
          }
        }
        .animate-orbit {
          animation: orbit var(--duration) linear infinite;
          left: calc(50% - var(--icon-size) / 2);
          top: calc(50% - var(--icon-size) / 2);
        }
      `}</style>
    </section>
  );
}

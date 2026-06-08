"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LiquidButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  delay?: number;
  fillHeight?: string | number;
  hoverScale?: number;
  tapScale?: number;
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  (
    {
      className,
      children,
      variant = "default",
      size = "default",
      fillHeight = "4px",
      hoverScale = 1.05,
      tapScale = 0.95,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="relative flex flex-col items-center select-none"
      >
        <motion.button
          ref={ref}
          variants={{
            hover: { scale: hoverScale },
            tap: { scale: tapScale },
          }}
          className={cn(
            "relative overflow-hidden font-medium transition-colors duration-300 rounded-xl border group outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0F]",
            // Size styles
            size === "default" && "px-6 py-3 text-base",
            size === "sm" && "px-4 py-2 text-sm",
            size === "lg" && "px-8 py-4 text-lg",
            size === "icon" && "p-3 flex items-center justify-center rounded-full",
            // Variant base borders/bg
            variant === "default" && "bg-white/5 text-white border-white/10 hover:border-indigo-500/30",
            variant === "secondary" && "bg-white/10 text-white border-white/20 hover:border-purple-500/30",
            variant === "destructive" && "bg-red-500/10 text-red-400 border-red-500/20 hover:border-red-500/50",
            variant === "ghost" && "bg-transparent text-white border-transparent hover:bg-white/5",
            className
          )}
          style={{
            ...props.style,
          } as React.CSSProperties}
          {...props}
        >
          
          {/* Liquid wave background fill effect */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            variants={{
              initial: { 
                height: fillHeight, 
                borderTopLeftRadius: "50% 80%",
                borderTopRightRadius: "50% 80%",
                background: variant === "destructive" 
                  ? "linear-gradient(135deg, #ef4444, #b91c1c)" 
                  : "var(--liquid-color, linear-gradient(135deg, #FF0080, #7928CA, #0070F3, #38bdf8))",
                opacity: 0.8,
                filter: "blur(1px)"
              },
              hover: { 
                height: "100%", 
                borderTopLeftRadius: "0% 0%",
                borderTopRightRadius: "0% 0%",
                opacity: 1,
                filter: "blur(0px)",
                transition: {
                  type: "spring",
                  stiffness: 120,
                  damping: 15
                }
              }
            }}
          />

          {/* Content layer positioned relative to be on top of the liquid fill */}
          <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
            {children}
          </span>
        </motion.button>

        {/* Floating Moving Aurora Underline */}
        <motion.div
          variants={{
            initial: { width: 0, opacity: 0, scaleX: 0 },
            hover: { 
              width: "70%", 
              opacity: 1, 
              scaleX: 1,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
              }
            }
          }}
          className="h-[3px] mt-3 rounded-full blur-[0.5px] bg-gradient-to-r bg-[size:200%_auto]"
          style={{
            background: "var(--liquid-underline, linear-gradient(to right, #FF0080, #7928CA, #0070F3))",
            animation: "aurora-text 4s linear infinite"
          }}
        />
      </motion.div>
    );
  }
);

LiquidButton.displayName = "LiquidButton";

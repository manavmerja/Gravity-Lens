"use client"
 
import type { ComponentProps } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
 
export type AppleHelloEffectProps = Omit<
  ComponentProps<typeof motion.svg>,
  "durationScale" | "onAnimationComplete"
> & {
  durationScale?: number
  onAnimationComplete?: () => void
}
 
export function AppleHelloEffectRajasthani({
  className,
  durationScale = 1,
  onAnimationComplete,
  ...props
}: AppleHelloEffectProps) {
  const text = "खम्मा घणी" // "Khamma Ghani" in Rajasthani / Devanagari
  
  return (
    <motion.svg
      className={cn("h-20 w-auto min-w-[280px]", className)}
      viewBox="0 0 500 120"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      <defs>
        <linearGradient id="aurora-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@700&display=swap');
        .rajasthani-text {
          font-family: 'Kalam', cursive, system-ui, sans-serif;
          font-size: 72px;
          fill: none;
          stroke: url(#aurora-gradient);
          stroke-width: 3.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}</style>
      
      <motion.text
        x="50%"
        y="60%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="rajasthani-text"
        style={{ fill: "url(#aurora-gradient)" }}
        initial={{ strokeDasharray: 400, strokeDashoffset: 400, fillOpacity: 0 }}
        animate={{ 
          strokeDashoffset: 0,
          fillOpacity: 1,
          transition: {
            strokeDashoffset: { duration: 2 * durationScale, ease: "easeInOut" },
            fillOpacity: { duration: 0.8, delay: 1.5 * durationScale, ease: "easeIn" }
          }
        }}
        onAnimationComplete={onAnimationComplete}
      >
        {text}
      </motion.text>
    </motion.svg>
  )
}

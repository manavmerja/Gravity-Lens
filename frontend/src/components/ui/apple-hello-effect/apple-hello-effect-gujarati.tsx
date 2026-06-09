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
 
export function AppleHelloEffectGujarati({
  className,
  durationScale = 1,
  onAnimationComplete,
  ...props
}: AppleHelloEffectProps) {
  const text = "કેમ છો" // "Kem Cho" in Gujarati
  
  return (
    <motion.svg
      className={cn("h-20 w-auto min-w-[200px]", className)}
      viewBox="0 0 400 120"
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
        @import url('https://fonts.googleapis.com/css2?family=Mogra&display=swap');
        .gujarati-text {
          font-family: 'Mogra', system-ui, sans-serif;
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
        className="gujarati-text"
        style={{ fill: "url(#aurora-gradient)" }}
        initial={{ strokeDasharray: 300, strokeDashoffset: 300, fillOpacity: 0 }}
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

"use client"
 
import type { SVGMotionProps } from "framer-motion"
import { motion } from "framer-motion"
 
const circle1 =
  "M12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4Z"
 
const infinity =
  "M 6 16 C 11 16 13 8 18 8 C 23.333 8 23.333 16 18 16 C 13 16 11 8 6 8 C 0.667 8 0.667 16 6 16 Z"
 
const circle2 =
  "M12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20Z"
 
export function MobiusLoopIcon(props: SVGMotionProps<SVGSVGElement>) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#mobius-aurora-gradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <defs>
        <linearGradient id="mobius-aurora-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="15%" stopColor="#a855f7" />
          <stop offset="30%" stopColor="#6366f1" />
          <stop offset="45%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#3b82f6" />
          <stop offset="75%" stopColor="#14b8a6" />
          <stop offset="90%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <motion.path
        animate={{
          d: [circle1, infinity, circle2],
        }}
        transition={{
          d: {
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          },
        }}
      />
    </motion.svg>
  )
}

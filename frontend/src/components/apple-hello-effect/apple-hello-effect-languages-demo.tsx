"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

import { AppleHelloEffectEnglish } from "@/components/apple-hello-effect/apple-hello-effect-english"
import { AppleHelloEffectHindi } from "@/components/apple-hello-effect/apple-hello-effect-hindi"
import { AppleHelloEffectSpanish } from "@/components/apple-hello-effect/apple-hello-effect-spanish"
import { AppleHelloEffectVietnamese } from "@/components/apple-hello-effect/apple-hello-effect-vietnamese"
import { AppleHelloEffectGujarati } from "@/components/apple-hello-effect/apple-hello-effect-gujarati"
import { AppleHelloEffectRajasthani } from "@/components/apple-hello-effect/apple-hello-effect-rajasthani"

export function AppleHelloEffectLanguagesDemo({ className }: { className?: string }) {
  const [index, setIndex] = useState(0)

  const handleAnimationEnd = () => {
    setIndex((prevIndex) => (prevIndex + 1) % 6)
  }

  const demos = [
    <AppleHelloEffectEnglish
      key="english"
      onAnimationComplete={handleAnimationEnd}
    />,
    <AppleHelloEffectHindi
      key="hindi"
      onAnimationComplete={handleAnimationEnd}
    />,
    <AppleHelloEffectGujarati
      key="gujarati"
      durationScale={1.7}
      onAnimationComplete={handleAnimationEnd}
    />,
    <AppleHelloEffectRajasthani
      key="rajasthani"
      durationScale={1.7}
      onAnimationComplete={handleAnimationEnd}
    />,
    <AppleHelloEffectSpanish
      key="spanish"
      durationScale={0.8}
      onAnimationComplete={handleAnimationEnd}
    />,
    <AppleHelloEffectVietnamese 
      key="vietnamese" 
      durationScale={0.8} 
      onAnimationComplete={handleAnimationEnd}
    />,
  ]

  return (
    <div className={cn("flex items-center justify-center text-indigo-400 select-none", className)}>
      <AnimatePresence mode="wait">
        {demos[index]}
      </AnimatePresence>
    </div>
  )
}

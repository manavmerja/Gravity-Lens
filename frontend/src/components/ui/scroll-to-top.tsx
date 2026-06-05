"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ y: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full",
            "border border-white bg-white text-black shadow-[0_4px_20px_rgba(255,255,255,0.25)]",
            "hover:bg-neutral-100 hover:border-neutral-200",
            "transition-all duration-300 cursor-pointer outline-none"
          )}
          aria-label="Scroll to top"
        >
          {/* Subtle light glow layer behind white button */}
          <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
          <IconArrowUp className="w-5 h-5 text-black" stroke={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

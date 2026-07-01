"use client";

import React, { useEffect, useRef, createContext, useContext } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Context to expose Lenis instance to child components if needed
const LenisContext = createContext<{ lenis: Lenis | null }>({ lenis: null });
export const useLenis = () => useContext(LenisContext);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis on the native window scroll (html element)
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite: false,
      // Lenis v1 targets window scroll by default when no wrapper/content given
    });

    lenisRef.current = lenis;

    // Sync GSAP ScrollTrigger with Lenis scroll position
    lenis.on("scroll", (e: any) => {
      ScrollTrigger.update();

      // Mark body as scrolling (can disable pointer events on heavy elements)
      document.body.classList.add("is-scrolling");
      clearTimeout((window as any).__lenisScrollTimeout);
      (window as any).__lenisScrollTimeout = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 150);
    });

    // Drive Lenis via GSAP ticker for perfect frame sync
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after everything mounts
    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  );
}

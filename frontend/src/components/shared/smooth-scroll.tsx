"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && (pathname.startsWith("/dashboard") || pathname === "/timeline" || pathname === "/connect-aws")) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Fast start, slow end
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // Sync ScrollTrigger updates with Lenis scroll movements
    lenis.on("scroll", () => {
      ScrollTrigger.update();
      
      // Add scroll class to body to disable pointer events on heavy elements (e.g. iframes) during scrolling
      document.body.classList.add("is-scrolling");
      clearTimeout((window as any).scrollTimeout);
      (window as any).scrollTimeout = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 150);
    });

    // Use GSAP ticker to drive Lenis for perfect 60fps/120fps frame synchronization
    const updateScroll = (time: number) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(updateScroll);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateScroll);
    };
  }, [pathname]);

  return <>{children}</>;
}

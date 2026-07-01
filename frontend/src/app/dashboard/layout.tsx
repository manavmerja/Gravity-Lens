'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useFontScale } from "@/hooks/useFontScale";
import { useFontSizeShortcuts } from "@/hooks/useFontSizeShortcuts";
import { useDashboardStore } from "@/components/dashboard/useDashboardStore";
import "@/styles/font-scale.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  useFontScale(); // Initialize the hook
  const fontToast = useFontSizeShortcuts();
  const pathname = usePathname();
  const setActiveSection = useDashboardStore((state) => state.setActiveSection);

  useEffect(() => {
    // Early dataset font-scale load to prevent FOUC on mount
    try {
      const saved = localStorage.getItem('gl-font-scale') || 'small';
      const el = document.getElementById('gl-dashboard');
      if (el) el.dataset.fontScale = saved;
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!pathname) return;
    if (pathname === "/dashboard") {
      setActiveSection("overview");
    } else {
      const section = pathname.split("/").pop() as any;
      setActiveSection(section);
    }
  }, [pathname, setActiveSection]);

  return (
    <div 
      id="gl-dashboard"
      className={`${geistSans.variable} ${geistMono.variable} font-sans dashboard-wrapper h-full w-full`} 
      suppressHydrationWarning
    >
      {fontToast}
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}

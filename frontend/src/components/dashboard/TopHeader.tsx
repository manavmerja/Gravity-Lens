"use client";

import React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  Sun, Moon, CaretRight,
  WifiHigh, WifiSlash, SidebarSimple,
  ArrowsClockwise, PlayCircle, House
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboardStore } from "./useDashboardStore";
import type { DashboardSection } from "./useDashboardStore";
import { useSidebar } from "@/components/ui/sidebar";
import { useCanvasStore } from "../../store/useCanvasStore";
import { Separator } from "@/components/ui/separator";
import { FontSizeControl } from "./FontSizeControl";

const SECTION_LABELS: Record<DashboardSection, string> = {
  overview: "Overview",
  canvas: "Infrastructure Canvas",
  "blast-radius": "Blast Radius",
  timeline: "Timeline",
  alerts: "Alerts",
  cost: "Cost Analysis",
  "db-explorer": "Database Explorer",
  settings: "Settings",
  logs: "Scan Job Logs"
};

export function TopHeader() {
  const { theme, setTheme } = useTheme();
  const { state: sidebarState, toggleSidebar } = useSidebar();
  const leftPanelOpen = sidebarState === "expanded";
  const {
    activeSection,
    isAwsConnected,
  } = useDashboardStore();
//test
  const isLoading = useCanvasStore((state) => state.isLoading);
  const fetchInfrastructure = useCanvasStore((state) => state.fetchInfrastructure);
  const setTourActive = useCanvasStore((state) => state.setTourActive);
  const connectedAccounts = useCanvasStore((state) => state.connectedAccounts);
  const selectedAccountId = useCanvasStore((state) => state.selectedAccountId);
  const setSelectedAccountId = useCanvasStore((state) => state.setSelectedAccountId);
  const fetchConnectedAccounts = useCanvasStore((state) => state.fetchConnectedAccounts);

  React.useEffect(() => {
    fetchConnectedAccounts();
  }, [fetchConnectedAccounts]);

  const replayTour = () => {
    localStorage.removeItem('gravity-lens-tour-complete');
    setTourActive(true);
    window.dispatchEvent(new CustomEvent('replay-tour'));
  };

  return (
    <header className="flex items-center h-14 px-4 gap-3 border-b border-[var(--gl-border)] bg-[var(--gl-bg-panel)] shrink-0 z-40">

      {/* Home Button */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href="/"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-[var(--gl-text-muted)] hover:text-[var(--gl-text-primary)] hover:bg-[var(--gl-bg-muted)] transition-colors"
            />
          }
        >
          <House size={16} />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          Back to Home
        </TooltipContent>
      </Tooltip>

      {/* Left Panel Toggle */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost" size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 text-[var(--gl-text-muted)] hover:text-[var(--gl-text-primary)] hover:bg-[var(--gl-bg-muted)]"
            />
          }
        >
          <SidebarSimple size={16} />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {leftPanelOpen ? "Collapse sidebar" : "Expand sidebar"}
        </TooltipContent>
      </Tooltip>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs hidden sm:flex">
        <span className="text-[var(--gl-text-muted)]">Dashboard</span>
        <CaretRight size={12} className="text-[var(--gl-text-disabled)]" />
        <span className="text-[var(--gl-text-primary)] font-medium">
          {SECTION_LABELS[activeSection]}
        </span>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Product Tour Recap */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost" size="icon"
              onClick={replayTour}
              className="h-8 w-8 text-[var(--gl-text-muted)] hover:text-[var(--gl-text-primary)] hover:bg-[var(--gl-bg-muted)]"
            />
          }
        >
          <PlayCircle size={16} />
        </TooltipTrigger>
        <TooltipContent side="bottom">Replay Tour</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-5 mx-1 bg-[var(--gl-border)]" />

      {/* AWS Connection Status */}
      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--gl-bg-muted)] border border-[var(--gl-border)] text-xs">
        {isAwsConnected ? (
          <>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            />
            <span className="text-[var(--gl-text-secondary)] font-medium">Connected</span>
          </>
        ) : (
          <>
            <WifiSlash size={12} className="text-red-400" />
            <span className="text-red-400">Disconnected</span>
          </>
        )}
      </div>

      <FontSizeControl />



      {/* Theme Toggle */}
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost" size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 text-[var(--gl-text-muted)] hover:text-[var(--gl-text-primary)] hover:bg-[var(--gl-bg-muted)]"
            />
          }
        >
          <Sun  size={16} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon size={16} className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
        </TooltipTrigger>
        <TooltipContent side="bottom">Toggle theme</TooltipContent>
      </Tooltip>


    </header>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
import { 
  IconHistory, 
  IconBinaryTree, 
  IconShieldHeart, 
  IconGitCompare,
  IconCircleCheck,
  IconAlertCircle,
  IconPlayerPlay,
  IconPlayerPause,
  IconTrash,
  IconActivity
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { DotPattern } from "@/components/ui/dot-pattern";
import StatusIndicator from "@/components/ui/status-indicator";

import { 
  IconUser,
  IconCloud,
  IconServer,
  IconDatabase,
  IconNetwork,
  IconBrandAws,
  IconBucket
} from "@tabler/icons-react";

const Circle = React.forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#161622]/90 text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]",
        className
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

function AutoMappingBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const cloudfrontRef = useRef<HTMLDivElement>(null);
  const gatewayRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const ec2Ref = useRef<HTMLDivElement>(null);
  const rdsRef = useRef<HTMLDivElement>(null);
  const s3Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full h-[320px] items-center justify-center overflow-hidden py-4 px-2 bg-[#0E0E12]/40 rounded-2xl border border-white/5"
    >
      <div className="flex w-full max-w-sm flex-row items-stretch justify-between gap-4 z-10">
        {/* Left Column - Inputs */}
        <div className="flex flex-col justify-center gap-6">
          <Circle ref={userRef} className="size-12 border-blue-500/20 text-blue-400">
            <IconUser className="w-5 h-5" />
          </Circle>
          <Circle ref={cloudfrontRef} className="size-12 border-sky-500/20 text-sky-400">
            <IconCloud className="w-5 h-5" />
          </Circle>
          <Circle ref={gatewayRef} className="size-12 border-teal-500/20 text-teal-400">
            <IconNetwork className="w-5 h-5" />
          </Circle>
        </div>

        {/* Center Column - AWS Colored Center Core */}
        <div className="flex flex-col justify-center">
          <Circle ref={centerRef} className="size-16 border-[#FF9900]/40 bg-[#FF9900]/10 text-[#FF9900] shadow-[0_0_25px_rgba(255,153,0,0.25)] hover:border-[#FF9900]/60">
            <IconBrandAws className="w-9 h-9" stroke={1.5} />
          </Circle>
        </div>

        {/* Right Column - Outputs */}
        <div className="flex flex-col justify-center gap-6">
          <Circle ref={ec2Ref} className="size-12 border-purple-500/20 text-purple-400">
            <IconServer className="w-5 h-5" />
          </Circle>
          <Circle ref={rdsRef} className="size-12 border-pink-500/20 text-pink-400">
            <IconDatabase className="w-5 h-5" />
          </Circle>
          <Circle ref={s3Ref} className="size-12 border-amber-500/20 text-amber-400">
            <IconBucket className="w-5 h-5" />
          </Circle>
        </div>
      </div>

      {/* Animated Beams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={userRef}
        toRef={centerRef}
        duration={3}
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#3b82f6"
        gradientStopColor="#6366f1"
        pathColor="rgba(255,255,255,0.15)"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={cloudfrontRef}
        toRef={centerRef}
        duration={3}
        delay={0.5}
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#0ea5e9"
        gradientStopColor="#6366f1"
        pathColor="rgba(255,255,255,0.15)"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={gatewayRef}
        toRef={centerRef}
        duration={3}
        delay={1}
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#14b8a6"
        gradientStopColor="#6366f1"
        pathColor="rgba(255,255,255,0.15)"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={ec2Ref}
        duration={3}
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#6366f1"
        gradientStopColor="#a855f7"
        pathColor="rgba(255,255,255,0.15)"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={rdsRef}
        duration={3}
        delay={0.5}
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#6366f1"
        gradientStopColor="#ec4899"
        pathColor="rgba(255,255,255,0.15)"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={s3Ref}
        duration={3}
        delay={1}
        pathWidth={3}
        pathOpacity={0.4}
        gradientStartColor="#6366f1"
        gradientStopColor="#f59e0b"
        pathColor="rgba(255,255,255,0.15)"
      />
    </div>
  );
}

function BentoTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollXProgress } = useScroll({
    container: containerRef,
  });

  const opacityTransform = useTransform(scrollXProgress, [0, 0.1], [0, 1]);

  const timelineData = [
    {
      time: "10:15 AM",
      content: (
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Provisioning</span>
          <h4 className="text-xs font-bold text-white mt-2">VPC Cluster Created</h4>
          <p className="text-[10px] text-neutral-400 mt-1 max-w-[180px]">Mapped 24 subnet allocations across 3 Availability Zones.</p>
        </div>
      )
    },
    {
      time: "11:30 AM",
      content: (
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">Scaling Event</span>
          <h4 className="text-xs font-bold text-white mt-2">RDS Instance Upgraded</h4>
          <p className="text-[10px] text-neutral-400 mt-1 max-w-[180px]">Scaled db.t3.medium to db.r6g.large due to CPU load.</p>
        </div>
      )
    },
    {
      time: "02:10 PM",
      content: (
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">IAM Drift</span>
          <h4 className="text-xs font-bold text-white mt-2">Sarah | Cloud Arch</h4>
          <p className="text-[10px] text-neutral-400 mt-1 max-w-[180px]">Manually edited admin role adding wildcards (s3:*).</p>
        </div>
      )
    },
    {
      time: "04:45 PM",
      content: (
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">Security Warning</span>
          <h4 className="text-xs font-bold text-white mt-2">Port 22 Opened</h4>
          <p className="text-[10px] text-neutral-400 mt-1 max-w-[180px]">SSH ingress security rule opened globally to 0.0.0.0/0.</p>
        </div>
      )
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-x-auto overflow-y-hidden mt-6 pr-2 select-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent py-4"
    >
      <div className="relative pt-12 pb-2 min-w-max">
        {/* Horizontal Line Track */}
        <div
          className="absolute left-6 right-6 top-[22px] h-[2px] bg-neutral-800"
        >
          <motion.div
            style={{
              scaleX: scrollXProgress,
              transformOrigin: "left",
              opacity: opacityTransform,
            }}
            className="absolute inset-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent rounded-full"
          />
        </div>

        <div className="flex flex-row gap-12 px-6">
          {timelineData.map((item, index) => (
            <div key={index} className="relative flex flex-col items-center text-center w-[200px] shrink-0">
              {/* Timeline indicator circle intersecting the line */}
              <div className="absolute top-[-40px] z-40 flex h-5 w-5 items-center justify-center rounded-full bg-[#121218] border border-white/10">
                <div className="h-2 w-2 rounded-full bg-indigo-500/50 border border-indigo-500/80" />
              </div>

              {/* Time Title */}
              <span className="text-xs font-bold text-neutral-500 mb-1">
                {item.time}
              </span>

              {/* Details Content */}
              <div className="w-full">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type AuditLogEntry = {
  id: string;
  timestamp: string;
  service: string;
  checkName: string;
  status: "passed" | "warning" | "failed";
  latency: string;
};

const auditChecks = [
  { service: "IAM", checkName: "MFA Enforcement Checked", status: "passed" },
  { service: "VPC", checkName: "Public Port 22 Ingress Scan", status: "warning" },
  { service: "S3", checkName: "Public Access Block Audit", status: "passed" },
  { service: "EKS", checkName: "Cluster Configuration Drift", status: "failed" },
  { service: "RDS", checkName: "DB Storage Encryption check", status: "passed" },
  { service: "KMS", checkName: "Key Rotation Schedule check", status: "passed" },
  { service: "EC2", checkName: "Unused SGs Cleanup Scan", status: "warning" },
  { service: "API", checkName: "Root Access Key Detection", status: "failed" },
];

function LiveComplianceFeed() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const generateLog = (): AuditLogEntry => {
    const date = new Date();
    const randomCheck = auditChecks[Math.floor(Math.random() * auditChecks.length)];
    return {
      id: Math.random().toString(36).slice(2, 9),
      timestamp: date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      service: randomCheck.service,
      checkName: randomCheck.checkName,
      status: randomCheck.status as "passed" | "warning" | "failed",
      latency: `${Math.floor(Math.random() * 80) + 10}ms`,
    };
  };

  useEffect(() => {
    // Generate initial logs
    const initialLogs = Array.from({ length: 4 }, generateLog);
    setLogs(initialLogs);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLog = generateLog();
        const newLogs = [...prev, newLog];
        if (newLogs.length > 20) return newLogs.slice(newLogs.length - 20);
        return newLogs;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (scrollRef.current && !isPaused) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [logs, isPaused]);

  return (
    <div className="flex flex-col h-[280px] bg-[#08080C]/80 border border-white/5 rounded-2xl p-4 mt-6 overflow-hidden relative z-10 shadow-inner">
      {/* Header controls */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-2 select-none">
        <div className="flex items-center gap-2">
          <StatusIndicator state="active" size="sm" />
          <span className="text-xs font-bold text-neutral-300">Live Audit Logs</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
            title={isPaused ? "Resume Feed" : "Pause Feed"}
          >
            {isPaused ? <IconPlayerPlay className="w-3.5 h-3.5" /> : <IconPlayerPause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setLogs([])}
            className="text-neutral-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
            title="Clear Logs"
          >
            <IconTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Logs Viewport */}
      <div 
        ref={scrollRef}
        className="grow overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-1.5 py-1"
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 text-xs gap-1 py-10">
            <IconActivity className="w-5 h-5 animate-pulse text-indigo-400" />
            <span>Waiting for audits...</span>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-2 hover:bg-white/[0.02] px-2 py-1 rounded-md transition-colors text-[10px] sm:text-xs font-mono"
            >
              <span className="text-neutral-500 w-12 shrink-0">{log.timestamp}</span>
              <span className="text-indigo-400 font-bold shrink-0 w-8">{log.service}</span>
              <span className="text-neutral-300 grow truncate">{log.checkName}</span>
              <span className="text-neutral-500 text-end shrink-0 w-8">{log.latency}</span>
              <span className={cn(
                "shrink-0 text-[8px] font-semibold px-2 py-0.5 rounded-full border tracking-wide scale-95",
                {
                  "text-green-400 bg-green-500/10 border-green-500/20": log.status === "passed",
                  "text-amber-400 bg-amber-500/10 border-amber-500/20": log.status === "warning",
                  "text-red-400 bg-red-500/10 border-red-500/20": log.status === "failed",
                }
              )}>
                {log.status.toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function BentoGrid() {
  const [showDriftFix, setShowDriftFix] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Fade/Slide up the grid section header
    gsap.from(".bento-header", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
      }
    });

    // Stagger fade/slide up the individual cards
    gsap.from(".bento-card", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 px-6 max-w-7xl mx-auto relative z-20">
      {/* Header */}
      <div className="bento-header text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
          Architected for <span className="aurora-text">Total Intelligence</span>
        </h2>
        <p className="text-neutral-400 text-base sm:text-lg">
          GravityLens continuously maps, audits, and records every single change inside your cloud environments.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Time-Travel Timeline (Spans 2 columns) */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bento-card md:col-span-2 p-8 rounded-3xl bg-[#121218]/80 border border-white/5 backdrop-blur-md flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-indigo-500/20 transition-colors duration-300 group relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px]" />
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                <IconHistory className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Infrastructure Time-Travel</h3>
                <p className="text-sm text-neutral-400">Reconstruct past environments down to the exact second.</p>
              </div>
            </div>

            {/* Interactive Timeline follow component */}
            <BentoTimeline />
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-500">
            <span>Scroll inside timeline to scrub back in time</span>
            <span className="text-indigo-400 font-medium group-hover:underline cursor-pointer">Explore Timeline Snapshot →</span>
          </div>
        </motion.div>

        {/* Card 2: Security Audit checks (Spans 1 column) */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bento-card p-8 rounded-3xl bg-[#121218]/80 border border-white/5 backdrop-blur-md flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-pink-500/20 transition-colors duration-300 group relative overflow-hidden"
        >
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-pink-500/5 rounded-full blur-[80px]" />
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pink-500/10 text-pink-400 rounded-2xl border border-pink-500/20">
                <IconShieldHeart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Live Compliance</h3>
                <p className="text-sm text-neutral-400">Continuous vulnerability audits.</p>
              </div>
            </div>

            {/* Live compliance log feed console */}
            <LiveComplianceFeed />
          </div>

          <div className="mt-8 text-xs text-neutral-500">
            Real-time compliance synced with AWS GuardDuty.
          </div>
        </motion.div>

        {/* Card 3: Auto-Discovery Topology (Spans 1 column) */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bento-card p-8 rounded-3xl bg-[#121218]/80 border border-white/5 backdrop-blur-md flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-sky-500/20 transition-colors duration-300 group relative overflow-hidden"
        >
          <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-sky-500/5 rounded-full blur-[80px]" />
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl border border-sky-500/20">
                <IconBinaryTree className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Auto-Mapping</h3>
                <p className="text-sm text-neutral-400">Instant VPC & node graphs.</p>
              </div>
            </div>

            {/* Glowing diagram connectivity mockup using Animated Beam */}
            <AutoMappingBeamDemo />
          </div>

          <div className="mt-8 text-xs text-neutral-500">
            Auto-generates clean visual node layouts.
          </div>
        </motion.div>

        {/* Card 4: Drift Detection Code Diff (Spans 2 columns) */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bento-card md:col-span-2 p-8 rounded-3xl bg-[#121218]/80 border border-white/5 backdrop-blur-md flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-indigo-500/20 transition-colors duration-300 group relative overflow-hidden"
        >
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px]" />
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                  <IconGitCompare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Live Drift Tracking</h3>
                  <p className="text-sm text-neutral-400">Spot configurations that deviate from your IaC blueprints.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDriftFix(!showDriftFix)}
                className="text-xs bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-indigo-400 select-none font-semibold transition-colors duration-200 pointer-events-auto"
              >
                {showDriftFix ? "Show Drift" : "Simulate Auto-Heal"}
              </button>
            </div>

            {/* Code Diff Panel */}
            <div className="rounded-xl border border-white/5 bg-[#08080C]/90 p-4 font-mono text-xs sm:text-sm text-neutral-400 relative z-10 shadow-inner overflow-x-auto">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-neutral-500 text-[10px]">
                <span>terraform/security.tf</span>
                <span className="text-amber-500 animate-pulse font-semibold">DRIFT DETECTED</span>
              </div>
              <div className="space-y-1 select-none">
                <div>resource "aws_security_group" "database" &#123;</div>
                <div>  name = "db-sg"</div>
                <div className={cn(
                  "transition-colors duration-500 rounded px-1.5 py-0.5",
                  showDriftFix ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                )}>
                  {showDriftFix 
                    ? "+ ingress_port = 3306 // Auto-healed: restored database port restrict"
                    : "- ingress_port = 22   // Public SSH opened by user manually in console"
                  }
                </div>
                <div>&#125;</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-500">
            <span>Syncs with Terraform Cloud & AWS CloudFormation</span>
            <span className="text-indigo-400 font-medium">Reconcile Drift →</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

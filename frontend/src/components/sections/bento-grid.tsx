"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  IconHistory, 
  IconBinaryTree, 
  IconShieldHeart, 
  IconGitCompare,
  IconCircleCheck,
  IconAlertCircle
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function BentoGrid() {
  const [activeTimeStep, setActiveTimeStep] = useState(2);
  const [showDriftFix, setShowDriftFix] = useState(false);

  const timelineSteps = [
    { time: "10:15 AM", title: "VPC Created", desc: "US-East subnet allocation complete." },
    { time: "11:30 AM", title: "RDS Database Scale", desc: "db.t3.medium upgraded to db.r6g.large." },
    { time: "02:10 PM", title: "IAM Policy Change", desc: "Sarah modified admin role permissions." },
    { time: "04:45 PM", title: "Security Group Edit", desc: "Port 22 opened to public (0.0.0.0/0)." }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative z-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
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
          className="md:col-span-2 p-8 rounded-3xl bg-[#121218]/80 border border-white/5 backdrop-blur-md flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-indigo-500/20 transition-colors duration-300 group relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px]" />
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                <IconHistory className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Infrastructure Time-Travel</h3>
                <p className="text-sm text-neutral-400">Reconstruct past environments down to the exact second.</p>
              </div>
            </div>

            {/* Interactive Timeline Graph */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8 relative z-10">
              {timelineSteps.map((step, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveTimeStep(idx)}
                  className={cn(
                    "cursor-pointer p-4 rounded-2xl border transition-all duration-300 select-none",
                    activeTimeStep === idx 
                      ? "bg-indigo-600/15 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "bg-[#161622]/40 border-white/5 text-neutral-400 hover:border-white/10 hover:bg-[#161622]/70"
                  )}
                >
                  <span className={cn(
                    "text-xs font-semibold block mb-1",
                    activeTimeStep === idx ? "text-indigo-400" : "text-neutral-500"
                  )}>
                    {step.time}
                  </span>
                  <h4 className="font-bold text-sm text-white mb-1">{step.title}</h4>
                  <p className="text-xs text-neutral-400 leading-normal">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-500">
            <span>Click steps to scrub back in time</span>
            <span className="text-indigo-400 font-medium group-hover:underline cursor-pointer">Explore Timeline Snapshot →</span>
          </div>
        </motion.div>

        {/* Card 2: Security Audit checks (Spans 1 column) */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="p-8 rounded-3xl bg-[#121218]/80 border border-white/5 backdrop-blur-md flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-pink-500/20 transition-colors duration-300 group relative overflow-hidden"
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

            {/* Audit Status Items */}
            <div className="space-y-3 mt-6">
              {[
                { label: "MFA Enforcement Check", status: "passed" },
                { label: "Public VPC Ports Audit", status: "warning" },
                { label: "IAM Role Privileges Check", status: "passed" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#161622]/40 border border-white/5">
                  <span className="text-sm text-neutral-300">{item.label}</span>
                  {item.status === "passed" ? (
                    <span className="flex items-center gap-1 text-xs text-green-400 font-semibold bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                      <IconCircleCheck className="w-3.5 h-3.5" /> Checked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 animate-pulse">
                      <IconAlertCircle className="w-3.5 h-3.5" /> 1 Warning
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-xs text-neutral-500">
            Real-time compliance synced with AWS GuardDuty.
          </div>
        </motion.div>

        {/* Card 3: Auto-Discovery Topology (Spans 1 column) */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="p-8 rounded-3xl bg-[#121218]/80 border border-white/5 backdrop-blur-md flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-sky-500/20 transition-colors duration-300 group relative overflow-hidden"
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

            {/* Glowing diagram connectivity mockup */}
            <div className="flex flex-col items-center justify-center py-6 relative">
              <div className="relative flex items-center justify-between w-full max-w-[200px]">
                {/* Connection line */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-400 z-0">
                  <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8] animate-ping absolute left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                {/* Node 1 */}
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
                  <span className="text-xs font-bold text-sky-400">VPC</span>
                </div>
                {/* Node 2 */}
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                  <span className="text-xs font-bold text-purple-400">EC2</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-xs text-neutral-500">
            Auto-generates clean visual node layouts.
          </div>
        </motion.div>

        {/* Card 4: Drift Detection Code Diff (Spans 2 columns) */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="md:col-span-2 p-8 rounded-3xl bg-[#121218]/80 border border-white/5 backdrop-blur-md flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-indigo-500/20 transition-colors duration-300 group relative overflow-hidden"
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

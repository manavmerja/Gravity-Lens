"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LiquidButton } from "@/components/ui/liquid-button";
import { Backlight } from "@/components/ui/backlight";

function MoveLeftArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400 group-hover:text-white transition-colors"
    >
      <motion.g>
        <motion.path
          d="M2 12H22"
          animate={{
            d: ["M2 12H22", "M12 12H22", "M2 12H22"],
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 4.4,
          }}
        />
        <motion.path
          d="M6 8L2 12L6 16"
          animate={{
            d: ["M6 8L2 12L6 16", "M15 8L11 12L15 16", "M6 8L2 12L6 16"],
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 4.4,
          }}
        />
      </motion.g>
    </svg>
  );
}

const SCAN_STEPS = [
  { id: 1, label: "IAM Role Credentials Verified", desc: "Checking STS caller identity and trust relationships." },
  { id: 2, label: "Discovering Infrastructure Resources", desc: "Scanning EC2, RDS, VPCs, Lambda, and active regions." },
  { id: 3, label: "Analyzing Topology Relationships", desc: "Evaluating cross-service routes and security group associations." },
  { id: 4, label: "Calculating Monthly Cost & Drift", desc: "Running pricing engine logic and matching billing units." },
  { id: 5, label: "Generating Architecture Canvas", desc: "Ready to render interactive live architecture." }
];

export default function ConnectAWSPage() {
  const [roleArn, setRoleArn] = useState("");
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Connection and scanning state
  const [connectedAccount, setConnectedAccount] = useState<any>(null);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleArn.trim()) {
      setError("AWS Role ARN is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/aws/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role_arn: roleArn,
          account_name: projectName || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to link AWS account.");
      }

      if (data.success === false) {
        throw new Error(data.message || "Failed to connect AWS Account.");
      }

      setConnectedAccount(data.account);
      setScanStatus("pending");
      setCurrentStep(1);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Poll scan status after successful connection
  useEffect(() => {
    if (!connectedAccount) return;

    let pollInterval: NodeJS.Timeout;
    let stepTimer: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/aws/accounts/${connectedAccount.account_id}/status`);
        const data = await response.json();

        if (response.ok) {
          const status = data.latest_scan_status;
          setScanStatus(status);

          if (status === "success" || status === "partial" || status === "completed") {
            setCurrentStep(5);
            setCompleted(true);
            clearInterval(pollInterval);
          } else if (status === "failed") {
            setError("The initial scan job failed. Please verify IAM policy permissions.");
            clearInterval(pollInterval);
          }
        }
      } catch (err) {
        console.error("Error polling scan status:", err);
      }
    };

    // Poll every 2 seconds
    pollInterval = setInterval(checkStatus, 2000);

    // Smoothly increment steps in UI while scan is running
    stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 4000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(stepTimer);
    };
  }, [connectedAccount]);

  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col lg:flex-row relative">
      {/* Left side: Form & Branding */}
      <div className="w-full lg:w-[48%] bg-[#030303] flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden shrink-0 border-r border-white/5 z-10">
        {/* Slowly-shifting organic Aurora blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[15%] -right-[15%] w-[500px] h-[500px] rounded-full bg-[#0025cc]/20 blur-[90px]" />
          <div className="absolute -bottom-[15%] -left-[15%] w-[500px] h-[500px] rounded-full bg-[#42000b]/40 blur-[90px]" />
        </div>

        {/* Brand Link & Back Button */}
        <div className="flex items-center justify-between w-full z-10">
          <Link
            href="/"
            className="flex items-center gap-3 text-white font-bold text-xl tracking-wider hover:opacity-90 transition-opacity"
          >
            <div className="relative h-9 w-9 shrink-0">
              <Image
                src="/logo.png"
                alt="GravityLens Logo"
                fill
                className="object-contain invert"
                sizes="36px"
                priority
              />
            </div>
            <span>GravityLens</span>
          </Link>
          <Link
            href="/"
            className="text-gray-400 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 p-2 rounded-xl transition-all flex items-center justify-center group"
            aria-label="Back to Home"
          >
            <MoveLeftArrow />
          </Link>
        </div>

        {/* Dynamic Display: Form or Progress Flow */}
        <div className="my-auto py-8 flex items-center justify-center z-10 w-full">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {!connectedAccount ? (
                <motion.div
                  key="connect-form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="border border-white/5 bg-[#09090D] shadow-2xl overflow-hidden rounded-2xl relative w-full flex flex-col p-6 gap-6"
                >
                  <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />

                  <div className="flex flex-col space-y-1">
                    <h3 className="text-xl font-bold text-white">Connect your AWS Account</h3>
                    <p className="text-xs text-gray-500">
                      Provide your role ARN and project details to start tracking drift.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="aws-arn" className="text-gray-300">AWS Role ARN</Label>
                      <Input
                        id="aws-arn"
                        type="text"
                        placeholder="arn:aws:iam::123456789012:role/GravityLensAccess"
                        value={roleArn}
                        onChange={(e) => setRoleArn(e.target.value)}
                        disabled={loading}
                        className="bg-black/40 border-white/10 text-white placeholder-gray-600 focus:border-indigo-500/50"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="project-name" className="text-gray-300">Project Name</Label>
                      <Input
                        id="project-name"
                        type="text"
                        placeholder="My-Cloud-Infrastructure"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        disabled={loading}
                        className="bg-black/40 border-white/10 text-white placeholder-gray-600 focus:border-indigo-500/50"
                      />
                    </div>

                    <div className="pt-2">
                      <LiquidButton
                        className="w-full bg-white text-black hover:bg-transparent hover:text-white border-transparent"
                        size="sm"
                        style={{ "--liquid-color": "#111111", "--liquid-underline": "transparent" } as React.CSSProperties}
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Connecting..." : "Connect AWS"}
                      </LiquidButton>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="scan-progress"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="border border-white/5 bg-[#09090D] shadow-2xl overflow-hidden rounded-2xl relative w-full flex flex-col p-6 gap-6"
                >
                  <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />

                  <div className="flex flex-col space-y-1">
                    <h3 className="text-xl font-bold text-white">Scanning Cloud Architecture</h3>
                    <p className="text-xs text-gray-500">
                      Discovery and normalization are running in the background.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  {/* Progressive Steps */}
                  <div className="flex flex-col gap-5 my-2">
                    {SCAN_STEPS.map((step) => {
                      const isCompleted = step.id < currentStep;
                      const isActive = step.id === currentStep;
                      const isPending = step.id > currentStep;

                      return (
                        <div key={step.id} className="flex gap-3 items-start">
                          <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                            {isCompleted ? (
                              <div className="h-5 w-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                                ✓
                              </div>
                            ) : isActive ? (
                              <div className="h-5 w-5 rounded-full border border-indigo-400 flex items-center justify-center relative">
                                <span className="absolute h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                              </div>
                            ) : (
                              <div className="h-5 w-5 rounded-full border border-white/10 text-gray-600 flex items-center justify-center text-[10px]">
                                {step.id}
                              </div>
                            )}

                            {/* Connective Line */}
                            {step.id < 5 && (
                              <div
                                className={`absolute top-5 bottom-[-22px] w-0.5 ${
                                  step.id < currentStep ? "bg-indigo-500" : "bg-white/5"
                                }`}
                              />
                            )}
                          </div>

                          <div className="flex flex-col">
                            <span
                              className={`text-xs font-semibold transition-colors ${
                                isActive ? "text-white" : isCompleted ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Interactive Button that reveals when completed */}
                  <div className="pt-2 min-h-[44px] flex items-center justify-center">
                    {completed ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-full"
                      >
                        <Link href="/dashboard/canvas" className="w-full">
                          <LiquidButton
                            className="w-full bg-indigo-500 text-white hover:bg-indigo-600 border-transparent shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                            size="sm"
                            style={{ "--liquid-color": "#4f46e5", "--liquid-underline": "transparent" } as React.CSSProperties}
                          >
                            Enter Architecture Canvas
                          </LiquidButton>
                        </Link>
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-2.5 text-xs text-indigo-400/80 animate-pulse">
                        <div className="h-2 w-2 rounded-full bg-indigo-400" />
                        <span>Running scan jobs on Hugging Face...</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-xs text-gray-600 z-10">
          &copy; {new Date().getFullYear()} GravityLens Inc. All rights reserved.
        </p>
      </div>

      {/* Right side: Video component with backlight */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 bg-[#030303] relative overflow-hidden z-10">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none z-0" />

        {/* Video component with premium backlight glow */}
        <div className="my-auto py-8 flex flex-col items-center justify-center z-10 w-full px-4">

          {/* Header instructing the user */}
          <div className="text-center max-w-lg mb-6 z-10 flex flex-col items-center justify-center gap-1.5 select-none">
            <span className="text-[10px] font-bold tracking-[0.25em] text-indigo-400 uppercase">
              Step-by-Step Guide
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              Watch this video tutorial before filling up the form
            </h2>
          </div>

          <Backlight blur={40} className="w-full max-w-lg">
            <iframe
              className="w-full aspect-video rounded-2xl border border-white/10 bg-[#09090D] shadow-2xl"
              src="https://www.youtube.com/embed/9CJLtzzUphU"
              title="How to Connect AWS Video Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </Backlight>

          {/* Quick Steps Guide */}
          <div className="w-full max-w-lg mt-8 border border-white/5 bg-[#09090D]/60 backdrop-blur-md p-6 rounded-2xl flex flex-col gap-4 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-px left-5 right-5 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Quick Setup</h4>
            <ul className="flex flex-col gap-3 text-xs text-gray-400">
              <li className="flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-300 font-semibold mt-0.5 shrink-0 group-hover:border-indigo-500/30 transition-colors">1</span>
                <span>Select <strong>AWS Account</strong> trust entity in your IAM Console.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-300 font-semibold mt-0.5 shrink-0 group-hover:border-indigo-500/30 transition-colors">2</span>
                <span>Attach <strong>ReadOnlyAccess</strong> to grant discovery permissions.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-300 font-semibold mt-0.5 shrink-0 group-hover:border-indigo-500/30 transition-colors">3</span>
                <span>Copy <strong>Role ARN</strong> and paste into the configuration form.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

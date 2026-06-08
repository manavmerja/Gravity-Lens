"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AppleHelloEffectLanguagesDemo } from "@/components/apple-hello-effect/apple-hello-effect-languages-demo";
import { MacbookPro } from "@/components/eldoraui/macbook-pro";
import { cn } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsContent,
  AnimatedTabHighlight,
} from "@/components/animate-ui/components/radix/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LiquidButton } from "@/components/ui/liquid-button";
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function AuthPage() {
  const [lidOpen, setLidOpen] = React.useState(false);
  const [bootStatus, setBootStatus] = React.useState<"closed" | "bootlogo" | "ready">("closed");
  const [resetTrigger, setResetTrigger] = React.useState(0);

  React.useEffect(() => {
    let active = true;

    async function startSequence() {
      // 1. Open the lid
      setLidOpen(true);
      setBootStatus("closed");

      // Wait for opening animation to complete (2.2s)
      await new Promise((resolve) => setTimeout(resolve, 2200));
      if (!active) return;

      // 2. Show boot logo
      setBootStatus("bootlogo");

      // Show boot logo for 3.2s
      await new Promise((resolve) => setTimeout(resolve, 3200));
      if (!active) return;

      // 3. Show Hello languages screen
      setBootStatus("ready");
    }

    startSequence();

    return () => {
      active = false;
    };
  }, [resetTrigger]);

  const handleCycleComplete = () => {
    // 4. When all languages complete, start the close sequence
    setLidOpen(false);
    setBootStatus("closed");

    // Wait 1.5s for lid to close completely, then stay closed for 3.0s before resetting/opening again
    setTimeout(() => {
      setResetTrigger((prev) => prev + 1);
    }, 4500);
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col lg:flex-row relative">

      {/* Left side: Animated presentation area */}
      <div className="w-full lg:w-[45%] bg-[#030303] flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden shrink-0">

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

        {/* Center handwriting animation and copy */}
        <div className="my-auto py-8 flex flex-col items-center justify-center z-10 w-full">
          {/* Macbook Pro Mockup for Animation */}
          <div className="w-full max-w-sm sm:max-w-md xl:max-w-lg mb-8 flex items-center justify-center relative select-none">
            <MacbookPro
              className="w-full h-auto text-neutral-950"
              lidOpen={lidOpen}
              bootStatus={bootStatus}
            >
              <AppleHelloEffectLanguagesDemo
                className="w-full h-auto max-h-[84px] px-8 sm:px-12 text-white"
                onCycleComplete={handleCycleComplete}
                resetTrigger={resetTrigger}
              />
            </MacbookPro>
          </div>
          <motion.div
            className="text-center max-w-sm"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-2xl font-bold tracking-tight text-white leading-tight"
              variants={itemVariants}
            >
              Welcome to the{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(99,102,241,0.25)]">
                future of cloud tracking.
              </span>
            </motion.h1>
            <motion.p
              className="mt-3 text-sm text-gray-400 leading-relaxed"
              variants={itemVariants}
            >
              Monitor real-time changes, automate configuration updates, and prevent cloud drift in seconds.
            </motion.p>
          </motion.div>
        </div>

        {/* Footer text */}
        <p className="text-xs text-gray-600 z-10">
          &copy; {new Date().getFullYear()} GravityLens Inc. All rights reserved.
        </p>
      </div>

      {/* Right side: Authentication forms */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 bg-[#030303] relative overflow-hidden">
        {/* Slowly-shifting organic Aurora blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Deep Blue Upper Right Blob */}
          <div className="absolute -top-[15%] -right-[15%] w-[500px] h-[500px] rounded-full bg-[#0025cc]/35 blur-[90px] animate-aurora-1" />
          
          {/* Purple Blob */}
          <div className="absolute -bottom-[20%] -left-[20%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[130px] animate-aurora-2" />
          
          {/* Teal Blob */}
          <div className="absolute top-[20%] left-[10%] w-[450px] h-[450px] rounded-full bg-teal-500/5 blur-[120px] animate-aurora-3" />
          
          {/* Pink/Magenta Blob */}
          <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-pink-500/5 blur-[120px] animate-aurora-4" />
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
          
          {/* Symmetrical Bottom Left Deep Teal Blob */}
          <div className="absolute -bottom-[15%] -left-[15%] w-[500px] h-[500px] rounded-full bg-[#00687a]/45 blur-[90px] animate-aurora-2" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <AuthFormTabs />
        </div>
      </div>
    </main>
  );
}

// Subcomponent to organize forms cleanly with premium sliding track & height animations
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  const { ref, ...svgProps } = props as any;
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...svgProps}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  const { ref, ...svgProps } = props as any;
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...svgProps}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function AuthFormTabs() {
  const [activeTab, setActiveTab] = React.useState("signin");

  const handleAuth = () => {
    localStorage.setItem("gravity_user", "true");
    window.location.href = "/connect-aws";
  };

  return (
    <motion.div
      animate={{ height: activeTab === "signin" ? 515 : 600 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="border border-white/5 bg-[#09090D] shadow-2xl overflow-hidden rounded-2xl relative w-full flex flex-col p-6 gap-6"
    >
      <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />
      
      {/* Tabs list styled selector - Inside the box! */}
      <div className="grid grid-cols-2 relative h-10 p-1 bg-neutral-950 border border-white/5 rounded-xl shrink-0 z-20">
        <button
          onClick={() => setActiveTab("signin")}
          className={cn(
            "relative text-xs font-semibold py-1.5 rounded-md transition-colors duration-300 focus:outline-none z-10",
            activeTab === "signin" ? "text-white" : "text-gray-500 hover:text-gray-300"
          )}
        >
          Sign In
          <AnimatedTabHighlight active={activeTab === "signin"} />
        </button>
        <button
          onClick={() => setActiveTab("signup")}
          className={cn(
            "relative text-xs font-semibold py-1.5 rounded-md transition-colors duration-300 focus:outline-none z-10",
            activeTab === "signup" ? "text-white" : "text-gray-500 hover:text-gray-300"
          )}
        >
          Sign Up
          <AnimatedTabHighlight active={activeTab === "signup"} />
        </button>
      </div>

      {/* Horizontal Slide Track */}
      <div className="relative flex-1 overflow-hidden w-full">
        <div
          className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-[200%]"
          style={{
            transform: activeTab === "signin" ? "translateX(0%)" : "translateX(-50%)"
          }}
        >
          {/* Sign In form container */}
          <div className="w-1/2 flex flex-col gap-4 h-full justify-between shrink-0 pr-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col space-y-1">
                <h3 className="text-xl font-bold text-white">Welcome back</h3>
                <p className="text-xs text-gray-500">
                  Enter your credentials to access your cloud dashboard.
                </p>
              </div>
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signin-email">Email Address</Label>
                  <Input id="signin-email" type="email" placeholder="name@company.com" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="signin-password">Password</Label>
                    <Link href="#" className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="signin-password" type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 pt-2">
              <LiquidButton
                className="w-full bg-white text-black hover:bg-transparent hover:text-white border-transparent"
                size="sm"
                style={{ "--liquid-color": "#111111", "--liquid-underline": "transparent" } as React.CSSProperties}
                onClick={handleAuth}
              >
                Sign In
              </LiquidButton>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5" />
                </div>
                <span className="relative px-3 bg-[#09090D] text-[9px] text-gray-500 uppercase tracking-widest font-semibold">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAuth}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 border border-white/5 rounded-xl bg-neutral-950 hover:bg-white/5 transition-all duration-200 hover:text-white"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleAuth}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 border border-white/5 rounded-xl bg-neutral-950 hover:bg-white/5 transition-all duration-200 hover:text-white"
                >
                  <GitHubIcon />
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sign Up form container */}
          <div className="w-1/2 flex flex-col gap-4 h-full justify-between shrink-0 pl-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col space-y-1">
                <h3 className="text-xl font-bold text-white">Create your account</h3>
                <p className="text-xs text-gray-500">
                  Start monitoring and protecting your cloud setups today.
                </p>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" type="text" placeholder="John Doe" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input id="signup-email" type="email" placeholder="name@company.com" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 pt-2">
              <LiquidButton
                className="w-full bg-white text-black hover:bg-transparent hover:text-white border-transparent"
                size="sm"
                style={{ "--liquid-color": "#111111", "--liquid-underline": "transparent" } as React.CSSProperties}
                onClick={handleAuth}
              >
                Get Started
              </LiquidButton>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5" />
                </div>
                <span className="relative px-3 bg-[#09090D] text-[9px] text-gray-500 uppercase tracking-widest font-semibold">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAuth}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 border border-white/5 rounded-xl bg-neutral-950 hover:bg-white/5 transition-all duration-200 hover:text-white"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleAuth}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 border border-white/5 rounded-xl bg-neutral-950 hover:bg-white/5 transition-all duration-200 hover:text-white"
                >
                  <GitHubIcon />
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AppleHelloEffectLanguagesDemo } from "@/components/apple-hello-effect/apple-hello-effect-languages-demo";
import { MacbookPro } from "@/components/eldoraui/macbook-pro";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col lg:flex-row relative">
      
      {/* Left side: Animated presentation area */}
      <div className="w-full lg:w-[45%] bg-[#030303] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden shrink-0">
        
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
            className="text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
          >
            <span>←</span> Back to Home
          </Link>
        </div>

        {/* Center handwriting animation and copy */}
        <div className="my-auto py-8 flex flex-col items-center justify-center z-10 w-full">
          {/* Macbook Pro Mockup for Animation */}
          <div className="w-full max-w-sm sm:max-w-md xl:max-w-lg mb-8 flex items-center justify-center relative select-none">
            <MacbookPro className="w-full h-auto text-neutral-950">
              <AppleHelloEffectLanguagesDemo className="w-full h-auto max-h-[84px] px-8 sm:px-12 text-white" />
            </MacbookPro>
          </div>
          <div className="text-center max-w-sm">
            <h1 className="text-2xl font-bold tracking-tight text-gray-200">
              Welcome to the future of cloud tracking.
            </h1>
            <p className="mt-2.5 text-sm text-gray-500 leading-relaxed">
              Monitor real-time changes, automate configuration updates, and prevent cloud drift in seconds.
            </p>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-xs text-gray-600 z-10">
          &copy; {new Date().getFullYear()} GravityLens Inc. All rights reserved.
        </p>
      </div>

      {/* Right side: Authentication forms */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 bg-[#030303]">
        <div className="w-full max-w-md relative">
          <AuthFormTabs />
        </div>
      </div>
    </main>
  );
}

// Subcomponent to organize forms cleanly with premium sliding track & height animations
function AuthFormTabs() {
  const [activeTab, setActiveTab] = React.useState("signin");

  // Approximate card height to transition smoothly
  const containerHeight = activeTab === "signin" ? "h-[360px]" : "h-[440px]";

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Tabs list styled selector */}
      <div className="grid grid-cols-2 relative h-10 p-1 bg-neutral-950 border border-white/5 rounded-xl">
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

      {/* Sliding and Auto-Height Animated Container */}
      <motion.div
        animate={{ height: activeTab === "signin" ? 360 : 440 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className="border border-white/5 bg-[#09090D] shadow-2xl overflow-hidden rounded-2xl relative w-full"
      >
        <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />
        
        {/* Horizontal Slide Track */}
        <div
          className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-[200%]"
          style={{
            transform: activeTab === "signin" ? "translateX(0%)" : "translateX(-50%)"
          }}
        >
          {/* Sign In form container */}
          <div className="w-1/2 p-6 flex flex-col gap-4 h-full justify-between shrink-0">
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
            <div className="pt-2">
              <Button className="w-full bg-white text-black hover:bg-neutral-200">
                Sign In
              </Button>
            </div>
          </div>

          {/* Sign Up form container */}
          <div className="w-1/2 p-6 flex flex-col gap-4 h-full justify-between shrink-0">
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
            <div className="pt-2">
              <Button className="w-full bg-white text-black hover:bg-neutral-200">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { 
  IconBrandGithub, 
  IconBrandLinkedin, 
  IconBrandTwitter, 
  IconBrandYoutube 
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import StatusIndicator from "@/components/8starlabs-ui/status-indicator";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const linksPro = {
  group: "Product",
  items: [
    { title: "Drift Detection", href: "#" },
    { title: "Asset Mapping", href: "#" },
    { title: "Auto-Remediation", href: "#" },
    { title: "Terraform Engine", href: "#" },
    { title: "Multi-Cloud Sync", href: "#" },
    { title: "Pricing", href: "#" },
    { title: "Changelog", href: "#" },
    { title: "Security", href: "#" }
  ]
};

const linksRes = {
  group: "Resources",
  items: [
    { title: "Docs", href: "#" },
    { title: "API Reference", href: "#" },
    { title: "Guides", href: "#" },
    { title: "Academy", href: "#" },
    { title: "Integrations", href: "#" },
    { title: "Support Center", href: "#" }
  ]
};

const linksCom = {
  group: "Company",
  items: [
    { title: "About Us", href: "#" },
    { title: "Blog", href: "#" },
    { title: "Careers", href: "#" },
    { title: "Customers", href: "#" },
    { title: "Contact Us", href: "#" }
  ]
};

const legalItems = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Policy",
  "Cookie Preferences",
  "DMCA Policy",
  "SLA"
];

const sdkItems = [
  "Terraform Provider",
  "Python SDK",
  "Go Client",
  "CLI Tool"
];

export function Footer() {
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isSdkOpen, setIsSdkOpen] = useState(false);

  return (
    <footer className="relative z-30 bg-[#0A0A0F] border-t border-white/5 text-gray-400">
      <BackgroundBeamsWithCollision className="py-16 w-full h-auto">
        {/* Background glow highlights */}
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#6b1fad]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-6xl px-6 relative z-10 w-full">
          {/* Header / CTA inside footer with Beams Collision */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl relative z-20 md:text-5xl lg:text-6xl font-bold text-center text-white font-sans tracking-tight">
              Stop Cloud Drift.{" "}
              <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)] select-none">
                  <span>Autonomous Audits.</span>
                </div>
                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4 select-none">
                  <span>Autonomous Audits.</span>
                </div>
              </div>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3 text-white font-bold text-xl tracking-wider">
              <div className="relative h-10 w-10 shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="GravityLens Logo" 
                  fill 
                  className="object-contain invert" 
                  sizes="40px"
                />
              </div>
              <span>GravityLens</span>
            </Link>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
              Autonomous cloud infrastructure tracking, real-time drift detection, and automated cost remediation.
            </p>
          </div>

          {/* Product Col */}
          <div className="space-y-4 text-xs">
            <span className="block font-bold text-gray-200 uppercase tracking-widest">{linksPro.group}</span>
            <div className="space-y-2.5">
              {linksPro.items.map((item, idx) => (
                <Link key={idx} href={item.href} className="block hover:text-white transition-colors">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources Col */}
          <div className="space-y-4 text-xs">
            <span className="block font-bold text-gray-200 uppercase tracking-widest">{linksRes.group}</span>
            <div className="space-y-2.5">
              {linksRes.items.map((item, idx) => (
                <Link key={idx} href={item.href} className="block hover:text-white transition-colors">
                  {item.title}
                </Link>
              ))}
              
              {/* SDKs Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsSdkOpen(!isSdkOpen)}
                  onBlur={() => setTimeout(() => setIsSdkOpen(false), 200)}
                  className="flex items-center gap-1 hover:text-white transition-colors text-left focus:outline-none"
                >
                  SDKs & APIs <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {isSdkOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-0 mb-2 w-48 bg-[#0F0F16] border border-white/10 rounded-lg p-1 shadow-2xl z-50"
                    >
                      {sdkItems.map((item, idx) => (
                        <button 
                          key={idx}
                          className="w-full text-left px-3 py-2 text-[11px] text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors flex items-center justify-between"
                        >
                          {item}
                          <ArrowUpRight className="w-3 h-3 text-gray-500" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Company Col */}
          <div className="space-y-4 text-xs">
            <span className="block font-bold text-gray-200 uppercase tracking-widest">{linksCom.group}</span>
            <div className="space-y-2.5">
              {linksCom.items.map((item, idx) => (
                <Link key={idx} href={item.href} className="block hover:text-white transition-colors">
                  {item.title}
                </Link>
              ))}

              {/* Legal Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsLegalOpen(!isLegalOpen)}
                  onBlur={() => setTimeout(() => setIsLegalOpen(false), 200)}
                  className="flex items-center gap-1 hover:text-white transition-colors text-left focus:outline-none"
                >
                  Legal Documents <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {isLegalOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-0 mb-2 w-48 bg-[#0F0F16] border border-white/10 rounded-lg p-1 shadow-2xl z-50"
                    >
                      {legalItems.map((item, idx) => (
                        <button 
                          key={idx}
                          className="w-full text-left px-3 py-2 text-[11px] text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Social Col */}
          <div className="space-y-4 text-xs">
            <span className="block font-bold text-gray-200 uppercase tracking-widest">Social Connection</span>
            <div className="space-y-2.5">
              <Link href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                <IconBrandGithub className="w-4 h-4" /> GitHub
              </Link>
              <Link href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                <IconBrandLinkedin className="w-4 h-4" /> LinkedIn
              </Link>
              <Link href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                <IconBrandTwitter className="w-4 h-4" /> Twitter
              </Link>
              <Link href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                <IconBrandYoutube className="w-4 h-4" /> YouTube
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
          <StatusIndicator
            state="active"
            label="All cloud monitors fully operational"
            size="sm"
            labelClassName="text-xs text-emerald-400/80 font-medium"
          />
          <p className="text-[10px] text-gray-600">
            &copy; {new Date().getFullYear()} GravityLens Inc. All rights reserved.
          </p>
        </div>
        </div>
      </BackgroundBeamsWithCollision>
    </footer>
  );
}

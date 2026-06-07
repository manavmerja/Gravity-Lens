"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is cloud infrastructure management, and how can GravityLens help?",
    answer: "GravityLens simplifies cloud management by automatically tracking assets, detecting drift in real-time, and reconstructing historical configurations across AWS, GCP, and Azure."
  },
  {
    question: "How does GravityLens integrate with AWS, Azure, and GCP?",
    answer: "Using secure IAM role attachments with read-only permissions, GravityLens continuously queries cloud provider APIs to stay in sync with your live infrastructure configuration."
  },
  {
    question: "What are the benefits of GravityLens's Terraform integration?",
    answer: "GravityLens directly compares your live cloud resources with your Terraform state files, allowing you to instantly identify manual modifications and import untracked infrastructure back into code."
  },
  {
    question: "How does GravityLens ensure security and cost optimization?",
    answer: "We alert you to overprivileged IAM permissions, public exposure vectors, and idle/orphaned storage or compute resources, preventing both security breaches and unexpected bill spikes."
  },
  {
    question: "Can I start using GravityLens for free?",
    answer: "Yes! GravityLens offers a free tier for up to 50 active cloud resources, letting you map, track, and analyze your infrastructure at no cost."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative z-30 py-24 overflow-hidden">
      {/* Background Gradient & Velvet Purple Glow (#6b1fad) with smooth top/bottom vertical fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1E053A]/40 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6b1fad]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Title & CTA */}
          <div className="lg:col-span-5 space-y-6 pt-2">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
              Your<br />questions,<br />answered.
            </h2>
            <p className="text-gray-400 text-sm sm:text-base font-normal max-w-sm">
              Didn't find the answer to your question?
            </p>
            <button className="px-6 py-2.5 bg-gradient-to-r from-[#6b1fad] to-[#8f39db] hover:from-[#7a24c2] hover:to-[#9f4beb] text-white rounded-lg text-xs font-semibold shadow-[0_4px_20px_rgba(107,31,173,0.3)] transition-all cursor-pointer select-none">
              Ask us anything
            </button>
          </div>

          {/* Right Column: Accordion Items */}
          <div className="lg:col-span-7 space-y-4">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className="border border-white/10 rounded-xl bg-[#09090C]/80 hover:bg-[#121217]/80 transition-all duration-300 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between p-5 text-left text-white focus:outline-none"
                  >
                    <span className="font-bold text-sm sm:text-base text-gray-100 hover:text-white transition-colors max-w-[85%]">
                      {item.question}
                    </span>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-500 text-gray-400 hover:text-white hover:border-white transition-colors shrink-0">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-white/5 mt-1">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

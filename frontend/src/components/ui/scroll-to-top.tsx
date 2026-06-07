"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowUp, IconSend, IconX, IconSparkles } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { MobiusLoopIcon } from "@/components/ui/mobius-loop-icon";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export function ScrollToTop() {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am Gravity-AI. I can help you monitor cloud infrastructure, analyze real-time drift, or suggest automated cost remediation strategies. What are we auditing today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show notification tooltip after 3 seconds
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    const toggleVisibility = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      // Show scroll-to-top arrow only when reached the absolute bottom/footer (within 120px of bottom)
      if (scrollTop + clientHeight >= scrollHeight - 120) {
        setIsScrolledDown(true);
      } else {
        setIsScrolledDown(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    // Trigger once on mount in case we are already scrolled down
    toggleVisibility();

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      clearTimeout(tooltipTimer);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const userMsg = inputVal.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInputVal("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let aiResponse = "I am currently analyzing your cloud queries. For live audits, feel free to connect your AWS credentials in the dashboard!";
      
      const lower = userMsg.toLowerCase();
      if (lower.includes("drift")) {
        aiResponse = "Drift detection tracks discrepancies between your active cloud state and your declared Terraform/OpenTofu files, helping you prevent un-audited manual modifications.";
      } else if (lower.includes("cost") || lower.includes("price") || lower.includes("save")) {
        aiResponse = "GravityLens automatically scans idle resources (unattached EBS volumes, orphan load balancers) and schedules automated shutdown routines to trim cost structures by up to 30%.";
      } else if (lower.includes("hello") || lower.includes("hi")) {
        aiResponse = "Hello! Tell me about your current multi-cloud setup. Are you running on AWS, Azure, or GCP?";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleButtonClick = () => {
    setShowTooltip(false);
    if (isScrolledDown) {
      scrollToTop();
    } else {
      setIsChatOpen(!isChatOpen);
    }
  };

  return (
    <>
      {/* Notice Prompt Tooltip for Chatbot */}
      <AnimatePresence>
        {showTooltip && !isScrolledDown && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            onClick={() => {
              setIsChatOpen(true);
              setShowTooltip(false);
            }}
            className="fixed bottom-[116px] right-8 z-50 bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-400/40 flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="flex items-center gap-1.5">
              <IconSparkles className="w-3.5 h-3.5 animate-pulse text-indigo-200" />
              <span>Ask Gravity-AI!</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="p-0.5 text-indigo-200 hover:text-white rounded transition-colors cursor-pointer"
            >
              <IconX className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gravity-AI Chat Window Drawer */}
      <AnimatePresence>
        {isChatOpen && !isScrolledDown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed bottom-[116px] right-8 w-80 sm:w-[350px] h-[460px] bg-[#09090D]/95 border border-white/10 rounded-2xl flex flex-col shadow-2xl backdrop-blur-md z-50 overflow-hidden"
          >
            {/* Top gradient border highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500" />
            
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-neutral-950/40">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <MobiusLoopIcon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    Gravity-AI
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    </span>
                  </h4>
                  <p className="text-[9px] text-gray-500">Autonomous Cloud Auditor</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1 text-gray-500 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            {/* Message History list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "flex flex-col max-w-[80%] rounded-2xl px-3.5 py-2.5",
                    msg.sender === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-none self-end ml-auto" 
                      : "bg-white/5 text-gray-300 border border-white/5 rounded-tl-none self-start"
                  )}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
              {isTyping && (
                <div className="bg-white/5 text-gray-500 border border-white/5 rounded-2xl rounded-tl-none px-3.5 py-2.5 max-w-[80%] self-start flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form Footer */}
            <div className="p-3 border-t border-white/5 bg-neutral-950/40 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about drift, savings, setup..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-neutral-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                onClick={handleSend}
                className="h-8 w-8 rounded-xl bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <IconSend className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Controller Button Widget */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center justify-center">
        {/* Pulsating Ring Indicator to get user's attention to the chatbot */}
        {!isScrolledDown && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/50 animate-ping opacity-75 pointer-events-none scale-110" />
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-indigo-500/15 to-purple-500/15 blur-lg animate-pulse pointer-events-none" />
          </>
        )}
        
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ y: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleButtonClick}
          className={cn(
            "relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 cursor-pointer outline-none shadow-2xl",
            isScrolledDown
              ? "border border-white bg-white text-black shadow-[0_8px_30px_rgba(255,255,255,0.3)] hover:bg-neutral-100"
              : "border border-indigo-500/40 bg-neutral-950 text-indigo-400 shadow-[0_8px_30px_rgba(99,102,241,0.35)] hover:bg-neutral-900"
          )}
          aria-label={isScrolledDown ? "Scroll to top" : "Open Gravity-AI chatbot"}
        >
          <AnimatePresence mode="wait">
            {isScrolledDown ? (
              <motion.div
                key="arrow"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <IconArrowUp className="w-8 h-8" stroke={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="mobius"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <MobiusLoopIcon className="w-8 h-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}


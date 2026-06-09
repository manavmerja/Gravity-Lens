"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Coins, 
  Layers, 
  Cpu, 
  Database, 
  Globe, 
  Sparkles,
  Zap
} from "lucide-react";

// Imports from the installed charts library
import { AreaChart, Area } from "@/components/charts/area-chart";
import { Grid } from "@/components/charts/grid";
import { XAxis } from "@/components/charts/x-axis";
import { ChartTooltip } from "@/components/charts/tooltip/chart-tooltip";

// Ring chart imports
import { RingChart } from "@/components/charts/ring-chart";
import { Ring } from "@/components/charts/ring";
import { RingCenter } from "@/components/charts/ring-center";

import StatusIndicator from "@/components/ui/status-indicator";

// Composed chart data: base (projected - Lime), warning (minor drift - Amber), breach (uncontrolled drift - Red)
const mockComposedData = [
  { date: "May 15", base: 10000, warning: 10000, breach: 10000 },
  { date: "May 18", base: 10200, warning: 10200, breach: 10200 },
  { date: "May 21", base: 10400, warning: 10800, breach: 10800 },
  { date: "May 24", base: 10600, warning: 11300, breach: 11400 },
  { date: "May 27", base: 10800, warning: 11700, breach: 12400 },
  { date: "May 30", base: 11000, warning: 12100, breach: 13400 },
  { date: "Jun 02", base: 11200, warning: 12400, breach: 13900 },
  { date: "Jun 05", base: 11400, warning: 12600, breach: 14245 }
];

// Ring Chart data mapping to compliance scores
const mockRingData = [
  { label: "IAM Privilege", value: 85, maxValue: 100, color: "#EF4444" }, // Inner Ring (Rose)
  { label: "Cost Limits", value: 70, maxValue: 100, color: "#F59E0B" },    // Middle Ring (Amber)
  { label: "Net Security", value: 90, maxValue: 100, color: "#10B981" }    // Outer Ring (Lime)
];

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<"cost" | "resources" | "security">("cost");

  return (
    <section className="relative z-30 max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Intro Info (Left Column) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Integrations & Analytics Preview
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-none">
            Cloud Integrity, <span className="aurora-text">Visualized.</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            See GravityLens in action. Switch between our live analytics mockups below to view cost-drift bands, asset distributions, and compliance details.
          </p>

          {/* Color Indicators / Legend */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Simulation Key</h4>
            <div className="flex flex-col gap-2.5 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <StatusIndicator state="active" size="sm" />
                <span><strong className="text-gray-200">Lime (Baseline):</strong> Standard budgeted run-rate.</span>
              </span>
              <span className="flex items-center gap-2">
                <StatusIndicator state="fixing" size="sm" />
                <span><strong className="text-gray-200">Amber (Warning):</strong> Minor orphaned resource leakage.</span>
              </span>
              <span className="flex items-center gap-2">
                <StatusIndicator state="down" size="sm" />
                <span><strong className="text-gray-200">Red (Breach):</strong> Critical un-remediated instance size drift.</span>
              </span>
            </div>
          </div>
        </div>



        {/* Dashboard Preview panel (Right Column) */}
        <div className="lg:col-span-7 bg-white/[0.01] border border-white/10 rounded-2xl backdrop-blur-md relative overflow-hidden shadow-2xl flex flex-col min-h-[460px]">
          
          {/* Glass Card Header */}
          <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <StatusIndicator
                state="active"
                label="gravity-lens::showcase"
                size="sm"
                labelClassName="text-[11px] text-gray-500 font-mono"
              />
            </div>
            
            {/* Visual Tab Buttons */}
            <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10 text-xs self-start flex-wrap gap-1">
              <button
                onClick={() => setActiveTab("cost")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  activeTab === "cost" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                Cost Timeline
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  activeTab === "resources" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  activeTab === "security" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                Compliance Ring
              </button>
            </div>
          </div>

          {/* Panel Display */}
          <div className="p-6 flex-1 flex flex-col justify-center">
            
            {/* Tab 1: Composed Cost Timeline Chart */}
            {activeTab === "cost" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      Live Cost Timeline Run-Rate
                      <motion.span 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-mono border border-rose-500/20"
                      >
                        LIVE AUDIT
                      </motion.span>
                    </h3>
                    <p className="text-[10px] text-gray-500">Overhead progression by severity levels</p>
                  </div>
                  <div className="flex items-center gap-4 text-[9px] font-mono">
                    <span className="flex items-center gap-1.5"><StatusIndicator state="down" size="sm" /><span className="text-rose-400">Red</span></span>
                    <span className="flex items-center gap-1.5"><StatusIndicator state="fixing" size="sm" /><span className="text-amber-400">Amber</span></span>
                    <span className="flex items-center gap-1.5"><StatusIndicator state="active" size="sm" /><span className="text-emerald-400">Lime</span></span>
                  </div>
                </div>

                <div className="relative">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-amber-500/5 to-rose-500/5 rounded-2xl filter blur-xl pointer-events-none"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  />
                  <div className="h-[220px] w-full relative z-10">
                    <AreaChart 
                      data={mockComposedData}
                      xDataKey="date"
                      aspectRatio="2.2 / 1"
                      margin={{ top: 10, right: 10, bottom: 30, left: 45 }}
                    >
                      <Grid shimmer={true} shimmerStroke="indigo" />
                      <XAxis numTicks={5} />
                      <Area 
                        dataKey="breach" 
                        fill="#EF4444"
                        stroke="#EF4444"
                        fillOpacity={0.08}
                        strokeWidth={2}
                      />
                      <Area 
                        dataKey="warning" 
                        fill="#F59E0B"
                        stroke="#F59E0B"
                        fillOpacity={0.08}
                        strokeWidth={2}
                      />
                      <Area 
                        dataKey="base" 
                        fill="#10B981"
                        stroke="#10B981"
                        fillOpacity={0.08}
                        strokeWidth={2}
                      />
                      <ChartTooltip 
                        rows={(point) => [
                          { color: "#EF4444", label: "Breach (Red)", value: `$${point.breach}` },
                          { color: "#F59E0B", label: "Warning (Amber)", value: `$${point.warning}` },
                          { color: "#10B981", label: "Base (Lime)", value: `$${point.base}` }
                        ]}
                      />
                    </AreaChart>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Resource Allocation list */}
            {activeTab === "resources" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-sm font-bold text-white">Active Infrastructure Assets</h3>
                  <p className="text-[10px] text-gray-500">Live resources grouped by core services</p>
                </div>

                <div className="space-y-4">
                  {[
                    { name: "Compute (EC2 / EKS)", count: 118, color: "from-purple-500 to-indigo-500", percent: "75%", icon: Cpu },
                    { name: "Storage (S3 / EBS)", count: 168, color: "from-blue-500 to-sky-500", percent: "95%", icon: Layers },
                    { name: "Database (RDS / Dynamo)", count: 32, color: "from-pink-500 to-rose-500", percent: "45%", icon: Database },
                    { name: "Networking (VPC / Gateway)", count: 24, color: "from-teal-500 to-emerald-500", percent: "30%", icon: Globe }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="space-y-1.5 group">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="flex items-center gap-1.5 text-gray-300 group-hover:text-white transition-colors duration-200">
                            <motion.span
                              animate={{ scale: [1, 1.15, 1] }}
                              transition={{ repeat: Infinity, duration: 4, delay: idx * 0.4 }}
                              className="text-indigo-400 group-hover:text-indigo-300"
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </motion.span>
                            {item.name}
                          </span>
                          <span className="font-mono text-gray-400 group-hover:text-gray-200 transition-colors duration-200">{item.count} items</span>
                        </div>
                        <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                          <motion.div 
                            className={`h-full bg-gradient-to-r ${item.color} rounded-full absolute left-0 top-0`}
                            initial={{ width: "0%" }}
                            animate={{ width: item.percent }}
                            transition={{ type: "spring", stiffness: 60, damping: 12, delay: idx * 0.15 }}
                          />
                          
                          {/* Running light shimmer sheen */}
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[30%] h-full"
                            animate={{ x: ["-100%", "350%"] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: idx * 0.3 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Compliance Ring (Bklit RingChart) */}
            {activeTab === "security" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center animate-in fade-in duration-300">
                
                {/* Actual Bklit RingChart Component */}
                <div className="flex items-center justify-center relative w-full h-[180px]">
                  <RingChart
                    data={mockRingData}
                    strokeWidth={10}
                    ringGap={6}
                    baseInnerRadius={38}
                    className="w-[180px] h-[180px]"
                  >
                    <Ring index={0} />
                    <Ring index={1} />
                    <Ring index={2} />
                    <RingCenter suffix="%" />
                  </RingChart>
                </div>

                {/* Audit listings mapped to rings */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                    Multi-Audit Score
                  </h3>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                      <span className="flex items-center gap-1.5 text-gray-300">
                        <StatusIndicator state="active" size="sm" />
                        Network Security (Outer)
                      </span>
                      <span className="text-emerald-400 font-mono font-bold">90%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                      <span className="flex items-center gap-1.5 text-gray-300">
                        <StatusIndicator state="fixing" size="sm" />
                        Cost Limits (Middle)
                      </span>
                      <span className="text-amber-400 font-mono font-bold">70%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                      <span className="flex items-center gap-1.5 text-gray-300">
                        <StatusIndicator state="down" size="sm" />
                        IAM Role Privilege (Inner)
                      </span>
                      <span className="text-rose-400 font-mono font-bold">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}

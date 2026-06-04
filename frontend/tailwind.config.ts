import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      colors: {
        // GravityLens Design System
        background: "#0A0A0F",
        surface: "#111118",
        border: "#1E1E2E",
        primary: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
          muted: "#6366F120",
        },
        success: {
          DEFAULT: "#22C55E",
          muted: "#22C55E20",
        },
        danger: {
          DEFAULT: "#EF4444",
          muted: "#EF444420",
        },
        warning: {
          DEFAULT: "#F59E0B",
          muted: "#F59E0B20",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
          muted: "#475569",
        },
        // Node colors for graph
        node: {
          vpc: "#6366F1",
          subnet: "#8B5CF6",
          ec2: "#06B6D4",
          lambda: "#F59E0B",
          rds: "#22C55E",
          s3: "#F97316",
          sqs: "#EC4899",
          apigateway: "#14B8A6",
        },
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-up": "slideInUp 0.4s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
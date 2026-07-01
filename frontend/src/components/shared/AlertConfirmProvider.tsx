"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Warning, Info, CheckCircle, XCircle, WarningOctagon } from "@phosphor-icons/react";

type ModalType = "alert" | "confirm";
type ModalSeverity = "info" | "success" | "warning" | "error";

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;
  severity: ModalSeverity;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  resolvePromise?: (value: any) => void;
}

interface AlertConfirmContextType {
  showAlert: (
    title: string,
    message: string,
    severity?: ModalSeverity
  ) => Promise<void>;
  showConfirm: (
    title: string,
    message: string,
    options?: { confirmText?: string; cancelText?: string; isDanger?: boolean; severity?: ModalSeverity }
  ) => Promise<boolean>;
}

const AlertConfirmContext = createContext<AlertConfirmContextType | null>(null);

export const useAlertConfirm = () => {
  const context = useContext(AlertConfirmContext);
  if (!context) {
    throw new Error("useAlertConfirm must be used within an AlertConfirmProvider");
  }
  return context;
};

export function AlertConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    type: "alert",
    title: "",
    message: "",
    severity: "info",
  });

  const showAlert = useCallback(
    (title: string, message: string, severity: ModalSeverity = "info"): Promise<void> => {
      return new Promise<void>((resolve) => {
        setState({
          isOpen: true,
          type: "alert",
          title,
          message,
          severity,
          confirmText: "Okay",
          resolvePromise: resolve,
        });
      });
    },
    []
  );

  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      options?: { confirmText?: string; cancelText?: string; isDanger?: boolean; severity?: ModalSeverity }
    ): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        setState({
          isOpen: true,
          type: "confirm",
          title,
          message,
          severity: options?.severity || (options?.isDanger ? "error" : "info"),
          confirmText: options?.confirmText || "Confirm",
          cancelText: options?.cancelText || "Cancel",
          isDanger: options?.isDanger ?? false,
          resolvePromise: resolve,
        });
      });
    },
    []
  );

  const handleClose = useCallback(
    (value: boolean) => {
      if (state.resolvePromise) {
        state.resolvePromise(value);
      }
      setState((prev) => ({ ...prev, isOpen: false }));
    },
    [state.resolvePromise]
  );

  const getIcon = () => {
    const iconSize = 24;
    switch (state.severity) {
      case "success":
        return <CheckCircle size={iconSize} className="text-emerald-400" weight="fill" />;
      case "warning":
        return <Warning size={iconSize} className="text-amber-400" weight="fill" />;
      case "error":
        return <WarningOctagon size={iconSize} className="text-red-400" weight="fill" />;
      case "info":
      default:
        return <Info size={iconSize} className="text-indigo-400" weight="fill" />;
    }
  };

  const getSeverityStyles = () => {
    switch (state.severity) {
      case "success":
        return {
          glow: "from-emerald-500/10 via-transparent to-transparent",
          border: "border-emerald-500/20",
          accentColor: "bg-emerald-500",
        };
      case "warning":
        return {
          glow: "from-amber-500/10 via-transparent to-transparent",
          border: "border-amber-500/20",
          accentColor: "bg-amber-500",
        };
      case "error":
        return {
          glow: "from-red-500/10 via-transparent to-transparent",
          border: "border-red-500/20",
          accentColor: "bg-red-500",
        };
      case "info":
      default:
        return {
          glow: "from-indigo-500/10 via-transparent to-transparent",
          border: "border-indigo-500/20",
          accentColor: "bg-indigo-500",
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <AlertConfirmContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <AnimatePresence>
        {state.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleClose(false)}
              className="absolute inset-0 bg-[#030303]/80 backdrop-blur-md"
            />

            {/* Modal Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`relative w-full max-w-md overflow-hidden rounded-2xl border ${styles.border} bg-[#0A0A0F]/90 p-6 shadow-2xl backdrop-blur-xl`}
            >
              {/* Top Organic Accent Glow */}
              <div className={`absolute left-0 top-0 h-40 w-full bg-gradient-to-b ${styles.glow} pointer-events-none`} />

              {/* Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${styles.accentColor} opacity-70`} />

              <div className="relative z-10 flex flex-col gap-4">
                {/* Header Row */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-inner">
                    {getIcon()}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight select-none">
                    {state.title}
                  </h3>
                </div>

                {/* Message Body */}
                <div className="text-sm text-gray-400 leading-relaxed pr-1">
                  {state.message}
                </div>

                {/* Action Buttons Row */}
                <div className="mt-4 flex items-center justify-end gap-3">
                  {state.type === "confirm" && (
                    <button
                      type="button"
                      onClick={() => handleClose(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white border border-white/5 bg-white/5 hover:bg-white/10 transition-all select-none duration-150"
                    >
                      {state.cancelText}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleClose(true)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide text-white transition-all shadow-md select-none active:scale-95 duration-150 ${
                      state.isDanger
                        ? "bg-red-600 hover:bg-red-500 shadow-red-600/10 hover:shadow-red-500/20"
                        : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/10 hover:shadow-indigo-500/20"
                    }`}
                  >
                    {state.confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AlertConfirmContext.Provider>
  );
}

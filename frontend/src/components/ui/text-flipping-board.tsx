"use client";

import React, { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const BOARD_ROWS = 6;
const BOARD_COLS = 22;

// ── Optimized Individual Cell ─────────────────────────────────────────
const FlapCell = React.memo(function FlapCell({ target }: { target: string }) {
  const [current, setCurrent] = useState(" ");
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (target !== current) {
      setIsFlipping(true);

      // Swap the text at the midpoint (110ms) when the scale is flat
      const textTimer = setTimeout(() => {
        setCurrent(target);
      }, 110);

      // Stop the animation state after the full cycle (220ms)
      const animTimer = setTimeout(() => {
        setIsFlipping(false);
      }, 220);

      return () => {
        clearTimeout(textTimer);
        clearTimeout(animTimer);
      };
    }
  }, [target, current]);

  const show = current === " " ? "\u00A0" : current;

  return (
    <div className="relative flex aspect-[3/5] flex-col items-center justify-center bg-[#09090D] border border-white/5 dark:border-white/10 rounded-[3px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] overflow-hidden select-none">
      {/* Top half shadow highlight */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-white/[0.015] border-b border-black/40 z-10" />

      {/* Text element using GPU-accelerated CSS keyframe scale transition */}
      <span
        className={cn(
          "font-mono font-bold text-gray-200 tracking-wide text-center leading-none z-10 select-none",
          isFlipping ? "animate-flap" : ""
        )}
        style={{ fontSize: "clamp(8px, 1.8vw, 20px)" }}
      >
        {show}
      </span>

      {/* Mechanical middle split divider */}
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/50 z-20 pointer-events-none" />
    </div>
  );
});

// ── Row Parser ────────────────────────────────────────────────────────
type ParsedCell = { type: "char"; value: string };

function parseRow(row: string): ParsedCell[] {
  const cells: ParsedCell[] = [];
  for (let i = 0; i < row.length; i++) {
    cells.push({ type: "char", value: row[i] });
  }
  return cells;
}

// ── Word Wrap ─────────────────────────────────────────────────────────
function wrapParagraph(paragraph: string, maxCols: number): string[] {
  const lines: string[] = [];
  const words = paragraph.split(/[ \t]+/).filter(Boolean);
  let currentLine = "";

  for (const word of words) {
    if (word.length > maxCols) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = "";
      }
      lines.push(word.slice(0, maxCols));
      continue;
    }

    if (!currentLine) {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= maxCols) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

function wrapText(input: string, maxCols: number): string[] {
  return input
    .split("\n")
    .flatMap((paragraph) =>
      paragraph.trim() === "" ? [""] : wrapParagraph(paragraph, maxCols)
    );
}

// ── Main TextFlippingBoard Component ──────────────────────────────────
export interface TextFlippingBoardProps {
  rows?: string[];
  text?: string;
  className?: string;
}

export function TextFlippingBoard({
  rows,
  text,
  className,
}: TextFlippingBoardProps) {
  const board = useMemo(() => {
    const grid: ParsedCell[][] = Array.from({ length: BOARD_ROWS }, () =>
      Array.from({ length: BOARD_COLS }, () => ({
        type: "char" as const,
        value: " ",
      }))
    );

    if (text) {
      const lines = wrapText(text, BOARD_COLS).slice(0, BOARD_ROWS);
      const startRow = Math.max(0, Math.floor((BOARD_ROWS - lines.length) / 2));
      lines.forEach((line, i) => {
        const row = startRow + i;
        if (row >= BOARD_ROWS) return;
        const parsed = parseRow(line);
        const startCol = Math.max(
          0,
          Math.floor((BOARD_COLS - parsed.length) / 2)
        );
        parsed.forEach((cell, c) => {
          if (startCol + c < BOARD_COLS) {
            grid[row][startCol + c] = cell;
          }
        });
      });
    } else if (rows) {
      rows.forEach((row, r) => {
        if (r >= BOARD_ROWS) return;
        const parsed = parseRow(row);
        parsed.forEach((cell, c) => {
          if (c < BOARD_COLS) {
            grid[r][c] = cell;
          }
        });
      });
    }

    return grid;
  }, [rows, text]);

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-3xl rounded-xl bg-neutral-900 border border-white/10 p-2 shadow-2xl md:rounded-2xl md:p-4 dark:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      <div
        className="grid gap-[2px] md:gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <FlapCell key={`${r}-${c}`} target={cell.value} />
          ))
        )}
      </div>
    </div>
  );
}

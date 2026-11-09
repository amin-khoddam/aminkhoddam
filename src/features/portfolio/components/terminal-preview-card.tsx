"use client";

import { useTilt } from "@/hooks/use-tilt";

type Line = { type: "cmd" | "out"; text: string };

const LINES: Line[] = [
  { type: "cmd", text: "whoami" },
  { type: "out", text: "Frontend Developer" },
  { type: "cmd", text: "cat focus.txt" },
  { type: "out", text: "React · Next.js · TypeScript · Design Systems" },
  { type: "cmd", text: "echo $EXPERIENCE" },
  { type: "out", text: "3+ years shipping React & Next.js products" },
  { type: "cmd", text: "npm run build" },
  { type: "out", text: "compiled successfully ✓" },
];

const GLOW_BG =
  "radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), hsl(var(--primary) / 0.15), transparent 60%)";

function Prompt() {
  return <span className="me-2 shrink-0 text-success">$</span>;
}

function TerminalHeader() {
  return (
    <div className="relative flex items-center justify-between border-b border-border/60 px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex gap-1.5 sm:gap-2" aria-hidden>
        <span className="size-2.5 rounded-full bg-[#ff5f57] sm:size-3" />
        <span className="size-2.5 rounded-full bg-[#febc2e] sm:size-3" />
        <span className="size-2.5 rounded-full bg-[#28c840] sm:size-3" />
      </div>
      <span className="truncate ps-3 text-[11px] text-muted-foreground sm:text-xs">
                amin@dev:~$
            </span>
    </div>
  );
}

function TerminalLine({ type, text }: Line) {
  if (type === "cmd") {
    return (
      <p className="flex text-foreground">
        <Prompt />
        <span className="min-w-0 break-words">{text}</span>
      </p>
    );
  }
  return <p className="break-words text-muted-foreground">{text}</p>;
}

function SpinningBorder() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    >
      <div className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#22c55e_60deg,#6366f1_140deg,transparent_220deg)]" />
    </div>
  );
}

function CursorGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{ background: GLOW_BG }}
    />
  );
}

export function TerminalPreviewCard() {
  const tilt = useTilt<HTMLDivElement>();

  return (
    <div dir="ltr" className="group w-full min-w-0 [perspective:1000px]">
      <div
        {...tilt}
        className="relative rounded-2xl p-px transition-transform duration-200 ease-out will-change-transform [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] motion-reduce:transform-none"
      >
        <SpinningBorder />

        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card font-mono text-xs shadow-lg transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-primary/20 sm:text-sm">
          <CursorGlow />
          <TerminalHeader />

          <div className="relative space-y-2.5 p-4 leading-relaxed sm:space-y-3 sm:p-6">
            {LINES.map((line) => (
              <TerminalLine key={line.text} {...line} />
            ))}
            <p className="flex text-foreground">
              <Prompt />
              <span className="animate-pulse">_</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
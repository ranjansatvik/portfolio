"use client";

import { useMemo, useRef, useState } from "react";
import chartData from "@/lib/data/cryptocast-hero-sample.json";

type Point = { date: string; actual: number; predicted: number };

const DATA = chartData as Point[];
const WIDTH = 640;
const HEIGHT = 360;
const PADDING = { top: 24, right: 16, bottom: 32, left: 16 };

function buildPath(values: number[], xScale: (i: number) => number, yScale: (v: number) => number) {
  return values
    .map((v, i) => `${i === 0 ? "M" : "L"}${xScale(i).toFixed(2)},${yScale(v).toFixed(2)}`)
    .join(" ");
}

export default function CryptoCastChartPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const { actualPath, predictedPath, xScale, yScale, min, max } = useMemo(() => {
    const values = DATA.flatMap((d) => [d.actual, d.predicted]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const innerW = WIDTH - PADDING.left - PADDING.right;
    const innerH = HEIGHT - PADDING.top - PADDING.bottom;

    const xScale = (i: number) => PADDING.left + (i / (DATA.length - 1)) * innerW;
    const yScale = (v: number) => PADDING.top + innerH - ((v - min) / (max - min)) * innerH;

    return {
      actualPath: buildPath(DATA.map((d) => d.actual), xScale, yScale),
      predictedPath: buildPath(DATA.map((d) => d.predicted), xScale, yScale),
      xScale,
      yScale,
      min,
      max,
    };
  }, []);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    setTilt({ x: (relY - 0.5) * -4, y: (relX - 0.5) * 6 });

    const svgX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const innerW = WIDTH - PADDING.left - PADDING.right;
    const ratio = Math.min(1, Math.max(0, (svgX - PADDING.left) / innerW));
    const index = Math.round(ratio * (DATA.length - 1));
    setHoverIndex(index);
  }

  function handlePointerLeave() {
    setTilt({ x: 0, y: 0 });
    setHoverIndex(null);
  }

  const active = hoverIndex !== null ? DATA[hoverIndex] : DATA[DATA.length - 1];
  const fmt = (n: number) => n.toLocaleString("en-US");

  return (
    <div
      ref={panelRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full rounded-2xl border border-border bg-panel p-5 sm:p-6"
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 150ms ease-out",
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">CryptoCast · BTC/USD</p>
          <p className="font-heading text-sm font-medium text-foreground">Actual vs. LSTM forecast</p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-zinc-400" />
            Actual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            Forecast
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Chart of Bitcoin actual price versus LSTM forecast price">
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={PADDING.top + f * (HEIGHT - PADDING.top - PADDING.bottom)}
            y2={PADDING.top + f * (HEIGHT - PADDING.top - PADDING.bottom)}
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}

        <path d={actualPath} fill="none" stroke="#71717a" strokeWidth={2} />
        <path d={predictedPath} fill="none" stroke="var(--accent)" strokeWidth={2} />

        {hoverIndex !== null && (
          <>
            <line
              x1={xScale(hoverIndex)}
              x2={xScale(hoverIndex)}
              y1={PADDING.top}
              y2={HEIGHT - PADDING.bottom}
              stroke="var(--border)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle cx={xScale(hoverIndex)} cy={yScale(DATA[hoverIndex].actual)} r={4} fill="#71717a" />
            <circle cx={xScale(hoverIndex)} cy={yScale(DATA[hoverIndex].predicted)} r={4} fill="var(--accent)" />
          </>
        )}
      </svg>

      <div className="mt-3 flex items-center justify-between font-mono text-xs text-zinc-500">
        <span>{active.date}</span>
        <span>
          Actual ${fmt(active.actual)} · Forecast ${fmt(active.predicted)}
        </span>
      </div>
      <p className="mt-1 font-mono text-[11px] text-zinc-600">
        Range ${fmt(min)}–${fmt(max)} · LSTM R² 0.9933
      </p>
    </div>
  );
}

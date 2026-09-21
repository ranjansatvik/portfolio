import type { CaseStudyStep as CaseStudyStepType, ChartConfig } from "@/lib/projects";
import { stepId } from "@/lib/projects";

const STEP_LABEL: Record<CaseStudyStepType["type"], string> = {
  question: "Question",
  data: "Data",
  baseline: "Baseline",
  approach: "Approach",
  results: "Results",
  failure: "Failure",
  reflection: "Reflection",
};

const STEP_NUMBER: Record<CaseStudyStepType["type"], string> = {
  question: "01",
  data: "02",
  baseline: "03",
  approach: "04",
  results: "05",
  failure: "06",
  reflection: "07",
};

function StepShell({
  step,
  children,
}: {
  step: CaseStudyStepType;
  children: React.ReactNode;
}) {
  return (
    <section id={stepId(step.type)} className="scroll-mt-24 border-t border-border py-10 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-zinc-600">{STEP_NUMBER[step.type]}</span>
        <h2 className="font-heading text-xl font-semibold tracking-tight">{STEP_LABEL[step.type]}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function MiniChart({ chartConfig }: { chartConfig: ChartConfig }) {
  const { series, unit } = chartConfig;
  const values = series.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = 600;
  const height = 200;
  const padding = { top: 16, right: 12, bottom: 24, left: 12 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const xScale = (i: number) => padding.left + (i / Math.max(1, series.length - 1)) * innerW;
  const yScale = (v: number) => {
    if (max === min) return padding.top + innerH / 2;
    return padding.top + innerH - ((v - min) / (max - min)) * innerH;
  };

  return (
    <div className="mt-6 rounded-2xl border border-border bg-panel p-5">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Chart accompanying this step">
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + f * innerH}
            y2={padding.top + f * innerH}
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}

        {chartConfig.kind === "line" ? (
          <path
            d={series.map((p, i) => `${i === 0 ? "M" : "L"}${xScale(i).toFixed(2)},${yScale(p.value).toFixed(2)}`).join(" ")}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
          />
        ) : (
          series.map((p, i) => {
            const barWidth = innerW / series.length / 2;
            const x = xScale(i) - barWidth / 2;
            const y = yScale(p.value);
            return (
              <rect
                key={p.label}
                x={x}
                y={y}
                width={barWidth}
                height={height - padding.bottom - y}
                fill="var(--accent)"
                opacity={0.85}
                rx={2}
              />
            );
          })
        )}

        {series.map((p, i) => (
          <text
            key={p.label}
            x={xScale(i)}
            y={height - 6}
            textAnchor="middle"
            className="fill-zinc-500"
            fontSize={10}
            fontFamily="var(--font-mono)"
          >
            {p.label}
          </text>
        ))}
      </svg>
      {unit && <p className="mt-1 font-mono text-[11px] text-zinc-600">Values in {unit}</p>}
    </div>
  );
}

export default function CaseStudyStep({ step }: { step: CaseStudyStepType }) {
  switch (step.type) {
    case "question":
      return (
        <StepShell step={step}>
          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">{step.body}</p>
        </StepShell>
      );

    case "data":
      return (
        <StepShell step={step}>
          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">{step.description}</p>
          <MiniChart chartConfig={step.chartConfig} />
        </StepShell>
      );

    case "baseline":
      return (
        <StepShell step={step}>
          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">{step.body}</p>
        </StepShell>
      );

    case "approach":
      return (
        <StepShell step={step}>
          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">{step.description}</p>
          <ol className="mt-6 flex flex-col gap-2">
            {step.diagramSteps.map((diagramStep, i) => (
              <li key={diagramStep} className="flex items-start gap-3 rounded-xl border border-border bg-panel px-4 py-3">
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-zinc-300">{diagramStep}</span>
              </li>
            ))}
          </ol>
        </StepShell>
      );

    case "results":
      return (
        <StepShell step={step}>
          <div className="grid gap-3 sm:grid-cols-2">
            {step.metrics.map((m) => (
              <div key={m.metric} className="rounded-xl border border-border bg-panel p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{m.metric}</p>
                <p className="mt-1 font-heading text-lg font-semibold text-foreground">{m.value}</p>
                {m.note && <p className="mt-1 text-xs text-zinc-500">{m.note}</p>}
              </div>
            ))}
          </div>
        </StepShell>
      );

    case "failure":
      return (
        <StepShell step={step}>
          <ul className="flex flex-col gap-3">
            {step.points.map((point, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
                <span className="mt-1 shrink-0 text-accent">—</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </StepShell>
      );

    case "reflection":
      return (
        <StepShell step={step}>
          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">{step.body}</p>
        </StepShell>
      );
  }
}

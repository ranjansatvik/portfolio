"use client";

import { useEffect, useState } from "react";
import type { CaseStudyStep } from "@/lib/projects";
import { stepId } from "@/lib/projects";

const STEP_LABEL: Record<CaseStudyStep["type"], string> = {
  question: "Question",
  data: "Data",
  baseline: "Baseline",
  approach: "Approach",
  results: "Results",
  failure: "Failure",
  reflection: "Reflection",
};

export default function ScrollProgressNav({ steps }: { steps: CaseStudyStep[] }) {
  const [activeId, setActiveId] = useState<string>(stepId(steps[0].type));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    for (const step of steps) {
      const el = document.getElementById(stepId(step.type));
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [steps]);

  return (
    <nav
      aria-label="Case study progress"
      className="sticky top-20 hidden shrink-0 flex-col gap-1 self-start pt-2 lg:flex"
    >
      {steps.map((step) => {
        const id = stepId(step.type);
        const active = id === activeId;
        return (
          <a
            key={id}
            href={`#${id}`}
            className={`border-l-2 px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
              active
                ? "border-accent text-accent"
                : "border-border text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {STEP_LABEL[step.type]}
          </a>
        );
      })}
    </nav>
  );
}

import type { CaseStudy } from "@/lib/projects";
import StatusBadge from "./StatusBadge";

export default function CaseStudyHero({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <header className="mx-auto max-w-3xl px-6 pb-10 pt-20 sm:pt-28">
      <div className="flex items-center gap-3">
        <StatusBadge status={caseStudy.status} />
        {caseStudy.repoUrl && (
          <a
            href={caseStudy.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-xs text-zinc-500 underline decoration-border underline-offset-4 transition hover:text-accent"
          >
            View repo →
          </a>
        )}
      </div>
      <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {caseStudy.title}
      </h1>
      <p className="mt-4 text-base text-zinc-400 sm:text-lg">{caseStudy.hook}</p>
    </header>
  );
}

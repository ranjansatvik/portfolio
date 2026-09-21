import Link from "next/link";
import { caseStudies } from "@/lib/projects";

const STATUS_LABEL: Record<string, string> = {
  shipped: "Shipped",
  "in-progress": "In Progress",
};

export default function SelectedWork() {
  return (
    <section id="selected-work" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">Selected Work</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {caseStudies.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group flex flex-col justify-between gap-6 rounded-2xl border border-border bg-panel p-6 transition hover:border-zinc-600"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-heading text-lg font-semibold tracking-tight">
                  {project.title}
                </h3>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${
                    project.status === "shipped"
                      ? "border-accent/40 text-accent"
                      : "border-border text-zinc-500"
                  }`}
                >
                  {STATUS_LABEL[project.status]}
                </span>
              </div>
              <p className="text-sm text-zinc-400">{project.hook}</p>
            </div>
            <span className="font-mono text-xs text-zinc-500 transition group-hover:text-accent">
              Read the case study →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

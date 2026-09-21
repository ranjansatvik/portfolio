import { experiments } from "@/lib/experiments";

export default function Experiments() {
  return (
    <section id="experiments" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">Experiments</h2>
      <p className="mt-2 max-w-lg text-sm text-zinc-400">
        An interactive lab, not a card grid. Full builds land as they&apos;re ready.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {experiments.map((exp) => {
          const isLink = exp.kind === "link" && exp.githubUrl;
          const Wrapper = isLink ? "a" : "div";
          return (
            <Wrapper
              key={exp.slug}
              {...(isLink
                ? { href: exp.githubUrl, target: "_blank", rel: "noreferrer noopener" }
                : {})}
              className="group flex flex-col justify-between gap-4 rounded-2xl border border-border bg-panel p-5 transition hover:border-zinc-600"
            >
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-sm font-semibold tracking-tight">{exp.title}</h3>
                <p className="text-xs text-zinc-400">{exp.description}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[11px] text-zinc-600 group-hover:text-accent">
                  {isLink ? "GitHub →" : "Coming soon"}
                </span>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
}

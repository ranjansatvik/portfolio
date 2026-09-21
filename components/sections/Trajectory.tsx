const STEPS = [
  { year: "2022", label: "B.Tech CSE begins", detail: "Bennett University" },
  { year: "2023", label: "Data Science specialization", detail: "First ML coursework" },
  { year: "2024", label: "CryptoCast · SIH Round 2", detail: "LSTM forecasting, Smart India Hackathon" },
  { year: "2025", label: "Software Development Intern", detail: "Artisans Square, Jul–Dec" },
  { year: "2026", label: "Intern → full-time Developer", detail: "Jan–Jun, degree completed Jun 2026" },
];

export default function Trajectory() {
  return (
    <section id="trajectory" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">Trajectory</h2>
      <p className="mt-2 max-w-lg text-sm text-zinc-400">
        Not a resume restated — how the interest actually evolved.
      </p>

      <div className="relative mt-10 flex flex-col gap-8 border-l border-border pl-6 sm:flex-row sm:gap-0 sm:border-l-0 sm:border-t sm:pl-0 sm:pt-8">
        {STEPS.map((step) => (
          <div key={step.year} className="relative flex-1 sm:px-4 sm:first:pl-0 sm:last:pr-0">
            <span className="absolute -left-[29px] top-1 h-2 w-2 rounded-full bg-accent sm:-top-[37px] sm:left-4" />
            <p className="font-mono text-xs uppercase tracking-wider text-accent">{step.year}</p>
            <p className="mt-1 text-sm font-medium text-foreground">{step.label}</p>
            <p className="mt-1 text-xs text-zinc-500">{step.detail}</p>
          </div>
        ))}

        <div className="relative flex-1 sm:px-4">
          <span className="absolute -left-[29px] top-1 h-2 w-2 animate-pulse rounded-full bg-accent sm:-top-[37px] sm:left-4" />
          <p className="font-mono text-xs uppercase tracking-wider text-accent">NOW</p>
          <p className="mt-1 text-sm font-medium text-foreground">AI Engineering</p>
          <p className="mt-1 text-xs text-zinc-500">Building, learning, applying</p>
        </div>
      </div>
    </section>
  );
}

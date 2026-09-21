import CryptoCastChartPanel from "@/components/sections/CryptoCastChartPanel";

export default function Hero() {
  return (
    <section id="hero" className="relative flex min-h-[90vh] flex-col justify-center px-6 py-20">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col items-start gap-6">
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Satvik Ranjan
          </h1>
          <p className="max-w-md text-lg text-zinc-400">
            Data Scientist building toward production AI systems.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#selected-work"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-black transition hover:brightness-110"
            >
              View Work
            </a>
            <a
              href="#ask-my-ai"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-zinc-500"
            >
              Ask My AI
            </a>
          </div>
        </div>

        <CryptoCastChartPanel />
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-zinc-600">
        scroll
      </div>
    </section>
  );
}

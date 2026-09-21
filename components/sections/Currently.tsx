const TAGS = ["RAG", "Embeddings", "Vector Search", "LLMs", "Guardrails"];

export default function Currently() {
  return (
    <section id="currently" className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-panel px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">Currently</p>
        </div>
        <p className="text-sm text-zinc-300 sm:text-base">
          Building an AI-powered portfolio assistant —{" "}
          <span className="font-mono text-xs text-zinc-500 sm:text-sm">
            {TAGS.join(" · ")}
          </span>
        </p>
      </div>
    </section>
  );
}

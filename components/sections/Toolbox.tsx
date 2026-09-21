const TAGS = [
  "Python",
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "TensorFlow",
  "SQL",
  "MySQL",
  "REST APIs",
  "Django/Flask",
  "RAG",
  "Vector Search",
  "LLM APIs",
  "Git",
  "GCP",
  "React",
  "Next.js",
];

export default function Toolbox() {
  return (
    <section id="toolbox" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">Toolbox</h2>
      <p className="mt-2 max-w-lg text-sm text-zinc-400">
        A reference, not a monument to dependencies — the work above is the proof.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-3 py-1 font-mono text-xs text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}

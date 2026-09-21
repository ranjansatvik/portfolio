const STATS = [
  { value: "4,700+", label: "daily BTC observations", note: "CryptoCast dataset, 13yrs" },
  { value: "0.9933", label: "LSTM R² score", note: "CryptoCast forecast accuracy" },
  { value: "2×", label: "Smart India Hackathon", note: "Round 2 qualifier, 2024" },
  { value: "1,000+", label: "users onboarded", note: "ArkN Global platform" },
];

export default function Proof() {
  return (
    <section id="proof" className="mx-auto max-w-5xl px-6 py-16">
      <p className="mb-8 font-mono text-xs uppercase tracking-wider text-zinc-500">Proof</p>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1.5 bg-panel px-5 py-6">
            <span className="font-heading text-3xl font-semibold tracking-tight text-accent">
              {stat.value}
            </span>
            <span className="text-sm text-zinc-300">{stat.label}</span>
            <span className="font-mono text-[11px] text-zinc-600">{stat.note}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

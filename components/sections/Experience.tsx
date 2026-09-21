const ENTRIES = [
  {
    role: "Software Developer",
    org: "Artisans Square Pvt. Ltd.",
    period: "Jan 2026 – Jun 2026",
    detail:
      "Promoted from intern within six months. Owned production backend modules for a government e-procurement bidding platform and a loan origination/management system — REST APIs, RBAC, SQL, deployment.",
    tags: ["REST APIs", "Auth", "RBAC", "SQL", "Agile"],
  },
  {
    role: "Software Development Intern",
    org: "Artisans Square Pvt. Ltd.",
    period: "Jul 2025 – Dec 2025",
    detail:
      "Built and deployed production web interfaces for 5+ live client sites; handled hosting, DNS, and post-deployment verification end to end.",
    tags: ["Deployment", "DNS", "Frontend"],
  },
  {
    role: "Member Platform, ArkN Global",
    org: "Independent project, deployed",
    period: "2024 – ongoing",
    detail:
      "Full-stack donation and member-management platform onboarding 1,000+ users in production, with an admin panel for auth, RBAC, and content management.",
    tags: ["MySQL", "Auth", "RBAC"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">Experience</h2>
      <div className="mt-8 flex flex-col divide-y divide-border rounded-2xl border border-border bg-panel">
        {ENTRIES.map((entry) => (
          <div key={`${entry.role}-${entry.period}`} className="flex flex-col gap-2 p-6 sm:flex-row sm:justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-medium text-foreground">{entry.role}</h3>
              <p className="text-xs text-zinc-500">{entry.org}</p>
              <p className="mt-1 max-w-xl text-sm text-zinc-400">{entry.detail}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-zinc-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="shrink-0 font-mono text-xs text-zinc-600 sm:text-right">{entry.period}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import type { CaseStudy } from "@/lib/projects";

const STATUS_LABEL: Record<CaseStudy["status"], string> = {
  shipped: "Shipped",
  "in-progress": "In Progress",
};

export default function StatusBadge({ status }: { status: CaseStudy["status"] }) {
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${
        status === "shipped" ? "border-accent/40 text-accent" : "border-border text-zinc-500"
      }`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

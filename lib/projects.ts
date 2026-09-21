export type CaseStudyStep =
  | { type: "question"; body: string }
  | { type: "data"; description: string; chartConfig: ChartConfig }
  | { type: "baseline"; body: string }
  | { type: "approach"; description: string; diagramSteps: string[] }
  | { type: "results"; metrics: { metric: string; value: string; note?: string }[] }
  | { type: "failure"; points: string[] }
  | { type: "reflection"; body: string };

// Placeholder shape — real chart config lands once the CryptoCast case study
// content is built out (plan.md 3.4).
export type ChartConfig = {
  kind: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  status: "shipped" | "in-progress";
  hook: string;
  coverImage: string;
  steps: CaseStudyStep[]; // always 7, in order
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "cryptocast",
    title: "CryptoCast",
    status: "shipped",
    hook: "Forecasting Bitcoin with an LSTM, benchmarked against a real research paper.",
    coverImage: "/images/projects/cryptocast-cover.jpg",
    steps: [
      { type: "question", body: "Placeholder — full write-up pending the research paper and repo handoff (plan.md 3.4)." },
      { type: "data", description: "Placeholder dataset description.", chartConfig: { kind: "line" } },
      { type: "baseline", body: "Placeholder baseline description." },
      { type: "approach", description: "Placeholder approach description.", diagramSteps: ["Placeholder step"] },
      { type: "results", metrics: [{ metric: "Placeholder metric", value: "TBD" }] },
      { type: "failure", points: ["Placeholder failure point."] },
      { type: "reflection", body: "Placeholder reflection." },
    ],
  },
  {
    slug: "ai-chatbot",
    title: "AI Chatbot",
    status: "in-progress",
    hook: "A RAG pipeline over my own resume and project history, built live and documented as it happens.",
    coverImage: "/images/projects/ai-chatbot-cover.jpg",
    steps: [
      { type: "question", body: "Placeholder — case study content is written incrementally as the chatbot is built (plan.md 2.4)." },
      { type: "data", description: "Placeholder dataset description.", chartConfig: { kind: "bar" } },
      { type: "baseline", body: "Placeholder baseline description." },
      { type: "approach", description: "Placeholder approach description.", diagramSteps: ["Query", "Embedding", "Retrieved chunks", "LLM", "Answer"] },
      { type: "results", metrics: [{ metric: "Placeholder metric", value: "TBD" }] },
      { type: "failure", points: ["Placeholder failure point."] },
      { type: "reflection", body: "Placeholder reflection." },
    ],
  },
];

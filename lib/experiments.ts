export type ExperimentEntry = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  kind: "interactive" | "link"; // interactive → renders a component, link → GitHub card
  component?: "BitcoinForecastExplorer" | "RagPlayground";
  githubUrl?: string;
};

export const experiments: ExperimentEntry[] = [
  {
    slug: "bitcoin-forecast-explorer",
    title: "Bitcoin Forecast Explorer",
    description:
      "Adjust window size, model, and forecast horizon on the CryptoCast dataset and watch the chart update live.",
    tags: ["forecasting", "lstm", "cryptocast"],
    kind: "interactive",
    component: "BitcoinForecastExplorer",
  },
  {
    slug: "rag-playground",
    title: "RAG Playground",
    description:
      "Visualizes the chatbot's own pipeline in real time — query, embedding, retrieved chunks, LLM, answer.",
    tags: ["rag", "chatbot", "supabase"],
    kind: "interactive",
    component: "RagPlayground",
  },
  // Smaller GitHub-linked experiments land here as they clear the
  // "worth a mention" filter (plan.md 3.6 / 4). Federated Learning clears it —
  // it's a capability (privacy-preserving distributed training) neither
  // flagship case study demonstrates. Everything else in the GitHub account
  // is either a fork or overlaps with what CryptoCast/AI Chatbot/ArkN Global
  // already show, so it stays GitHub-only.
  {
    slug: "federated-learning-health-predictor",
    title: "Federated Learning — Health Predictor",
    description:
      "Team project forecasting urinary bladder inflammation and renal pelvis nephritis with federated learning across simulated hospital networks — training stays local, only model updates are shared. 92.45% federated accuracy vs. 97.17% centralized.",
    tags: ["federated-learning", "pytorch", "privacy"],
    kind: "link",
    githubUrl: "https://github.com/ranjansatvik/Federated-Learning-by-team-SHY",
  },
];

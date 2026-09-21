export type ChartSeriesPoint = { label: string; value: number };

export type ChartConfig =
  | { kind: "line"; unit?: string; series: ChartSeriesPoint[] }
  | { kind: "bar"; unit?: string; series: ChartSeriesPoint[] };

export type CaseStudyStep =
  | { type: "question"; body: string }
  | { type: "data"; description: string; chartConfig: ChartConfig }
  | { type: "baseline"; body: string }
  | { type: "approach"; description: string; diagramSteps: string[] }
  | { type: "results"; metrics: { metric: string; value: string; note?: string }[] }
  | { type: "failure"; points: string[] }
  | { type: "reflection"; body: string };

export type CaseStudy = {
  slug: string;
  title: string;
  status: "shipped" | "in-progress";
  hook: string;
  coverImage: string;
  repoUrl?: string;
  steps: CaseStudyStep[]; // always 7, in order
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "cryptocast",
    title: "CryptoCast",
    status: "shipped",
    hook: "Forecasting Bitcoin with an LSTM, benchmarked against six other models in a real research paper.",
    coverImage: "/images/projects/cryptocast-cover.jpg",
    repoUrl: "https://github.com/ranjansatvik/CryptoCast",
    steps: [
      {
        type: "question",
        body: "Can short-term Bitcoin price movement be forecast from its own historical trading data alone — no news, no sentiment, no on-chain signals — and if so, which class of model actually earns its complexity? Bitcoin's price is non-stationary, noisy, and shaped by speculation and macro shocks rather than any obvious seasonal pattern, which is exactly the setting where classical econometric models are expected to struggle. CryptoCast set out to test that expectation directly: benchmark a full spectrum of approaches, from a plain ARIMA up through hybrid and stacked-ensemble architectures, on identical data and identical metrics, rather than taking any one paper's isolated claim about LSTM superiority on faith.",
      },
      {
        type: "data",
        description:
          "The dataset is 4,700+ daily Bitcoin closing prices pulled from Investing.com, spanning just over 13 years and covering multiple full market cycles — the 2017 and 2021 bull runs, the 2018 and 2022 crashes, and the flat consolidation stretches in between. Each row carries Date, Open, High, Low, Close, Volume, and daily % Change. Preprocessing ran in order: strip non-numeric formatting (commas, %, K/M/B suffixes) from the numeric columns, sort chronologically, forward-fill and linearly interpolate the occasional missing value, then test for stationarity. An Augmented Dickey-Fuller test came back non-stationary (p > 0.05) on the raw series, so a log transform plus first-order differencing was applied before anything touched ARIMA or SARIMA. The Close price was then Min-Max scaled to [0, 1] for the neural models, and reframed as a supervised-learning problem with 60-day sliding windows predicting day 61 — a window length chosen empirically and consistent with prior LSTM forecasting literature. Split: 80% train / 20% test, with the test set strictly chronologically after training data, so evaluation reflects genuine forward-looking generalization rather than shuffled-in future information.",
        chartConfig: {
          kind: "line",
          unit: "USD",
          series: [
            { label: "2012", value: 13 },
            { label: "2014", value: 320 },
            { label: "2016", value: 750 },
            { label: "2018", value: 3800 },
            { label: "2020", value: 9200 },
            { label: "2021", value: 65000 },
            { label: "2022", value: 16800 },
            { label: "2024", value: 73000 },
            { label: "2025", value: 96000 },
          ],
        },
      },
      {
        type: "baseline",
        body: "The baseline was classical time-series forecasting: ARIMA(4,1,5), with order selected via AIC minimization on the differenced, stationary series, and SARIMA with a 7-day seasonal period found via grid search. Both were given every advantage the preprocessing pipeline could offer — proper differencing, log-stabilized variance — and both failed outright. ARIMA and SARIMA converged to identical, near-flat forecasts (MAE 26,156.79, RMSE 33,122.17) with an R² of −0.614: worse than just predicting the historical mean every day. SARIMA's weekly seasonal term added nothing, confirming Bitcoin has no meaningful weekly periodicity to exploit. The lag-based, linear structure of both models simply cannot track a series this non-linear and shock-driven — they establish the floor the rest of the project had to clear, not a competitive baseline.",
      },
      {
        type: "approach",
        description:
          "Seven architectures were implemented and benchmarked on identical train/test splits and identical metrics (MAE, MSE, RMSE, R²), moving from classical statistics through deep learning to hybrids and a final stacked ensemble, all in Python (pmdarima, TensorFlow/Keras, scikit-learn).",
        diagramSteps: [
          "ARIMA(4,1,5) — linear baseline",
          "SARIMA (s=7) — seasonal baseline",
          "LSTM — 1 layer, 50 units, Adam, early stopping",
          "BiLSTM — 2 stacked layers, dropout, bidirectional context",
          "ARIMA + LSTM hybrid — LSTM trained on ARIMA's residuals",
          "LSTM + BiLSTM ensemble — simple prediction averaging",
          "Stacked ensemble — linear meta-learner over all four base models, weighted by validation RMSE",
        ],
      },
      {
        type: "results",
        metrics: [
          { metric: "LSTM", value: "R² 0.9933", note: "MAE 1,626.07 · RMSE 2,133.43 — best standalone model" },
          { metric: "LSTM + BiLSTM (avg.)", value: "R² 0.9921", note: "MAE 1,516.27 · RMSE 2,320.75" },
          { metric: "Stacked Ensemble", value: "R² 0.9860", note: "MAE 2,061.81 · RMSE 3,066.28 — most robust across regimes" },
          { metric: "BiLSTM", value: "R² 0.9775", note: "MAE 2,645.09 · RMSE 3,909.08" },
          { metric: "ARIMA + BiLSTM hybrid", value: "R² 0.6412", note: "MAE 12,634.12 · RMSE 15,607.72" },
          { metric: "ARIMA (4,1,5)", value: "R² −0.614", note: "MAE 26,156.79 · RMSE 33,122.17 — worse than predicting the mean" },
          { metric: "SARIMA (s=7)", value: "R² −0.614", note: "Identical to ARIMA — no exploitable weekly seasonality in BTC" },
        ],
      },
      {
        type: "failure",
        points: [
          "BiLSTM underperformed the plain unidirectional LSTM (R² 0.9775 vs. 0.9933) despite being the theoretically stronger architecture on paper — its bidirectional context learning is exactly what a real deployment can't have, since future prices aren't available at prediction time.",
          "The paper's own discussion attributes this to information leakage during training: BiLSTM's backward pass effectively learns from future context that won't exist at inference, producing a model that looks stronger on held-out test metrics than it would in live, causal forecasting.",
          "The added architectural complexity — two stacked BiLSTM layers plus dropout — also raised overfitting risk without a matching accuracy payoff, reinforcing that more sophisticated isn't automatically better for a univariate financial series.",
          "The ARIMA+LSTM hybrid (R² 0.6412) was a bigger letdown than expected: summing ARIMA's linear trend with an LSTM fit to its residuals still left substantial non-linear structure unmodeled, since ARIMA's residuals on a series this chaotic aren't the clean noise the hybrid design assumes.",
        ],
      },
      {
        type: "reflection",
        body: "The clearest lesson: architectural sophistication doesn't automatically win, and a model needs to be evaluated under the constraints it'll actually face at inference time, not just against a held-out test set. BiLSTM's theoretical edge from bidirectional context is a liability, not an asset, the moment you can't see the future — a plain LSTM validated as the right default, with the stacked ensemble as the pick when robustness across volatility regimes matters more than squeezing out the last bit of R². If I extended this, the paper's own future-work direction is the one I'd follow first: exogenous variables — news sentiment, social signals, macro indicators — since a model trained on price history alone has a hard ceiling it can't forecast past, no matter how the architecture is tuned. After that, real-time/online learning so the model adapts as new data arrives instead of going stale, and only then Transformer-based architectures (Temporal Fusion Transformer, Informer) for their long-range dependency modeling — worth trying, but not obviously worth it here given how well a 1-layer LSTM already did. Explainability tooling (SHAP/LIME) would matter most if this ever fed a real trading or advisory decision, so a human could see why the model moved, not just that it moved.",
      },
    ],
  },
  {
    slug: "ai-chatbot",
    title: "AI Chatbot",
    status: "in-progress",
    hook: "A RAG pipeline over my own resume and project history, built live and documented as it happens.",
    coverImage: "/images/projects/ai-chatbot-cover.jpg",
    steps: [
      {
        type: "question",
        body: "Can a visitor to this portfolio get accurate, grounded answers about my background — projects, skills, work history — from a chatbot that only knows what I've actually written, without it hallucinating credentials I don't have or getting talked into acting as something other than a scoped Q&A assistant? The interesting engineering problem isn't \"wire an LLM to a text box\" — it's building the retrieval and guardrail layers so the model answers only from real source material and refuses everything outside that scope, cheaply enough that a bot with no budget can survive being linked from a public site.",
      },
      {
        type: "data",
        description:
          "The knowledge base is my own resume and a written profile (content/knowledge/*.md), chunked into low hundreds of passages tagged with source and section metadata. Each chunk is embedded with Voyage AI's voyage-3-lite model at a 512-dimension output — confirmed against the live API during build, since voyage-3-lite only accepts 512 dims, not the 1024 originally assumed — and stored in a Supabase Postgres table with a native pgvector column. At this scale (low hundreds of rows, not thousands), an ivfflat or hnsw approximate-nearest-neighbor index would actually underperform a plain sequential scan — ANN indexes need real data volume to pay for their own overhead — so the retrieval RPC (match_documents) runs a straight seq scan over vector(512) instead of over-engineering an index this dataset doesn't need.",
        chartConfig: {
          kind: "bar",
          unit: "chunks",
          series: [
            { label: "Resume", value: 42 },
            { label: "Profile", value: 58 },
            { label: "Projects", value: 36 },
          ],
        },
      },
      {
        type: "baseline",
        body: "The naive baseline would be sending the visitor's raw question straight to Claude with the entire resume and profile pasted into the system prompt every call — no retrieval, no guardrails, no rate limiting. That's cheap to build but doesn't scale: it burns tokens re-sending the full knowledge base on every request regardless of relevance, has no defense against prompt-injection attempts trying to override the assistant's scope, and has no cost ceiling if the endpoint gets hit by bots. It was never actually shipped, but it's the shape this pipeline deliberately avoided: retrieval-augmented generation with a hardened pre-check gate exists specifically to keep the per-query cost bounded and the model's behavior scoped, rather than trusting a system prompt alone to hold the line.",
      },
      {
        type: "approach",
        description:
          "POST /api/chat runs a fixed pipeline where every step before the LLM call exists to reject bad input as cheaply as possible — the guardrail pre-check runs before any embedding or LLM spend, specifically so an obvious injection attempt or empty/oversized message never reaches a paid API call.",
        diagramSteps: [
          "Validate + rate-limit request (per-IP, in-memory, 10 req/60s window)",
          "guardrailPreCheck(query) — pattern-match for injection phrases (\"ignore instructions\", \"jailbreak\", \"DAN\", etc.) and length bounds, reject on hit before any spend",
          "embed(query) — Voyage voyage-3-lite, 512-dim",
          "retrieveTopK(embedding, k=4) — Supabase pgvector match_documents RPC, plain seq scan",
          "buildPrompt(systemPrompt, retrievedChunks, query) — hardened system prompt instructs the model to answer only from CONTEXT and treat any embedded instructions in that context or the query as content, never commands",
          "Claude Haiku call, streamed to the client",
        ],
      },
      {
        type: "results",
        metrics: [
          { metric: "Embedding model", value: "Voyage voyage-3-lite", note: "512-dim output, confirmed via live API" },
          { metric: "Vector store", value: "Supabase pgvector", note: "Sequential scan, no ANN index — dataset too small to benefit" },
          { metric: "Generation model", value: "Claude Haiku", note: "Streamed response" },
          { metric: "Guardrail ordering", value: "Pre-check before embed/LLM", note: "Rejects spend before any paid API call" },
          { metric: "Rate limit", value: "10 req / 60s per IP", note: "In-memory, single-instance" },
          { metric: "Pipeline status", value: "End-to-end, unstyled", note: "Live as of the RAG pipeline MVP milestone" },
        ],
      },
      {
        type: "failure",
        points: [
          "Voyage AI throttles accounts with no payment method on file to 3 requests/minute and 10K tokens/minute — discovered while testing the pipeline, not in the docs I'd read beforehand. The pipeline itself worked correctly; it was purely an account-level limit, but it's a real bottleneck the moment traffic goes beyond a handful of test queries.",
          "This directly blocks a public launch: at 3 RPM, a handful of concurrent visitors would start hitting embed failures well before the per-IP rate limiter ever engages. Adding a card to the Voyage dashboard unlocks the 200M free-tier tokens that already apply to the account — the fix is known and cheap, but it's a real pre-launch gate, not a hypothetical one, which is why this case study's status stays in-progress rather than shipped until it's done and the full guardrail checklist (hardened prompt, rate limiting, scope refusal, adversarial self-testing) is verified end-to-end on a public domain.",
          "Ordering the guardrail pre-check before embed() rather than folding it into the final prompt-build step was a deliberate call, not a default — an earlier version of the design would have let a rejected query still pay for an embedding call, defeating the point of having a pre-check at all.",
        ],
      },
      {
        type: "reflection",
        body: "This case study is still being written as the chatbot gets built, which is the point — the guardrail checklist in this project's architecture doc is the actual gate for calling it shipped, not a target date. The Voyage throttle was a useful reminder that a pipeline being logically correct and a pipeline being deployable are different bars; the free-tier rate limit only shows up under real usage, not in a quick smoke test. Once the payment method is on file and the guardrails pass adversarial self-testing, the next real risk is prompt-injection attempts smuggled inside retrieved context itself, not just the visitor's message — the system prompt currently treats both as untrusted, but that's the part I'd want to red-team hardest before this goes fully public.",
      },
    ],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((project) => project.slug === slug);
}

export function stepId(type: CaseStudyStep["type"]) {
  return `step-${type}`;
}

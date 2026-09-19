# Portfolio Website — Technical Architecture

This is the canonical architecture reference, built from `plan.md` (which remains the source of truth for design and content decisions). Where this document and `plan.md` overlap on architecture, this document wins — it resolves plan.md's proposed architecture into something buildable. Nothing here re-litigates plan.md's locked design/content decisions.

---

## 1. Routing (Next.js App Router)

```
/                    Home (single scroll, all sections)
/projects/[slug]     Case study (CryptoCast, AI Chatbot)
/experiments         Interactive lab
/blog, /blog/[slug]  Devlog
/api/chat            RAG chat endpoint
```

Unchanged from plan.md 2.1 — it was already correct.

---

## 2. Folder / Component Structure

Two deliberate refinements from plan.md's proposed structure (2.2), both mechanical, not design decisions:

- **Case-study steps collapse into one data-driven `CaseStudyStep.tsx`**, rather than 7 separate section components (`QuestionSection.tsx` … `ReflectionSection.tsx`). Plan.md 2.3 already establishes case studies as data objects — the component layer should match: one renderer keyed by step type, driven by the `CaseStudy.steps` array. Avoids maintaining 7 near-identical files for 2 case studies.
- **`lib/chatbot/` splits `embed.ts` out from `retrieve.ts`** — embedding (query → vector) and retrieval (vector → chunks) are separately testable, and one will need mocking in tests while the other won't.

```
app/
  layout.tsx
  page.tsx
  globals.css
  projects/[slug]/page.tsx
  experiments/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  api/chat/route.ts

components/
  sections/          Hero, Currently, Proof, SelectedWork, Trajectory,
                     Experiments, Experience, Toolbox, DevlogPreview,
                     AiChatbot, Contact  (1:1 with plan.md 2.2)
  case-study/
    CaseStudyHero.tsx
    CaseStudyStep.tsx     ← single data-driven renderer for the 7 steps
    ScrollProgressNav.tsx
    StatusBadge.tsx
  experiments/
    BitcoinForecastExplorer.tsx
    RagPlayground.tsx
  ui/
    MagneticButton.tsx
    AnimatedCounter.tsx
    ProjectCard.tsx
    SkillPill.tsx
    CommandMenu.tsx

lib/
  projects.ts          typed CaseStudy[]
  experiments.ts
  posts.ts
  chatbot/
    types.ts            shared types (ChatMessage, RetrievedChunk, ...)
    embed.ts             text → embedding (Voyage AI voyage-3-lite)
    retrieve.ts           embedding → top-k pgvector query
    guardrails.ts          system prompt, scope refusal, injection checks
    rateLimit.ts            per-IP limiter
  supabase/
    client.ts             server-side Supabase client

content/
  project-1-cryptocast.ts
  project-2-ai-chatbot.ts
  posts/*.mdx
  knowledge/*.md          chunked source-of-truth for RAG (resume, profile, project writeups)

types/
  index.ts                 shared cross-cutting types if needed
```

---

## 3. Data Schemas

### CaseStudy

Extends plan.md 2.3's shape with a `steps` array that drives `CaseStudyStep.tsx`, enforcing the 7-step research-paper structure (plan.md 1.4) at the type level.

```ts
type CaseStudyStep =
  | { type: "question"; body: string }
  | { type: "data"; description: string; chartConfig: ChartConfig }
  | { type: "baseline"; body: string }
  | { type: "approach"; description: string; diagramSteps: string[] }
  | { type: "results"; metrics: { metric: string; value: string; note?: string }[] }
  | { type: "failure"; points: string[] }
  | { type: "reflection"; body: string };

type CaseStudy = {
  slug: string;
  title: string;
  status: "shipped" | "in-progress";
  hook: string;
  coverImage: string;
  steps: CaseStudyStep[];   // always 7, in order
};
```

### DevlogPost

```ts
type DevlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
};
```

### ExperimentEntry

```ts
type ExperimentEntry = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  kind: "interactive" | "link";     // interactive → renders a component, link → GitHub card
  component?: "BitcoinForecastExplorer" | "RagPlayground";
  githubUrl?: string;
};
```

---

## 4. AI Chatbot — RAG Pipeline (plan.md 2.4)

**Embedding model: Voyage AI `voyage-3-lite`** (512-dim — confirmed against the live API during Step 2; `voyage-3-lite` only accepts `output_dimension: 512`, not 1024 as originally assumed here). Chosen over OpenAI `text-embedding-3-small` to keep the pipeline in the Anthropic-adjacent ecosystem — Voyage is Anthropic's recommended embedding partner — which fits the case study's "intentional model choices" narrative better than mixing in an OpenAI dependency for just the retrieval step.

```
POST /api/chat
  → validate + rate-limit (lib/chatbot/rateLimit.ts, per-IP)
  → guardrailPreCheck(query)           (lib/chatbot/guardrails.ts — pattern-match for injection/off-topic
                                         BEFORE spending an embed or LLM call; reject early on a hit)
  → embed(query)                      (lib/chatbot/embed.ts, Voyage voyage-3-lite)
  → retrieveTopK(embedding, k=4)      (lib/chatbot/retrieve.ts → Supabase pgvector match_documents RPC)
  → buildPrompt(guardrailSystemPrompt, retrievedChunks, query)   (lib/chatbot/guardrails.ts)
  → Claude Haiku call, streamed
  → stream response to client
```

The pre-check is a distinct step, not folded into the final `buildPrompt` call — its whole point is to reject obviously malicious/off-topic input before an embed or LLM call is spent on it. Ordering it after `embed()` would defeat that.

### Supabase schema

At this data scale — a resume, profile, and a couple of project writeups, likely low hundreds of chunks — skip `ivfflat`/`hnsw` entirely and use a plain sequential scan. `ivfflat` needs a nontrivial amount of data to build a good index (thousands of rows) and underperforms a seq scan below that; `hnsw` is a reasonable choice at larger scale but is unnecessary complexity here. Revisit if the knowledge base later grows to thousands of chunks.

```sql
create table documents (
  id bigint primary key generated always as identity,
  content text,
  embedding vector(512),    -- voyage-3-lite output dimension (confirmed via live API)
  metadata jsonb            -- {source: "resume.md", section: "experience"}
);
-- No ivfflat/hnsw index: knowledge base is small (low hundreds of chunks at most),
-- a sequential scan over vector(512) outperforms an ANN index at this scale.
```

### Guardrails (non-negotiable before public, per plan.md 2.4)

- Hardened system prompt + output validation against prompt-injection/jailbreak attempts.
- Per-IP rate limiting on `/api/chat` to cap cost exposure from bots/abuse.
- Scope refusal for questions unrelated to Satvik's background.
- Adversarial self-testing before the chatbot is public on a real domain.

---

## 5. Deployment

Unchanged from plan.md 2.5: Vercel free tier now, Supabase free tier for the vector store, custom domain + production deploy later once both case studies and the chatbot are stable. Daily commits from day one, mirrored with periodic devlog/LinkedIn posts on real milestones.

---

## 6. Build Sequence

Plan.md's Section 4 already locks the order — chatbot foundation starts immediately, in parallel with the app shell — for three reasons that still hold: it's the riskiest/most technically uncertain piece, it doubles as Case Study #2's subject matter (so devlog content can be written as it's built, not reconstructed later), and it's infrastructure-heavy rather than design-heavy, so it doesn't block on visual-design decisions.

1. **Scaffold** — `create-next-app` (TS, App Router, Tailwind), fonts (Space Grotesk / Inter / IBM Plex Mono via `next/font`), theme tokens (colors from plan.md 1.1), root `layout.tsx`.
   *Commit: "project scaffold + design tokens."*
2. **Chatbot foundation, part 1** — Supabase project + `documents` table/RPC, `lib/supabase/client.ts`, `content/knowledge/*.md` seeded from resume + profile.md, a one-off ingest script (chunk → Voyage embed → insert).
   *Commit: "seed knowledge base + vector store."*
3. **Chatbot foundation, part 2** — `lib/chatbot/{types,embed,retrieve,guardrails,rateLimit}.ts`, `app/api/chat/route.ts`, minimal `AiChatbot.tsx` (no polish) wired end-to-end.
   *Commit: "RAG pipeline MVP."*
4. **Global shell** — nav, homepage `page.tsx` composing empty section placeholders in the locked order (plan.md 1.2), footer/Contact skeleton.
5. **Hero** — Concept A: positioning line + CTAs (content locked, plan.md 3.1) + the CryptoCast actual-vs-forecast chart panel (needs the CryptoCast dataset — build-time prompt, plan.md 3.4).
6. **Data layer** — `lib/projects.ts`, `lib/experiments.ts`, `lib/posts.ts` typed stubs so remaining sections have something real to render against.
7. **Remaining homepage sections**, in plan order: Currently → Proof (confirm the 4 numbers, plan.md 3.3) → SelectedWork → Trajectory → Experiments → Experience/Toolbox (build-time prompt, plan.md 3.6) → DevlogPreview → full AiChatbot polish → Contact.
8. **Case study template** — `CaseStudyStep.tsx` + `/projects/[slug]/page.tsx`, populated first by the AI Chatbot case study (content exists as it's built), CryptoCast once the paper/repo are handed over.
9. **Polish pass** — MagneticButton, ScrollProgressNav, CommandMenu, skill-tag filtering. Custom cursor stays deferred per plan.md 1.1.
10. **Deploy** — Vercel + Supabase free tier, per plan.md 2.5.

---

## 7. Open Build-Time Prompts (carried from plan.md Section 5)

Still to be asked/confirmed when their step is actually reached — not blockers now:

| Step | Ask for… | Suggested default |
|---|---|---|
| 2–3 (Chatbot foundation) | Knowledge-base source files | Resume + `profile.md` from the planning conversation |
| 5 (Hero) | CryptoCast dataset + chart data | Provided when this step starts |
| 7 (Proof) | Exact CryptoCast dataset size + other numbers | The 4 candidates in plan.md 3.3, confirm/correct |
| 7 (SelectedWork — CryptoCast) | Research paper + GitHub repo | Provided when this step starts |
| 7 (Experience/Toolbox) | Full job history, smaller projects, GitHub links | Synthesized, not transcribed — see plan.md 3.6 |
| 7 (Devlog first post) | First post topic | "Scoping the RAG pipeline" |
| 7 (Contact) | Exact handles | Pull from `content/` once populated |

Resolved since plan.md was written: **embedding model → Voyage AI `voyage-3-lite`** (see Section 4).

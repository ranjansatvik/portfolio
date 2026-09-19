# Portfolio Website — Design, Architecture, Content & Experiment Plan

This is the final, canonical plan. It supersedes `context.md`, the earlier draft of this file, and `worth-thinking.md` (kept only as rationale/history — nothing in it should be treated as more current than this document). Nothing here is code yet — this is the reference a separate architecture pass gets built against. Once that architecture exists, it becomes the bible; this document stops being the working reference at that point.

**Overall direction:** a dark, technical-editorial personal site where data visualization, case studies, interactive experiments, and an AI assistant act as evidence of engineering ability — not a claim of it. The website should demonstrate the qualities it says the developer has, not describe them.

---

## 1. Visual Design Direction

### 1.1 Overall Aesthetic — Technical Editorial

- **Near-black background** (`#0A0A0B`), with a slightly raised charcoal (`#121214`) for panels/cards, thin 1px borders (`#232326`), not pure black — gives room for depth without leaning on glow effects.
- **Accent: amber** (`#F5A623`-range) — **locked**, chosen over teal and violet after a live side-by-side comparison. Teal-on-near-black is the default combination for nearly every SaaS dashboard/analytics tool and read as "filling in a form"; amber reads warmer, closer to ink-on-a-notebook or a research annotation — the more personal, deliberate feel that was the deciding criterion. One accent + neutrals only — never introduce a second accent alongside it.
- **Typography:**
  - Headings — **Space Grotesk**
  - Body — **Inter**
  - Technical metadata (metrics, model names, dataset sizes, labels, chart annotations) — **IBM Plex Mono**
  - This three-way split turns typography itself into part of the technical visual language, not just a font choice.
- **Motion — restrained and purposeful, with an explicit hierarchy** (so the site never feels like every component is competing for attention):
  - **Level 1 (always present):** micro-transitions, hover states, typography transitions.
  - **Level 2 (important):** the hero visualization, project-card interactions.
  - **Level 3 (storytelling):** case-study scroll animations.
  - **Level 4 (easter eggs, build last / optional):** magnetic button, Cmd+K. Custom cursor deliberately **deferred** — low visitor value relative to core content, accessibility/mobile complications, better as a later polish pass if ever.
  - Ease-out, spring-like transitions (Framer Motion). Nothing snaps; nothing exceeds ~500ms. Scroll-linked animation should feel tied to scroll position, not just triggered once.
- **Grain/texture (optional):** a very subtle noise overlay prevents the flat/cheap look common in dark portfolios.
- **Avoid:** generic AI-neon aesthetics, excessive particle effects, giant skill lists, decorative animation with no semantic link to content, numbered section markers used just for decoration (numbering is only used where content is an actual sequence — e.g. the Trajectory timeline or a case study's research steps).

### 1.2 Homepage Section Order (locked)

1. **Nav** — name + Work / About / Contact, minimal sticky.
2. **Hero** — Concept A, locked (see 1.3).
3. **Currently** — a small "what I'm building right now" block (the AI chatbot), keeps the site feeling alive rather than static. Example: *"Building an AI-powered portfolio assistant — RAG · embeddings · vector search · LLMs · guardrails."*
4. **Proof** — a compact strip of substantiated, real numbers only (no invented stats). See 3.3a for the actual figures to use.
5. **Selected Work** — the two case studies (CryptoCast, AI Chatbot), presented as research-story objects, not generic cards (see 1.4, 3.4).
6. **Trajectory** *(renamed from "Growth/Direction" — that label read as HR/corporate)* — a visual path (reuses the hero's data/graph visual language) showing how interests evolved over time, ending on "AI Engineering, now." Not a resume timeline restated — it should explain evolution, not just list dates.
7. **Experiments** — an interactive mini-lab, not a static card grid (see 4).
8. **Experience** — editorial timeline (jobs/internships), separate from Trajectory, which covers the broader interest arc.
9. **Toolbox** *(renamed from "Skills/Tools", intentionally de-emphasized)* — compact tags only, no giant categorized list and no proficiency bars. The projects and case studies are what prove skill; the toolbox is just a reference, not a monument to dependencies.
10. **Notes / Devlog** — short chronological progress posts, credibility/freshness signal only, minimal visual treatment.
11. **Ask My AI** — the chatbot, one of the three highest-visual-weight elements on the page alongside Hero and Selected Work.
12. **Contact** — centered, minimal, magnetic CTA button, email + socials.

### 1.3 Hero — Concept A: Data Visualization (locked)

- Compared live against a "system initialization" terminal-readout alternative; A won clearly on both feel and message ("proof before claim" beats "personality display").
- Layout: name + one-line positioning + CTAs on one side, a real/meaningful chart panel on the other (CryptoCast actual-vs-LSTM-forecast line), which subtly reacts to cursor position. Not decorative particles — the visualization stands in for real project data from the first frame the visitor sees.
- Positioning line is **honest-but-directional**, not a rotating list of interchangeable titles (a "Data Scientist / ML Engineer / Problem Solver" typing effect reads as hedging, not range). Draft locked line:
  > "Data Scientist building toward production AI systems."
- Scroll-cue at bottom.

### 1.4 Case Study Page Format — Research-Paper Structure

Case studies are framed as compact research/engineering write-ups, not generic portfolio prose:

```
[PROJECT NAME]
[One-line subject]

01 — QUESTION       what problem is being answered
02 — DATA           source, size, timeframe
03 — BASELINE       simplest approach tried
04 — APPROACH       what was actually built (deep learning / RAG pipeline / etc.)
05 — RESULTS        real interactive chart or demo, not a screenshot
06 — FAILURE        where it broke down, what was hard
07 — REFLECTION     what would change today
```

- Full scrollytelling, one continuous scroll, sticky section labels on desktop tracking which numbered step the reader is in.
- Data section embeds a real interactive chart (Recharts/Plotly), never a static screenshot.
- Architecture/approach section can use a simple animated diagram (boxes/arrows revealing on scroll).
- Pull-quote callouts for the Failure/Reflection steps, visually separating judgment from plain narrative.
- Numbering here is legitimate (per 1.1's rule against decorative numbering) — it's a real fixed sequence every case study follows.

---

## 2. Site Architecture

### 2.1 Routing Structure (Next.js App Router)

```
/                          → Home (all sections, single scroll page)
/projects/[slug]           → Dedicated case study page (2 of these — CryptoCast + AI Chatbot)
/experiments               → interactive mini-lab (see Section 4)
/blog                      → devlog index
/blog/[slug]               → individual devlog post
/api/chat                  → chatbot API route (RAG pipeline: embed query → retrieve → LLM call)
```

### 2.2 Component Structure (proposed)

```
app/
  layout.tsx                 → root layout, fonts, theme, nav
  page.tsx                   → homepage, composes sections below
  projects/[slug]/page.tsx   → case study template (research-paper format, 1.4)

components/
  sections/
    Hero.tsx                  → Concept A: name/positioning + reactive chart panel
    Currently.tsx
    Proof.tsx                 → quantified evidence strip
    SelectedWork.tsx          → the 2 case-study cards
    Trajectory.tsx             → path graphic + evolution copy
    Experiments.tsx            → interactive lab entry points
    Experience.tsx             → editorial timeline
    Toolbox.tsx                 → compact skill tags
    DevlogPreview.tsx           → homepage teaser of latest posts
    AiChatbot.tsx                → chat UI (input, message list, streaming response)
    Contact.tsx
  case-study/
    CaseStudyHero.tsx
    QuestionSection.tsx
    DataSection.tsx            → wraps chart embeds
    BaselineSection.tsx
    ApproachSection.tsx        → architecture diagram
    ResultsSection.tsx
    FailureSection.tsx
    ReflectionSection.tsx
    ScrollProgressNav.tsx
    StatusBadge.tsx             → "Shipped" / "In Progress" tag
  experiments/
    BitcoinForecastExplorer.tsx
    RagPlayground.tsx
  ui/
    MagneticButton.tsx
    AnimatedCounter.tsx
    ProjectCard.tsx
    SkillPill.tsx
    CommandMenu.tsx             → Cmd+K / Ctrl+K quick nav

lib/
  projects.ts                  → typed data for each case study
  experiments.ts                → typed data for the Experiments lab
  posts.ts                       → typed data/MDX loader for devlog posts
  chatbot/
    retrieve.ts                  → embedding + vector-store query
    knowledge/                    → chunked source-of-truth content about Satvik
    guardrails.ts                  → system prompt, injection/off-topic refusal, rate limiting

content/
  project-1-data.ts             → CryptoCast
  project-2-data.ts              → AI Chatbot case study (architecture, guardrails, why-built-this-way)
  posts/                          → devlog markdown/MDX files
```

### 2.3 Data-Driven Content Pattern

Case studies are **data objects**, not one-off JSX per project, so the 7-step structure (1.4) is enforced by a shared template and adding project #3 later is just adding a data file.

```ts
type CaseStudy = {
  slug: string;
  title: string;
  status: "shipped" | "in-progress";
  hook: string;
  coverImage: string;
  question: string;
  data: { description: string; chartConfig: ChartConfig };
  baseline: string;
  approach: { description: string; diagramSteps: string[] };
  results: { metric: string; value: string; note?: string }[];
  failure: string[];
  reflection: string;
};
```

Devlog posts follow the same principle — a small typed/MDX shape (slug, title, date, excerpt, body) so posting doesn't require touching component code.

### 2.4 AI Chatbot — Architecture Notes (decisions locked)

- **Approach: RAG, not fine-tuning.** Chunk resume/profile/project write-ups into a small knowledge base, embed, store in a vector store, retrieve top-k chunks per question, pass to an LLM API with a strict system prompt: answer only from provided context about Satvik; refuse/redirect otherwise.
- **LLM: Claude (Haiku-class).** Chosen over GPT-4o-mini — cheap/fast enough for Q&A over a small fixed knowledge base, and building the "AI engineering" narrative of the site on the same model family signals intentionality.
- **Vector store: Supabase pgvector.** Chosen over Chroma — zero-maintenance once deployed, free tier, and doubles as a real hosted Postgres DB, which gives the case study a more concrete infra story than a local embedded store.
- **Guardrails (non-negotiable before public on a real domain):**
  - Hardened system prompt + output validation against prompt-injection/jailbreak attempts.
  - Per-IP rate limiting on `/api/chat` to cap cost exposure from bots/abuse.
  - Scope refusal for questions unrelated to Satvik's background.
- **Accuracy bar:** adversarially test against your own background before it's public — tighten the knowledge base wherever it hedges or hallucinates.
- Doubles as **case study #2** (`project-2-data.ts`, status `in-progress`) — the case study page explains the RAG pipeline and guardrails, not just the widget, so it reads as engineering rather than "wrapped an API call."

### 2.5 Deployment

- **Now:** free/temporary hosting (Vercel free tier or similar) — goal is daily-visible progress, not a finished production setup. Supabase's free tier covers the vector store without needing an always-on server.
- **Later:** purchased custom domain + proper production deploy once both case studies and the chatbot are stable.
- **GitHub:** daily commits from day one (foundation/architecture work counts), mirrored with periodic LinkedIn posts on real milestones — devlog posts (see below) are the natural source material for these, not filler commits.

---

## 3. Content Plan

Content falls into three buckets: **decided** (locked below), **ready to draft now** (I can write a first pass from what's already in this conversation), and **deferred to build-time** (the coding agent should ask for these when that section is actually being built, with suggested defaults so it's a quick choice rather than a blank prompt).

### 3.1 Hero — decided
- Name: Satvik Ranjan.
- Positioning line (locked): *"Data Scientist building toward production AI systems."*
- CTAs: "View Work" (primary) + "Ask My AI" (secondary).

### 3.2 About — draft ready, needs a personal pass
A first draft, adapted from the resume/profile already built in this conversation, rewritten to fix the "lacks direction" issue by leaning into the trajectory rather than listing credentials flatly:

> I'm a Computer Science graduate from Bennett University (Data Science specialization), and for the last year I've also been a working software developer — building backend systems for a government e-procurement platform and a loan management system, and shipping production web apps end to end. That combination is deliberate: most people studying data science haven't shipped software that real users depend on, and most backend developers haven't formally trained in forecasting, predictive modelling, or applied ML. I'm building this site — and the AI assistant on it — to close the gap between those two worlds. What I'm most drawn to is turning messy, real data into something that actually predicts or decides correctly, and then making sure it survives contact with production.

**Still needed from you:** one genuinely personal/human detail (an interest, a habit, something outside credentials) to keep this from reading as a restated resume — add whenever it comes to mind, not a blocker.

### 3.3 Proof — draft ready, pending your confirmation of exact numbers
Only substantiated numbers go here. Candidates from what's already known:
- CryptoCast dataset size (confirm exact figure — "600K+ observations" was mentioned once, verify against the actual dataset before publishing)
- LSTM R² score — `0.9933`
- Smart India Hackathon — 2 participations, Round 2 qualifier (2024)
- Semesters completed — 8 (Sep 2022 – Jun 2026)
- 1,000+ users onboarded (ArkN Global platform)
**To build at the relevant step:** confirm/correct these four before they go live — quick yes/no per number, not new research.

### 3.4 Selected Work — 2 case studies
- **CryptoCast** — shipped. **Deferred to build-time by design:** you have a research paper and the GitHub repo with the full picture (data, methodology, results, failure modes) and will hand both over when it's time to actually build this page — no draft attempted here, since guessing at the technical detail would just create rework.
- **AI Chatbot** — in-progress. Case study content gets written incrementally as it's built (naturally follows from the devlog posts).

### 3.5 Trajectory — draft ready
Suggested path, to confirm/adjust once exact dates are known:
```
2022 → B.Tech CSE begins, Bennett University
2023 → Data Science specialization; first ML coursework
2024 → CryptoCast; Smart India Hackathon (Round 2)
2025 → Software Development Intern → full-time Developer (Artisans Square)
2026 → Graduating; building the AI Chatbot / active AI-engineering upskilling
NOW  → AI Engineering
```

### 3.6 Experience Timeline & Project Inventory — deferred to build-time, agent-guided
You'll provide the raw material (jobs, smaller projects, GitHub links) when it's time to build this section, and it will likely arrive unordered/messy. **Instruction to the coding agent:** don't just transcribe what's given — synthesize it. Specifically:
- Merge the Experience timeline entries with the relevant Toolbox tags per entry (e.g. the Artisans Square entries should surface PHP/MySQL/REST-API tags contextually, without making Toolbox itself PHP-led — see 3.7's framing note).
- For each smaller project mentioned, make an explicit call on **whether it's worth a homepage mention at all** versus GitHub-only — the bar is "does this add a new capability the two flagship case studies don't already show," not "is it finished." State the reasoning when excluding something, don't just drop it silently.
- Suggested default cadence for asking: at the point Experience/Toolbox components are actually being scaffolded, not before.

### 3.7 Toolbox — draft ready, framing decided
Compact tags only, categorized loosely, no proficiency bars, no giant list (per 1.2, item 9). Starting set:
`Python · Pandas · NumPy · Scikit-learn · TensorFlow · SQL · MySQL · REST APIs · Django/Flask · RAG · Vector Search · LLM APIs · Git · GCP · React · Next.js`
**Framing note carried over from earlier direction:** PHP is deliberately absent from this list even though it was used professionally — the backend experience is represented through transferable/general tags (REST APIs, Auth, RBAC) and the Django/Flask upskilling target, not the specific legacy language, consistent with the "Python backend, not PHP" positioning already locked for the resume.

### 3.8 Devlog — decided
- Cadence: **per-milestone**, not a fixed schedule — a forced post on a timer produces filler, which is exactly the "empty motivational copy" this plan is trying to avoid. Post when something real happened (a pipeline works, a bug got fixed, a guardrail got added).
- First post topic: **deferred to build-time** — natural candidate is "scoping the RAG pipeline," but confirm once the chatbot work actually starts.

### 3.9 Contact — decided
- Include a downloadable resume PDF — a recruiter should be one click from it, not required to email first.
- **Deferred to build-time:** exact email/LinkedIn/GitHub handles to link (already known from the resume, agent should pull from `content/` once it exists rather than re-asking).

---

## 4. Interactive Experiments

Replaces the old generic "Other Experiments" card grid with an actual interactive mini-lab — fits the AI/data profile better than decorative animation, per the earlier design review.

**Core lab ideas:**
1. **Bitcoin Forecast Explorer** — visitor adjusts window size / model / forecast horizon on the CryptoCast dataset, chart updates live. Ties directly to Selected Work #1.
2. **RAG Playground** — visualizes the chatbot's own pipeline in real time (`Query → Embedding → Retrieved chunks → LLM → Answer`), turning the Ask My AI feature into something you can also inspect mechanically, not just talk to. Ties directly to Selected Work #2.
3. Any smaller GitHub projects that survive the "worth a mention" filter (3.6) can also live here as lighter entries — title, 2-line description, tags, GitHub link, simple hover lift, no heavy animation.

**Build sequencing (unchanged from earlier plan, still correct):**
- AI Chatbot foundation (2.4) starts immediately, in parallel with daily commits.
- Hero visualization + Contact/global feel next.
- Magnetic button, scroll-progress bar, Cmd+K, skill-tag filtering as later polish passes, after the skeleton and chatbot MVP both work end-to-end.
- Custom cursor stays deferred/optional (1.1).

---

## 5. Build-Time Content Prompts (for the coding/architecture agent)

Everything below is intentionally **not** a pre-launch blocker — ask for these inline, at the point the relevant section is actually being built, each with the suggested default already decided so it's a quick confirm rather than an open question:

| When building… | Ask for… | Suggested default (already decided, just confirm) |
|---|---|---|
| Chatbot foundation (2.4) | Knowledge-base source files | Resume + `profile.md` from this conversation as the starting corpus; ask if anything else should be added |
| Proof section (3.3) | Exact CryptoCast dataset size and any other numbers to include | Use the 4 candidates listed in 3.3, confirm/correct |
| Selected Work — CryptoCast (3.4) | Research paper + GitHub repo | User will provide when this page is actually being built — do not draft content before receiving it |
| Experience / Toolbox (3.6) | Full job history, smaller projects, GitHub links | User provides raw/unordered input; agent synthesizes, decides what's homepage-worthy vs. GitHub-only, and states reasoning for exclusions |
| Devlog (3.8) | First post topic | Suggested: "scoping the RAG pipeline" — confirm once chatbot build actually starts |
| Contact (3.9) | Confirm exact handles | Pull from resume content already in `content/` rather than re-asking |
| About (3.2) | One personal/human detail | Optional, add whenever — not a blocker |

Decisions already made and **not** to be re-asked: hero concept (A), accent color (amber), typography stack, LLM (Claude Haiku), vector store (Supabase pgvector), devlog cadence (per-milestone), resume-on-contact (include), Toolbox framing (PHP omitted, transferable tags used instead).

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
};

// Devlog content is per-milestone, not on a fixed schedule (plan.md 3.8) —
// posted when something real happens, not filler on a timer.
const posts: Post[] = [
  {
    slug: "scoping-the-rag-pipeline",
    title: "Scoping the RAG pipeline",
    date: "2026-09-14",
    excerpt:
      "Chose Voyage voyage-3-lite over OpenAI embeddings, Supabase pgvector over Chroma, and skipped an ANN index entirely — here's why.",
    body: `The AI Chatbot case study doubles as this site's second flagship project, so the pipeline had to be built deliberately, not wired together as fast as possible.

Embeddings: Voyage AI's voyage-3-lite, not OpenAI's text-embedding-3-small. Voyage is Anthropic's recommended embedding partner, and this project already leans on Claude for generation — keeping the stack in one ecosystem fit the "intentional model choices" story better than mixing in an unrelated OpenAI dependency for just the retrieval step. Confirmed against the live API that voyage-3-lite only accepts a 512-dim output, not the 1024 I'd assumed going in.

Vector store: Supabase pgvector over Chroma. Zero maintenance once deployed, a free tier, and it doubles as a real hosted Postgres database — a more concrete infra story for the case study than a local embedded store.

Indexing: skipped ivfflat/hnsw entirely. The knowledge base here is a resume, a profile, and a couple of project write-ups — low hundreds of chunks at most. ivfflat needs thousands of rows to build a useful index and underperforms a plain sequential scan below that; hnsw is reasonable at real scale but unnecessary complexity here. A seq scan over vector(512) is the right call until this grows by orders of magnitude.

Guardrails are the part that isn't optional: a hardened system prompt against prompt-injection, per-IP rate limiting to cap cost exposure, and scope refusal for anything unrelated to my background. None of that is built yet — it's the next milestone, before this chatbot ever sees a real domain.

The pipeline itself — embed → retrieve top-k → build prompt → stream a Claude response — is live end to end as of this post. Unstyled, ungated, but real.`,
  },
];

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

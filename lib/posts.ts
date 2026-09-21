export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
};

// Devlog content is deferred (plan.md 3.8) — posted per-milestone, not on a
// fixed schedule, so there are zero real posts yet.
const posts: Post[] = [];

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

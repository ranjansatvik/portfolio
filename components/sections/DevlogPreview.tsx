import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function DevlogPreview() {
  const posts = getAllPosts();

  return (
    <section id="devlog" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">Notes</h2>

      {posts.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">No posts yet — check back after the next milestone.</p>
      ) : (
        <div className="mt-6 flex flex-col divide-y divide-border">
          {posts
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 3)
            .map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <div className="flex flex-col gap-1 sm:flex-1">
                  <h3 className="text-sm text-foreground group-hover:text-accent">{post.title}</h3>
                  <p className="text-xs text-zinc-500">{post.excerpt}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-zinc-600">{post.date}</span>
              </Link>
            ))}
        </div>
      )}
    </section>
  );
}

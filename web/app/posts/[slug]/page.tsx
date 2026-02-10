// web/app/posts/[slug]/page.tsx
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getPostBySlug, getAllPostSlugs } from "@/app/lib/posts";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link href="/posts" className="text-sm text-white/70 hover:text-white">
        ← 返回 Posts
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">{post.title}</h1>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/60">
        {post.date ? <span>{post.date}</span> : null}
        <span className="text-white/30">•</span>
        <span>slug: {post.slug}</span>
      </div>

      {post.tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70"
            >
              #{t}
            </span>
          ))}
        </div>
      ) : null}

      <article className="prose prose-invert mt-8 max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </main>
  );
}

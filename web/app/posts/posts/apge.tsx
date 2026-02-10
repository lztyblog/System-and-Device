// web/app/posts/page.tsx
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Link from "next/link";

type PostMeta = {
  slug: string;
  title: string;
  date?: string;
  desc?: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function getPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(POSTS_DIR, filename);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data } = matter(raw);

      return {
        slug,
        title: (data.title as string) ?? slug,
        date: data.date as string | undefined,
        desc: data.desc as string | undefined,
      };
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export default function PostsPage() {
  const posts = getPosts();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Posts</h1>
        <p className="text-zinc-400 mt-2">Markdown posts from /content/posts</p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-white/10 p-6 text-zinc-300">
          没找到任何 md：<code className="text-zinc-200">web/content/posts/*.md</code>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/posts/${encodeURIComponent(p.slug)}`}
              className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-medium">{p.title}</div>
                  {p.desc ? <div className="text-zinc-400 mt-1">{p.desc}</div> : null}
                </div>
                {p.date ? <div className="text-zinc-400 text-sm">{p.date}</div> : null}
              </div>
              <div className="text-zinc-500 text-sm mt-3">slug: {p.slug}</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

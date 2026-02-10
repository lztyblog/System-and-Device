import Link from "next/link";
import { getAllPosts } from "../lib/posts";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Blog</h1>
      <p style={{ opacity: 0.7 }}>文档列表（Markdown 自动生成）</p>

      <ul style={{ marginTop: 24, display: "grid", gap: 16, padding: 0, listStyle: "none" }}>
        {posts.map((p) => (
          <li key={p.slug} style={{ border: "1px solid #3333", borderRadius: 12, padding: 16 }}>
            <Link href={`/blog/${p.slug}`} style={{ fontSize: 18, fontWeight: 700 }}>
              {p.title}
            </Link>
            <div style={{ marginTop: 8, opacity: 0.7 }}>
              {p.date} {p.tags?.length ? `· ${p.tags.join(" / ")}` : ""}
            </div>
            {p.summary ? <p style={{ marginTop: 10 }}>{p.summary}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}

import Link from "next/link";
import { getPostBySlug } from "../../lib/posts";

export default async function PostPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const p = await params;
  const { meta, contentHtml } = await getPostBySlug(p.slug);

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Link href="/blog">← 返回 Blog</Link>

      <h1 style={{ marginTop: 16 }}>{meta.title}</h1>
      <div style={{ opacity: 0.7, marginTop: 6 }}>
        {meta.date} {meta.tags?.length ? `· ${meta.tags.join(" / ")}` : ""}
      </div>

      <article
        style={{ marginTop: 24, lineHeight: 1.75 }}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
}

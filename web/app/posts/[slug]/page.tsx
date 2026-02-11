import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/app/lib/posts"; // ← 如果你原来不是这个路径，保持原来的

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  // getPostBySlug 可能是同步也可能是异步；await 两种情况都兼容
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // 你的 post 结构是 { meta: PostMeta, content: string }
  const {
    meta: { title, date, description },
    content,
  } = post;

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      {/* 如果你的列表页路由不是 /posts，把这里改成对应路径 */}
      <Link href="/posts">← Back</Link>

      <h1 style={{ marginTop: 16 }}>{title}</h1>
      <p style={{ opacity: 0.7 }}>
        {slug} · {date ?? ""}
      </p>
      {description ? <p style={{ opacity: 0.85 }}>{description}</p> : null}

      <div style={{ marginTop: 24 }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </main>
  );
}

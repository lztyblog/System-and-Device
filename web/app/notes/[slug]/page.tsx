// web/app/notes/[slug]/page.tsx
import Link from "next/link";

type Note = {
  id: string;
  title: string;
  desc?: string;
  category?: string;
  tags?: string[];
  updatedAt?: string;
};

async function getNote(slug: string): Promise<Note | null> {
  // 这里走你的 API（同域，相对路径即可）
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/notes/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return (await res.json()) as Note;
}

export default async function NotePage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  // ✅ 兼容 Next 16：params 可能是 Promise
  const p = await params;
  const slug = p?.slug;

  if (!slug) {
    return (
      <main style={{ padding: 24 }}>
        <Link href="/">← 返回首页</Link>
        <h1 style={{ marginTop: 16 }}>Note: slug 缺失</h1>
        <p>路由参数没拿到（slug is undefined）。</p>
      </main>
    );
  }

  const note = await getNote(slug);

  if (!note) {
    return (
      <main style={{ padding: 24 }}>
        <Link href="/">← 返回首页</Link>
        <h1 style={{ marginTop: 16 }}>找不到：{slug}</h1>
        <p>API 没返回该 note（可能 id 不存在或路由没对上）。</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <Link href="/">← 返回首页</Link>
      <h1 style={{ marginTop: 16 }}>{note.title}</h1>
      <p style={{ opacity: 0.7 }}>id: {note.id}</p>
      {note.desc ? <p style={{ marginTop: 12 }}>{note.desc}</p> : null}
    </main>
  );
}

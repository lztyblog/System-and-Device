// web/app/notes/[slug]/page.tsx
import Link from "next/link";
import { headers } from "next/headers";

function baseUrlFromHeaders(h: Headers) {
  const host = h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

type NoteDetail = {
  slug: string;
  title: string;
  content: string;
  time: string;
};

export default async function NotePage({
  params,
}: {
  params: { slug: string };
}) {
  const h = await headers();
  const baseUrl = baseUrlFromHeaders(h);

  // ✅ 关键：这里一定是 ${params.slug}
  const res = await fetch(`${baseUrl}/api/notes/${params.slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main style={{ padding: 24 }}>
        <h1>找不到这条 Note</h1>
        <p>
          slug: <code>{params.slug}</code>
        </p>
        <p>
          API: <code>{baseUrl}/api/notes/{params.slug}</code>
        </p>
        <Link href="/">返回首页</Link>
      </main>
    );
  }

  const data = (await res.json()) as NoteDetail;

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: 16 }}>
        ← 返回首页
      </Link>

      <h1 style={{ fontSize: 32, marginBottom: 8 }}>{data.title}</h1>
      <div style={{ opacity: 0.7, marginBottom: 20 }}>
        <span>slug: {data.slug}</span> · <span>{data.time}</span>
      </div>

      <article style={{ lineHeight: 1.8, fontSize: 16, whiteSpace: "pre-wrap" }}>
        {data.content}
      </article>
    </main>
  );
}

import Link from "next/link";
import { getNote } from "@/app/lib/notes";

export default async function NotePage({
  params,
}: {
  params: { slug: string };
}) {
  const note = getNote(params.slug);
  if (!note) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
          <div className="text-xl font-semibold">未找到内容</div>
          <div className="mt-2 text-white/70">这个条目可能被删除或改名了。</div>
          <Link className="mt-6 inline-block text-white underline" href="/">
            返回首页
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-white">
      <Link href="/" className="text-white/70 hover:text-white">
        ← 返回首页
      </Link>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-7">
        <div className="text-sm text-white/60">
          {note.category} · 更新于 {new Date(note.updatedAt).toLocaleString()}
        </div>
        <h1 className="mt-3 text-3xl font-semibold">{note.title}</h1>
        <p className="mt-3 text-white/75">{note.desc}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-sm text-white/70"
            >
              #{t}
            </span>
          ))}
        </div>

        <div className="mt-8 whitespace-pre-wrap leading-7 text-white/85">
          {note.content.trim()}
        </div>
      </div>
    </main>
  );
}

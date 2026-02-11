import Link from "next/link";
import { getAllPosts } from "@/app/lib/posts"; // 你按你的实际路径改

export default async function BlogIndex() {
  const posts = await getAllPosts(); // [{ slug,title,date,tags,excerpt }]

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(900px_500px_at_80%_20%,rgba(168,85,247,0.14),transparent_60%),linear-gradient(to_bottom,rgba(3,7,18,1),rgba(2,6,23,1))] text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <span className="text-sm font-semibold tracking-wider">SD</span>
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-wide">Blog</div>
              <div className="text-xs text-zinc-400">系统与设备 · 笔记/文章</div>
            </div>
          </div>

          <nav className="flex items-center gap-2 text-sm">
            <Link className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white" href="/">
              首页
            </Link>
            <Link className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white" href="/download?root=download">
              Download
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 ring-1 ring-white/10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">文章列表</h1>
              <p className="mt-2 text-sm text-zinc-300">
                共 {posts.length} 篇 · 点击进入阅读
              </p>
            </div>
            <Link
              className="rounded-xl bg-white/5 px-4 py-2 text-sm text-zinc-200 ring-1 ring-white/10 hover:bg-white/10"
              href="/download?root=blog"
            >
              Blog 文件库 ↗
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {posts.map((p: any) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-zinc-400">{p.date ?? ""}</span>
                <span className="text-xs text-zinc-500">/{p.slug}</span>
              </div>
              <h2 className="mt-3 text-base font-semibold tracking-tight text-zinc-100 group-hover:text-cyan-200">
                {p.title}
              </h2>
              {p.excerpt ? (
                <p className="mt-2 text-sm leading-6 text-zinc-300">{p.excerpt}</p>
              ) : null}

              {Array.isArray(p.tags) && p.tags.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.slice(0, 6).map((t: string) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300 ring-1 ring-white/10"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}

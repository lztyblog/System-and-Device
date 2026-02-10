import Link from "next/link";
import { headers } from "next/headers";

type HelloData = { message?: string; time?: string; error?: string };
type Note = {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  category: "Tools" | "Network" | "OS" | "Next.js";
  updatedAt: string;
};

function cx(...cls: Array<string | false | undefined | null>) {
  return cls.filter(Boolean).join(" ");
}

function baseUrlFromHeaders(h: Headers) {
  const host = h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function getHello(baseUrl: string): Promise<HelloData> {
  try {
    const res = await fetch(`${baseUrl}/api/hello`, { cache: "no-store" });
    return (await res.json()) as HelloData;
  } catch {
    return { error: "API 请求失败（本地 http / 线上 https）" };
  }
}

async function getNotes(baseUrl: string): Promise<Note[]> {
  try {
    const res = await fetch(`${baseUrl}/api/notes`, { cache: "no-store" });
    const data = (await res.json()) as { items: Note[] };
    return data.items ?? [];
  } catch {
    return [];
  }
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function countTags(items: Note[]) {
  const all = items.flatMap((n) => n.tags);
  const map = new Map<string, number>();
  for (const t of all) map.set(t, (map.get(t) ?? 0) + 1);
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);
}

export default async function Home({
  searchParams,
}: {
  searchParams:Promise< { q?: string; tag?: string; cat?: string }>;
}) {
  const sp = await searchParams;
  const h = await headers();
  const baseUrl = baseUrlFromHeaders(h);

  const q = (sp?.q ?? "").trim();
  const tag = (sp?.tag ?? "").trim();
  const cat = (sp?.cat ?? "").trim();

  const [hello, notes] = await Promise.all([getHello(baseUrl), getNotes(baseUrl)]);

  const categories = uniq(notes.map((n) => n.category));
  const tagCounts = countTags(notes);

  const filtered = notes.filter((n) => {
    const hitQ =
      !q ||
      `${n.title} ${n.desc} ${n.tags.join(" ")} ${n.category}`
        .toLowerCase()
        .includes(q.toLowerCase());
    const hitTag = !tag || n.tags.includes(tag);
    const hitCat = !cat || n.category === cat;
    return hitQ && hitTag && hitCat;
  });

  const kpiTotal = notes.length;
  const kpiCats = categories.length;
  const kpiTags = uniq(notes.flatMap((n) => n.tags)).length;
  const kpiFiltered = filtered.length;

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(56,189,248,0.20),transparent_60%),radial-gradient(900px_500px_at_80%_20%,rgba(168,85,247,0.18),transparent_60%),radial-gradient(1000px_600px_at_55%_85%,rgba(34,197,94,0.12),transparent_60%),linear-gradient(to_bottom,rgba(3,7,18,1),rgba(2,6,23,1))] text-zinc-100">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <span className="text-sm font-semibold tracking-wider">SD</span>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-wide">System & Device</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300 ring-1 ring-emerald-500/20">
                  LIVE
                </span>
              </div>
              <div className="text-xs text-zinc-400">Next.js + API · 科技风仪表盘</div>
            </div>
          </div>

          <nav className="flex items-center gap-2 text-sm">
            <Link
              className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white"
              href="/"
            >
              首页
            </Link>
            <Link
              className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white"
              href="/api/hello"
              prefetch={false}
            >
              API
            </Link>
            <Link
              className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/5 hover:text-white"
              href="/api/notes"
              prefetch={false}
            >
              Notes
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 ring-1 ring-white/10">
          {/* grid + scanline */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.30),transparent_50%),radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.25),transparent_55%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>

          <div className="relative">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300 ring-1 ring-white/10">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                  实时拉取 /api/hello 与 /api/notes
                </div>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  系统与设备 · <span className="text-cyan-300">科技仪表盘</span>
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
                  服务器端渲染获取实时数据，页面以“控制台/监控面板”风格展示。
                  线上 Vercel 与本地开发自动切换 http/https，避免 SSL 报错。
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-zinc-200"
                  href="/api/hello"
                  prefetch={false}
                >
                  打开 API JSON
                  <span className="opacity-70 group-hover:opacity-100">↗</span>
                </Link>

                <Link
                  className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-zinc-200 ring-1 ring-white/10 hover:bg-white/10"
                  href="/api/notes"
                  prefetch={false}
                >
                  打开 /api/notes
                  <span className="opacity-70">↗</span>
                </Link>

                <div className="rounded-xl bg-black/30 px-4 py-2 text-xs text-zinc-300 ring-1 ring-white/10">
                  Base URL：<span className="text-zinc-100">{baseUrl}</span>
                </div>
              </div>
            </div>

            {/* KPI */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <KPI label="Notes 总数" value={kpiTotal} hint="本地模拟数据" />
              <KPI label="分类数" value={kpiCats} hint="category" />
              <KPI label="标签数" value={kpiTags} hint="tags" />
              <KPI label="当前筛选" value={kpiFiltered} hint="search" />
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide">检索面板</h2>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-300 ring-1 ring-white/10">
                SSR
              </span>
            </div>

            <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  ⌕
                </div>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="搜索：例如 wsl / nextjs / tcp..."
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-9 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none ring-1 ring-white/10 focus:border-cyan-400/40 focus:ring-cyan-400/20"
                />
              </div>

              <button className="rounded-xl bg-cyan-400/90 px-5 py-3 text-sm font-semibold text-black hover:bg-cyan-300">
                搜索
              </button>

              {tag ? <input type="hidden" name="tag" value={tag} /> : null}
              {cat ? <input type="hidden" name="cat" value={cat} /> : null}
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <FilterPill label="全部" active={!cat} href={buildHref({ q, tag, cat: "" })} />
              {categories.map((c) => (
                <FilterPill
                  key={c}
                  label={c}
                  active={cat === c}
                  href={buildHref({ q, tag, cat: c })}
                />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400">热门标签：</span>
              <FilterPill label="全部" active={!tag} href={buildHref({ q, tag: "", cat })} />
              {tagCounts.map(([t, n]) => (
                <FilterPill
                  key={t}
                  label={`${t} · ${n}`}
                  active={tag === t}
                  href={buildHref({ q, tag: t, cat })}
                />
              ))}
            </div>
          </div>

          {/* API Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide">API 状态</h2>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300 ring-1 ring-emerald-500/20">
                no-store
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-black/35 p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">/api/hello</span>
                <span
                  className={cx(
                    "text-xs",
                    hello.error ? "text-rose-300" : "text-emerald-300"
                  )}
                >
                  {hello.error ? "ERROR" : "OK"}
                </span>
              </div>

              <pre className="mt-2 max-h-44 overflow-auto text-xs leading-5 text-zinc-200">
{JSON.stringify(hello, null, 2)}
              </pre>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                className="rounded-xl bg-white/5 px-3 py-2 text-center text-sm text-zinc-200 ring-1 ring-white/10 hover:bg-white/10"
                href="/api/hello"
                prefetch={false}
              >
                打开 /api/hello
              </Link>
              <Link
                className="rounded-xl bg-white/5 px-3 py-2 text-center text-sm text-zinc-200 ring-1 ring-white/10 hover:bg-white/10"
                href="/api/notes"
                prefetch={false}
              >
                打开 /api/notes
              </Link>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-zinc-300">
              提示：如果你看到 hydration 报错，多半是浏览器插件注入属性。
              你已经在 <code className="text-zinc-100">layout.tsx</code> 加了{" "}
              <code className="text-zinc-100">suppressHydrationWarning</code>，基本可压住。
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="mt-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">知识条目</h2>
              <p className="mt-1 text-sm text-zinc-400">
                用 /api/notes 模拟数据库。你之后可以换成真实数据源（文件/数据库/爬虫）。
              </p>
            </div>
            <Link
              className="rounded-xl bg-white/5 px-4 py-2 text-sm text-zinc-200 ring-1 ring-white/10 hover:bg-white/10"
              href={buildHref({ q: "", tag: "", cat: "" })}
            >
              清空筛选
            </Link>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {filtered.length === 0 ? (
              <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-zinc-300 ring-1 ring-white/10">
                没有匹配结果。试试清空筛选，或者换个关键词。
              </div>
            ) : (
              filtered.map((n) => (
                <article
                  key={n.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:border-cyan-400/30"
                >
                  <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyan-400/10 blur-2xl transition group-hover:bg-cyan-400/20" />
                  <div className="pointer-events-none absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-2xl transition group-hover:bg-fuchsia-500/20" />

                  <div className="relative">
                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2">
                        <span className="rounded-lg bg-black/30 px-2 py-1 text-xs text-zinc-300 ring-1 ring-white/10">
                          {n.category}
                        </span>
                        <span className="text-xs text-zinc-500">{n.updatedAt}</span>
                      </div>
                      <span className="text-xs text-zinc-500">#{n.id}</span>
                    </div>

                    <h3 className="mt-3 text-base font-semibold tracking-tight text-zinc-100">
                      {n.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{n.desc}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {n.tags.map((t) => (
                        <Link
                          key={t}
                          href={buildHref({ q, tag: t, cat })}
                          className={cx(
                            "rounded-full px-3 py-1 text-xs ring-1 transition",
                            tag === t
                              ? "bg-cyan-400/20 text-cyan-200 ring-cyan-400/30"
                              : "bg-white/5 text-zinc-300 ring-white/10 hover:bg-white/10"
                          )}
                        >
                          #{t}
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <footer className="mt-10 border-t border-white/10 py-6 text-xs text-zinc-500">
          Built with Next.js on Vercel · repo: System-and-Device
        </footer>
      </main>
    </div>
  );
}

function KPI({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 ring-1 ring-white/10">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <div className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-300 ring-1 ring-white/10">
          {hint}
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "rounded-full px-3 py-1 text-xs ring-1 transition",
        active
          ? "bg-cyan-400/20 text-cyan-200 ring-cyan-400/30"
          : "bg-white/5 text-zinc-300 ring-white/10 hover:bg-white/10"
      )}
    >
      {label}
    </Link>
  );
}

function buildHref({
  q,
  tag,
  cat,
}: {
  q?: string;
  tag?: string;
  cat?: string;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (tag) params.set("tag", tag);
  if (cat) params.set("cat", cat);
  const qs = params.toString();
  return qs ? `/?${qs}` : `/`;
}

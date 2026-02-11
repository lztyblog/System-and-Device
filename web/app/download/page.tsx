// web/app/download/page.tsx
import Link from "next/link";
import { headers } from "next/headers";

type GhItem = {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
};

const OWNER = "lztyblog";
const REPO = "System-and-Device";
const BRANCH = "main";

// 两个“资源站根目录”
const ROOTS = {
  download: "web/content/download",
  blog: "web/content/posts",
} as const;

type RootKey = keyof typeof ROOTS;

function cx(...cls: Array<string | false | undefined | null>) {
  return cls.filter(Boolean).join(" ");
}

function baseUrlFromHeaders(h: Headers) {
  const host = h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function joinPath(a: string, b: string) {
  const x = a.replace(/\/+$/, "");
  const y = b.replace(/^\/+/, "");
  if (!x) return y;
  if (!y) return x;
  return `${x}/${y}`;
}

function humanSize(bytes?: number) {
  if (!bytes || bytes < 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function rawUrl(path: string) {
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;
}

function buildHref(root: RootKey, path: string) {
  const p = new URLSearchParams();
  p.set("root", root);
  if (path) p.set("path", path);
  return `/download?${p.toString()}`;
}

function crumbs(displayPath: string) {
  const parts = displayPath ? displayPath.split("/").filter(Boolean) : [];
  const out: Array<{ label: string; path: string }> = [{ label: "资源库", path: "" }];

  let cur = "";
  for (const part of parts) {
    cur = joinPath(cur, part);
    out.push({ label: part, path: cur });
  }
  return out;
}

export default async function DownloadPage({
  searchParams,
}: {
  searchParams: Promise<{ root?: string; path?: string }>;
}) {
  const sp = await searchParams;

  // ✅ 默认打开 Downloads（更符合你首页 Download 按钮）
  const rootKey: RootKey =
    sp?.root === "blog" || sp?.root === "download" ? (sp.root as RootKey) : "download";

  const subPath = (sp?.path ?? "").replace(/^\/+/, "");
  const rootPath = ROOTS[rootKey];
  const ghPath = joinPath(rootPath, subPath);

  const h = await headers();
  const baseUrl = baseUrlFromHeaders(h);

  const res = await fetch(`${baseUrl}/api/gh?path=${encodeURIComponent(ghPath)}`, {
    cache: "no-store",
  });

  const items = (await res.json()) as GhItem[] | { error: string };
  const list = Array.isArray(items) ? items : [];

  const dirs = list
    .filter((x) => x.type === "dir")
    .sort((a, b) => a.name.localeCompare(b.name));
  const files = list
    .filter((x) => x.type === "file")
    // ✅ 隐藏 .gitkeep
    .filter((x) => x.name !== ".gitkeep")
    .sort((a, b) => a.name.localeCompare(b.name));
  const all = [...dirs, ...files];

  const crumbList = crumbs(subPath);

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,rgba(3,7,18,1),rgba(2,6,23,1))] text-zinc-100">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <span className="text-sm font-semibold tracking-wider">DL</span>
            </div>
            <div>
              <div className="font-semibold tracking-wide">资源库</div>
              <div className="text-xs text-zinc-400">
                {OWNER}/{REPO} ·{" "}
                {rootKey === "download" ? "web/content/download/" : "web/content/posts/"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
              href="/"
            >
              ← 首页
            </Link>
            <Link
              className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
              href="/blog"
            >
              Blog
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* 根目录切换 */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Link
            className={cx(
              "rounded-xl px-4 py-2 text-sm ring-1 transition",
              rootKey === "download"
                ? "bg-cyan-400/20 text-cyan-200 ring-cyan-400/30"
                : "bg-white/5 text-zinc-300 ring-white/10 hover:bg-white/10"
            )}
            href={buildHref("download", "")}
          >
            Downloads
          </Link>

          <Link
            className={cx(
              "rounded-xl px-4 py-2 text-sm ring-1 transition",
              rootKey === "blog"
                ? "bg-cyan-400/20 text-cyan-200 ring-cyan-400/30"
                : "bg-white/5 text-zinc-300 ring-white/10 hover:bg-white/10"
            )}
            href={buildHref("blog", "")}
          >
            Blog Files
          </Link>
        </div>

        {/* 面包屑 */}
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-zinc-300">
          {crumbList.map((c, idx) => (
            <span key={c.path} className="flex items-center gap-2">
              <Link className="hover:text-white" href={buildHref(rootKey, c.path)}>
                {c.label}
              </Link>
              {idx < crumbList.length - 1 ? <span className="text-zinc-600">/</span> : null}
            </span>
          ))}
        </nav>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] ring-1 ring-white/10">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-sm font-semibold tracking-wide">文件列表</div>
            <div className="text-xs text-zinc-400">{all.length} 项</div>
          </div>

          {Array.isArray(items) ? null : (
            <div className="px-4 py-4 text-sm text-rose-300">
              {(items as any).error ?? "加载失败"}
            </div>
          )}

          <ul className="divide-y divide-white/10">
            {all.map((it) => {
              const isDir = it.type === "dir";
              const icon = isDir ? "📁" : "⬇️";
              const size = !isDir ? humanSize(it.size) : "";

              const relativePath = it.path.startsWith(rootPath)
                ? it.path.slice(rootPath.length).replace(/^\/+/, "")
                : it.path;

              if (isDir) {
                return (
                  <li key={it.path} className="px-4 py-3 hover:bg-white/[0.03]">
                    <Link
                      className="flex items-center justify-between gap-3"
                      href={buildHref(rootKey, relativePath)}
                    >
                      <div className="flex items-center gap-3">
                        <span>{icon}</span>
                        <span className="text-zinc-100">{it.name}</span>
                      </div>
                      <span className="text-xs text-zinc-500">打开</span>
                    </Link>
                  </li>
                );
              }

              // ✅ 文件：点击直接下载（走 /api/dl）
              const dlHref = `/api/dl?path=${encodeURIComponent(it.path)}`;

              return (
                <li key={it.path} className="px-4 py-3 hover:bg-white/[0.03]">
                  <div className="flex items-center justify-between gap-3">
                    <a className="flex items-center gap-3" href={dlHref}>
                      <span>{icon}</span>
                      <span className="text-zinc-100">{it.name}</span>
                    </a>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500">{size}</span>

                      {/* 可选：预览（不影响下载） */}
                      <a
                        className="text-xs text-zinc-400 hover:text-white"
                        href={rawUrl(it.path)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        预览
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}

            {all.length === 0 ? (
              <li className="px-4 py-6 text-sm text-zinc-400">这个目录下没有文件。</li>
            ) : null}
          </ul>
        </div>
      </main>
    </div>
  );
}

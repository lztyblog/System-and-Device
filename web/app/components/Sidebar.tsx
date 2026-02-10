import Link from "next/link";

export default function Sidebar({
  categories,
  tags,
  activeTag,
}: {
  categories: string[];
  tags: string[];
  activeTag: string | null;
}) {
  return (
    <aside className="hidden lg:block w-[280px] shrink-0">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sticky top-6">
        <div className="text-sm text-white/60">分类</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-sm text-white/80"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-6 text-sm text-white/60">标签</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/"
            className={`rounded-full px-3 py-1 text-sm border ${
              activeTag
                ? "border-white/10 bg-black/30 text-white/70"
                : "border-white/20 bg-white/10 text-white"
            }`}
          >
            全部
          </Link>

          {tags.map((t) => {
            const isActive = activeTag === t;
            return (
              <Link
                key={t}
                href={`/?tag=${encodeURIComponent(t)}`}
                className={`rounded-full px-3 py-1 text-sm border ${
                  isActive
                    ? "border-white/30 bg-white/15 text-white"
                    : "border-white/10 bg-black/30 text-white/70 hover:text-white"
                }`}
              >
                #{t}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

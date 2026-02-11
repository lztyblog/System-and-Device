import fs from "node:fs";
import path from "node:path";

export type PostMeta = {
  title: string;
  date?: string;
  description?: string;
};

export type Post = {
  meta: PostMeta;
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export function getPostBySlug(slug: string): Post | null {
  const candidates = [
    path.join(POSTS_DIR, `${slug}.md`),
    path.join(POSTS_DIR, `${slug}.mdx`),
  ];

  const file = candidates.find((p) => fs.existsSync(p));
  if (!file) return null;

  const raw = fs.readFileSync(file, "utf8");

  // 超简易 frontmatter 解析（兼容你现在需求：title/date/description）
  // 格式：
  // ---
  // title: Hello
  // date: 2026-02-10
  // description: xxx
  // ---
  // markdown...
  let meta: PostMeta = { title: slug };
  let content = raw;

  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (m) {
    const fm = m[1];
    content = m[2];

    const get = (key: string) => {
      const r = fm.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
      return r ? r[1].trim().replace(/^['"]|['"]$/g, "") : undefined;
    };

    meta = {
      title: get("title") ?? slug,
      date: get("date"),
      description: get("description"),
    };
  }

  return { meta, content };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

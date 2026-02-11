// web/app/lib/posts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date?: string;          // ✅ 永远是 string
  description?: string;
};

function toTime(v: unknown) {
  if (!v) return 0;
  if (v instanceof Date) return v.getTime();
  const t = new Date(String(v)).getTime();
  return Number.isFinite(t) ? t : 0;
}

function toDateString(v: unknown): string | undefined {
  if (!v) return undefined;
  if (v instanceof Date) return v.toISOString();
  const s = String(v).trim();
  return s ? s : undefined;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts: PostMeta[] = files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, "");
    const fullPath = path.join(POSTS_DIR, filename);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(raw);

    return {
      slug,
      title: (data as any)?.title ? String((data as any).title) : slug,
      date: toDateString((data as any)?.date),
      description: (data as any)?.description
        ? String((data as any).description)
        : undefined,
    };
  });

  // ✅ 排序：新日期在前
  posts.sort((a, b) => toTime(b.date) - toTime(a.date));
  return posts;
}

export function getPostBySlug(slug: string) {
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);

  const fullPath = fs.existsSync(mdPath) ? mdPath : mdxPath;
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: (data as any)?.title ? String((data as any).title) : slug,
      date: toDateString((data as any)?.date),
      description: (data as any)?.description
        ? String((data as any).description)
        : undefined,
    } as PostMeta,
    content,
  };
}

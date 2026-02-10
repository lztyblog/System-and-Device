import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDir = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
  summary?: string;
};

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(postsDir, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(raw);

    return {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ""),
      tags: (data.tags ?? []) as string[],
      summary: String(data.summary ?? ""),
    };
  });

  // 日期倒序
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDir, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    meta: {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ""),
      tags: (data.tags ?? []) as string[],
      summary: String(data.summary ?? ""),
    } satisfies PostMeta,
    contentHtml,
  };
}

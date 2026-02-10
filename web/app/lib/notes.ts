export type Note = {
  slug: string;
  title: string;
  desc: string;
  category: "OS" | "Network" | "Hardware" | "Tools";
  tags: string[];
  updatedAt: string; // ISO
  content: string;   // 简单先用 markdown-like 文本
};

export const NOTES: Note[] = [
  {
    slug: "wsl-basic",
    title: "WSL 常用命令与踩坑",
    desc: "安装、路径、权限、端口映射与常见错误排查。",
    category: "Tools",
    tags: ["wsl", "windows", "terminal"],
    updatedAt: "2026-02-10T09:00:00.000Z",
    content: `
# WSL 常用命令与踩坑

- \`wsl --status\` 看当前状态
- 端口：Next.js 默认 3000
- 路径：\`/mnt/c\` 访问 C 盘

## 常见问题
- Wsl/Service/E_UNEXPECTED：重启服务或重装 WSL
`,
  },
  {
    slug: "next-api-route",
    title: "Next.js App Router：写 API 路由",
    desc: "route.ts 的 GET/POST 写法，部署到 Vercel 注意点。",
    category: "Tools",
    tags: ["nextjs", "api", "vercel"],
    updatedAt: "2026-02-10T10:00:00.000Z",
    content: `
# Next.js API 路由

在 App Router 里：\`app/api/**/route.ts\`

\`\`\`ts
export async function GET() {
  return Response.json({ ok: true });
}
\`\`\`
`,
  },
  {
    slug: "tcp-udp",
    title: "TCP vs UDP 一页速记",
    desc: "连接、可靠性、延迟、典型场景。",
    category: "Network",
    tags: ["tcp", "udp", "network"],
    updatedAt: "2026-02-09T20:00:00.000Z",
    content: `
# TCP vs UDP

- TCP：可靠、有序、面向连接
- UDP：快、无连接、可能丢包
`,
  },
];

export function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function getAllMeta() {
  const categories = uniq(NOTES.map((n) => n.category));
  const tags = uniq(NOTES.flatMap((n) => n.tags)).sort((a, b) => a.localeCompare(b));
  return { categories, tags };
}

export function searchNotes(q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return NOTES;
  return NOTES.filter((n) => {
    const hay = `${n.title} ${n.desc} ${n.tags.join(" ")}`.toLowerCase();
    return hay.includes(query);
  });
}

export function getNote(slug: string) {
  return NOTES.find((n) => n.slug === slug) ?? null;
}

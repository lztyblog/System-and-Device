// web/app/api/notes/route.ts
export const runtime = "nodejs";

type Note = {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  category: "Tools" | "Network" | "OS" | "Next.js";
  updatedAt: string;
};

const ITEMS: Note[] = [
  {
    id: "N-001",
    title: "WSL 常用命令与踩坑清单",
    desc: "安装、路径映射、权限、端口转发、常见错误排查。适合做成你自己的系统维护手册。",
    tags: ["wsl", "windows", "terminal"],
    category: "Tools",
    updatedAt: "2026-02-10",
  },
  {
    id: "N-002",
    title: "Next.js App Router：API Route 写法",
    desc: "route.ts 的 GET/POST，缓存策略（no-store / revalidate），部署到 Vercel 的注意点。",
    tags: ["nextjs", "api", "vercel"],
    category: "Next.js",
    updatedAt: "2026-02-10",
  },
  {
    id: "N-003",
    title: "TCP vs UDP：一页速记",
    desc: "可靠性、拥塞控制、延迟与吞吐的取舍；常见应用协议映射。",
    tags: ["tcp", "udp", "network"],
    category: "Network",
    updatedAt: "2026-02-09",
  },
  {
    id: "N-004",
    title: "端口占用排查（Linux）",
    desc: "lsof / ss / netstat 快速定位；如何优雅地停止服务；端口转发对调试的影响。",
    tags: ["linux", "port", "debug"],
    category: "OS",
    updatedAt: "2026-02-09",
  },
  {
    id: "N-005",
    title: "Vercel 部署：本地 http vs 线上 https",
    desc: "为什么本地用 https 会报 ERR_SSL_WRONG_VERSION_NUMBER，以及如何用 headers 自动判断协议。",
    tags: ["vercel", "https", "nextjs"],
    category: "Next.js",
    updatedAt: "2026-02-10",
  },
];

export async function GET() {
  // 模拟“实时更新”（不影响 SSR 稳定性：这里只在 API 返回里变化）
  const now = new Date().toISOString();

  return Response.json({
    meta: {
      count: ITEMS.length,
      generatedAt: now,
      hint: "Replace this mock with DB/file later.",
    },
    items: ITEMS,
  });
}

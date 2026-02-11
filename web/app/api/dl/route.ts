// web/app/api/dl/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const OWNER = "lztyblog";
const REPO = "System-and-Device";
const BRANCH = "main";

// 只允许下载这两个根目录下的内容（安全）
const ALLOW_PREFIX = ["web/content/download", "web/content/posts"];

function rawUrl(path: string) {
  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = (searchParams.get("path") ?? "").trim();

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }
  if (path.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  if (!ALLOW_PREFIX.some((p) => path === p || path.startsWith(p + "/"))) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const upstream = await fetch(rawUrl(path), { cache: "no-store" });
  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Upstream error ${upstream.status}` },
      { status: upstream.status }
    );
  }

  const filename = path.split("/").pop() || "download";
  const contentType =
    upstream.headers.get("content-type") ?? "application/octet-stream";

  const buf = Buffer.from(await upstream.arrayBuffer());

  return new NextResponse(buf, {
    headers: {
      "content-type": contentType,
      // ✅ 强制下载
      "content-disposition": `attachment; filename="${encodeURIComponent(
        filename
      )}"`,
      "cache-control": "no-store",
    },
  });
}

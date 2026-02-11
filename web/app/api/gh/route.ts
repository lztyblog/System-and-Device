import { NextResponse } from "next/server";

const OWNER = "lztyblog";
const REPO = "System-and-Device";
const BRANCH = "main";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = (searchParams.get("path") ?? "").replace(/^\/+/, "");

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
    },
    cache: "no-store", // 先用实时，保证你 push 文件刷新就看到
  });

  const text = await res.text();

  // GitHub 出错时也把错误 JSON/文本原样返回，方便排查
  if (!res.ok) {
    return NextResponse.json(
      { error: `GitHub API error ${res.status}`, detail: text },
      { status: res.status }
    );
  }

  // 正常情况：GitHub 返回 JSON
  return new NextResponse(text, {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

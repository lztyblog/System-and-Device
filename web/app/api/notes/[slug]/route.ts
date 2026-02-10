import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  return NextResponse.json({
    slug,
    title: `Note: ${slug}`,
    content: `This is the content for note "${slug}".`,
    time: new Date().toISOString(),
  });
}

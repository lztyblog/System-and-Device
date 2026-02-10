import { getNote } from "@/app/lib/notes";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const note = getNote(params.slug);
  if (!note) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(note);
}

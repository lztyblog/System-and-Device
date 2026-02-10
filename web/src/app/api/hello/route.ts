export async function GET() {
  return Response.json({
    message: "Hello! This is a dynamic API.",
    time: new Date().toISOString(),
  });
}

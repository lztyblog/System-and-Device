export async function GET() {
  return Response.json({
    message: "Hello! This API is working 🎉",
    time: new Date().toISOString(),
  });
}

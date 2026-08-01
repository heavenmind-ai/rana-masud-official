export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    {
      status: "ok",
      site: "ranamasudbd.com",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

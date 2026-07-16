import { NextRequest, NextResponse } from "next/server";
import { R2_PUBLIC_URL } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await props.params;

    if (!R2_PUBLIC_URL) {
      return new NextResponse("R2 storage public URL is not configured.", { status: 500 });
    }

    const cleanBaseUrl = R2_PUBLIC_URL.endsWith("/")
      ? R2_PUBLIC_URL
      : `${R2_PUBLIC_URL}/`;

    const redirectUrl = `${cleanBaseUrl}uploads/${filename}`;
    return NextResponse.redirect(redirectUrl, 307);
  } catch (error: any) {
    console.error("Serving uploaded file redirect error:", error);
    return new NextResponse("Error loading asset", { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getPageBySlug, savePageData } from "@/lib/content";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);
    const page = await getPageBySlug(slug);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    return NextResponse.json(page);
  } catch (error) {
    console.error(`Failed to read page data:`, error);
    return NextResponse.json({ error: "Failed to load page data" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const isAuthenticated = await verifySession(token);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);
    const body = await request.json();
    const { frontmatter, content } = body;

    if (!frontmatter || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid payload details" }, { status: 400 });
    }

    const success = await savePageData(slug, frontmatter, content);
    if (!success) {
      return NextResponse.json({ error: "Page save failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Page saved successfully!" });
  } catch (error) {
    console.error(`Failed to save page data:`, error);
    return NextResponse.json({ error: "Failed to save page data" }, { status: 500 });
  }
}

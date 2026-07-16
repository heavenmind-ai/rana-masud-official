import { NextRequest, NextResponse } from "next/server";
import { getPageBySlug, savePageData } from "@/lib/content";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);
    const page = getPageBySlug(slug);
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
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);
    const body = await request.json();
    const { frontmatter, content } = body;

    if (!frontmatter || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid payload details" }, { status: 400 });
    }

    const success = savePageData(slug, frontmatter, content);
    if (!success) {
      return NextResponse.json({ error: "Page not found in manifest" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Page saved successfully!" });
  } catch (error) {
    console.error(`Failed to save page data:`, error);
    return NextResponse.json({ error: "Failed to save page data" }, { status: 500 });
  }
}


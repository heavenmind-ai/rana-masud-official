import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Page } from "@/models/Page";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);
    const post = await Page.findOne({ slug, "frontmatter.isPost": true }).lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error("Failed to fetch blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);
    const body = await req.json();
    const { title, content, description, image, summary } = body;

    const post = await Page.findOne({ slug, "frontmatter.isPost": true });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updatedFrontmatter = {
      ...(post.frontmatter || {}),
      title,
      description: description || summary || "",
      image: image || post.frontmatter?.image || "",
      summary: summary || "",
    };

    post.title = title;
    post.description = description || summary || "";
    post.content = content || "";
    post.frontmatter = updatedFrontmatter;

    await post.save();
    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error("Failed to update blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);

    const result = await Page.findOneAndDelete({ slug, "frontmatter.isPost": true });
    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog post deleted successfully!" });
  } catch (error: any) {
    console.error("Failed to delete blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete post" },
      { status: 500 }
    );
  }
}

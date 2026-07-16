import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Page } from "@/models/Page";

export async function GET() {
  try {
    await connectToDatabase();
    const posts = await Page.find({ "frontmatter.isPost": true }).sort({ updatedAt: -1 }).lean();
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Failed to load blog posts:", error);
    return NextResponse.json({ error: error.message || "Failed to load posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { title, slug, content, description, image, summary } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    // Ensure slug doesn't collide
    const existing = await Page.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "A page or post with this slug already exists" }, { status: 400 });
    }

    const frontmatter = {
      title,
      description: description || summary || "",
      isPost: true,
      image: image || "",
      summary: summary || "",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    };

    const newPost = new Page({
      slug,
      title,
      description: description || summary || "",
      content: content || "",
      frontmatter,
    });

    await newPost.save();
    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    console.error("Failed to create blog post:", error);
    return NextResponse.json({ error: error.message || "Failed to create post" }, { status: 500 });
  }
}

import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { Page } from "@/models/Page";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ranamasud.com";

  // Base static pages
  const staticRoutes = [
    "",
    "about",
    "biography",
    "filmography",
    "awards",
    "festivals",
    "gallery",
    "press",
    "tv-shows",
    "contact",
    "blog",
  ].map((route) => ({
    url: `${baseUrl}${route ? "/" + route : ""}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    await connectToDatabase();
    
    // Fetch dynamic blog posts from the database
    const posts = await Page.find({ "frontmatter.isPost": true }, "slug updatedAt").lean() as any[];
    
    const dynamicRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap, fallback to static:", error);
    return staticRoutes;
  }
}

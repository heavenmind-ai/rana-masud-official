export const revalidate = 86400;

import React from "react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Page } from "@/models/Page";
import { getPageBySlug, generatePageMetadata } from "@/lib/content";
import { Calendar, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "blog",
    "Blog & Articles | Rana Masud",
    "Read the latest articles, writeups, and press statements published by director Rana Masud."
  );
}

export default async function BlogFeedPage() {
  let posts: any[] = [];
  let pageData: any = null;

  try {
    await connectToDatabase();
    
    // Fetch blog page metadata for headers
    pageData = await Page.findOne({ slug: "blog" }).lean();

    // Fetch actual blog post entries
    posts = await Page.find({ "frontmatter.isPost": true })
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    console.error("Failed to load blog posts in public feed page:", error);
  }

  const badgeText = pageData?.frontmatter?.blogBadgeText || "Articles";
  const titleText = pageData?.frontmatter?.blogTitle || "Director's Blog";
  const descriptionText =
    pageData?.frontmatter?.headerText ||
    "Read articles, writeups, and press statements published regarding Rana Masud's film awards, festival participations, and creative direction journeys.";

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">{badgeText}</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">{titleText}</h1>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        <p className="text-white/60 mt-6 leading-relaxed">{descriptionText}</p>
      </section>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-white/40 text-sm">No blog posts found.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const decodedSlug = encodeURIComponent(post.slug);
            const imageSrc = post.frontmatter?.image || "/content/home/assets/Director-Rana-Masud.jpg";
            const dateStr = post.frontmatter?.date || "Published Post";
            const summaryStr = post.frontmatter?.summary || post.description || "";

            return (
              <div key={post.slug} className="glass-card overflow-hidden flex flex-col group border border-white/5">
                <Link href={`/blog/${decodedSlug}`} className="relative aspect-video w-full bg-zinc-950 overflow-hidden block group/img cursor-pointer">
                  <img
                    src={imageSrc}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors duration-300" />
                </Link>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4 text-left">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                      <Calendar className="h-3.5 w-3.5 text-gold-accent" />
                      <span>{dateStr}</span>
                    </div>
                    <Link href={`/blog/${decodedSlug}`} className="group/title cursor-pointer">
                      <h3 className="text-lg font-bold text-white leading-snug group-hover/title:text-gold-accent transition-colors mt-1">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-white/60 text-xs mt-1 leading-relaxed line-clamp-3">
                      {summaryStr}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${decodedSlug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-accent hover:text-white transition-colors mt-auto w-fit cursor-pointer"
                  >
                    পড়ুন / Read Full Article
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

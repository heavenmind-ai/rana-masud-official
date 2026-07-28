export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { getPageBySlug, generatePageMetadata } from "@/lib/content";
import ReactMarkdown from "react-markdown";
import { Calendar, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  const post = await getPageBySlug(slug);
  const defaultTitle = post?.title || "Blog Post | Rana Masud";
  const defaultDesc = post?.frontmatter?.summary || "Read this article published by director Rana Masud.";
  return generatePageMetadata(slug, defaultTitle, defaultDesc);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Decode the slug to map the manifest entry
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  const post = await getPageBySlug(slug);


  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Post Not Found</h1>
        <p className="text-white/60 mt-2">The requested blog post could not be resolved.</p>
        <Link href="/blog" className="inline-flex items-center gap-2 mt-6 text-gold-accent hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog Feed
        </Link>
      </div>
    );
  }

  const coverImage = post.frontmatter?.image;
  const dateStr = post.frontmatter?.date;

  return (
    <article className="container mx-auto px-4 py-16 flex flex-col gap-8 items-center text-left">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-accent hover:text-white transition-colors cursor-pointer w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog Feed
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-3">
          {dateStr && (
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Calendar className="h-4 w-4 text-gold-accent" />
              <span>{dateStr}</span>
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            {post.title}
          </h1>
        </div>

        {/* Full Height Blog Cover Image */}
        {coverImage && (
          <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950 my-2">
            <img
              src={coverImage}
              alt={post.title}
              className="w-full h-auto max-h-none object-contain rounded-2xl"
            />
          </div>
        )}

        {/* Horizontal separator */}
        <div className="h-px w-full bg-white/10 my-2" />

        {/* Content Body */}
        <div className="prose prose-invert max-w-none text-white/80 leading-relaxed text-base md:text-lg flex flex-col gap-6">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-6 mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-6 mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-bold text-white mt-4 mb-2">{children}</h3>,
              p: ({ children }) => <p className="mb-4 text-white/80 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-4 flex flex-col gap-1.5">{children}</ul>,
              li: ({ children }) => <li className="text-white/80">{children}</li>,
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-gold-accent hover:underline">
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <div className="relative my-6 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-zinc-950">
                  <img src={src} alt={alt || "Post Media"} className="w-full h-auto max-h-none object-cover" />
                </div>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}

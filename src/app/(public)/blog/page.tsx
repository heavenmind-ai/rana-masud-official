import React from "react";
import Link from "next/link";
import { getPageBySlug } from "@/lib/content";
import { Calendar, ArrowRight } from "lucide-react";

export default async function BlogFeedPage() {
  // Identify the blog post pages from the manifest.
  // The blog posts have percent encoded bengali slugs.
  const blogPostSlugs = [
    "%e0%a6%ae%e0%a6%b0%e0%a6%95%e0%a7%8d%e0%a6%95%e0%a7%8b-%e0%a6%89%e0%a7%8e%e0%a6%b8%e0%a6%ac%e0%a7%87-%e0%a6%b8%e0%a7%87%e0%a6%b0%e0%a6%be-%e0%a6%b0%e0%a6%be%e0%a6%a8%e0%a6%be-%e0%a6%ae%e0%a6%be",
    "%e0%a6%9a%e0%a6%b2%e0%a6%9a%e0%a6%9a%e0%a6%a4%e0%a6%b0-%e0%a6%aa%e0%a6%b0%e0%a6%9a%e0%a6%b2%e0%a6%95-%e0%a6%93-%e0%a6%ac%e0%a6%9c%e0%a6%9e%e0%a6%aa%e0%a6%a8-%e0%a6%a8%e0%a6%b0%e0%a6%ae%e0%a6%a4",
    "%e0%a6%85%e0%a6%b8%e0%a6%b9%e0%a6%af-%e0%a6%ae%e0%a6%a8%e0%a6%b7%e0%a6%b0-%e0%a6%9c%e0%a6%a8%e0%a6%af-%e0%a6%85%e0%a6%a8%e0%a6%b2-rana-masud-film-director"
  ];

  const posts = (await Promise.all(
    blogPostSlugs.map((slug) => getPageBySlug(slug))
  )).filter((post) => post !== null);

  // Fallback metadata for displays
  const fallbackImages: Record<string, string> = {
    "%e0%a6%ae%e0%a6%b0%e0%a6%95%e0%a7%8d%e0%a6%95%e0%a7%8b-%e0%a6%89%e0%a7%8e%e0%a6%b8%e0%a6%ac%e0%a7%87-%e0%a6%b8%e0%a7%87%e0%a6%b0%e0%a6%be-%e0%a6%b0%e0%a6%be%e0%a6%a8%e0%a6%be-%e0%a6%ae%e0%a6%be": "/content/%e0%a6%ae%e0%a6%b0%e0%a6%95%e0%a7%8d%e0%a6%95%e0%a7%8b-%e0%a6%89%e0%a7%8e%e0%a6%b8%e0%a6%ac%e0%a7%87-%e0%a6%b8%e0%a7%87%e0%a6%b0%e0%a6%be-%e0%a6%b0%e0%a6%be%e0%a6%a8%e0%a6%be-%e0%a6%ae%e0%a6%be/assets/rana-masud-awards-profile-1024x538.png",
    "%e0%a6%9a%e0%a6%b2%e0%a6%9a%e0%a6%9a%e0%a6%a4%e0%a6%b0-%e0%a6%aa%e0%a6%b0%e0%a6%9a%e0%a6%b2%e0%a6%95-%e0%a6%93-%e0%a6%ac%e0%a6%9c%e0%a6%9e%e0%a6%aa%e0%a6%a8-%e0%a6%a8%e0%a6%b0%e0%a6%ae%e0%a6%a4": "/content/media-press/assets/Press-12-Rana-Masud.png",
    "%e0%a6%85%e0%a6%b8%e0%a6%b9%e0%a6%af-%e0%a6%ae%e0%a6%a8%e0%a6%b7%e0%a6%b0-%e0%a6%9c%e0%a6%a8%e0%a6%af-%e0%a6%85%e0%a6%a8%e0%a6%b2-rana-masud-film-director": "/content/media-press/assets/Press-11-Rana-Masud.jpg"
  };

  const summaries: Record<string, string> = {
    "%e0%a6%ae%e0%a6%b0%e0%a6%95%e0%a7%8d%e0%a6%95%e0%a7%8b-%e0%a6%89%e0%a7%8e%e0%a6%b8%e0%a6%ac%e0%a7%87-%e0%a6%b8%e0%a7%87%e0%a6%b0%e0%a6%be-%e0%a6%b0%e0%a6%be%e0%a6%a8%e0%a6%be-%e0%a6%ae%e0%a6%be": "এবার ‘আতর’ সিনেমার জন্য মরক্কো ওয়ালিদ তাইমা আন্তর্জাতিক চলচ্চিত্র উৎসব থেকে সেরা চিত্রনাট্যকার হিসেবে পুরস্কার জিতলেন রানা মাসুদ।...",
    "%e0%a6%9a%e0%a6%b2%e0%a6%9a%e0%a6%9a%e0%a6%a4%e0%a6%b0-%e0%a6%aa%e0%a6%b0%e0%a6%9a%e0%a6%b2%e0%a6%95-%e0%a6%93-%e0%a6%ac%e0%a6%9c%e0%a6%9e%e0%a6%aa%e0%a6%a8-%e0%a6%a8%e0%a6%b0%e0%a6%ae%e0%a6%a4": "বাংলাদেশ থেকে আগত জনপ্রিয় চলচ্চিত্র পরিচালক ও বিজ্ঞাপন নির্মাতা রানা মাসুদ এখন নিউইয়র্কে।...",
    "%e0%a6%85%e0%a6%b8%e0%a6%b9%e0%a6%af-%e0%a6%ae%e0%a6%a8%e0%a6%b7%e0%a6%b0-%e0%a6%9c%e0%a6%a8%e0%a6%af-%e0%a6%85%e0%a6%a8%e0%a6%b2-rana-masud-film-director": "মানুষের জন্য অনলাইন চলচ্চিত্র প্রদর্শনী শুরু হলো। স্বল্পদৈর্ঘ্য চলচ্চিত্র নিয়ে আয়োজিত প্রদর্শনীতে..."
  };

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">Articles</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">Director&apos;s Blog</h1>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        <p className="text-white/60 mt-6 leading-relaxed">
          Read articles, writeups, and press statements published regarding Rana Masud&apos;s film awards, festival participations, and creative direction journeys.
        </p>
      </section>

      {/* Posts List */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          if (!post) return null;
          const decodedSlug = encodeURIComponent(post.slug);
          return (
            <div key={post.slug} className="glass-card overflow-hidden flex flex-col group border border-white/5">
              <div className="relative aspect-video w-full bg-zinc-950">
                <img
                  src={fallbackImages[post.slug] || "/content/home/assets/Director-Rana-Masud.jpg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between gap-4 text-left">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Calendar className="h-3.5 w-3.5 text-gold-accent" />
                    <span>Published Post</span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-gold-accent transition-colors mt-1">
                    {post.title}
                  </h3>
                  <p className="text-white/60 text-xs mt-1 leading-relaxed">
                    {summaries[post.slug]}
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
    </div>
  );
}

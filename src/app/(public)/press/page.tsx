export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { getPageBySlug, generatePageMetadata } from "@/lib/content";
import { Newspaper, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "press",
    "Press & Media | Rana Masud",
    "Read coverage, newspaper articles, interviews, and media reports featuring director Rana Masud."
  );
}

export default async function PressPage() {
  const pageData = await getPageBySlug("press");

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error loading press page.</h1>
      </div>
    );
  }

  const pressItems = pageData.frontmatter.pressItems || [];
  const headerText =
    pageData.frontmatter.headerText ||
    "Read coverage and reviews of Rana Masud's film creations, TVCs, and academic contributions from leading national and international publications.";

  const badgeText = pageData.frontmatter.pressBadgeText || "Media Presence";
  const titleText = pageData.frontmatter.pressTitle || "Press & Media";
  const pressQuote = pageData.frontmatter.pressQuote || "Cinema is a mirror that can focus or distort, but in the hands of a storyteller, it must always speak truth.";
  const pressHeaderImage = pageData.frontmatter.pressHeaderImage || "/content/home/assets/Director-Rana-Masud.jpg";
  const pressButtonText = pageData.frontmatter.pressButtonText || "Let's Talk";

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Page Header */}
      <section className="glass-card p-8 md:p-12 border border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">{badgeText}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">{titleText}</h1>
          
          <blockquote className="border-l-2 border-gold-accent pl-4 italic text-white/85 text-lg font-serif">
            "{pressQuote}"
          </blockquote>
          
          <p className="text-white/60 text-sm leading-relaxed">{headerText}</p>
          
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-gold-accent hover:bg-gold-hover text-black font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-lg w-fit transition-colors cursor-pointer"
          >
            {pressButtonText}
          </Link>
        </div>
        
        <div className="lg:col-span-5 relative aspect-[4/3] md:aspect-[3/2] lg:aspect-square w-full rounded-lg overflow-hidden border border-white/10 shadow-2xl bg-zinc-950/40">
          <img
            src={pressHeaderImage}
            alt="Press Header Cover"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Press Grid */}
      {pressItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-white/40 text-sm">No press coverage items found.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pressItems.map((item: any, idx: number) => (
            <div key={idx} className="glass-card overflow-hidden flex flex-col group border border-white/5">
              {/* Clipping Image */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-zinc-900 border-b border-white/5">
                <img
                  src={item.image || "/content/media-press/assets/rana-masud-awards-profile.png"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/60 to-transparent" />
              </div>

              {/* Clipping Content */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-4 text-left">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span className="font-semibold text-gold-accent flex items-center gap-1">
                      <Newspaper className="h-3 w-3" />
                      {item.outlet}
                    </span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-gold-accent transition-colors mt-1">
                    {item.title}
                  </h3>
                </div>

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold-accent hover:bg-gold-hover text-black text-[10px] font-bold uppercase tracking-wider rounded transition-colors mt-auto w-fit cursor-pointer"
                  >
                    Read Full Article
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

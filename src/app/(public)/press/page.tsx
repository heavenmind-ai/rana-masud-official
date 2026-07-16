export const dynamic = "force-dynamic";

import React from "react";
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

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">{badgeText}</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">{titleText}</h1>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        <p className="text-white/60 mt-6 leading-relaxed">{headerText}</p>
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-accent hover:text-white transition-colors mt-auto w-fit cursor-pointer"
                  >
                    Read Full Article
                    <ExternalLink className="h-3.5 w-3.5" />
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

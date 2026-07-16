import React from "react";
import { getPageBySlug } from "@/lib/content";
import { Tv } from "lucide-react";

export default async function TvShowsPage() {
  const pageData = await getPageBySlug("tv-shows");

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error loading tv shows page.</h1>
      </div>
    );
  }

  const shows = pageData.frontmatter.shows || [];
  const headerText =
    pageData.frontmatter.headerText ||
    "Watch talk shows, Public Service Announcements (PSAs), and television broadcasts directed and produced by Rana Masud.";

  const badgeText = pageData.frontmatter.showsBadgeText || "Broadcasts";
  const titleText = pageData.frontmatter.showsTitle || "TV Shows & Directing";

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">{badgeText}</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">{titleText}</h1>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        <p className="text-white/60 mt-6 leading-relaxed">{headerText}</p>
      </section>

      {/* Videos Layout */}
      {shows.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-white/40 text-sm">No TV broadcast shows found.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {shows.map((show: any, idx: number) => (
            <div key={idx} className="glass-card overflow-hidden flex flex-col group border border-white/5">
              {/* Embedded Iframe */}
              <div className="relative aspect-video w-full bg-zinc-950">
                {show.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${show.youtubeId}`}
                    title={show.title}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-white/30">
                    No video link configured
                  </div>
                )}
              </div>
              {/* Metadata */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-4 text-left">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-gold-accent transition-colors flex items-start gap-2 leading-snug">
                    <Tv className="h-5 w-5 text-gold-accent shrink-0 mt-0.5" />
                    {show.title}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed mt-1">{show.description}</p>
                </div>
                <div className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mt-2 border-t border-white/5 pt-3">
                  Broadcasting Director: Rana Masud
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

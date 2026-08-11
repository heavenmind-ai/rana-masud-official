export const revalidate = 0;

import React from "react";
import { getPageBySlug, generatePageMetadata } from "@/lib/content";
import { Clapperboard } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "ad-film",
    "AD Films | Rana Masud",
    "Watch advertisement films directed and produced by Rana Masud."
  );
}

export default async function AdFilmPage() {
  const pageData = await getPageBySlug("ad-film");

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error loading AD Film page.</h1>
      </div>
    );
  }

  const films = pageData.frontmatter.films || [];
  const headerText =
    pageData.frontmatter.headerText ||
    "Watch advertisement films directed and produced by Rana Masud.";

  const badgeText = pageData.frontmatter.filmsBadgeText || "AD Films";
  const titleText = pageData.frontmatter.filmsTitle || "AD Films & Productions";

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
      {films.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-white/40 text-sm">No AD films found.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {films.map((film: any, idx: number) => (
            <div key={idx} className="glass-card overflow-hidden flex flex-col group border border-white/5">
              {/* Embedded Iframe */}
              <div className="relative aspect-video w-full bg-zinc-950">
                {film.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${film.youtubeId}`}
                    title={film.title}
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
                    <Clapperboard className="h-5 w-5 text-gold-accent shrink-0 mt-0.5" />
                    {film.title}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed mt-1">{film.description}</p>
                </div>
                <div className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mt-2 border-t border-white/5 pt-3">
                  Director: Rana Masud
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* JSON-LD VideoObject Structured Data for Google Video Indexing */}
      {films.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              films
                .filter((film: any) => film.youtubeId)
                .map((film: any) => ({
                  "@context": "https://schema.org",
                  "@type": "VideoObject",
                  "name": film.title || "AD Film directed by Rana Masud",
                  "description":
                    film.description ||
                    "Watch advertisement film directed and produced by Rana Masud.",
                  "thumbnailUrl": [
                    `https://img.youtube.com/vi/${film.youtubeId}/maxresdefault.jpg`,
                    `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg`
                  ],
                  "uploadDate": film.date
                    ? new Date(film.date).toISOString()
                    : "2023-01-01T00:00:00Z",
                  "embedUrl": `https://www.youtube.com/embed/${film.youtubeId}`
                }))
            )
          }}
        />
      )}
    </div>
  );
}

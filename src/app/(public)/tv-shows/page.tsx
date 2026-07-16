import React from "react";
import { Tv } from "lucide-react";

export default function TvShowsPage() {
  const shows = [
    {
      title: "Joyeetar Joy Jaatra (জয়ীতার জয় যাত্রা) - Part 1",
      description: "A 26-episode talk show directing series highlighting professional women, their struggles, achievements, and impact on society in Bangladesh. Directed by Rana Masud.",
      youtubeId: "BAZk8gtrEcw",
    },
    {
      title: "Talk Show Direction - Part 2",
      description: "In-depth studio discussions with industry leaders and creative professionals regarding brand communication, advertising ethics, and development campaigns.",
      youtubeId: "6da92ZJBbdg",
    },
    {
      title: "Talk Show Direction - Part 3",
      description: "Exploring social transformation, behavior changes campaign, and documentary storytelling techniques with veteran media figures.",
      youtubeId: "dRO7oCsh-V4",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">Broadcasts</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">TV Shows & Directing</h1>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        <p className="text-white/60 mt-6 leading-relaxed">
          Watch talk shows, Public Service Announcements (PSAs), and television broadcasts directed and produced by Rana Masud.
        </p>
      </section>

      {/* Videos Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {shows.map((show, idx) => (
          <div key={idx} className="glass-card overflow-hidden flex flex-col group border border-white/5">
            {/* Embedded Iframe */}
            <div className="relative aspect-video w-full bg-zinc-950">
              <iframe
                src={`https://www.youtube.com/embed/${show.youtubeId}`}
                title={show.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
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
    </div>
  );
}

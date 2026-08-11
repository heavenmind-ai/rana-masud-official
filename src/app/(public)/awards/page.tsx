export const revalidate = 0;

import React from "react";
import { getPageBySlug, generatePageMetadata } from "@/lib/content";
import { Award } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "film-awards",
    "Awards & Recognitions | Rana Masud",
    "Discover the film awards, recognitions, and international laurels received by director Rana Masud."
  );
}

export default async function AwardsPage() {
  const pageData = await getPageBySlug("film-awards");

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error loading awards.</h1>
      </div>
    );
  }

  const awards = pageData.frontmatter.awards || [
    {
      title: "Best Director & Screenplay Award",
      film: "The Fragrance (আতর)",
      event: "Festival Ouled Teima du Film International",
      location: "Morocco",
      year: "2022",
      description: "Recognized for outstanding visual screenwriting and narrative control in representing high-impact social matters.",
    },
    {
      title: "Best Director Peace Film Award",
      film: "The Fragrance (আতর)",
      event: "Peace Film Award 2023 (Film 4 Peace Foundation)",
      location: "Dhaka, Bangladesh",
      year: "2023",
      description: "Awarded for highlighting human rights, community tolerance, and peaceful conflict resolution.",
    },
    {
      title: "Grand Prize Award",
      film: "The Residence (নিবাস)",
      event: "Festival Ouled Teima du Film International",
      location: "Morocco",
      year: "2019",
      description: "Highest festival award for direct storytelling and cinematic direction of domestic relationship narratives.",
    },
    {
      title: "Best Director Award",
      film: "The Residence (নিবাস)",
      event: "Sat Rong Short Film Festival",
      location: "Nilphamari, Bangladesh",
      year: "2021",
      description: "Awarded for exceptional directing, scene composition, and emotional resonance in independent filmmaking.",
    },
    {
      title: "Best Short Film Award",
      film: "The Residence (নিবাস)",
      event: "Sylhet Agricultural University Film Society",
      location: "Sylhet, Bangladesh",
      year: "2018",
      description: "Awarded best short fiction film for creativity, theme execution, and cinematography.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">
          {pageData.frontmatter.awardsBadgeText || "Recognition"}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">
          {pageData.frontmatter.awardsTitle || "Film Awards"}
        </h1>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        <p className="text-white/60 mt-6 leading-relaxed">
          {pageData.frontmatter.headerText ||
            "Celebrating cinematic accomplishments on both the national and international film festival stages, honoring storytelling and directing excellence."}
        </p>
      </section>

      {/* Trophies Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {awards.map((award: any, idx: number) => (
          <div
            key={idx}
            className="glass-card p-8 flex flex-col gap-6 justify-between text-left relative overflow-hidden group border border-white/5"
          >
            {/* Wreath Watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-5 text-gold-accent group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <Award className="w-36 h-36" />
            </div>

            {award.image ? (
              <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-white/5 bg-zinc-950/40 shrink-0">
                <img
                  src={award.image}
                  alt={award.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent shrink-0">
                <Award className="h-6 w-6" />
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gold-accent tracking-wider">{award.event}</span>
                <span className="text-xs text-white/40">
                  {award.location} ({award.year})
                </span>
                <h3 className="text-xl font-bold text-white mt-2 leading-snug">{award.title}</h3>
                <p className="text-xs text-gold-accent mt-0.5 italic font-medium">Film: {award.film}</p>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mt-2">{award.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

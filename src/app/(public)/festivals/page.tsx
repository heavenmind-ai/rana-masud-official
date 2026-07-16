export const dynamic = "force-dynamic";

import React from "react";
import { getPageBySlug, generatePageMetadata } from "@/lib/content";
import { Compass, Globe, MapPin } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "film-festivals",
    "Screenings & Festivals | Rana Masud",
    "List of national and international film festivals and screenings of Rana Masud's films globally."
  );
}

export default async function FestivalsPage() {
  const pageData = await getPageBySlug("film-festivals");

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error loading festivals.</h1>
      </div>
    );
  }

  const internationalFestivals = pageData.frontmatter.internationalFestivals || [
    { name: "Ouled Teima International Film Festival", country: "Morocco" },
    { name: "International Film Festival of South Asia (IFFSA)", country: "Toronto, Canada" },
    { name: "Al-Nahj International Film Festival", country: "Karbala, Iraq" },
    { name: "Lift-Off Global Network Sessions", country: "United Kingdom" },
  ];

  const nationalFestivals = pageData.frontmatter.nationalFestivals || [
    { name: "Sylhet International Film Festival", city: "Sylhet" },
    { name: "Chittagong Short Film Festival", city: "Chittagong" },
    { name: "Dheki International Motion Picture Festival", city: "Dhaka" },
    { name: "Cefal Film Festival Screening", city: "Dhaka" },
  ];

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">
          {pageData.frontmatter.festivalsBadgeText || "Screenings"}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">
          {pageData.frontmatter.festivalsTitle || "Film Festivals"}
        </h1>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        <p className="text-white/60 mt-6 leading-relaxed">
          {pageData.frontmatter.headerText ||
            "Screening selections representing dynamic cinematic works to international forums and regional audiences across Bangladesh."}
        </p>
      </section>

      {/* Screenings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* International */}
        <section className="glass-card p-8 flex flex-col gap-6 text-left border border-white/5 relative overflow-hidden">
          <div className="absolute top-6 right-6 opacity-10 text-gold-accent">
            <Globe className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-white border-b border-white/5 pb-4">
            {pageData.frontmatter.intlSectionTitle || "International Festivals"}
          </h2>
          <div className="flex flex-col gap-4">
            {internationalFestivals.map((fest: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center bg-white/5 px-4 py-3.5 rounded-lg border border-white/5 hover:border-gold-accent/20 transition-all">
                <span className="font-bold text-white text-sm">{fest.name}</span>
                <span className="text-xs font-semibold text-gold-accent flex items-center gap-1.5 shrink-0 bg-gold-accent/5 border border-gold-accent/20 px-2 py-0.5 rounded">
                  <Compass className="w-3.5 h-3.5" />
                  {fest.country}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* National */}
        <section className="glass-card p-8 flex flex-col gap-6 text-left border border-white/5 relative overflow-hidden">
          <div className="absolute top-6 right-6 opacity-10 text-gold-accent">
            <MapPin className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-white border-b border-white/5 pb-4">
            {pageData.frontmatter.natSectionTitle || "National Festivals"}
          </h2>
          <div className="flex flex-col gap-4">
            {nationalFestivals.map((fest: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center bg-white/5 px-4 py-3.5 rounded-lg border border-white/5 hover:border-gold-accent/20 transition-all">
                <span className="font-bold text-white text-sm">{fest.name}</span>
                <span className="text-xs font-semibold text-gold-accent flex items-center gap-1.5 shrink-0 bg-gold-accent/5 border border-gold-accent/20 px-2 py-0.5 rounded">
                  <MapPin className="w-3.5 h-3.5" />
                  {fest.city}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

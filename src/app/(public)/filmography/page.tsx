export const dynamic = "force-dynamic";

import React from "react";
import { getPageBySlug, generatePageMetadata } from "@/lib/content";
import { Film, Award, Link as LinkIcon, Star, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "rana_masud_filmography",
    "Filmography & Works | Rana Masud",
    "Explore the cinematic works, feature films, short films, and documentaries directed by Rana Masud."
  );
}

export default async function FilmographyPage() {
  const pageData = await getPageBySlug("rana_masud_filmography");

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error loading filmography.</h1>
      </div>
    );
  }

  const films = pageData.frontmatter.films || [
    {
      title: "The Fragrance (আতর)",
      type: "Short Film (Fiction)",
      role: "Director & Screenplay Writer",
      description:
        "A gripping drama addressing the tragic incident of Nusrath Jahan Rafi, highlighting social issues, injustice, and human rights. Starred veteran actor Shahiduzzaman Selim and actor Roopkotha.",
      image: "/content/rana_masud_filmography/assets/the-fragrance-rana-masud-2.jpeg",
      selections: ["Morocco Film Festival 2022 (Best Director)", "Peace Film Award 2023"],
    },
    {
      title: "The Residence (নিবাস)",
      type: "Short Film (Fiction)",
      role: "Director & Screenplay Writer",
      description:
        "An emotionally resonant film examining human relationships, vulnerability, and domestic space. Celebrated in multiple national and international showcases.",
      image: "/content/rana_masud_filmography/assets/the-residence-rana-masud-1.jpg",
      selections: ["Grand Prize (Morocco 2019)", "Best Director (Sat Rong 2021)", "Best Short Film (Sylhet 2018)"],
    },
    {
      title: "The Battles of Belonia",
      type: "Documentary",
      role: "Director & Producer",
      description:
        "A detailed war documentary focusing on the strategic and intense battles fought at the Belonia front during the 1971 Liberation War of Bangladesh.",
      image: "/content/rana_masud_filmography/assets/the-battles-of-belonia-rana-masud.jpg",
      selections: ["Special Screenings in USA", "Sylhet Film Festival Showcase"],
    },
  ];

  const assistantRoles = pageData.frontmatter.assistantRoles || [
    { film: "Lal Shalu (Lalsalu)", director: "Tanvir Mokammel", year: "2001" },
    { film: "Lalon", director: "Tanvir Mokammel", year: "2004" },
    { film: "Rabeya", director: "Tanvir Mokammel", year: "2008" },
    { film: "Jibondhuli", director: "Tanvir Mokammel", year: "2014" },
    { film: "Rupsa Nodir Bake", director: "Tanvir Mokammel", year: "2020" },
  ];

  const imdbUrl = pageData.frontmatter.imdbUrl || "https://www.imdb.com/name/nm7851085/";

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">
          {pageData.frontmatter.worksBadgeText || "Works"}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">
          {pageData.frontmatter.worksTitle || "Filmography"}
        </h1>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        <p className="text-white/60 mt-6 leading-relaxed">
          {pageData.frontmatter.headerText ||
            "Rana Masud's career is marked by a transition from high-level advertising conceptualization to deep narrative filmmaking."}
        </p>
      </section>

      {/* Main Showcase */}
      <section className="flex flex-col gap-12">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Film className="h-6 w-6 text-gold-accent" />
          {pageData.frontmatter.showcaseSectionTitle || "Primary Showcase"}
        </h2>
        <div className="flex flex-col gap-8">
          {films.map((film: any, index: number) => (
            <div key={index} className="glass-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-white/5">
              {/* Poster Cover */}
              <div className="lg:col-span-4 relative aspect-[4/3] lg:aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden border-r border-white/5">
                {film.link ? (
                  <a href={film.link} target="_blank" rel="noopener noreferrer" className="w-full h-full block group/poster">
                    <img 
                      src={film.image} 
                      alt={film.title} 
                      className="w-full h-full object-contain transition-transform duration-500 group-hover/poster:scale-105" 
                    />
                  </a>
                ) : (
                  <img 
                    src={film.image} 
                    alt={film.title} 
                    className="w-full h-full object-contain" 
                  />
                )}
              </div>
              {/* Content Panel */}
              <div className="lg:col-span-8 p-8 flex flex-col justify-between gap-6 text-left">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-gold-accent/10 border border-gold-accent/20 text-gold-accent text-xs font-semibold uppercase">
                      {film.type}
                    </span>
                    <span className="text-xs text-white/40">{film.role}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{film.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{film.description}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-gold-accent" />
                    Festival Honors
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {film.selections?.map((award: string, aIdx: number) => (
                      <span
                        key={aIdx}
                        className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/80 text-xs font-medium"
                      >
                        {award}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Assistant Director Roles */}
      <section className="glass-card p-8 flex flex-col gap-6 text-left">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <Star className="h-5 w-5 text-gold-accent" />
          {pageData.frontmatter.assistantSectionTitle || "Assistant Director Credits"}
        </h2>
        <p className="text-sm text-white/60 leading-relaxed">
          {pageData.frontmatter.assistantSectionDescription ||
            "Rana Masud honed his practical directing capabilities and shot composition skills under the direct mentorship of internationally acclaimed, legendary filmmaker Tanvir Mokammel:"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {assistantRoles.map((role: any, idx: number) => (
            <div
              key={idx}
              className="p-5 rounded-lg border border-white/5 bg-white/5 flex items-center gap-4 hover:border-gold-accent/20 transition-all"
            >
              <CheckCircle className="h-5 w-5 text-gold-accent shrink-0" />
              <div>
                <h4 className="font-bold text-white text-base leading-snug">{role.film}</h4>
                <p className="text-xs text-white/40 mt-1">
                  Dir: {role.director} ({role.year})
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* External profiles */}
      <section className="text-center">
        <div className="inline-flex gap-6">
          <a
            href={imdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gold-accent/20 bg-gold-accent/5 hover:bg-gold-accent/15 text-gold-accent font-semibold text-sm transition-all"
          >
            <LinkIcon className="h-4 w-4" />
            {pageData.frontmatter.imdbButtonText || "IMDb Profile"}
          </a>
        </div>
      </section>
    </div>
  );
}

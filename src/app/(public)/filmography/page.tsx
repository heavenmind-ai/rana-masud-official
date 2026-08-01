export const revalidate = 3600; // ISR: revalidate every 1 hour

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
        <div className="flex flex-col gap-12">
          {films.map((film: any, index: number) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl transition-all duration-500 hover:border-gold-accent/40"
            >
              {/* Card Ambient Background Glow */}
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <img
                  src={film.image}
                  alt=""
                  className="w-full h-full object-contain object-center opacity-15 filter blur-xl scale-110 pointer-events-none"
                />
                <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" />
              </div>

              {/* Main Grid Layout - 5 Cols Large Image / 7 Cols Content */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
                {/* Large Edge-to-Edge Poster Image Column */}
                <div className="lg:col-span-5 relative w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 group/poster">
                  {film.link ? (
                    <a
                      href={film.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-full block relative"
                    >
                      <img
                        src={film.image}
                        alt={film.title}
                        className="w-full h-full object-cover object-top lg:object-center transition-transform duration-700 group-hover/poster:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                    </a>
                  ) : (
                    <div className="w-full h-full relative">
                      <img
                        src={film.image}
                        alt={film.title}
                        className="w-full h-full object-cover object-top lg:object-center transition-transform duration-700 group-hover/poster:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                    </div>
                  )}

                  {/* Gradient Overlay for smooth edge transition into content panel */}
                  <div className="hidden lg:block absolute inset-y-0 right-0 w-20 bg-gradient-to-r from-transparent to-zinc-950/80 pointer-events-none" />
                </div>

                {/* Right Content Panel */}
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 text-left">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3.5 py-1 rounded-md bg-gold-accent/15 border border-gold-accent/30 text-gold-accent text-xs font-bold uppercase tracking-wider shadow-sm">
                        {film.type}
                      </span>
                      <span className="text-xs font-semibold text-white/50">{film.role}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight group-hover:text-gold-accent transition-colors leading-snug">
                      {film.title}
                    </h3>

                    <p className="text-white/80 text-sm sm:text-base leading-relaxed font-normal">
                      {film.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                    <h4 className="text-xs font-bold text-gold-accent uppercase tracking-widest flex items-center gap-2">
                      <Award className="h-4 w-4 text-gold-accent shrink-0" />
                      Festival Honors & Selections
                    </h4>
                    <div className="flex flex-wrap gap-2.5 mt-1">
                      {film.selections?.map((award: string, aIdx: number) => (
                        <span
                          key={aIdx}
                          className="px-3.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium shadow-sm hover:border-gold-accent/40 transition-colors"
                        >
                          {award}
                        </span>
                      ))}
                    </div>
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

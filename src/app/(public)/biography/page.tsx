import React from "react";
import { getPageBySlug } from "@/lib/content";
import { Briefcase, Award, GraduationCap, Users } from "lucide-react";

export default async function BiographyPage() {
  const pageData = getPageBySlug("biography-rana_masud_film_director");

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error loading biography.</h1>
      </div>
    );
  }

  // Parse sections manually or map them to visual layout blocks
  const professionalTimeline = [
    {
      role: "Creative Director",
      period: "2002 - 2009",
      company: "Madonna Advertising Ltd. & Dhanshiri Communication Ltd.",
      description: "Specialized in conceptualization, idea generation, and translation of brand messaging into creative campaign materials for major brand promotions and social causes.",
      icon: Briefcase,
    },
    {
      role: "Managing Director",
      period: "2006 - Present",
      company: "Ferywala Communications",
      description: "Founded and leads Ferywala Communications, a prominent film production company in Bangladesh, delivering narrative through compelling visual aesthetics and sophisticated cinematic language.",
      icon: Briefcase,
    },
    {
      role: "Film Director & Screenplay Writer",
      period: "2002 - Present",
      company: "Independent & Agency Production",
      description: "Directed almost 300 television commercials, documentaries, talk shows, and short films. Wrote multiple award-winning screens including 'The Residence (নিবাস)' and 'The Fragrance (আতর)'.",
      icon: Briefcase,
    },
    {
      role: "Academic Film Teacher",
      period: "2002 - Present",
      company: "Bangladesh Film Institute (BFI)",
      description: "Instructing student filmmakers in Film Production Design and Shot Division, providing foundational training to new generations of directors.",
      icon: GraduationCap,
    },
  ];

  const memberships = [
    "Honorable Member of Bangladesh Short Film Forum",
    "Honorable Member of Bangladesh Film Institute Alumni Association",
    "Honorable Member of Film 4 Peace Foundation",
    "Honorable Member of Theatre Artist Association of Dhaka (TAAD)",
    "Honorable Member of AD Club",
  ];

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Intro Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-4 flex justify-center">
          <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="/content/biography-rana_masud_film_director/assets/Rana-Masud-Profile-1.png"
              alt="Rana Masud Portrait"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div>
            <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">The Filmmaker</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">Rana Masud Biography</h1>
            <div className="h-0.5 w-16 bg-gold-accent mt-4" />
          </div>
          <p className="text-white/80 leading-relaxed text-base md:text-lg">
            Born on September 21, 1979, Rana Masud is a renowned Bangladeshi film director, producer, screenplay writer, and academic. Over his illustrious career spanning more than two decades, he has established himself as a prominent voice in both commercial advertising and independent short films. Through his production house, <strong>Ferywala Communications</strong>, he has directed nearly 300 TV commercials, documentaries, and narrative projects.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Briefcase className="text-gold-accent h-7 w-7" />
          Professional Career
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {professionalTimeline.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="glass-card p-8 flex gap-6 text-left items-start">
                <div className="w-12 h-12 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-gold-accent/80 tracking-wider">{item.period}</span>
                  <h3 className="text-xl font-bold text-white leading-snug">{item.role}</h3>
                  <p className="text-xs font-semibold text-white/50">{item.company}</p>
                  <p className="text-white/60 text-sm leading-relaxed mt-2">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Grid: Memberships & Jury Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Memberships */}
        <div className="glass-card p-8 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="text-gold-accent h-5 w-5" />
            Affiliations & Memberships
          </h2>
          <ul className="flex flex-col gap-3">
            {memberships.map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-accent shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Jury details */}
        <div className="glass-card p-8 flex flex-col gap-6 justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="text-gold-accent h-5 w-5" />
              Jury Service
            </h2>
            <div className="flex flex-col gap-2 text-left">
              <h4 className="font-bold text-white text-sm">Honorable Member of Jury Board - Peace Film Festival</h4>
              <p className="text-xs text-white/40">Dhaka, Bangladesh (October 2023)</p>
              <p className="text-sm text-white/70 mt-2">
                Served as an official jury member, selecting independent works that promote social harmony, conflict resolution, and global peace.
              </p>
            </div>
          </div>
          <div className="text-xs text-gold-accent/80 border-t border-white/5 pt-4">
            Bangladesh Film Institute Alumni Association member since 2012.
          </div>
        </div>
      </section>
    </div>
  );
}

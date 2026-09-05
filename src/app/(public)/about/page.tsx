export const revalidate = 86400;

import React from "react";
import { getPageBySlug, generatePageMetadata } from "@/lib/content";
import { Shield, Sparkles, Film, Compass } from "lucide-react";
import * as icons from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "about",
    "About Us | Ferywala Communications",
    "Learn about Ferywala Communications, a leading audio-visual production house in Bangladesh founded by Rana Masud in 2006."
  );
}

export default async function AboutUsPage() {
  const pageData = await getPageBySlug("about");

  // Fallback defaults
  const introTitle = pageData?.frontmatter.introTitle || "Ferywala Communications";
  const introText =
    pageData?.frontmatter.introText ||
    "Ferywala Communications is a leading audiovisual production banner in Bangladesh. Founded by filmmaker and creative director Rana Masud in 2006, the agency has spent decades producing high-fidelity advertising materials, public service broadcasts (PSAs), social awareness docudramas, and independent shorts.";
  const introSubtext =
    pageData?.frontmatter.introSubtext ||
    "We focus on storytelling through sophisticated cinematography, detailed scene construction, and custom sound design. We help brand campaigns and social behavior change programs communicate impactfully with large target audiences.";

  const pillars = pageData?.frontmatter.pillars || [
    {
      title: "Brand Promotion",
      description: "Conceptualizing and executing creative television commercials (TVCs) that drive market growth and strengthen brand value.",
      icon: "Sparkles",
    },
    {
      title: "Behavior Change",
      description: "Developing educational materials and PSAs for social development agencies, promoting health, child education, and peace.",
      icon: "Shield",
    },
    {
      title: "Documentary Cinema",
      description: "Documenting cultural heritage, history, and social justice narratives through long and short-form non-fiction films.",
      icon: "Compass",
    },
  ];

  const badgeText = pageData?.frontmatter.aboutBadgeText || "The Banner";
  const bannerPrimaryText = pageData?.frontmatter.bannerPrimaryText || "Ferywala";
  const bannerSecondaryText = pageData?.frontmatter.bannerSecondaryText || "Communications";
  const pillarsSectionTitle = pageData?.frontmatter.pillarsSectionTitle || "Core Operations";

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Editorial Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div>
            <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">{badgeText}</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">{introTitle}</h1>
            <div className="h-0.5 w-16 bg-gold-accent mt-4" />
          </div>
          <p className="text-white/80 leading-relaxed text-base md:text-lg">{introText}</p>
          <p className="text-white/70 leading-relaxed text-sm">{introSubtext}</p>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950 flex items-center justify-center p-6">
            <div className="text-center flex flex-col gap-2">
              <Film className="w-12 h-12 text-gold-accent mx-auto animate-pulse" />
              <h3 className="text-xl font-bold text-white tracking-widest uppercase mt-2">{bannerPrimaryText}</h3>
              <p className="text-xs text-white/40">{bannerSecondaryText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-white text-center">{pillarsSectionTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar: any, index: number) => {
            const IconComponent = (icons as any)[pillar.icon] || Shield;
            return (
              <div key={index} className="glass-card p-8 flex flex-col gap-4 text-center">
                <div className="mx-auto w-12 h-12 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                <p className="text-white/60 text-xs leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

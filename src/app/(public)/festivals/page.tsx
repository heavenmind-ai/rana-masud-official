import React from "react";
import { getPageBySlug } from "@/lib/content";
import { Compass, Globe, MapPin } from "lucide-react";

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
    { name: "South Asia International Film Festival", country: "Canada" },
    { name: "Al-Nahj International Film Festival", country: "Iraq" },
    { name: "Cefalù Film Festival", country: "Italy" },
    { name: "First-Time Filmmaker Sessions", country: "United Kingdom" },
    { name: "Festival Ouled Teima du Film International", country: "Morocco" },
    { name: "Second Al-Sharqiyah International Film Festival", country: "Oman" },
    { name: "Tripura Tourism Film Utshab", country: "India" },
  ];

  const nationalFestivals = pageData.frontmatter.nationalFestivals || [
    { name: "Chittagong SHORT Film Festival", city: "Chittagong" },
    { name: "Sylhet Film Festival", city: "Sylhet" },
    { name: "Our Shorts Their Shorts Film Festival", city: "Dhaka" },
    { name: "Dheki International Motion Picture Festival", city: "Dhaka" },
    { name: "Short Film Forum Showcase", city: "Dhaka" },
    { name: "Bangladesh Shilpakala Academy Short & Docu Festival", city: "Dhaka" },
    { name: "International Short and Independent Film Festival (14th & 15th)", city: "Dhaka" },
    { name: "Sat Rong Short Film Festival", city: "Nilphamari" },
  ];

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">Screenings</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">Film Festivals</h1>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        <p className="text-white/60 mt-6 leading-relaxed">
          {pageData.frontmatter.headerText ||
            "Rana Masud's films have traveled globally and nationally, engaging diverse audiences and winning critical praise across multiple international venues."}
        </p>
      </section>

      {/* Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
        {/* International */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 border-b border-white/5 pb-4">
            <Globe className="text-gold-accent h-6 w-6" />
            International Screenings
          </h2>
          <div className="flex flex-col gap-4">
            {internationalFestivals.map((fest: any, idx: number) => (
              <div key={idx} className="glass-card p-5 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-white text-base leading-snug">{fest.name}</h3>
                  <p className="text-xs text-white/40 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gold-accent" />
                    Host Nation
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full border border-gold-accent/20 bg-gold-accent/5 text-gold-accent text-xs font-semibold">
                  {fest.country}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* National */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 border-b border-white/5 pb-4">
            <Compass className="text-gold-accent h-6 w-6" />
            National Screenings
          </h2>
          <div className="flex flex-col gap-4">
            {nationalFestivals.map((fest: any, idx: number) => (
              <div key={idx} className="glass-card p-5 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-white text-base leading-snug">{fest.name}</h3>
                  <p className="text-xs text-white/40 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gold-accent" />
                    Location
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs font-medium">
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

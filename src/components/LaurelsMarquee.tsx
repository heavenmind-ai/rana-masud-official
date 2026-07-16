"use client";

import React from "react";

export default function LaurelsMarquee({ laurels }: { laurels: string[] }) {
  if (!laurels || laurels.length === 0) return null;

  return (
    <section className="py-16 bg-[#09090b] border-t border-white/5 overflow-hidden w-full">
      <div className="container mx-auto px-4 mb-10 text-center">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">Festival Presence</p>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white uppercase tracking-wide">
          Festival Laurels
        </h2>
        <div className="w-16 h-0.5 bg-gold-accent mx-auto mt-4" />
      </div>

      <div className="flex w-full relative">
        {/* Shadow overlays on the left/right edges for premium fade out */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />

        {/* Scrolling Row (Single line, scrolling left) */}
        <div className="flex overflow-hidden select-none w-full gap-16">
          <div className="flex shrink-0 gap-16 animate-marquee justify-around min-w-full items-center">
            {laurels.map((laurel, idx) => (
              <img
                key={idx}
                src={laurel}
                alt="Festival Laurel"
                className="h-16 md:h-20 w-auto object-contain brightness-95 hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
          <div className="flex shrink-0 gap-16 animate-marquee justify-around min-w-full items-center" aria-hidden="true">
            {laurels.map((laurel, idx) => (
              <img
                key={idx}
                src={laurel}
                alt="Festival Laurel"
                className="h-16 md:h-20 w-auto object-contain brightness-95 hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

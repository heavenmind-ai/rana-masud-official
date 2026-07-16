"use client";

import React from "react";

export default function ClientsMarquee({ logos }: { logos: string[] }) {
  if (!logos || logos.length === 0) return null;

  // Split logos into two rows
  const row1 = logos.slice(0, Math.ceil(logos.length / 2));
  const row2 = logos.slice(Math.ceil(logos.length / 2));

  return (
    <section className="py-20 bg-[#09090b] border-t border-white/5 overflow-hidden w-full">
      <div className="container mx-auto px-4 mb-12 text-center">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">Trusted Collaborations</p>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white uppercase tracking-wide">
          Our Clients
        </h2>
        <div className="w-16 h-0.5 bg-gold-accent mx-auto mt-4" />
      </div>

      <div className="flex flex-col gap-6 w-full relative">
        {/* Shadow overlays on the left/right edges for premium fade out */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />

        {/* Row 1: Scrolling Left */}
        <div className="flex overflow-hidden select-none w-full gap-16">
          <div className="flex shrink-0 gap-16 animate-marquee justify-around min-w-full items-center">
            {row1.map((logo, idx) => (
              <img
                key={idx}
                src={logo}
                alt="Client Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
            ))}
          </div>
          <div className="flex shrink-0 gap-16 animate-marquee justify-around min-w-full items-center" aria-hidden="true">
            {row1.map((logo, idx) => (
              <img
                key={idx}
                src={logo}
                alt="Client Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="flex overflow-hidden select-none w-full gap-16">
          <div className="flex shrink-0 gap-16 animate-marquee-reverse justify-around min-w-full items-center">
            {row2.map((logo, idx) => (
              <img
                key={idx}
                src={logo}
                alt="Client Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
            ))}
          </div>
          <div className="flex shrink-0 gap-16 animate-marquee-reverse justify-around min-w-full items-center" aria-hidden="true">
            {row2.map((logo, idx) => (
              <img
                key={idx}
                src={logo}
                alt="Client Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

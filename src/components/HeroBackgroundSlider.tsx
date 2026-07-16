"use client";

import React, { useState, useEffect } from "react";

export default function HeroBackgroundSlider({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-[1500ms] ease-in-out transform ${idx === currentIndex ? "opacity-60 scale-100" : "opacity-0 scale-[1.03]"
            }`}
          style={{
            backgroundImage: `url(${img})`,
          }}
        />
      ))}
      {/* Cinematic dark overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#09090b]/80 to-[#09090b] z-10" />
    </div>
  );
}

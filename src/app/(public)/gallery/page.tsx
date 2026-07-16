"use client";

import React, { useState } from "react";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);

  // Curated list of images with resolved paths from the output directory
  const galleryItems = [
    {
      src: "/content/gallery/assets/Shooting-1-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "Shooting scene on location",
    },
    {
      src: "/content/gallery/assets/Shooting-3-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "Camera set-up overview",
    },
    {
      src: "/content/gallery/assets/Shooting-4-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "Director instructing actors",
    },
    {
      src: "/content/gallery/assets/rana-masud-seminar.jpg",
      category: "seminar",
      title: "Guest lecturer at Bangladesh Film Institute",
    },
    {
      src: "/content/gallery/assets/Film-Awards-Rana-Masud-2.jpg",
      category: "awards",
      title: "Receiving Best Short Film Laurel",
    },
    {
      src: "/content/gallery/assets/Rana-Masud-Awards-3.jpg",
      category: "awards",
      title: "Moroccan festival jury honors",
    },
    {
      src: "/content/gallery/assets/Rana-Masud-Awards-4.jpg",
      category: "awards",
      title: "Sat Rong Film Festival Trophy",
    },
    {
      src: "/content/gallery/assets/Shooting-5-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "On-set production crew briefing",
    },
    {
      src: "/content/gallery/assets/Shooting-7-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "Behind-the-scenes camera rig",
    },
    {
      src: "/content/gallery/assets/Shooting-10-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "Night shoot coordinates",
    },
    {
      src: "/content/gallery/assets/Shooting-14-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "Director reviewing script drafts",
    },
    {
      src: "/content/gallery/assets/Rana-Masud-Awards-11.png",
      category: "awards",
      title: "Official screening certificate",
    },
  ];

  const filteredItems = activeFilter === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  const openLightbox = (src: string) => {
    const idx = galleryItems.findIndex(item => item.src === src);
    if (idx !== -1) {
      setSelectedImageIdx(idx);
    }
  };

  const closeLightbox = () => {
    setSelectedImageIdx(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((selectedImageIdx + 1) % galleryItems.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((selectedImageIdx - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-12">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">Visuals</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">Image Gallery</h1>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        <p className="text-white/60 mt-6 leading-relaxed">
          Explore production stills, behind-the-scenes shoots, award ceremonies, and BFI classroom highlights representing decades of filmmaking.
        </p>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {["all", "shooting", "awards", "seminar"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border border-white/5 cursor-pointer ${
              activeFilter === filter
                ? "bg-gold-accent text-black border-gold-accent"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            {filter === "all" ? "All Photos" : filter === "shooting" ? "On Set / Shooting" : filter === "awards" ? "Awards" : "Seminars & Teaching"}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(item.src)}
            className="glass-card overflow-hidden group cursor-pointer border border-white/5 relative aspect-square"
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
              <div className="text-center flex flex-col gap-2">
                <ImageIcon className="h-6 w-6 text-gold-accent mx-auto" />
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                <span className="text-[10px] text-gold-accent uppercase tracking-widest font-semibold">{item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIdx !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 cursor-zoom-out"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/60 hover:text-white p-2 rounded-full bg-white/5 border border-white/10 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-4 p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Main expanded image */}
          <div className="max-w-5xl max-h-[80vh] flex flex-col gap-4 items-center">
            <img
              src={galleryItems[selectedImageIdx].src}
              alt={galleryItems[selectedImageIdx].title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-white font-bold text-lg">{galleryItems[selectedImageIdx].title}</h3>
              <p className="text-xs text-gold-accent uppercase tracking-widest font-semibold mt-1">
                {galleryItems[selectedImageIdx].category}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Newspaper, ExternalLink } from "lucide-react";

export default function PressPage() {
  const pressItems = [
    {
      title: "Rana Masud wins Best Director at Moroccan International Film Festival",
      outlet: "Bangladesh Post",
      link: "https://bangladeshpost.net/posts/rana-masud-s-short-at-morocco-film-festival-13867",
      image: "/content/media-press/assets/rana-masud-awards-profile.png",
      date: "Nov 2022",
    },
    {
      title: "Faria Shahrin performs in TVC after 2 years directed by Rana Masud",
      outlet: "Daily Sun",
      link: "https://www.daily-sun.com/printversion/details/285989",
      image: "/content/media-press/assets/Press-5-Rana-Masud-1.jpg",
      date: "May 2018",
    },
    {
      title: "Noble and Purnima come together for TVC under Ferywala banner",
      outlet: "The Daily Star",
      link: "https://www.thedailystar.net/arts-entertainment/tv/noble-and-purnima-come-together-tvc-1565743",
      image: "/content/media-press/assets/Press-7-Rana-Masud.jpg",
      date: "Apr 2018",
    },
    {
      title: "Mila makes her music video comeback with director Rana Masud",
      outlet: "Dhaka Tribune",
      link: "https://www.dhakatribune.com/magazine/arts-and-letters/34669/mila-makes-her-comeback-after-nine-years",
      image: "/content/media-press/assets/Press-9-Rana-Masud.jpg",
      date: "Nov 2017",
    },
    {
      title: "মরক্কো উৎসবে সেরা রানা মাসুদ - চিত্রনাট্যকার হিসেবে অর্জন",
      outlet: "Dhaka Prakash",
      link: "https://www.dhakaprokash24.com/entertainment/dhallywood/36439",
      image: "/content/media-press/assets/WhatsApp-Image-2024-02-19-at-5.23.47-PM.jpeg",
      date: "Oct 2022",
    },
    {
      title: "রানা মাসুদের 'আতর' চলচ্চিত্রের জন্য আন্তর্জাতিক সম্মাননা",
      outlet: "Jago News 24",
      link: "https://www.jagonews24.com/entertainment/news/984055",
      image: "/content/media-press/assets/3.png",
      date: "Sep 2023",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">Media Presence</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">Press & Media</h1>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        <p className="text-white/60 mt-6 leading-relaxed">
          Read coverage and reviews of Rana Masud&apos;s film creations, TVCs, and academic contributions from leading national and international publications.
        </p>
      </section>

      {/* Press Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pressItems.map((item, idx) => (
          <div key={idx} className="glass-card overflow-hidden flex flex-col group border border-white/5">
            {/* Clipping Image */}
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-zinc-900 border-b border-white/5">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/60 to-transparent" />
            </div>

            {/* Clipping Content */}
            <div className="p-6 flex-1 flex flex-col justify-between gap-4 text-left">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span className="font-semibold text-gold-accent flex items-center gap-1">
                    <Newspaper className="h-3 w-3" />
                    {item.outlet}
                  </span>
                  <span>{item.date}</span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug group-hover:text-gold-accent transition-colors mt-1">
                  {item.title}
                </h3>
              </div>

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-accent hover:text-white transition-colors mt-auto w-fit cursor-pointer"
              >
                Read Full Article
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

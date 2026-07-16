import React from "react";
import Link from "next/link";
import { getPageBySlug } from "@/lib/content";
import { Award, Film, PlayCircle, BookOpen, Tv, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const pageData = getPageBySlug("home");
  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error loading homepage content.</h1>
        <p className="text-white/60 mt-2">Please ensure output/content/home/index.md exists.</p>
      </div>
    );
  }

  // Define structured film data for quick display
  const notableFilms = [
    {
      title: "The Fragrance (আতর)",
      description: "Based on the tragic burning of Feni madrasah student Nusrath Jahan Rafi. Focuses on social justice, peace, and human rights.",
      image: `/content/home/assets/film-posters-1-1-scaled.jpg`,
      imdb: "https://www.imdb.com/title/tt30203183/",
    },
    {
      title: "The Residence (নিবাস)",
      description: "Award-winning short film exploring domestic narratives and human vulnerability.",
      image: `/content/home/assets/the-residence-rana-masud-1.jpg`,
      imdb: "https://www.imdb.com/title/tt30022600/",
    },
    {
      title: "The Battles of Belonia",
      description: "A historical documentary detailing the crucial battles of the Bangladesh Liberation War in Belonia sector.",
      image: `/content/home/assets/the-battles-of-belonia-rana-masud.jpg`,
      imdb: "https://www.imdb.com/title/tt30252213/",
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#0c0c0e] via-[#09090b] to-[#09090b]">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gold-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-accent/20 bg-gold-accent/5 text-xs font-semibold tracking-widest text-gold-accent uppercase w-fit">
              <Award className="h-3.5 w-3.5" />
              Award Winning Filmmaker
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Crafting Stories <br />
              <span className="text-gold-accent gold-glow">Throughcompelling Visuals</span>
            </h1>
            <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-xl">
              Rana Masud is a pioneer filmmaker, producer, and teacher in Bangladesh. With over 300 television commercials, award-winning short films, and decades of creative leadership at Ferywala Communications.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                href="/filmography"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-accent hover:bg-gold-hover text-black font-semibold tracking-wide transition-all shadow-lg hover:shadow-gold-accent/15 cursor-pointer"
              >
                <PlayCircle className="h-5 w-5" />
                Explore Filmography
              </Link>
              <Link
                href="/biography"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/10 hover:border-gold-accent/30 bg-white/5 hover:bg-white/10 text-white font-semibold tracking-wide transition-all cursor-pointer"
              >
                Read Biography
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Hero Right Media */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-[380px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:border-gold-accent/30">
              {/* Profile Image */}
              <img
                src="/content/home/assets/rana-masud-Profile.png"
                alt="Rana Masud Profile"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Glass Info Card Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl border border-white/10 bg-[#09090b]/80 backdrop-blur-md text-left">
                <p className="text-xs font-semibold text-gold-accent tracking-widest uppercase">FILM DIRECTOR & TEACHER</p>
                <h3 className="text-lg font-bold text-white mt-1">Rana Masud</h3>
                <p className="text-xs text-white/50 mt-0.5">Bangladesh Film Institute (BFI)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">Expertise</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">Creative Services</h2>
          <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 flex flex-col gap-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-lg bg-gold-accent/10 flex items-center justify-center text-gold-accent border border-gold-accent/20">
              <Film className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Film Production</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Directing and producing independent narrative films, award-winning shorts, and historical documentaries representing Bangladesh globally.
            </p>
          </div>

          <div className="glass-card p-8 flex flex-col gap-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-lg bg-gold-accent/10 flex items-center justify-center text-gold-accent border border-gold-accent/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Academic Teaching</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Lecturing at Bangladesh Film Institute (BFI) for over 8 years, educating next-generation directors on Film Production Design and Shot Division.
            </p>
          </div>

          <div className="glass-card p-8 flex flex-col gap-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-lg bg-gold-accent/10 flex items-center justify-center text-gold-accent border border-gold-accent/20">
              <Tv className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">AD & Commercials</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Directed nearly 300 television commercials (TVCs) and Public Service Announcements (PSAs) for prominent national brands and social projects.
            </p>
          </div>
        </div>
      </section>

      {/* Notable Works Section */}
      <section className="container mx-auto px-4 py-8 bg-[#09090b]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">Highlight Showcase</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-white">Notable Films</h2>
          <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {notableFilms.map((film, index) => (
            <div key={index} className="glass-card overflow-hidden flex flex-col group border border-white/5">
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                <img
                  src={film.image}
                  alt={film.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-gold-accent transition-colors">{film.title}</h3>
                  <p className="text-white/60 text-xs leading-relaxed">{film.description}</p>
                </div>
                <a
                  href={film.imdb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-accent hover:text-white transition-colors mt-auto w-fit"
                >
                  IMDb Profile
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

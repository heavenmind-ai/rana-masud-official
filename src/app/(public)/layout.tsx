import React from "react";
import Link from "next/link";
import { Film, Settings } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-[#f4f4f5]">
      {/* Cinematic Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090b]/85 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-widest text-gold-accent hover:opacity-80 transition-opacity">
            <Film className="h-6 w-6 text-gold-accent" />
            <span className="uppercase text-lg">Rana Masud</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-gold-accent transition-colors">Home</Link>
            <Link href="/biography" className="hover:text-gold-accent transition-colors">Biography</Link>
            <Link href="/filmography" className="hover:text-gold-accent transition-colors">Filmography</Link>
            <Link href="/awards" className="hover:text-gold-accent transition-colors">Awards</Link>
            <Link href="/festivals" className="hover:text-gold-accent transition-colors">Festivals</Link>
            <Link href="/gallery" className="hover:text-gold-accent transition-colors">Gallery</Link>
            <Link href="/press" className="hover:text-gold-accent transition-colors">Press</Link>
            <Link href="/tv-shows" className="hover:text-gold-accent transition-colors">TV Shows</Link>
            <Link href="/contact" className="hover:text-gold-accent transition-colors">Contact</Link>
          </nav>

          {/* Admin Control Link */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gold-accent/20 bg-gold-accent/10 hover:bg-gold-accent/20 hover:border-gold-accent/40 text-xs font-semibold text-gold-accent transition-all cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5" />
            Admin Panel
          </Link>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-8 bg-[#0c0c0e]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold tracking-wider text-white/80">RANA MASUD</p>
            <p className="text-xs text-white/40 mt-1">Film Director • Producer • Teacher</p>
          </div>
          <div className="text-xs text-white/40 text-center">
            © {new Date().getFullYear()} Rana Masud. All Rights Reserved. Powered by Next.js.
          </div>
          <div className="flex gap-4 text-xs text-white/60">
            <Link href="/" className="hover:text-gold-accent transition-colors">Home</Link>
            <Link href="/contact" className="hover:text-gold-accent transition-colors">Contact</Link>
            <Link href="/admin" className="hover:text-gold-accent transition-colors">Admin Area</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

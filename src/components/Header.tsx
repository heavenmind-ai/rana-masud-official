"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  header: {
    logoImage?: string;
    menuLinks: Array<{ label: string; href: string }>;
  };
}

export default function Header({ header }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090b]/85 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity shrink-0"
          onClick={() => setIsOpen(false)}
        >
          {header.logoImage ? (
            <img
              src={header.logoImage}
              alt="Rana Masud"
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="text-xl font-bold tracking-wider text-white hover:text-gold-accent transition-colors uppercase">
              Rana Masud
            </span>
          )}
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-4 text-[13px] font-bold">
          {header.menuLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="hover:text-gold-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Links Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#09090b]/95 backdrop-blur-lg border-b border-white/10 py-6 px-4 z-40 transition-all duration-300 ease-in-out shadow-2xl">
          <nav className="flex flex-col gap-4 text-center font-bold text-sm">
            {header.menuLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-2 text-white/80 hover:text-gold-accent transition-colors border-b border-white/5 last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

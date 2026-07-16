export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { Settings, Facebook, Twitter, Youtube, Link as LinkIcon } from "lucide-react";
import * as icons from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import { GlobalSettings } from "@/models/GlobalSettings";

// Fallback configurations if DB is empty or disconnected
const defaultHeader = {
  logoText: "Rana Masud",
  logoIcon: "Film",
  menuLinks: [
    { label: "Home", href: "/" },
    { label: "Biography", href: "/biography" },
    { label: "Filmography", href: "/filmography" },
    { label: "Awards", href: "/awards" },
    { label: "Festivals", href: "/festivals" },
    { label: "Gallery", href: "/gallery" },
    { label: "Press", href: "/press" },
    { label: "TV Shows", href: "/tv-shows" },
    { label: "Contact", href: "/contact" },
  ],
};

const defaultFooter = {
  copyrightText: `© ${new Date().getFullYear()} Rana Masud. All Rights Reserved. Powered by Next.js.`,
  brandName: "RANA MASUD",
  brandSubtitle: "Film Director • Producer • Teacher",
  socials: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
    imdb: "https://www.imdb.com/name/nm7851085/",
  },
};

async function getHeaderFooterSettings() {
  try {
    await connectToDatabase();
    const headerDoc = await GlobalSettings.findOne({ key: "header" }).lean();
    const footerDoc = await GlobalSettings.findOne({ key: "footer" }).lean();
    return {
      header: headerDoc ? (headerDoc as any).data : defaultHeader,
      footer: footerDoc ? (footerDoc as any).data : defaultFooter,
    };
  } catch (error) {
    console.error("Failed to load header/footer settings, using fallbacks:", error);
    return {
      header: defaultHeader,
      footer: defaultFooter,
    };
  }
}

function DynamicLogoIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (icons as any)[name] || (icons as any).Film;
  return <IconComponent className={className} />;
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { header, footer } = await getHeaderFooterSettings();

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-[#f4f4f5]">
      {/* Cinematic Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090b]/85 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-widest text-gold-accent hover:opacity-80 transition-opacity"
          >
            <DynamicLogoIcon name={header.logoIcon} className="h-6 w-6 text-gold-accent" />
            <span className="uppercase text-lg">{header.logoText}</span>
          </Link>

          {/* Dynamic Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {header.menuLinks.map((link: any, idx: number) => (
              <Link
                key={idx}
                href={link.href}
                className="hover:text-gold-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1">{children}</main>

      {/* Dynamic Footer */}
      <footer className="w-full border-t border-white/10 py-8 bg-[#0c0c0e]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold tracking-wider text-white/80">
              {footer.brandName}
            </p>
            <p className="text-xs text-white/40 mt-1">{footer.brandSubtitle}</p>
          </div>
          <div className="text-xs text-white/40 text-center">
            {footer.copyrightText}
          </div>
          <div className="flex items-center gap-4 text-xs">
            {/* Socials */}
            {footer.socials?.facebook && (
              <a
                href={footer.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-gold-accent transition-colors"
                title="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {footer.socials?.twitter && (
              <a
                href={footer.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-gold-accent transition-colors"
                title="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {footer.socials?.youtube && (
              <a
                href={footer.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-gold-accent transition-colors"
                title="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            )}
            {footer.socials?.imdb && (
              <a
                href={footer.socials.imdb}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-gold-accent transition-colors"
                title="IMDb Profile"
              >
                <LinkIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

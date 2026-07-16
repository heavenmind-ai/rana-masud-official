export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { Settings, Facebook, Twitter, Youtube, Link as LinkIcon, ChevronDown } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import { GlobalSettings } from "@/models/GlobalSettings";

// Fallback configurations if DB is empty or disconnected
const defaultHeader = {
  logoImage: "",
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
    
    const header = headerDoc ? (headerDoc as any).data : defaultHeader;
    const footer = footerDoc ? (footerDoc as any).data : defaultFooter;

    // Bulletproof fallback: if menuLinks is empty or missing in database, restore default links
    if (!header.menuLinks || header.menuLinks.length === 0) {
      header.menuLinks = defaultHeader.menuLinks;
    }

    return { header, footer };
  } catch (error) {
    console.error("Failed to load header/footer settings, using fallbacks:", error);
    return {
      header: defaultHeader,
      footer: defaultFooter,
    };
  }
}


export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { header, footer } = await getHeaderFooterSettings();

  // Split links into main bar and dropdown
  const mainLinks = header.menuLinks.filter((link: any) =>
    ["home", "biography", "gallery", "contact"].includes(link.label.toLowerCase()) ||
    ["/", "/biography", "/gallery", "/contact"].includes(link.href)
  );

  const dropdownLinks = header.menuLinks.filter((link: any) =>
    !["home", "biography", "gallery", "contact"].includes(link.label.toLowerCase()) &&
    !["/", "/biography", "/gallery", "/contact"].includes(link.href)
  );

  const homeLink = mainLinks.find((l: any) => l.href === "/" || l.label.toLowerCase() === "home");
  const bioLink = mainLinks.find((l: any) => l.href === "/biography" || l.label.toLowerCase() === "biography");
  const galleryLink = mainLinks.find((l: any) => l.href === "/gallery" || l.label.toLowerCase() === "gallery");
  const contactLink = mainLinks.find((l: any) => l.href === "/contact" || l.label.toLowerCase() === "contact");

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-[#f4f4f5]">
      {/* Cinematic Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090b]/85 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity shrink-0"
          >
            {header.logoImage && (
              <img
                src={header.logoImage}
                alt="Rana Masud"
                className="h-10 w-auto object-contain"
              />
            )}
          </Link>

          {/* Dynamic Nav Links with Works Dropdown */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {homeLink && (
              <Link href={homeLink.href} className="hover:text-gold-accent transition-colors">
                {homeLink.label}
              </Link>
            )}
            
            {bioLink && (
              <Link href={bioLink.href} className="hover:text-gold-accent transition-colors">
                {bioLink.label}
              </Link>
            )}

            {dropdownLinks.length > 0 && (
              <div className="relative group py-2">
                <button className="flex items-center gap-1 hover:text-gold-accent transition-colors cursor-pointer">
                  Works
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-44 rounded-xl border border-white/10 bg-[#0c0c0e]/95 backdrop-blur-md p-1.5 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col gap-0.5 z-50">
                  {dropdownLinks.map((link: any, idx: number) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-gold-accent transition-colors text-xs text-left"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {galleryLink && (
              <Link href={galleryLink.href} className="hover:text-gold-accent transition-colors">
                {galleryLink.label}
              </Link>
            )}

            {contactLink && (
              <Link href={contactLink.href} className="hover:text-gold-accent transition-colors">
                {contactLink.label}
              </Link>
            )}
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

export const revalidate = 0;

import React, { Suspense } from "react";
import Link from "next/link";
import { Settings, Facebook, Twitter, Youtube, Link as LinkIcon, ChevronDown } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import { GlobalSettings } from "@/models/GlobalSettings";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import Header from "@/components/Header";

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
    { label: "AD Film", href: "/ad-film" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
};

const defaultFooter = {
  copyrightText: `© ${new Date().getFullYear()} Rana Masud. All Rights Reserved. Created by Shahadot.`,
  brandName: "RANA MASUD",
  brandSubtitle: "Film Director • Producer • Teacher",
  socials: [
    { title: "Facebook", logo: "/content/home/assets/facebook-icon-rana-masud.png", link: "https://facebook.com" },
    { title: "LinkedIn", logo: "/content/home/assets/linkedin-rana-masud.png", link: "https://linkedin.com" },
    { title: "Instagram", logo: "/content/home/assets/instagram-rana-masud.png", link: "https://instagram.com" },
    { title: "Twitter", logo: "/content/home/assets/twitter-rana-masud.png", link: "https://twitter.com" },
    { title: "Threads", logo: "/content/home/assets/threads-rana-masud.png", link: "https://threads.net" },
    { title: "Pinterest", logo: "/content/home/assets/pinterest-rana-masud.png", link: "https://pinterest.com" },
    { title: "Snapchat", logo: "/content/home/assets/snapchat-rana-masud.png", link: "https://snapchat.com" },
    { title: "YouTube", logo: "/content/home/assets/imdb-rana-masud.png", link: "https://youtube.com" },
    { title: "IMDb", logo: "/content/home/assets/imdb-rana-masud.png", link: "https://www.imdb.com/name/nm7851085/" },
    { title: "Vimeo", logo: "/content/home/assets/vimeo-rana-masud.png", link: "https://vimeo.com" },
  ],
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

    // Ensure "AD Film" always appears after "TV Shows" in the nav (both DB and fallback menus)
    const adFilmExists = header.menuLinks.some((l: any) => l.href === "/ad-film");
    if (!adFilmExists) {
      const tvShowsIndex = header.menuLinks.findIndex((l: any) => l.href === "/tv-shows");
      const insertAt = tvShowsIndex >= 0 ? tvShowsIndex + 1 : header.menuLinks.length;
      header.menuLinks.splice(insertAt, 0, { label: "AD Film", href: "/ad-film" });
    }

    // Bulletproof fallback: if socials is missing, empty, or not an array, use default list
    if (!footer.socials || !Array.isArray(footer.socials) || footer.socials.length === 0) {
      footer.socials = defaultFooter.socials;
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

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-[#f4f4f5]">
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {/* Cinematic Navigation Header */}
      <Header header={header} />

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
          <div className="flex items-center gap-3">
            {/* Socials */}
            {(footer.socials || []).map((social: any, idx: number) => (
              social.link && (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity shrink-0"
                  title={social.title}
                >
                  {social.logo ? (
                    <img
                      src={social.logo}
                      alt={social.title || "Social Logo"}
                      className="h-7 w-7 rounded-full object-cover bg-black/40 border border-white/10"
                    />
                  ) : (
                    <span className="text-[10px] text-white/60 bg-white/5 border border-white/10 px-2 py-1 rounded-full uppercase tracking-wider font-bold">
                      {social.title}
                    </span>
                  )}
                </a>
              )
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

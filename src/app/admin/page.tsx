import React from "react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Page } from "@/models/Page";
import {
  FileText,
  Image as ImageIcon,
  BookOpen,
  Settings,
  ChevronRight,
  Shield,
  User,
  Film,
  Award,
  Globe,
} from "lucide-react";

export default async function AdminDashboardPage() {
  let pagesCount = 6; // Standard base page editors
  let galleryCount = 0;
  let blogsCount = 0;

  try {
    await connectToDatabase();
    
    // Fetch counts from DB
    blogsCount = await Page.countDocuments({ "frontmatter.isPost": true });
    
    const galleryDoc = await Page.findOne({ slug: "gallery" }).lean();
    if (galleryDoc && (galleryDoc as any).frontmatter?.galleryItems) {
      galleryCount = (galleryDoc as any).frontmatter.galleryItems.length;
    }
  } catch (error) {
    console.error("Dashboard failed to load metrics from DB:", error);
  }

  const cmsShortcuts = [
    { name: "Home Page", href: "/admin/home", desc: "Hero areas & notable films showcase", icon: FileText },
    { name: "Biography", href: "/admin/biography", desc: "Professional timeline & memberships", icon: User },
    { name: "Filmography", href: "/admin/filmography", desc: "Film credits & primary works list", icon: Film },
    { name: "Awards", href: "/admin/awards", desc: "Festival honors, trophies, and laurels", icon: Award },
    { name: "Festivals", href: "/admin/festivals", desc: "International & national screenings", icon: Globe },
    { name: "Gallery Manager", href: "/admin/gallery", desc: "Upload shoot photos to Cloudflare R2", icon: ImageIcon },
    { name: "Blog Manager", href: "/admin/blog", desc: "Create, edit, and delete feed articles", icon: BookOpen },
    { name: "Global Settings", href: "/admin/settings", desc: "Navigation menus & footer social links", icon: Settings },
  ];

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-white/50 mt-1">Welcome to your custom portfolio CMS. Manage all aspects of your dynamic website pages.</p>
      </div>

      {/* Metrics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center justify-between border border-white/5">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Dynamic Pages</span>
            <span className="text-3xl font-bold text-white mt-1">{pagesCount}</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between border border-white/5">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Gallery Assets (R2)</span>
            <span className="text-3xl font-bold text-white mt-1">{galleryCount}</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent">
            <ImageIcon className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between border border-white/5">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Blog Articles</span>
            <span className="text-3xl font-bold text-white mt-1">{blogsCount}</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>
      </section>

      {/* Main Grid: CMS Shortcuts */}
      <section className="flex flex-col gap-4 mt-2">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-gold-accent" />
          CMS Control Panel
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cmsShortcuts.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <Link
                key={shortcut.name}
                href={shortcut.href}
                className="glass-card p-6 flex justify-between items-center group hover:bg-white/[0.04] border border-white/5 hover:border-gold-accent/30 transition-all cursor-pointer"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-gold-accent/10 flex items-center justify-center text-white/60 group-hover:text-gold-accent border border-white/5 transition-all">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-gold-accent transition-colors text-sm">{shortcut.name}</h4>
                    <p className="text-xs text-white/40 mt-0.5">{shortcut.desc}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-gold-accent group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

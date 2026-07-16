import React from "react";
import Link from "next/link";
import { getManifest } from "@/lib/content";
import { FileText, Image as ImageIcon, Video, Layers, PenTool, Edit3 } from "lucide-react";

export default async function AdminDashboardPage() {
  const manifest = await getManifest();
  const pagesCount = manifest.pages.length;
  
  // Total images based on manifest entries sum
  const totalScrapedImages = manifest.pages.reduce((acc, p) => acc + p.imageCount, 0);

  // Quick pages that are most commonly edited
  const featuredPages = manifest.pages.filter(p => 
    ["home", "biography-rana_masud_film_director", "rana_masud_filmography", "contact"].includes(p.slug)
  );

  return (
    <div className="flex flex-col gap-8 text-left">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-white/50 mt-1">Manage, update, and preview your site content files directly.</p>
      </div>

      {/* Metrics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Total Pages</span>
            <span className="text-3xl font-bold text-white mt-1">{pagesCount}</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Scraped Assets</span>
            <span className="text-3xl font-bold text-white mt-1">{totalScrapedImages}</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent">
            <ImageIcon className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Gallery Photos</span>
            <span className="text-3xl font-bold text-white mt-1">164</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent">
            <Layers className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">TV Broadcasts</span>
            <span className="text-3xl font-bold text-white mt-1">3</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent">
            <Video className="h-6 w-6" />
          </div>
        </div>
      </section>

      {/* Featured Quick Edit Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Quick Edits */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <PenTool className="h-5 w-5 text-gold-accent" />
            Quick Content Shortcuts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredPages.map((page) => {
              const decodedSlug = encodeURIComponent(page.slug);
              return (
                <div key={page.slug} className="glass-card p-6 flex justify-between items-center group">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-white capitalize">{page.slug.replace(/[-_]/g, ' ')}</h4>
                    <span className="text-xs text-white/40">{page.contentFile}</span>
                  </div>
                  <Link
                    href={`/admin/edit/${decodedSlug}`}
                    className="w-10 h-10 rounded-full border border-white/5 group-hover:border-gold-accent/30 bg-white/5 group-hover:bg-gold-accent/10 flex items-center justify-center text-white/60 group-hover:text-gold-accent transition-all cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Logs / Help */}
        <div className="lg:col-span-4 glass-card p-6 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-white">Migration Guide</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Your WordPress contents have been successfully indexed as structured markdown files inside the `/output/content` directory.
            </p>
            <p className="text-xs text-white/60 leading-relaxed">
              Edits performed in the admin panel will instantly write back to these local files, ensuring git portability and direct sync with the frontend.
            </p>
          </div>
          <Link
            href="/admin/pages"
            className="w-full text-center py-2.5 rounded-lg border border-gold-accent/20 bg-gold-accent/5 hover:bg-gold-accent/15 text-gold-accent text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            Manage All Pages
          </Link>
        </div>
      </section>
    </div>
  );
}

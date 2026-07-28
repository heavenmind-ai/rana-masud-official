"use client";

import React, { useState } from "react";
import { Globe, Image as ImageIcon, HelpCircle } from "lucide-react";

interface SEOControlProps {
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  seoKeywords: string;
  setSeoKeywords: (val: string) => void;
  seoOgImage: string;
  setSeoOgImage: (val: string) => void;
}

export default function SEOControl({
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  seoKeywords,
  setSeoKeywords,
  seoOgImage,
  setSeoOgImage,
}: SEOControlProps) {
  const [uploading, setUploading] = useState(false);

  const handleUploadOgImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setSeoOgImage(url);
    } catch (err) {
      console.error(err);
      alert("Social share image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // SEO Optimal Length Guidelines
  const isTitleOptimal = seoTitle.length >= 40 && seoTitle.length <= 60;
  const isDescOptimal = seoDescription.length >= 100 && seoDescription.length <= 160;

  return (
    <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5">
        <Globe className="h-4 w-4 text-gold-accent" />
        <h3 className="text-xs font-bold text-white/80 uppercase tracking-widest">
          SEO & Social Meta
        </h3>
      </div>

      {/* Meta Title */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1">
            Meta Title
            <span className="group relative cursor-pointer text-white/30 hover:text-white/60">
              <HelpCircle className="h-3 w-3" />
              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-zinc-900 text-white text-[9px] p-2 rounded shadow-lg border border-white/10 w-48 text-center normal-case font-normal leading-normal z-50">
                The page title shown in search engine results. Keeps keyword density high.
              </span>
            </span>
          </label>
          <span
            className={`text-[9px] font-mono ${
              seoTitle.length === 0
                ? "text-white/30"
                : isTitleOptimal
                ? "text-emerald-500 font-bold"
                : "text-amber-500"
            }`}
          >
            {seoTitle.length} chars (Optimal: 40-60)
          </span>
        </div>
        <input
          type="text"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          className="px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
          placeholder="e.g. Rana Masud | Film Director & Producer"
        />
      </div>

      {/* Meta Description */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1">
            Meta Description
            <span className="group relative cursor-pointer text-white/30 hover:text-white/60">
              <HelpCircle className="h-3 w-3" />
              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-zinc-900 text-white text-[9px] p-2 rounded shadow-lg border border-white/10 w-48 text-center normal-case font-normal leading-normal z-50">
                A brief summary of the page shown in search results. Write a compelling hook.
              </span>
            </span>
          </label>
          <span
            className={`text-[9px] font-mono ${
              seoDescription.length === 0
                ? "text-white/30"
                : isDescOptimal
                ? "text-emerald-500 font-bold"
                : "text-amber-500"
            }`}
          >
            {seoDescription.length} chars (Optimal: 100-160)
          </span>
        </div>
        <textarea
          rows={3}
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          className="px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-normal"
          placeholder="e.g. Explore the award-winning short films, documentaries, and TV commercials directed by Rana Masud."
        />
      </div>

      {/* Keywords */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1">
          Focus Keywords
          <span className="group relative cursor-pointer text-white/30 hover:text-white/60">
            <HelpCircle className="h-3 w-3" />
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-zinc-900 text-white text-[9px] p-2 rounded shadow-lg border border-white/10 w-48 text-center normal-case font-normal leading-normal z-50">
              Comma-separated search keywords relevant to this page (e.g. film director, commercial TVC).
            </span>
          </span>
        </label>
        <input
          type="text"
          value={seoKeywords}
          onChange={(e) => setSeoKeywords(e.target.value)}
          className="px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
          placeholder="e.g. film director, ferywala, bangladesh film"
        />
      </div>

      {/* Open Graph Image */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1">
          OG Image (Social Sharing)
          <span className="group relative cursor-pointer text-white/30 hover:text-white/60">
            <HelpCircle className="h-3 w-3" />
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-zinc-900 text-white text-[9px] p-2 rounded shadow-lg border border-white/10 w-48 text-center normal-case font-normal leading-normal z-50">
              The image preview shown when sharing this page link on social media (Facebook, LinkedIn, etc.).
            </span>
          </span>
        </label>
        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-1.5 px-3 py-2 rounded border border-white/10 hover:border-gold-accent/20 bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white cursor-pointer transition-colors shrink-0">
            <ImageIcon className="h-4 w-4 text-gold-accent" />
            {uploading ? "Uploading..." : "Upload"}
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadOgImage}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <input
            type="text"
            value={seoOgImage}
            onChange={(e) => setSeoOgImage(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-black/40 border border-white/10 text-white/60 text-xs outline-none focus:border-gold-accent/40 font-mono text-[10px]"
            placeholder="Image URL or upload a file"
          />
        </div>
      </div>
    </div>
  );
}

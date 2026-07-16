"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface TvShowItem {
  title: string;
  youtubeId: string;
  description: string;
}

export default function AdminTvShowsPageEditor() {
  const [shows, setShows] = useState<TvShowItem[]>([]);
  const [headerText, setHeaderText] = useState("");

  // New section header states
  const [showsBadgeText, setShowsBadgeText] = useState("");
  const [showsTitle, setShowsTitle] = useState("");

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    async function fetchTvShows() {
      try {
        const res = await fetch("/api/pages/tv-shows");
        if (!res.ok) throw new Error("Failed to fetch tv shows page data");
        const data = await res.json();
        
        const fm = data.frontmatter || {};
        setShows(fm.shows || []);
        setHeaderText(fm.headerText || "");

        setShowsBadgeText(fm.showsBadgeText || "Broadcasts");
        setShowsTitle(fm.showsTitle || "TV Shows & Directing");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchTvShows();
  }, []);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const frontmatter = {
        title: "TV Shows & Directing",
        headerText,
        shows,
        showsBadgeText,
        showsTitle,
      };

      const res = await fetch("/api/pages/tv-shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frontmatter,
          content: "",
        }),
      });

      if (!res.ok) throw new Error("Save request failed");

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (error) {
      console.error(error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  const handleAddShow = () => {
    setShows((prev) => [...prev, { title: "New Talk Show / Broadcast", youtubeId: "", description: "" }]);
  };

  const handleRemoveShow = (index: number) => {
    setShows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleShowChange = (index: number, field: keyof TvShowItem, value: string) => {
    setShows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-gold-accent animate-spin" />
        <span className="ml-3 text-sm text-white/60">Loading tv shows configurations...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit TV Shows & Broadcasts</h1>
          <p className="text-sm text-white/50 mt-1">Manage YouTube videos, talk shows, and media productions.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
            saveStatus === "saving"
              ? "bg-white/10 text-white/55 cursor-not-allowed"
              : saveStatus === "success"
              ? "bg-emerald-600 text-white"
              : saveStatus === "error"
              ? "bg-red-600 text-white"
              : "bg-gold-accent hover:bg-gold-hover text-black"
          }`}
        >
          {saveStatus === "saving" ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-white animate-spin" />
              Saving...
            </>
          ) : saveStatus === "success" ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved!
            </>
          ) : saveStatus === "error" ? (
            <>
              <AlertCircle className="h-3.5 w-3.5" />
              Failed
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Header settings */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">Page Header Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Shows Badge</label>
                <input
                  type="text"
                  value={showsBadgeText}
                  onChange={(e) => setShowsBadgeText(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Broadcasts"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Shows Title</label>
                <input
                  type="text"
                  value={showsTitle}
                  onChange={(e) => setShowsTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. TV Shows & Directing"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Header Description Text</label>
              <textarea
                rows={2}
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-normal"
              />
            </div>
          </div>

          {/* Videos Grid */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Broadcast Videos</h3>
              <button
                onClick={handleAddShow}
                className="text-[10px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Show Card
              </button>
            </div>

            <div className="flex flex-col gap-6 mt-2">
              {shows.map((show, index) => (
                <div key={index} className="p-5 rounded-lg border border-white/5 bg-white/5 flex flex-col gap-4 relative">
                  <button
                    onClick={() => handleRemoveShow(index)}
                    className="absolute top-4 right-4 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">Broadcast Title</label>
                      <input
                        type="text"
                        value={show.title}
                        onChange={(e) => handleShowChange(index, "title", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">YouTube Video ID (11 chars, e.g. dQw4w9WgXcQ)</label>
                      <input
                        type="text"
                        value={show.youtubeId}
                        onChange={(e) => handleShowChange(index, "youtubeId", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none font-mono"
                        placeholder="YouTube ID..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-white/40 font-bold uppercase">Brief Video Description</label>
                    <textarea
                      rows={2}
                      value={show.description}
                      onChange={(e) => handleShowChange(index, "description", e.target.value)}
                      className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none resize-none leading-normal"
                    />
                  </div>

                  {show.youtubeId && (
                    <div className="aspect-video w-full max-w-[280px] bg-black border border-white/10 rounded overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${show.youtubeId}`}
                        title="Preview"
                        className="w-full h-full border-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

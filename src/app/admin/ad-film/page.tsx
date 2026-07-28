"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Clapperboard } from "lucide-react";
import SEOControl from "@/components/SEOControl";

interface AdFilmItem {
  title: string;
  youtubeId: string;
  description: string;
}

export default function AdminAdFilmPageEditor() {
  const [films, setFilms] = useState<AdFilmItem[]>([]);
  const [headerText, setHeaderText] = useState("");

  // Section header states
  const [filmsBadgeText, setFilmsBadgeText] = useState("");
  const [filmsTitle, setFilmsTitle] = useState("");

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("");

  useEffect(() => {
    async function fetchAdFilms() {
      try {
        const res = await fetch("/api/pages/ad-film");
        if (!res.ok) throw new Error("Failed to fetch AD Film page data");
        const data = await res.json();

        const fm = data.frontmatter || {};
        setFilms(fm.films || []);
        setHeaderText(fm.headerText || "");
        setFilmsBadgeText(fm.filmsBadgeText || "AD Films");
        setFilmsTitle(fm.filmsTitle || "AD Films & Productions");
        setSeoTitle(fm.seoTitle || "");
        setSeoDescription(fm.seoDescription || "");
        setSeoKeywords(fm.seoKeywords || "");
        setSeoOgImage(fm.seoOgImage || "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdFilms();
  }, []);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const frontmatter = {
        title: "AD Films & Productions",
        headerText,
        films,
        filmsBadgeText,
        filmsTitle,
        seoTitle,
        seoDescription,
        seoKeywords,
        seoOgImage,
      };

      const res = await fetch("/api/pages/ad-film", {
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

  const handleAddFilm = () => {
    setFilms((prev) => [...prev, { title: "New AD Film", youtubeId: "", description: "" }]);
  };

  const handleRemoveFilm = (index: number) => {
    setFilms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFilmChange = (index: number, field: keyof AdFilmItem, value: string) => {
    setFilms((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-gold-accent animate-spin" />
        <span className="ml-3 text-sm text-white/60">Loading AD Film configurations...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit AD Films & Productions</h1>
          <p className="text-sm text-white/50 mt-1">Manage YouTube videos and advertisement film productions.</p>
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
                <label className="text-[10px] text-white/40 font-bold uppercase">Films Badge</label>
                <input
                  type="text"
                  value={filmsBadgeText}
                  onChange={(e) => setFilmsBadgeText(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. AD Films"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Films Title</label>
                <input
                  type="text"
                  value={filmsTitle}
                  onChange={(e) => setFilmsTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. AD Films & Productions"
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
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">AD Film Videos</h3>
              <button
                onClick={handleAddFilm}
                className="text-[10px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Film Card
              </button>
            </div>

            <div className="flex flex-col gap-6 mt-2">
              {films.map((film, index) => (
                <div key={index} className="p-5 rounded-lg border border-white/5 bg-white/5 flex flex-col gap-4 relative">
                  <button
                    onClick={() => handleRemoveFilm(index)}
                    className="absolute top-4 right-4 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">AD Film Title</label>
                      <input
                        type="text"
                        value={film.title}
                        onChange={(e) => handleFilmChange(index, "title", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">YouTube Video ID (11 chars, e.g. dQw4w9WgXcQ)</label>
                      <input
                        type="text"
                        value={film.youtubeId}
                        onChange={(e) => handleFilmChange(index, "youtubeId", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none font-mono"
                        placeholder="YouTube ID..."
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-white/40 font-bold uppercase">Brief Film Description</label>
                    <textarea
                      rows={2}
                      value={film.description}
                      onChange={(e) => handleFilmChange(index, "description", e.target.value)}
                      className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none resize-none leading-normal"
                    />
                  </div>

                  {film.youtubeId && (
                    <div className="aspect-video w-full max-w-[280px] bg-black border border-white/10 rounded overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${film.youtubeId}`}
                        title="Preview"
                        className="w-full h-full border-none"
                      />
                    </div>
                  )}
                </div>
              ))}

              {films.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-white/20">
                  <Clapperboard className="h-8 w-8" />
                  <p className="text-xs">No AD film cards yet. Click &quot;Add Film Card&quot; to begin.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - SEO configuration */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <SEOControl
            seoTitle={seoTitle}
            setSeoTitle={setSeoTitle}
            seoDescription={seoDescription}
            setSeoDescription={setSeoDescription}
            seoKeywords={seoKeywords}
            setSeoKeywords={setSeoKeywords}
            seoOgImage={seoOgImage}
            setSeoOgImage={setSeoOgImage}
          />
        </div>
      </div>
    </div>
  );
}

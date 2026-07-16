"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface PillarItem {
  title: string;
  description: string;
  icon: string;
}

export default function AdminAboutPageEditor() {
  const [introTitle, setIntroTitle] = useState("");
  const [introText, setIntroText] = useState("");
  const [introSubtext, setIntroSubtext] = useState("");
  
  const [aboutBadgeText, setAboutBadgeText] = useState("");
  const [bannerPrimaryText, setBannerPrimaryText] = useState("");
  const [bannerSecondaryText, setBannerSecondaryText] = useState("");
  const [pillarsSectionTitle, setPillarsSectionTitle] = useState("");

  const [pillars, setPillars] = useState<PillarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const res = await fetch("/api/pages/about");
        if (!res.ok) throw new Error("Failed to fetch about page data");
        const data = await res.json();
        
        const fm = data.frontmatter || {};
        setIntroTitle(fm.introTitle || "Ferywala Communications");
        setIntroText(fm.introText || "");
        setIntroSubtext(fm.introSubtext || "");
        
        setAboutBadgeText(fm.aboutBadgeText || "The Banner");
        setBannerPrimaryText(fm.bannerPrimaryText || "Ferywala");
        setBannerSecondaryText(fm.bannerSecondaryText || "Communications");
        setPillarsSectionTitle(fm.pillarsSectionTitle || "Core Operations");

        setPillars(fm.pillars || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAboutData();
  }, []);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const frontmatter = {
        title: "About Us",
        introTitle,
        introText,
        introSubtext,
        aboutBadgeText,
        bannerPrimaryText,
        bannerSecondaryText,
        pillarsSectionTitle,
        pillars,
      };

      const res = await fetch("/api/pages/about", {
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

  const handleAddPillar = () => {
    setPillars((prev) => [...prev, { title: "New Pillar", description: "", icon: "Shield" }]);
  };

  const handleRemovePillar = (index: number) => {
    setPillars((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePillarChange = (index: number, field: keyof PillarItem, value: string) => {
    setPillars((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-gold-accent animate-spin" />
        <span className="ml-3 text-sm text-white/60">Loading about configuration...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit About Banner</h1>
          <p className="text-sm text-white/50 mt-1">Manage about us introductions, core pillars, and logo layouts.</p>
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
          {/* Section Headers configuration */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">Page Header Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">About Page Badge</label>
                <input
                  type="text"
                  value={aboutBadgeText}
                  onChange={(e) => setAboutBadgeText(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. The Banner"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Introduction Title</label>
                <input
                  type="text"
                  value={introTitle}
                  onChange={(e) => setIntroTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Ferywala Communications"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Main Intro Text</label>
              <textarea
                rows={4}
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-normal"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Subtext paragraph</label>
              <textarea
                rows={3}
                value={introSubtext}
                onChange={(e) => setIntroSubtext(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-normal"
              />
            </div>
          </div>

          {/* Pillars Array */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Core Operation Pillars</h3>
              <button
                onClick={handleAddPillar}
                className="text-[10px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Pillar
              </button>
            </div>

            <div className="flex flex-col gap-1.5 mb-2">
              <label className="text-[10px] text-white/40 font-bold uppercase">Pillars Section Title</label>
              <input
                type="text"
                value={pillarsSectionTitle}
                onChange={(e) => setPillarsSectionTitle(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                placeholder="e.g. Core Operations"
              />
            </div>

            <div className="flex flex-col gap-4 mt-2">
              {pillars.map((pillar, index) => (
                <div key={index} className="p-4 rounded border border-white/5 bg-white/5 relative flex flex-col gap-3">
                  <button
                    onClick={() => handleRemovePillar(index)}
                    className="absolute top-2 right-2 text-red-500 hover:bg-red-500/10 p-1 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-bold uppercase">Pillar Title</label>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => handlePillarChange(index, "title", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-bold uppercase">Icon component</label>
                      <select
                        value={pillar.icon}
                        onChange={(e) => handlePillarChange(index, "icon", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                      >
                        <option value="Sparkles">Sparkles</option>
                        <option value="Shield">Shield</option>
                        <option value="Compass">Compass</option>
                        <option value="Film">Film</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] text-white/40 font-bold uppercase">Pillar Description</label>
                    <textarea
                      rows={2}
                      value={pillar.description}
                      onChange={(e) => handlePillarChange(index, "description", e.target.value)}
                      className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none resize-none leading-normal"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Logo details */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-2 border-b border-white/5">Logo Brand Display</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Primary brand word</label>
              <input
                type="text"
                value={bannerPrimaryText}
                onChange={(e) => setBannerPrimaryText(e.target.value)}
                className="px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                placeholder="e.g. Ferywala"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Secondary brand word</label>
              <input
                type="text"
                value={bannerSecondaryText}
                onChange={(e) => setBannerSecondaryText(e.target.value)}
                className="px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                placeholder="e.g. Communications"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

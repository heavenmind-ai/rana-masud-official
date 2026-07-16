"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface IntlFestival {
  name: string;
  country: string;
}

interface NatFestival {
  name: string;
  city: string;
}

export default function AdminFestivalsPageEditor() {
  const [intlFestivals, setIntlFestivals] = useState<IntlFestival[]>([]);
  const [natFestivals, setNatFestivals] = useState<NatFestival[]>([]);
  const [headerText, setHeaderText] = useState("");

  // New section header states
  const [festivalsBadgeText, setFestivalsBadgeText] = useState("");
  const [festivalsTitle, setFestivalsTitle] = useState("");
  const [intlSectionTitle, setIntlSectionTitle] = useState("");
  const [natSectionTitle, setNatSectionTitle] = useState("");

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    async function fetchFestivals() {
      try {
        const res = await fetch("/api/pages/film-festivals");
        if (!res.ok) throw new Error("Failed to fetch festivals page data");
        const data = await res.json();
        
        const fm = data.frontmatter || {};
        setIntlFestivals(fm.internationalFestivals || []);
        setNatFestivals(fm.nationalFestivals || []);
        setHeaderText(fm.headerText || "");

        setFestivalsBadgeText(fm.festivalsBadgeText || "Screenings");
        setFestivalsTitle(fm.festivalsTitle || "Film Festivals");
        setIntlSectionTitle(fm.intlSectionTitle || "International Festivals");
        setNatSectionTitle(fm.natSectionTitle || "National Festivals");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchFestivals();
  }, []);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const frontmatter = {
        title: "Film Screenings & Festivals",
        headerText,
        internationalFestivals: intlFestivals,
        nationalFestivals: natFestivals,
        festivalsBadgeText,
        festivalsTitle,
        intlSectionTitle,
        natSectionTitle,
      };

      const res = await fetch("/api/pages/film-festivals", {
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

  // Intl handlers
  const handleAddIntl = () => {
    setIntlFestivals((prev) => [...prev, { name: "New International Festival", country: "United States" }]);
  };

  const handleRemoveIntl = (index: number) => {
    setIntlFestivals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIntlChange = (index: number, field: keyof IntlFestival, value: string) => {
    setIntlFestivals((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Nat handlers
  const handleAddNat = () => {
    setNatFestivals((prev) => [...prev, { name: "New National Festival", city: "Dhaka" }]);
  };

  const handleRemoveNat = (index: number) => {
    setNatFestivals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNatChange = (index: number, field: keyof NatFestival, value: string) => {
    setNatFestivals((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-gold-accent animate-spin" />
        <span className="ml-3 text-sm text-white/60">Loading festivals configurations...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Film Festivals</h1>
          <p className="text-sm text-white/50 mt-1">Manage listings of national and international screenings.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
            saveStatus === "saving"
              ? "bg-white/10 text-white/50 cursor-not-allowed"
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
                <label className="text-[10px] text-white/40 font-bold uppercase">Festivals Badge</label>
                <input
                  type="text"
                  value={festivalsBadgeText}
                  onChange={(e) => setFestivalsBadgeText(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Screenings"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Festivals Title</label>
                <input
                  type="text"
                  value={festivalsTitle}
                  onChange={(e) => setFestivalsTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Film Festivals"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Header Description Text</label>
              <textarea
                rows={2}
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none"
              />
            </div>
          </div>

          {/* International table */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                International Screenings
              </h3>
              <button
                onClick={handleAddIntl}
                className="text-[10px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Row
              </button>
            </div>

            <div className="flex flex-col gap-1.5 mb-2">
              <label className="text-[10px] text-white/40 font-bold uppercase">International Section Title</label>
              <input
                type="text"
                value={intlSectionTitle}
                onChange={(e) => setIntlSectionTitle(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                placeholder="e.g. International Festivals"
              />
            </div>

            <div className="flex flex-col gap-3 mt-2">
              {intlFestivals.map((fest, index) => (
                <div key={index} className="flex gap-4 items-center bg-white/5 p-3 rounded border border-white/5 relative">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-bold uppercase">Festival / Forum Name</label>
                      <input
                        type="text"
                        value={fest.name}
                        onChange={(e) => handleIntlChange(index, "name", e.target.value)}
                        className="px-2 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-bold uppercase">Country (e.g. Morocco)</label>
                      <input
                        type="text"
                        value={fest.country}
                        onChange={(e) => handleIntlChange(index, "country", e.target.value)}
                        className="px-2 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveIntl(index)}
                    className="text-red-500 hover:text-red-400 p-1.5 cursor-pointer shrink-0 mt-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* National table */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                National Screenings
              </h3>
              <button
                onClick={handleAddNat}
                className="text-[10px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Row
              </button>
            </div>

            <div className="flex flex-col gap-1.5 mb-2">
              <label className="text-[10px] text-white/40 font-bold uppercase">National Section Title</label>
              <input
                type="text"
                value={natSectionTitle}
                onChange={(e) => setNatSectionTitle(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                placeholder="e.g. National Festivals"
              />
            </div>

            <div className="flex flex-col gap-3 mt-2">
              {natFestivals.map((fest, index) => (
                <div key={index} className="flex gap-4 items-center bg-white/5 p-3 rounded border border-white/5 relative">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-bold uppercase">Festival / Forum Name</label>
                      <input
                        type="text"
                        value={fest.name}
                        onChange={(e) => handleNatChange(index, "name", e.target.value)}
                        className="px-2 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-bold uppercase">City Location (e.g. Dhaka)</label>
                      <input
                        type="text"
                        value={fest.city}
                        onChange={(e) => handleNatChange(index, "city", e.target.value)}
                        className="px-2 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveNat(index)}
                    className="text-red-500 hover:text-red-400 p-1.5 cursor-pointer shrink-0 mt-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

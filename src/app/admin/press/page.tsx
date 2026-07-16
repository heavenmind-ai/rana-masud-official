"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";

interface PressItem {
  title: string;
  outlet: string;
  date: string;
  link: string;
  image: string;
}

export default function AdminPressPageEditor() {
  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [headerText, setHeaderText] = useState("");

  // New section header states
  const [pressBadgeText, setPressBadgeText] = useState("");
  const [pressTitle, setPressTitle] = useState("");

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [uploadingItemIdx, setUploadingItemIdx] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPress() {
      try {
        const res = await fetch("/api/pages/press");
        if (!res.ok) throw new Error("Failed to fetch press page data");
        const data = await res.json();
        
        const fm = data.frontmatter || {};
        setPressItems(fm.pressItems || []);
        setHeaderText(fm.headerText || "");

        setPressBadgeText(fm.pressBadgeText || "Media Presence");
        setPressTitle(fm.pressTitle || "Press & Media");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPress();
  }, []);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingItemIdx(index);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      
      setPressItems((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], image: url };
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert("Image upload failed.");
    } finally {
      setUploadingItemIdx(null);
    }
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const frontmatter = {
        title: "Press Releases & Clippings",
        headerText,
        pressItems,
        pressBadgeText,
        pressTitle,
      };

      const res = await fetch("/api/pages/press", {
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

  const handleAddItem = () => {
    setPressItems((prev) => [
      ...prev,
      { title: "New Article Title", outlet: "Newspaper Name", date: "July 2026", link: "", image: "" },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setPressItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof PressItem, value: string) => {
    setPressItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-gold-accent animate-spin" />
        <span className="ml-3 text-sm text-white/60">Loading press configurations...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Press Coverage</h1>
          <p className="text-sm text-white/50 mt-1">Manage news clipping references, newspaper headlines, and online links.</p>
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
                <label className="text-[10px] text-white/40 font-bold uppercase">Press Badge</label>
                <input
                  type="text"
                  value={pressBadgeText}
                  onChange={(e) => setPressBadgeText(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Media Presence"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Press Title</label>
                <input
                  type="text"
                  value={pressTitle}
                  onChange={(e) => setPressTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Press & Media"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Header Description Text</label>
              <textarea
                rows={2}
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none animate-none"
              />
            </div>
          </div>

          {/* Press clippings array */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Press Coverage Items</h3>
              <button
                onClick={handleAddItem}
                className="text-[10px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Press card
              </button>
            </div>

            <div className="flex flex-col gap-6 mt-2">
              {pressItems.map((item, index) => (
                <div key={index} className="p-5 rounded-lg border border-white/5 bg-white/5 flex flex-col gap-4 relative">
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="absolute top-4 right-4 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">News Outlet Name</label>
                      <input
                        type="text"
                        value={item.outlet}
                        onChange={(e) => handleItemChange(index, "outlet", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">Publication Date</label>
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) => handleItemChange(index, "date", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">External URL Link</label>
                      <input
                        type="text"
                        value={item.link}
                        onChange={(e) => handleItemChange(index, "link", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-white/40 font-bold uppercase">Article Headline Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleItemChange(index, "title", e.target.value)}
                      className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] text-white/40 font-bold uppercase">Clipping / Feature Cover Image</label>
                    <div className="flex gap-2 items-center">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 hover:border-gold-accent/20 bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white cursor-pointer transition-colors shrink-0">
                        <ImageIcon className="h-4 w-4 text-gold-accent" />
                        {uploadingItemIdx === index ? "Uploading..." : "Upload Clipping"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadImage(e, index)}
                          className="hidden"
                          disabled={uploadingItemIdx !== null}
                        />
                      </label>
                      <input
                        type="text"
                        value={item.image}
                        readOnly
                        className="flex-1 px-2.5 py-1.5 rounded bg-black/50 border border-white/5 text-white/30 text-xs font-mono select-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

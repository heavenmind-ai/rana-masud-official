"use client";

import React, { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Trash2, Plus, CheckCircle2, AlertCircle } from "lucide-react";

interface GalleryItem {
  src: string;
  category: string;
  title: string;
}

export default function AdminGalleryManager() {
  const [headerText, setHeaderText] = useState("");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  // New section header states
  const [galleryBadgeText, setGalleryBadgeText] = useState("");
  const [galleryTitle, setGalleryTitle] = useState("");

  // New Image Form state
  const [newImgSrc, setNewImgSrc] = useState("");
  const [newImgTitle, setNewImgTitle] = useState("");
  const [newImgCategory, setNewImgCategory] = useState("shooting");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/pages/gallery");
        if (!res.ok) throw new Error("Failed to fetch gallery");
        const data = await res.json();
        
        const fm = data.frontmatter || {};
        setHeaderText(fm.headerText || "");
        setGalleryItems(fm.galleryItems || []);
        setGalleryBadgeText(fm.galleryBadgeText || "Visuals");
        setGalleryTitle(fm.galleryTitle || "Photo Gallery");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setNewImgSrc(url);
    } catch (err) {
      console.error(err);
      alert("Image upload failed. Please check R2 configurations.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageToGallery = () => {
    if (!newImgSrc) {
      alert("Please upload an image first.");
      return;
    }
    const item: GalleryItem = {
      src: newImgSrc,
      title: newImgTitle.trim() || "Untitled Photo",
      category: newImgCategory,
    };
    
    const updatedItems = [item, ...galleryItems];
    setGalleryItems(updatedItems);
    
    // Auto-save changes immediately when items are added
    handleSave(updatedItems);

    // Clear form state
    setNewImgSrc("");
    setNewImgTitle("");
  };

  const handleRemoveImage = (index: number) => {
    const updatedItems = galleryItems.filter((_, i) => i !== index);
    setGalleryItems(updatedItems);
    // Auto-save when item is deleted
    handleSave(updatedItems);
  };

  const handleSave = async (itemsToSave = galleryItems) => {
    setSaveStatus("saving");
    try {
      const frontmatter = {
        title: "Gallery",
        headerText,
        galleryItems: itemsToSave,
        galleryBadgeText,
        galleryTitle,
      };

      const res = await fetch("/api/pages/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frontmatter,
          content: "", // stored in frontmatter
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-gold-accent animate-spin" />
        <span className="ml-3 text-sm text-white/60">Loading gallery configurations...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="h-7 w-7 text-gold-accent" />
            Gallery Manager
          </h1>
          <p className="text-sm text-white/50 mt-1">Upload files to Cloudflare R2, categorize them, and manage your public photo gallery.</p>
        </div>

        <button
          onClick={() => handleSave()}
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
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Header text settings */}
      <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">Page Header Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/40 font-bold uppercase">Gallery Badge</label>
            <input
              type="text"
              value={galleryBadgeText}
              onChange={(e) => setGalleryBadgeText(e.target.value)}
              className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              placeholder="e.g. Moments"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/40 font-bold uppercase">Gallery Title</label>
            <input
              type="text"
              value={galleryTitle}
              onChange={(e) => setGalleryTitle(e.target.value)}
              className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              placeholder="e.g. Photo Gallery"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 font-bold uppercase font-sans">Page Description Snippet</label>
          <textarea
            rows={2}
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
            className="px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Header and Add Image form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Add photo card */}
        <div className="lg:col-span-7 glass-card p-6 border border-white/10 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">Upload New Photo</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-white/40 font-bold uppercase">Photo Title</label>
              <input
                type="text"
                value={newImgTitle}
                onChange={(e) => setNewImgTitle(e.target.value)}
                className="px-3 py-2 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                placeholder="e.g. Shooting scene on location"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-white/40 font-bold uppercase">Category Category</label>
              <select
                value={newImgCategory}
                onChange={(e) => setNewImgCategory(e.target.value)}
                className="px-3 py-2 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
              >
                <option value="shooting">On Set / Shooting</option>
                <option value="awards">Awards & Festivals</option>
                <option value="seminar">Seminars & Classroom</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] text-white/40 font-bold uppercase">Select & Upload File</label>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-1.5 px-3 py-2 rounded border border-white/10 hover:border-gold-accent/20 bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white cursor-pointer transition-colors shrink-0">
                <ImageIcon className="h-4 w-4 text-gold-accent" />
                {uploadingImage ? "Uploading..." : "Select File"}
                <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" disabled={uploadingImage} />
              </label>
              <input
                type="text"
                value={newImgSrc}
                readOnly
                placeholder="Uploaded R2 image URL will show here..."
                className="flex-1 px-3 py-2 rounded bg-black/50 border border-white/5 text-white/40 text-xs font-mono outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleAddImageToGallery}
            className="w-full py-2.5 rounded bg-gold-accent hover:bg-gold-hover text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Image to Gallery
          </button>
        </div>

        {/* Preview image pane */}
        <div className="lg:col-span-5 glass-card p-6 border border-white/10 flex flex-col justify-center items-center gap-4 min-h-[220px]">
          {newImgSrc ? (
            <div className="w-full p-2 bg-black/40 rounded border border-white/5 flex flex-col gap-2">
              <span className="text-[9px] text-white/40 font-bold uppercase block">New Upload Preview</span>
              <img src={newImgSrc} alt="Preview" className="w-full aspect-video object-cover rounded border border-white/10" />
            </div>
          ) : (
            <div className="text-white/20 text-xs flex flex-col items-center gap-2">
              <ImageIcon className="h-10 w-10 text-white/10" />
              <span>Upload image to view preview</span>
            </div>
          )}
        </div>
      </div>

      {/* Gallery photos list grid */}
      <div className="glass-card p-6 border border-white/10">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-2 border-b border-white/5 mb-6">Gallery Images ({galleryItems.length})</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg border border-white/5 bg-white/5 flex flex-col gap-3 group relative">
              <button
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded cursor-pointer transition-colors shadow-lg"
                title="Delete Photo"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <img src={item.src} alt={item.title} className="w-full aspect-square object-cover rounded bg-black border border-white/10" />
              
              <div className="flex flex-col gap-1 text-left">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold-accent/10 border border-gold-accent/20 text-gold-accent w-fit uppercase font-semibold">
                  {item.category}
                </span>
                <h4 className="text-xs font-bold text-white truncate" title={item.title}>
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import SEOControl from "@/components/SEOControl";

interface NotableFilm {
  title: string;
  description: string;
  image: string;
  imdb: string;
}

interface ServiceCard {
  title: string;
  description: string;
  icon: string;
}

export default function AdminHomePageEditor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frontmatter, setFrontmatter] = useState<any>({
    title: "",
    description: "",
    notableFilms: [],
    services: [],
  });
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("");

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const res = await fetch("/api/pages/home");
        if (!res.ok) throw new Error("Failed to fetch home page data");
        const data = await res.json();
        
        setTitle(data.title || "");
        setDescription(data.description || "");
        setFrontmatter(data.frontmatter || { notableFilms: [], services: [] });
        setContent(data.content || "");
        
        const fm = data.frontmatter || {};
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
    fetchHomeData();
  }, []);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldKey + (index !== undefined ? `-${index}` : ""));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();

      if (index !== undefined) {
        setFrontmatter((prev: any) => {
          const updatedFilms = [...prev.notableFilms];
          updatedFilms[index] = { ...updatedFilms[index], image: url };
          return { ...prev, notableFilms: updatedFilms };
        });
      } else {
        setFrontmatter((prev: any) => ({
          ...prev,
          [fieldKey]: url,
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Image upload failed.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleAddSliderImage = () => {
    setFrontmatter((prev: any) => ({
      ...prev,
      heroSliderImages: [...(prev.heroSliderImages || []), ""],
    }));
  };

  const handleRemoveSliderImage = (index: number) => {
    setFrontmatter((prev: any) => ({
      ...prev,
      heroSliderImages: prev.heroSliderImages.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSliderImageChange = (index: number, value: string) => {
    setFrontmatter((prev: any) => {
      const updated = [...(prev.heroSliderImages || [])];
      updated[index] = value;
      return { ...prev, heroSliderImages: updated };
    });
  };

  const handleUploadSliderImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(`slider-${index}`);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();

      handleSliderImageChange(index, url);
    } catch (err) {
      console.error(err);
      alert("Slider image upload failed.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const updatedFrontmatter = {
        ...frontmatter,
        title,
        description,
        seoTitle,
        seoDescription,
        seoKeywords,
        seoOgImage,
      };

      const res = await fetch("/api/pages/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frontmatter: updatedFrontmatter,
          content,
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
    setFrontmatter((prev: any) => ({
      ...prev,
      notableFilms: [
        ...(prev.notableFilms || []),
        { title: "New Film", description: "", image: "", imdb: "" },
      ],
    }));
  };

  const handleRemoveFilm = (index: number) => {
    setFrontmatter((prev: any) => ({
      ...prev,
      notableFilms: prev.notableFilms.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleFilmChange = (index: number, field: keyof NotableFilm, value: string) => {
    setFrontmatter((prev: any) => {
      const updatedFilms = [...prev.notableFilms];
      updatedFilms[index] = { ...updatedFilms[index], [field]: value };
      return { ...prev, notableFilms: updatedFilms };
    });
  };

  const handleAddService = () => {
    setFrontmatter((prev: any) => ({
      ...prev,
      services: [
        ...(prev.services || []),
        { title: "New Service", description: "", icon: "Film" },
      ],
    }));
  };

  const handleRemoveService = (index: number) => {
    setFrontmatter((prev: any) => ({
      ...prev,
      services: prev.services.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleServiceChange = (index: number, field: keyof ServiceCard, value: string) => {
    setFrontmatter((prev: any) => {
      const updatedServices = [...prev.services];
      updatedServices[index] = { ...updatedServices[index], [field]: value };
      return { ...prev, services: updatedServices };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-gold-accent animate-spin" />
        <span className="ml-3 text-sm text-white/60">Loading home page configurations...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Home Page</h1>
          <p className="text-sm text-white/50 mt-1">Manage text fields, badge titles, profiles, and services.</p>
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
        {/* Main form */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* SEO & Meta */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">SEO Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Page Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">SEO Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
            </div>
          </div>

          {/* Hero Banner Section */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Hero Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Hero Badge text</label>
                <input
                  type="text"
                  value={frontmatter.heroBadgeText || ""}
                  onChange={(e) => setFrontmatter({ ...frontmatter, heroBadgeText: e.target.value })}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Award Winning Filmmaker"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Hero Primary Title</label>
                <input
                  type="text"
                  value={frontmatter.heroTitlePrimary || ""}
                  onChange={(e) => setFrontmatter({ ...frontmatter, heroTitlePrimary: e.target.value })}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Crafting Stories"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Hero Accent Title</label>
                <input
                  type="text"
                  value={frontmatter.heroTitleAccent || ""}
                  onChange={(e) => setFrontmatter({ ...frontmatter, heroTitleAccent: e.target.value })}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Through compelling Visuals"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Hero Description Text</label>
                <textarea
                  rows={2}
                  value={frontmatter.heroDescription || ""}
                  onChange={(e) => setFrontmatter({ ...frontmatter, heroDescription: e.target.value })}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none"
                  placeholder="Pioneer filmmaker description..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">CTA Left Button Text</label>
                <input
                  type="text"
                  value={frontmatter.heroCtaLeftText || ""}
                  onChange={(e) => setFrontmatter({ ...frontmatter, heroCtaLeftText: e.target.value })}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Explore Filmography"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">CTA Right Button Text</label>
                <input
                  type="text"
                  value={frontmatter.heroCtaRightText || ""}
                  onChange={(e) => setFrontmatter({ ...frontmatter, heroCtaRightText: e.target.value })}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Read Biography"
                />
              </div>
            </div>
          </div>

          {/* Creative Services settings */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Services Section Headers</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Services Section Badge</label>
                <input
                  type="text"
                  value={frontmatter.servicesSectionBadge || ""}
                  onChange={(e) => setFrontmatter({ ...frontmatter, servicesSectionBadge: e.target.value })}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Expertise"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Services Section Title</label>
                <input
                  type="text"
                  value={frontmatter.servicesSectionTitle || ""}
                  onChange={(e) => setFrontmatter({ ...frontmatter, servicesSectionTitle: e.target.value })}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Creative Services"
                />
              </div>
            </div>

            {/* List of Services */}
            <div className="flex justify-between items-center pb-2 border-b border-white/5 mt-4">
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Services Cards List</h4>
              <button
                onClick={handleAddService}
                className="text-[9px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2 py-1 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Service Card
              </button>
            </div>
            
            <div className="flex flex-col gap-4 mt-2">
              {frontmatter.services?.map((service: ServiceCard, index: number) => (
                <div key={index} className="p-4 rounded border border-white/5 bg-white/5 relative flex flex-col gap-3">
                  <button
                    onClick={() => handleRemoveService(index)}
                    className="absolute top-2 right-2 text-red-500 hover:bg-red-500/10 p-1 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-bold uppercase">Service Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => handleServiceChange(index, "title", e.target.value)}
                        className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-bold uppercase">Icon Selector</label>
                      <select
                        value={service.icon}
                        onChange={(e) => handleServiceChange(index, "icon", e.target.value)}
                        className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                      >
                        <option value="Film">Film Reel (Film)</option>
                        <option value="BookOpen">Academic Book (BookOpen)</option>
                        <option value="Tv">TV Display (Tv)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] text-white/40 font-bold uppercase">Service Description</label>
                    <textarea
                      rows={2}
                      value={service.description}
                      onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                      className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-normal"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notable Films Manager */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Notable Films Headers</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Notable Section Badge</label>
                <input
                  type="text"
                  value={frontmatter.notableFilmsSectionBadge || ""}
                  onChange={(e) => setFrontmatter({ ...frontmatter, notableFilmsSectionBadge: e.target.value })}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Notable Section Title</label>
                <input
                  type="text"
                  value={frontmatter.notableFilmsSectionTitle || ""}
                  onChange={(e) => setFrontmatter({ ...frontmatter, notableFilmsSectionTitle: e.target.value })}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-white/5 mt-4">
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Notable Films Cards</h4>
              <button
                onClick={handleAddFilm}
                className="text-[9px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Film Card
              </button>
            </div>

            <div className="flex flex-col gap-6 mt-2">
              {frontmatter.notableFilms?.map((film: NotableFilm, index: number) => (
                <div key={index} className="p-5 rounded-lg border border-white/5 bg-white/5 flex flex-col gap-4 relative">
                  <button
                    onClick={() => handleRemoveFilm(index)}
                    className="absolute top-4 right-4 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">Film Title</label>
                      <input
                        type="text"
                        value={film.title}
                        onChange={(e) => handleFilmChange(index, "title", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">IMDb URL Link</label>
                      <input
                        type="text"
                        value={film.imdb}
                        onChange={(e) => handleFilmChange(index, "imdb", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-white/40 font-bold uppercase">Description</label>
                    <textarea
                      rows={2}
                      value={film.description}
                      onChange={(e) => handleFilmChange(index, "description", e.target.value)}
                      className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] text-white/40 font-bold uppercase">Poster Image (Cloudflare R2)</label>
                    <div className="flex gap-4 items-center">
                      <label className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 hover:border-gold-accent/20 bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white cursor-pointer transition-colors shrink-0">
                        <ImageIcon className="h-4 w-4 text-gold-accent" />
                        {uploadingField === `notableFilms-${index}` ? "Uploading..." : "Upload Poster"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadImage(e, "notableFilms", index)}
                          className="hidden"
                          disabled={uploadingField !== null}
                        />
                      </label>
                      <input
                        type="text"
                        value={film.image}
                        readOnly
                        className="flex-1 px-2.5 py-1 rounded bg-black/50 border border-white/5 text-white/40 text-xs font-mono select-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - sidebar uploads */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Profile Details */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-2 border-b border-white/5">Hero Profile Card</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Profile Subtitle</label>
              <input
                type="text"
                value={frontmatter.heroProfileSubText || ""}
                onChange={(e) => setFrontmatter({ ...frontmatter, heroProfileSubText: e.target.value })}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                placeholder="e.g. FILM DIRECTING & TEACHING"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Profile Name</label>
              <input
                type="text"
                value={frontmatter.heroProfileName || ""}
                onChange={(e) => setFrontmatter({ ...frontmatter, heroProfileName: e.target.value })}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Profile Institution</label>
              <input
                type="text"
                value={frontmatter.heroProfileInstitution || ""}
                onChange={(e) => setFrontmatter({ ...frontmatter, heroProfileInstitution: e.target.value })}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              />
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <label className="text-[10px] text-white/40 font-bold uppercase">Hero Profile Portrait</label>
              {frontmatter.heroProfileImage ? (
                <img
                  src={frontmatter.heroProfileImage}
                  alt="Hero Portrait Preview"
                  className="w-full aspect-[4/5] object-cover rounded-lg border border-white/10 shadow-lg bg-black"
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-white/5 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs">
                  No image uploaded
                </div>
              )}
              
              <label className="flex items-center justify-center gap-1.5 w-full py-2 rounded bg-gold-accent/10 hover:bg-gold-accent/20 border border-gold-accent/20 text-gold-accent text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors">
                <ImageIcon className="h-4 w-4 text-gold-accent" />
                {uploadingField === "heroProfileImage" ? "Uploading..." : "Upload Profile Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadImage(e, "heroProfileImage")}
                  className="hidden"
                  disabled={uploadingField !== null}
                />
              </label>
            </div>
          </div>

          {/* Hero Background Slider Card */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Hero Background Slider</h3>
              <button
                type="button"
                onClick={handleAddSliderImage}
                className="text-[10px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2 py-1 rounded flex items-center gap-1 cursor-pointer font-bold"
              >
                <Plus className="h-3 w-3" /> Add Image
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
              {(frontmatter.heroSliderImages || []).map((imgUrl: string, idx: number) => (
                <div key={idx} className="flex flex-col gap-2 bg-white/5 p-3 rounded-lg border border-white/5 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveSliderImage(idx)}
                    className="absolute top-2 right-2 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 p-1 rounded cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <label className="text-[10px] text-white/40 font-bold uppercase">Slider Image {idx + 1}</label>
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={`Slider Preview ${idx + 1}`}
                      className="w-full aspect-[16/9] object-cover rounded border border-white/10"
                    />
                  ) : (
                    <div className="w-full aspect-[16/9] bg-black/40 rounded border border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs">
                      No image uploaded
                    </div>
                  )}

                  <label className="flex items-center justify-center gap-1.5 w-full py-1.5 mt-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors">
                    <ImageIcon className="h-3.5 w-3.5 text-white/60" />
                    <span>{uploadingField === `slider-${idx}` ? "Uploading..." : "Upload Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadSliderImage(e, idx)}
                      className="hidden"
                      disabled={uploadingField !== null}
                    />
                  </label>
                </div>
              ))}
              {(frontmatter.heroSliderImages || []).length === 0 && (
                <p className="text-xs text-white/35 italic text-center py-4">No slider images uploaded. Default cinematic background will be used.</p>
              )}
            </div>
          </div>

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

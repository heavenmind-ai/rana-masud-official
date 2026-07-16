"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";

interface ShowcaseFilm {
  title: string;
  type: string;
  role: string;
  description: string;
  image: string;
  selections: string[];
}

interface AssistantRole {
  film: string;
  director: string;
  year: string;
}

export default function AdminFilmographyPageEditor() {
  const [films, setFilms] = useState<ShowcaseFilm[]>([]);
  const [assistantRoles, setAssistantRoles] = useState<AssistantRole[]>([]);
  const [imdbUrl, setImdbUrl] = useState("");
  const [headerText, setHeaderText] = useState("");

  // New section header states
  const [worksBadgeText, setWorksBadgeText] = useState("");
  const [worksTitle, setWorksTitle] = useState("");
  const [showcaseSectionTitle, setShowcaseSectionTitle] = useState("");
  const [assistantSectionTitle, setAssistantSectionTitle] = useState("");
  const [assistantSectionDescription, setAssistantSectionDescription] = useState("");
  const [imdbButtonText, setImdbButtonText] = useState("");
  const [newSelectionInputs, setNewSelectionInputs] = useState<Record<number, string>>({});

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [uploadingFilmIdx, setUploadingFilmIdx] = useState<number | null>(null);

  useEffect(() => {
    async function fetchFilmography() {
      try {
        const res = await fetch("/api/pages/rana_masud_filmography");
        if (!res.ok) throw new Error("Failed to fetch filmography");
        const data = await res.json();
        
        const fm = data.frontmatter || {};
        setFilms(fm.films || []);
        setAssistantRoles(fm.assistantRoles || []);
        setImdbUrl(fm.imdbUrl || "");
        setHeaderText(fm.headerText || "");

        setWorksBadgeText(fm.worksBadgeText || "Works");
        setWorksTitle(fm.worksTitle || "Filmography");
        setShowcaseSectionTitle(fm.showcaseSectionTitle || "Primary Showcase");
        setAssistantSectionTitle(fm.assistantSectionTitle || "Assistant Director Credits");
        setAssistantSectionDescription(
          fm.assistantSectionDescription ||
            "Rana Masud honed his practical directing capabilities and shot composition skills under the direct mentorship of Tanvir Mokammel:"
        );
        setImdbButtonText(fm.imdbButtonText || "IMDb Profile");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchFilmography();
  }, []);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFilmIdx(index);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      
      setFilms((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], image: url };
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert("Image upload failed.");
    } finally {
      setUploadingFilmIdx(null);
    }
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const frontmatter = {
        title: "Filmography Showcase",
        headerText,
        films,
        assistantRoles,
        imdbUrl,
        worksBadgeText,
        worksTitle,
        showcaseSectionTitle,
        assistantSectionTitle,
        assistantSectionDescription,
        imdbButtonText,
      };

      const res = await fetch("/api/pages/rana_masud_filmography", {
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

  // Film Handlers
  const handleAddFilm = () => {
    setFilms((prev) => [
      ...prev,
      { title: "New Film Title", type: "Short Film", role: "Director", description: "", image: "", selections: [] },
    ]);
  };

  const handleRemoveFilm = (index: number) => {
    setFilms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFilmChange = (index: number, field: keyof ShowcaseFilm, value: any) => {
    setFilms((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Assistant Handlers
  const handleAddAssistantRole = () => {
    setAssistantRoles((prev) => [...prev, { film: "New Film", director: "Tanvir Mokammel", year: "2026" }]);
  };

  const handleRemoveAssistantRole = (index: number) => {
    setAssistantRoles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAssistantRoleChange = (index: number, field: keyof AssistantRole, value: string) => {
    setAssistantRoles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Selection Handlers (selections list of strings)
  const handleAddSelection = (filmIdx: number, selectionStr: string) => {
    if (!selectionStr.trim()) return;
    setFilms((prev) => {
      const updated = [...prev];
      const selections = [...(updated[filmIdx].selections || [])];
      selections.push(selectionStr.trim());
      updated[filmIdx] = { ...updated[filmIdx], selections };
      return updated;
    });
  };

  const handleRemoveSelection = (filmIdx: number, selectionIdx: number) => {
    setFilms((prev) => {
      const updated = [...prev];
      const selections = updated[filmIdx].selections.filter((_, i) => i !== selectionIdx);
      updated[filmIdx] = { ...updated[filmIdx], selections };
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-gold-accent animate-spin" />
        <span className="ml-3 text-sm text-white/60">Loading filmography configurations...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Filmography</h1>
          <p className="text-sm text-white/50 mt-1">Manage film posters, credentials, and assistant roles.</p>
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
          {/* Header configuration */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">Page Header Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Works Badge</label>
                <input
                  type="text"
                  value={worksBadgeText}
                  onChange={(e) => setWorksBadgeText(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Works"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Works Title</label>
                <input
                  type="text"
                  value={worksTitle}
                  onChange={(e) => setWorksTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Filmography"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Header Intro text</label>
              <textarea
                rows={2}
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none"
              />
            </div>
          </div>

          {/* Primary Showcase */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Showcase Movies Section
              </h3>
              <button
                onClick={handleAddFilm}
                className="text-[10px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Film Showcase
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Showcase Section Title</label>
                <input
                  type="text"
                  value={showcaseSectionTitle}
                  onChange={(e) => setShowcaseSectionTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Primary Showcase"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6 mt-4">
              {films.map((film, index) => {
                const selectionInput = newSelectionInputs[index] || "";
                return (
                  <div key={index} className="p-5 rounded-lg border border-white/5 bg-white/5 flex flex-col gap-4 relative">
                    <button
                      onClick={() => handleRemoveFilm(index)}
                      className="absolute top-4 right-4 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <label className="text-[9px] text-white/40 font-bold uppercase">Production Category</label>
                        <input
                          type="text"
                          value={film.type}
                          onChange={(e) => handleFilmChange(index, "type", e.target.value)}
                          className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                          placeholder="e.g. Short Film (Fiction)"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] text-white/40 font-bold uppercase">Role Title</label>
                        <input
                          type="text"
                          value={film.role}
                          onChange={(e) => handleFilmChange(index, "role", e.target.value)}
                          className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                          placeholder="e.g. Director & Writer"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">Film Description</label>
                      <textarea
                        rows={2}
                        value={film.description}
                        onChange={(e) => handleFilmChange(index, "description", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-normal"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Upload Poster */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] text-white/40 font-bold uppercase">Film Poster Image</label>
                        <div className="flex gap-2 items-center">
                          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 hover:border-gold-accent/20 bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white cursor-pointer transition-colors shrink-0">
                            <ImageIcon className="h-4 w-4 text-gold-accent" />
                            {uploadingFilmIdx === index ? "Uploading..." : "Upload Poster"}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUploadImage(e, index)}
                              className="hidden"
                              disabled={uploadingFilmIdx !== null}
                            />
                          </label>
                          <input
                            type="text"
                            value={film.image}
                            readOnly
                            className="flex-1 px-2.5 py-1.5 rounded bg-black/50 border border-white/5 text-white/30 text-xs font-mono select-all outline-none"
                          />
                        </div>
                      </div>

                      {/* Selections/Awards */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] text-white/40 font-bold uppercase">Festival Honors / Laurels</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={selectionInput}
                            placeholder="Add laurel (e.g. Best Director)..."
                            onChange={(e) => setNewSelectionInputs(prev => ({ ...prev, [index]: e.target.value }))}
                            className="flex-1 px-3 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddSelection(index, selectionInput);
                                setNewSelectionInputs(prev => ({ ...prev, [index]: "" }));
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              handleAddSelection(index, selectionInput);
                              setNewSelectionInputs(prev => ({ ...prev, [index]: "" }));
                            }}
                            className="px-3 bg-gold-accent text-black font-bold text-xs rounded hover:bg-gold-hover transition-colors cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {film.selections?.map((laurel, lIdx) => (
                            <span
                              key={lIdx}
                              className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/80 flex items-center gap-1"
                            >
                              {laurel}
                              <button
                                onClick={() => handleRemoveSelection(index, lIdx)}
                                className="text-red-500 hover:text-red-400 font-bold"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column - assistant credits & IMDb */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* IMDb Button Link */}
          <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-2 border-b border-white/5">IMDb Integration</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">IMDb Button Label</label>
              <input
                type="text"
                value={imdbButtonText}
                onChange={(e) => setImdbButtonText(e.target.value)}
                className="px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                placeholder="e.g. IMDb Profile"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">IMDb Director URL Link</label>
              <input
                type="text"
                value={imdbUrl}
                onChange={(e) => setImdbUrl(e.target.value)}
                className="px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs font-mono outline-none focus:border-gold-accent/40"
              />
            </div>
          </div>

          {/* Assistant Director Section */}
          <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Assistant Credits</h3>
              <button
                onClick={handleAddAssistantRole}
                className="text-[9px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2 py-1 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Row
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Assistant Section Title</label>
                <input
                  type="text"
                  value={assistantSectionTitle}
                  onChange={(e) => setAssistantSectionTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Assistant Director Credits"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Assistant Description</label>
                <textarea
                  rows={3}
                  value={assistantSectionDescription}
                  onChange={(e) => setAssistantSectionDescription(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-normal"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              {assistantRoles.map((role, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded border border-white/5 relative flex flex-col gap-2">
                  <button
                    onClick={() => handleRemoveAssistantRole(idx)}
                    className="absolute top-2 right-2 text-red-500/60 hover:text-red-500 p-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] text-white/40 font-bold uppercase">Film Name</label>
                    <input
                      type="text"
                      value={role.film}
                      onChange={(e) => handleAssistantRoleChange(idx, "film", e.target.value)}
                      className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-bold uppercase">Director Name</label>
                      <input
                        type="text"
                        value={role.director}
                        onChange={(e) => handleAssistantRoleChange(idx, "director", e.target.value)}
                        className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] text-white/40 font-bold uppercase">Year</label>
                      <input
                        type="text"
                        value={role.year}
                        onChange={(e) => handleAssistantRoleChange(idx, "year", e.target.value)}
                        className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none"
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

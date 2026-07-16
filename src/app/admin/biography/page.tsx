"use client";

import React, { useState, useEffect } from "react";
import SEOControl from "@/components/SEOControl";
import {
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Trophy,
  Users,
  Film,
  FileText,
  Settings,
  PlusCircle,
  Link as LinkIcon,
} from "lucide-react";

interface RoleCard {
  image: string;
  role: string;
  company: string;
}

interface AboutMe {
  badge: string;
  title: string;
  subtitle: string;
  text: string;
}

interface TimelineItem {
  role: string;
  period: string;
  company: string;
  description: string;
  icon: string;
}

interface FilmItem {
  name: string;
  designation: string;
  year: string;
  link: string;
}

export default function AdminBiographyPageEditor() {
  const [activeTab, setActiveTab] = useState<"about" | "timeline" | "awards" | "notable">("about");

  // Section 1: Role Cards & About Me
  const [headerTitle, setHeaderTitle] = useState("");
  const [headerSubtitle, setHeaderSubtitle] = useState("");

  const [roleCards, setRoleCards] = useState<RoleCard[]>([
    { image: "", role: "", company: "" },
    { image: "", role: "", company: "" },
    { image: "", role: "", company: "" },
  ]);
  const [aboutMe, setAboutMe] = useState<AboutMe>({
    badge: "",
    title: "",
    subtitle: "",
    text: "",
  });

  // Section 2: Career Timeline
  const [professionalTimeline, setProfessionalTimeline] = useState<TimelineItem[]>([]);

  // Section 3: Awards & Affiliations
  const [intlAwards, setIntlAwards] = useState<string[]>([]);
  const [newIntlAward, setNewIntlAward] = useState("");
  
  const [natAwards, setNatAwards] = useState<string[]>([]);
  const [newNatAward, setNewNatAward] = useState("");

  const [memberships, setMemberships] = useState<string[]>([]);
  const [newMembership, setNewMembership] = useState("");

  const [juryList, setJuryList] = useState<string[]>([]);
  const [newJury, setNewJury] = useState("");

  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");

  // Section 4: Notable Work & Film table
  const [nonFiction, setNonFiction] = useState("");
  
  const [socialFilms, setSocialFilms] = useState<string[]>([]);
  const [newSocialFilm, setNewSocialFilm] = useState("");

  const [adFilms, setAdFilms] = useState<string[]>([]);
  const [newAdFilm, setNewAdFilm] = useState("");

  const [films, setFilms] = useState<FilmItem[]>([]);

  // Utilities
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("");

  useEffect(() => {
    async function fetchBiography() {
      try {
        const res = await fetch("/api/pages/biography-rana_masud_film_director");
        if (!res.ok) throw new Error("Failed to fetch biography");
        const data = await res.json();
        
        const fm = data.frontmatter || {};
        
        // Parse Role Cards
        if (fm.roleCards && Array.isArray(fm.roleCards)) {
          setRoleCards(fm.roleCards);
        } else {
          setRoleCards([
            { image: fm.profileImage || "", role: "Film Director", company: "Ferywala Communications" },
            { image: "", role: "Film Producer", company: "Ferywala Communications" },
            { image: "", role: "Teacher", company: "Bangladesh Film Institute – BFI" },
          ]);
        }

        // Parse About Me
        setHeaderTitle(fm.headerTitle || "Biography");
        setHeaderSubtitle(fm.headerSubtitle || "Film Director • Producer • Teacher");

        setAboutMe({
          badge: fm.aboutMe?.badge || fm.biographyBadgeText || "A FEW WORDS",
          title: fm.aboutMe?.title || fm.introTitle || "ABOUT ME AND MY WORK",
          subtitle: fm.aboutMe?.subtitle || "RANA MASUD FILM DIRECTOR",
          text: fm.aboutMe?.text || fm.introText || "",
        });

        // Parse Timeline
        setProfessionalTimeline(fm.professionalTimeline || []);

        // Parse Awards
        setIntlAwards(fm.awards?.international || []);
        setNatAwards(fm.awards?.national || []);

        // Parse Affiliations
        setMemberships(fm.affiliations?.memberships || fm.memberships || []);
        setJuryList(fm.affiliations?.jury || []);
        setParticipants(fm.affiliations?.participant || []);

        // Parse Notable Work
        setNonFiction(fm.notableWork?.nonFiction || "");
        setSocialFilms(fm.notableWork?.socialFilms || []);
        setAdFilms(fm.notableWork?.adFilms || []);
        setFilms(fm.notableWork?.films || []);
        setSeoTitle(fm.seoTitle || "");
        setSeoDescription(fm.seoDescription || "");
        setSeoKeywords(fm.seoKeywords || "");
        setSeoOgImage(fm.seoOgImage || "");
      } catch (error) {
        console.error("Failed to load biography data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBiography();
  }, []);

  const handleUploadCardImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImageIndex(index);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      
      setRoleCards((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], image: url };
        return updated;
      });
    } catch (err) {
      console.error(err);
      alert("Image upload failed.");
    } finally {
      setUploadingImageIndex(null);
    }
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const frontmatter = {
        title: "Biography",
        headerTitle,
        headerSubtitle,
        roleCards,
        aboutMe,
        professionalTimeline,
        awards: {
          international: intlAwards,
          national: natAwards,
        },
        affiliations: {
          memberships,
          jury: juryList,
          participant: participants,
        },
        notableWork: {
          nonFiction,
          socialFilms,
          adFilms,
          films,
        },
        seoTitle,
        seoDescription,
        seoKeywords,
        seoOgImage,
      };

      const res = await fetch("/api/pages/biography-rana_masud_film_director", {
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

  // Add/Remove Helpers
  const handleAddTimeline = () => {
    setProfessionalTimeline((prev) => [
      ...prev,
      { role: "New Role", period: "", company: "", description: "", icon: "Briefcase" },
    ]);
  };

  const handleRemoveTimeline = (index: number) => {
    setProfessionalTimeline((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTimelineChange = (index: number, field: keyof TimelineItem, value: string) => {
    setProfessionalTimeline((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddFilmRow = () => {
    setFilms((prev) => [...prev, { name: "", designation: "", year: "", link: "" }]);
  };

  const handleRemoveFilmRow = (index: number) => {
    setFilms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFilmRowChange = (index: number, field: keyof FilmItem, value: string) => {
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
        <span className="ml-3 text-sm text-white/60">Loading biography editor...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left max-w-5xl">
      {/* Upper header action bar */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Biography Page</h1>
          <p className="text-sm text-white/50 mt-1">Manage profile role cards, career timeline, awards, and film indexes.</p>
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

      {/* Tabs navigation panel */}
      <div className="flex gap-4 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("about")}
          className={`pb-2 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
            activeTab === "about" ? "border-gold-accent text-white" : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          Cards & About
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`pb-2 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
            activeTab === "timeline" ? "border-gold-accent text-white" : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          Career Timeline
        </button>
        <button
          onClick={() => setActiveTab("awards")}
          className={`pb-2 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
            activeTab === "awards" ? "border-gold-accent text-white" : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          Awards & Affiliations
        </button>
        <button
          onClick={() => setActiveTab("notable")}
          className={`pb-2 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
            activeTab === "notable" ? "border-gold-accent text-white" : "border-transparent text-white/40 hover:text-white"
          }`}
        >
          Productions & Films
        </button>
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Tab 1: Cards & About */}
        {activeTab === "about" && (
          <div className="flex flex-col gap-6">
            {/* Page Banner Header */}
            <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                Page Banner Header Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/40 font-bold uppercase">Header Title</label>
                  <input
                    type="text"
                    value={headerTitle}
                    onChange={(e) => setHeaderTitle(e.target.value)}
                    className="px-3 py-2.5 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 w-full"
                    placeholder="e.g. Biography"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/40 font-bold uppercase">Header Subtitle</label>
                  <input
                    type="text"
                    value={headerSubtitle}
                    onChange={(e) => setHeaderSubtitle(e.target.value)}
                    className="px-3 py-2.5 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 w-full"
                    placeholder="e.g. Film Director • Producer • Teacher"
                  />
                </div>
              </div>
            </div>

            {/* 3 Role Cards Grid */}
            <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                Biography Header Cards (3 Cards)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roleCards.map((card, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/5 flex flex-col gap-3 relative">
                    <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-gold-accent/10 border border-gold-accent/20 text-gold-accent">
                      Card #{idx + 1}
                    </span>

                    {/* Image Preview / Upload */}
                    <div className="w-full aspect-[4/3] rounded-md overflow-hidden relative bg-black/40 border border-white/5 mt-4">
                      {card.image ? (
                        <img src={card.image} alt={`Card ${idx + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
                          No Photo Uploaded
                        </div>
                      )}
                    </div>
                    <label className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded bg-gold-accent/10 hover:bg-gold-accent/20 border border-gold-accent/20 text-gold-accent text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors text-center">
                      <ImageIcon className="h-3.5 w-3.5" />
                      {uploadingImageIndex === idx ? "Uploading..." : "Upload Photo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadCardImage(e, idx)}
                        className="hidden"
                        disabled={uploadingImageIndex !== null}
                      />
                    </label>

                    {/* Text Fields */}
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-white/40 font-bold uppercase">Role Title</label>
                        <input
                          type="text"
                          value={card.role}
                          onChange={(e) => {
                            const updated = [...roleCards];
                            updated[idx].role = e.target.value;
                            setRoleCards(updated);
                          }}
                          className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                          placeholder="e.g. Film Director"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-white/40 font-bold uppercase">Company / Subtitle</label>
                        <input
                          type="text"
                          value={card.company}
                          onChange={(e) => {
                            const updated = [...roleCards];
                            updated[idx].company = e.target.value;
                            setRoleCards(updated);
                          }}
                          className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                          placeholder="e.g. Ferywala Communications"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Me Section text */}
            <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                About Me Introductory Content
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/40 font-bold uppercase">Intro Badge Text</label>
                  <input
                    type="text"
                    value={aboutMe.badge}
                    onChange={(e) => setAboutMe({ ...aboutMe, badge: e.target.value })}
                    className="px-3 py-2.5 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                    placeholder="e.g. A FEW WORDS"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/40 font-bold uppercase">Intro Title</label>
                  <input
                    type="text"
                    value={aboutMe.title}
                    onChange={(e) => setAboutMe({ ...aboutMe, title: e.target.value })}
                    className="px-3 py-2.5 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                    placeholder="e.g. ABOUT ME AND MY WORK"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/40 font-bold uppercase">Intro Subtitle</label>
                  <input
                    type="text"
                    value={aboutMe.subtitle}
                    onChange={(e) => setAboutMe({ ...aboutMe, subtitle: e.target.value })}
                    className="px-3 py-2.5 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                    placeholder="e.g. RANA MASUD FILM DIRECTOR"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Biographical Summary Text</label>
                <textarea
                  rows={4}
                  value={aboutMe.text}
                  onChange={(e) => setAboutMe({ ...aboutMe, text: e.target.value })}
                  className="px-3 py-2.5 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-relaxed"
                  placeholder="Rana Masud served Madonna Advertising..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Career Timeline */}
        {activeTab === "timeline" && (
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Professional Timeline Configuration
              </h3>
              <button
                onClick={handleAddTimeline}
                className="text-[10px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Milestone
              </button>
            </div>

            <div className="flex flex-col gap-6 mt-2">
              {professionalTimeline.map((item, index) => (
                <div key={index} className="p-5 rounded-lg border border-white/5 bg-white/5 flex flex-col gap-4 relative">
                  <button
                    onClick={() => handleRemoveTimeline(index)}
                    className="absolute top-4 right-4 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">Role Title</label>
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) => handleTimelineChange(index, "role", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">Period (e.g. 2002 - 2009)</label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => handleTimelineChange(index, "period", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">Icon Shape</label>
                      <select
                        value={item.icon}
                        onChange={(e) => handleTimelineChange(index, "icon", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                      >
                        <option value="Briefcase">Briefcase</option>
                        <option value="GraduationCap">Graduation Cap</option>
                        <option value="Award">Award</option>
                        <option value="Film">Film</option>
                        <option value="FileText">Document Icon</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-white/40 font-bold uppercase">Company / Organization</label>
                    <input
                      type="text"
                      value={item.company}
                      onChange={(e) => handleTimelineChange(index, "company", e.target.value)}
                      className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-white/40 font-bold uppercase">Milestone Description</label>
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => handleTimelineChange(index, "description", e.target.value)}
                      className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-normal"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Awards & Affiliations */}
        {activeTab === "awards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Awards section */}
            <div className="flex flex-col gap-6">
              {/* International Film Awards */}
              <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                  International Awards
                </h3>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIntlAward}
                    placeholder="Grand Prize at..."
                    onChange={(e) => setNewIntlAward(e.target.value)}
                    className="flex-1 px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newIntlAward.trim()) {
                        setIntlAwards([...intlAwards, newIntlAward.trim()]);
                        setNewIntlAward("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newIntlAward.trim()) {
                        setIntlAwards([...intlAwards, newIntlAward.trim()]);
                        setNewIntlAward("");
                      }
                    }}
                    className="px-3 py-2 bg-gold-accent hover:bg-gold-hover text-black font-semibold text-xs rounded transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {intlAwards.map((award, idx) => (
                    <div key={idx} className="flex justify-between items-start bg-white/5 px-3 py-2 rounded border border-white/5 text-xs text-white/80">
                      <span className="leading-normal flex-1 pr-4">{award}</span>
                      <button
                        onClick={() => setIntlAwards(intlAwards.filter((_, i) => i !== idx))}
                        className="text-red-500/60 hover:text-red-500 p-1 cursor-pointer transition-colors shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* National Film Awards */}
              <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                  National Awards
                </h3>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNatAward}
                    placeholder="Best Director at..."
                    onChange={(e) => setNewNatAward(e.target.value)}
                    className="flex-1 px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newNatAward.trim()) {
                        setNatAwards([...natAwards, newNatAward.trim()]);
                        setNewNatAward("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newNatAward.trim()) {
                        setNatAwards([...natAwards, newNatAward.trim()]);
                        setNewNatAward("");
                      }
                    }}
                    className="px-3 py-2 bg-gold-accent hover:bg-gold-hover text-black font-semibold text-xs rounded transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {natAwards.map((award, idx) => (
                    <div key={idx} className="flex justify-between items-start bg-white/5 px-3 py-2 rounded border border-white/5 text-xs text-white/80">
                      <span className="leading-normal flex-1 pr-4">{award}</span>
                      <button
                        onClick={() => setNatAwards(natAwards.filter((_, i) => i !== idx))}
                        className="text-red-500/60 hover:text-red-500 p-1 cursor-pointer transition-colors shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Affiliations section */}
            <div className="flex flex-col gap-6">
              {/* Memberships */}
              <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                  Memberships
                </h3>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMembership}
                    placeholder="Member of..."
                    onChange={(e) => setNewMembership(e.target.value)}
                    className="flex-1 px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newMembership.trim()) {
                        setMemberships([...memberships, newMembership.trim()]);
                        setNewMembership("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newMembership.trim()) {
                        setMemberships([...memberships, newMembership.trim()]);
                        setNewMembership("");
                      }
                    }}
                    className="px-3 py-2 bg-gold-accent hover:bg-gold-hover text-black font-semibold text-xs rounded transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {memberships.map((m, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded border border-white/5 text-xs text-white/80">
                      <span className="truncate max-w-[80%]">{m}</span>
                      <button
                        onClick={() => setMemberships(memberships.filter((_, i) => i !== idx))}
                        className="text-red-500/60 hover:text-red-500 p-1 cursor-pointer transition-colors shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jury Board members */}
              <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                  Jury Board Service
                </h3>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newJury}
                    placeholder="Serving on jury..."
                    onChange={(e) => setNewJury(e.target.value)}
                    className="flex-1 px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newJury.trim()) {
                        setJuryList([...juryList, newJury.trim()]);
                        setNewJury("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newJury.trim()) {
                        setJuryList([...juryList, newJury.trim()]);
                        setNewJury("");
                      }
                    }}
                    className="px-3 py-2 bg-gold-accent hover:bg-gold-hover text-black font-semibold text-xs rounded transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {juryList.map((j, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded border border-white/5 text-xs text-white/80">
                      <span className="leading-normal flex-1 pr-4">{j}</span>
                      <button
                        onClick={() => setJuryList(juryList.filter((_, i) => i !== idx))}
                        className="text-red-500/60 hover:text-red-500 p-1 cursor-pointer transition-colors shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Participants */}
              <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                  Participants
                </h3>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newParticipant}
                    placeholder="Add participant detail..."
                    onChange={(e) => setNewParticipant(e.target.value)}
                    className="flex-1 px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newParticipant.trim()) {
                        setParticipants([...participants, newParticipant.trim()]);
                        setNewParticipant("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newParticipant.trim()) {
                        setParticipants([...participants, newParticipant.trim()]);
                        setNewParticipant("");
                      }
                    }}
                    className="px-3 py-2 bg-gold-accent hover:bg-gold-hover text-black font-semibold text-xs rounded transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {participants.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded border border-white/5 text-xs text-white/80">
                      <span className="leading-normal flex-1 pr-4">{p}</span>
                      <button
                        onClick={() => setParticipants(participants.filter((_, i) => i !== idx))}
                        className="text-red-500/60 hover:text-red-500 p-1 cursor-pointer transition-colors shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Notable Work & Film Index */}
        {activeTab === "notable" && (
          <div className="flex flex-col gap-6">
            
            {/* Non-Fiction & List tag arrays */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Non-fiction text & Documentaries */}
              <div className="flex flex-col gap-6">
                
                {/* Non Fiction description text */}
                <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                    Non-Fiction
                  </h3>
                  <textarea
                    rows={2}
                    value={nonFiction}
                    onChange={(e) => setNonFiction(e.target.value)}
                    placeholder="Directed Talk Show (26 episodes)..."
                    className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40 w-full"
                  />
                </div>

                {/* Social films list tags */}
                <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                    Social Films & Documentaries
                  </h3>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSocialFilm}
                      placeholder="e.g. Dengue ( UNICEF )"
                      onChange={(e) => setNewSocialFilm(e.target.value)}
                      className="flex-1 px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newSocialFilm.trim()) {
                          setSocialFilms([...socialFilms, newSocialFilm.trim()]);
                          setNewSocialFilm("");
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (newSocialFilm.trim()) {
                          setSocialFilms([...socialFilms, newSocialFilm.trim()]);
                          setNewSocialFilm("");
                        }
                      }}
                      className="px-3 py-2 bg-gold-accent hover:bg-gold-hover text-black font-semibold text-xs rounded transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2 max-h-[220px] overflow-y-auto pr-1">
                    {socialFilms.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md text-xs text-white border border-white/5"
                      >
                        {tag}
                        <button
                          onClick={() => setSocialFilms(socialFilms.filter((_, i) => i !== idx))}
                          className="text-red-500/60 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: AD Films lists */}
              <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                  AD Films Grid Tags
                </h3>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAdFilm}
                    placeholder="e.g. SKB Pressure Cooker"
                    onChange={(e) => setNewAdFilm(e.target.value)}
                    className="flex-1 px-3 py-2 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newAdFilm.trim()) {
                        setAdFilms([...adFilms, newAdFilm.trim()]);
                        setNewAdFilm("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newAdFilm.trim()) {
                        setAdFilms([...adFilms, newAdFilm.trim()]);
                        setNewAdFilm("");
                      }
                    }}
                    className="px-3 py-2 bg-gold-accent hover:bg-gold-hover text-black font-semibold text-xs rounded transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2 max-h-[350px] overflow-y-auto pr-1">
                  {adFilms.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-[11px] text-white/80 border border-white/5"
                    >
                      {tag}
                      <button
                        onClick={() => setAdFilms(adFilms.filter((_, i) => i !== idx))}
                        className="text-red-500/60 hover:text-red-500 transition-colors cursor-pointer text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Film table index details */}
            <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  Feature Film Catalog Table
                </h3>
                <button
                  onClick={handleAddFilmRow}
                  className="text-[10px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Add Film Entry
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="p-3 font-bold text-white/40 uppercase tracking-wider w-[40%]">Film Name</th>
                      <th className="p-3 font-bold text-white/40 uppercase tracking-wider w-[25%]">Designation</th>
                      <th className="p-3 font-bold text-white/40 uppercase tracking-wider w-[12%]">Year</th>
                      <th className="p-3 font-bold text-white/40 uppercase tracking-wider w-[18%]">IMDb URL</th>
                      <th className="p-3 font-bold text-white/40 uppercase tracking-wider text-right w-[5%]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {films.map((film, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.01]">
                        <td className="p-2">
                          <input
                            type="text"
                            value={film.name}
                            onChange={(e) => handleFilmRowChange(idx, "name", e.target.value)}
                            placeholder="Film title name"
                            className="w-full px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={film.designation}
                            onChange={(e) => handleFilmRowChange(idx, "designation", e.target.value)}
                            placeholder="e.g. Director"
                            className="w-full px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={film.year}
                            onChange={(e) => handleFilmRowChange(idx, "year", e.target.value)}
                            placeholder="e.g. 2021"
                            className="w-full px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={film.link}
                            onChange={(e) => handleFilmRowChange(idx, "link", e.target.value)}
                            placeholder="IMDb or video link"
                            className="w-full px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                          />
                        </td>
                        <td className="p-2 text-right">
                          <button
                            onClick={() => handleRemoveFilmRow(idx)}
                            className="text-red-500/60 hover:text-red-500 p-1.5 rounded cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {films.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-white/20 uppercase tracking-wider">
                          No Film Entries Added.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

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

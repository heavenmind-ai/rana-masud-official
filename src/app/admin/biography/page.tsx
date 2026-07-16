"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";

interface TimelineItem {
  role: string;
  period: string;
  company: string;
  description: string;
  icon: string;
}

export default function AdminBiographyPageEditor() {
  const [introTitle, setIntroTitle] = useState("");
  const [introText, setIntroText] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [professionalTimeline, setProfessionalTimeline] = useState<TimelineItem[]>([]);
  const [memberships, setMemberships] = useState<string[]>([]);
  const [newMembership, setNewMembership] = useState("");

  const [juryEvent, setJuryEvent] = useState("");
  const [juryLocationDate, setJuryLocationDate] = useState("");
  const [juryText, setJuryText] = useState("");
  const [juryFooter, setJuryFooter] = useState("");

  // New section header states
  const [biographyBadgeText, setBiographyBadgeText] = useState("");
  const [timelineSectionTitle, setTimelineSectionTitle] = useState("");
  const [membershipsSectionTitle, setMembershipsSectionTitle] = useState("");
  const [jurySectionTitle, setJurySectionTitle] = useState("");

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function fetchBiography() {
      try {
        const res = await fetch("/api/pages/biography-rana_masud_film_director");
        if (!res.ok) throw new Error("Failed to fetch biography");
        const data = await res.json();
        
        const fm = data.frontmatter || {};
        setIntroTitle(fm.introTitle || "Rana Masud Biography");
        setIntroText(fm.introText || "");
        setProfileImage(fm.profileImage || "");
        setProfessionalTimeline(fm.professionalTimeline || []);
        setMemberships(fm.memberships || []);
        setJuryEvent(fm.juryEvent || "");
        setJuryLocationDate(fm.juryLocationDate || "");
        setJuryText(fm.juryText || "");
        setJuryFooter(fm.juryFooter || "");

        setBiographyBadgeText(fm.biographyBadgeText || "The Filmmaker");
        setTimelineSectionTitle(fm.timelineSectionTitle || "Professional Career");
        setMembershipsSectionTitle(fm.membershipsSectionTitle || "Affiliations & Memberships");
        setJurySectionTitle(fm.jurySectionTitle || "Jury Service");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchBiography();
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
      setProfileImage(url);
    } catch (err) {
      console.error(err);
      alert("Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const frontmatter = {
        title: introTitle,
        introTitle,
        introText,
        profileImage,
        professionalTimeline,
        memberships,
        juryEvent,
        juryLocationDate,
        juryText,
        juryFooter,
        biographyBadgeText,
        timelineSectionTitle,
        membershipsSectionTitle,
        jurySectionTitle,
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

  const handleAddMembership = () => {
    if (!newMembership.trim()) return;
    setMemberships((prev) => [...prev, newMembership.trim()]);
    setNewMembership("");
  };

  const handleRemoveMembership = (index: number) => {
    setMemberships((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-gold-accent animate-spin" />
        <span className="ml-3 text-sm text-white/60">Loading biography configurations...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Biography</h1>
          <p className="text-sm text-white/50 mt-1">Manage biography badges, headers, timelines, and details.</p>
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
        {/* Left Side forms */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Section Headers configuration */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">Page Section Titles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Biography Badge</label>
                <input
                  type="text"
                  value={biographyBadgeText}
                  onChange={(e) => setBiographyBadgeText(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. The Filmmaker"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Timeline Section Title</label>
                <input
                  type="text"
                  value={timelineSectionTitle}
                  onChange={(e) => setTimelineSectionTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Professional Career"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Affiliations Section Title</label>
                <input
                  type="text"
                  value={membershipsSectionTitle}
                  onChange={(e) => setMembershipsSectionTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Affiliations & Memberships"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Jury Section Title</label>
                <input
                  type="text"
                  value={jurySectionTitle}
                  onChange={(e) => setJurySectionTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Jury Service"
                />
              </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">Introduction</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Biography Title</label>
              <input
                type="text"
                value={introTitle}
                onChange={(e) => setIntroTitle(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Biographical Text</label>
              <textarea
                rows={5}
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Professional timeline</h3>
              <button
                onClick={handleAddTimeline}
                className="text-[10px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Timeline Card
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
                      <label className="text-[9px] text-white/40 font-bold uppercase">Period (e.g. 2006 - Present)</label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => handleTimelineChange(index, "period", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-white/40 font-bold uppercase">Icon Type</label>
                      <select
                        value={item.icon}
                        onChange={(e) => handleTimelineChange(index, "icon", e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                      >
                        <option value="Briefcase">Briefcase</option>
                        <option value="GraduationCap">Graduation Cap (Teacher)</option>
                        <option value="Award">Award (Honors)</option>
                        <option value="Film">Film (Director)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-white/40 font-bold uppercase">Institution / Company</label>
                    <input
                      type="text"
                      value={item.company}
                      onChange={(e) => handleTimelineChange(index, "company", e.target.value)}
                      className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] text-white/40 font-bold uppercase">Job Description</label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => handleTimelineChange(index, "description", e.target.value)}
                      className="px-2.5 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-normal"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jury Service */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">Jury Service Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-white/40 font-bold uppercase">Jury Board Designation</label>
                <input
                  type="text"
                  value={juryEvent}
                  onChange={(e) => setJuryEvent(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-white/40 font-bold uppercase">Location & Date</label>
                <input
                  type="text"
                  value={juryLocationDate}
                  onChange={(e) => setJuryLocationDate(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-white/40 font-bold uppercase">Jury Service Summary</label>
              <textarea
                rows={2}
                value={juryText}
                onChange={(e) => setJuryText(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] text-white/40 font-bold uppercase">Jury Service Footer Info</label>
              <input
                type="text"
                value={juryFooter}
                onChange={(e) => setJuryFooter(e.target.value)}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Photo & Memberships */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Portrait Image */}
          <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-2 border-b border-white/5">Biography Portrait</h3>
            {profileImage ? (
              <img src={profileImage} alt="Portrait Preview" className="w-full aspect-[3/4] object-cover rounded-lg border border-white/10" />
            ) : (
              <div className="w-full aspect-[3/4] rounded-lg border border-dashed border-white/10 bg-white/5 flex items-center justify-center text-white/20 text-xs">
                No Portrait uploaded
              </div>
            )}
            
            <label className="flex items-center justify-center gap-1.5 w-full py-2 rounded bg-gold-accent/10 hover:bg-gold-accent/20 border border-gold-accent/20 text-gold-accent text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors">
              <ImageIcon className="h-4 w-4 text-gold-accent" />
              {uploadingImage ? "Uploading..." : "Upload Photo"}
              <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" disabled={uploadingImage} />
            </label>
          </div>

          {/* Memberships */}
          <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-2 border-b border-white/5">Affiliations</h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMembership}
                placeholder="Add affiliation..."
                onChange={(e) => setNewMembership(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                onKeyDown={(e) => e.key === "Enter" && handleAddMembership()}
              />
              <button
                onClick={handleAddMembership}
                className="px-3 py-1.5 bg-gold-accent hover:bg-gold-hover text-black font-semibold text-xs rounded transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              {memberships.map((membership, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded border border-white/5 text-xs text-white/80">
                  <span className="truncate max-w-[80%]">{membership}</span>
                  <button
                    onClick={() => handleRemoveMembership(idx)}
                    className="text-red-500/60 hover:text-red-500 p-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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

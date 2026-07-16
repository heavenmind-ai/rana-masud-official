"use client";

import React, { useState, useEffect } from "react";
import { Save, Settings, Compass, Link as LinkIcon, AlertCircle, CheckCircle2, Plus, Trash2, Lock } from "lucide-react";

interface MenuLink {
  label: string;
  href: string;
}

interface Socials {
  facebook: string;
  twitter: string;
  youtube: string;
  imdb: string;
}

interface HeaderData {
  logoText: string;
  logoIcon: string;
  menuLinks: MenuLink[];
}

interface FooterData {
  copyrightText: string;
  brandName: string;
  brandSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socials: Socials;
}

export default function AdminSettingsPage() {
  const [header, setHeader] = useState<HeaderData>({
    logoText: "Rana Masud",
    logoIcon: "Film",
    menuLinks: [],
  });

  const [footer, setFooter] = useState<FooterData>({
    copyrightText: "",
    brandName: "RANA MASUD",
    brandSubtitle: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    socials: { facebook: "", twitter: "", youtube: "", imdb: "" },
  });

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [securityEmail, setSecurityEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityStatus, setSecurityStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [securityErrorMsg, setSecurityErrorMsg] = useState("");
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        
        if (data.header) setHeader(data.header);
        if (data.footer) setFooter(data.footer);

        // Fetch security settings email address safely
        const secRes = await fetch("/api/admin/security");
        if (secRes.ok) {
          const secData = await secRes.json();
          if (secData.email) setSecurityEmail(secData.email);
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg("Failed to retrieve settings from the database.");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (key: "header" | "footer", data: any) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data }),
      });

      if (!res.ok) throw new Error(`Failed to save ${key} settings`);

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save configuration.");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityEmail) {
      setSecurityErrorMsg("Email address is required.");
      return;
    }
    if (!currentPassword) {
      setSecurityErrorMsg("Current password is required to save changes.");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setSecurityErrorMsg("New passwords do not match.");
      return;
    }

    setSecurityStatus("saving");
    setSecurityErrorMsg("");
    setSecuritySuccessMsg("");

    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: securityEmail,
          currentPassword,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update security credentials.");

      setSecurityStatus("success");
      setSecuritySuccessMsg("Security settings updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      setTimeout(() => {
        setSecuritySuccessMsg("");
        setSecurityStatus("idle");
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setSecurityErrorMsg(err.message || "Failed to update security credentials.");
      setSecurityStatus("error");
      setTimeout(() => setSecurityStatus("idle"), 4000);
    }
  };

  const handleAddMenuLink = () => {
    setHeader((prev) => ({
      ...prev,
      menuLinks: [...prev.menuLinks, { label: "New Link", href: "/" }],
    }));
  };

  const handleRemoveMenuLink = (index: number) => {
    setHeader((prev) => ({
      ...prev,
      menuLinks: prev.menuLinks.filter((_, i) => i !== index),
    }));
  };

  const handleMenuLinkChange = (index: number, field: "label" | "href", value: string) => {
    setHeader((prev) => {
      const updated = [...prev.menuLinks];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, menuLinks: updated };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-gold-accent animate-spin" />
        <span className="ml-3 text-sm text-white/60">Loading dynamic configurations...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Settings className="h-7 w-7 text-gold-accent" />
            Global Site Settings
          </h1>
          <p className="text-sm text-white/50 mt-1">Control your header, footer, links, and branding parameters dynamically.</p>
        </div>

        {saveStatus === "saving" && (
          <span className="text-xs text-white/40 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-t-transparent border-white animate-spin" />
            Saving settings...
          </span>
        )}
        {saveStatus === "success" && (
          <span className="text-xs text-emerald-500 flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4" />
            Configuration Saved!
          </span>
        )}
        {saveStatus === "error" && (
          <span className="text-xs text-red-500 flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <AlertCircle className="h-4 w-4" />
            Save Failed
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-600/10 border border-red-500/20 text-red-500 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Header Config */}
        <div className="glass-card p-6 flex flex-col gap-5 border border-white/10 h-fit">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
            <Compass className="h-5 w-5 text-gold-accent" />
            Navigation Header Settings
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/40 font-bold uppercase">Logo / Branding Text</label>
            <input
              type="text"
              value={header.logoText}
              onChange={(e) => setHeader({ ...header, logoText: e.target.value })}
              className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/40 font-bold uppercase">Logo Icon Name (Lucide)</label>
            <input
              type="text"
              value={header.logoIcon}
              onChange={(e) => setHeader({ ...header, logoIcon: e.target.value })}
              className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-white/40 font-bold uppercase">Header Navigation Links</label>
              <button
                onClick={handleAddMenuLink}
                className="text-[10px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2 py-1 rounded flex items-center gap-1 cursor-pointer font-bold"
              >
                <Plus className="h-3 w-3" /> Add Link
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
              {header.menuLinks.map((link, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-white/5 p-2 rounded border border-white/5">
                  <input
                    type="text"
                    value={link.label}
                    placeholder="Link Label"
                    onChange={(e) => handleMenuLinkChange(idx, "label", e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                  />
                  <input
                    type="text"
                    value={link.href}
                    placeholder="Path (e.g. /about)"
                    onChange={(e) => handleMenuLinkChange(idx, "href", e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40 font-mono"
                  />
                  <button
                    onClick={() => handleRemoveMenuLink(idx)}
                    className="text-red-500/60 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleSave("header", header)}
            className="w-full mt-2 py-2.5 rounded-lg bg-gold-accent hover:bg-gold-hover text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Save className="h-4 w-4" /> Save Header Config
          </button>
        </div>

        {/* Footer Config */}
        <div className="glass-card p-6 flex flex-col gap-5 border border-white/10 h-fit">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
            <LinkIcon className="h-5 w-5 text-gold-accent" />
            Footer & Social Settings
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Brand Header</label>
              <input
                type="text"
                value={footer.brandName}
                onChange={(e) => setFooter({ ...footer, brandName: e.target.value })}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Brand Subtitle</label>
              <input
                type="text"
                value={footer.brandSubtitle}
                onChange={(e) => setFooter({ ...footer, brandSubtitle: e.target.value })}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Contact Email</label>
              <input
                type="email"
                value={footer.contactEmail}
                onChange={(e) => setFooter({ ...footer, contactEmail: e.target.value })}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Contact Phone</label>
              <input
                type="text"
                value={footer.contactPhone}
                onChange={(e) => setFooter({ ...footer, contactPhone: e.target.value })}
                className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/40 font-bold uppercase">Office Address</label>
            <input
              type="text"
              value={footer.address}
              onChange={(e) => setFooter({ ...footer, address: e.target.value })}
              className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/40 font-bold uppercase">Copyright Notice</label>
            <input
              type="text"
              value={footer.copyrightText}
              onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
              className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[10px] text-white/40 font-bold uppercase">Social Media Handles</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={footer.socials.facebook}
                placeholder="Facebook URL"
                onChange={(e) =>
                  setFooter({ ...footer, socials: { ...footer.socials, facebook: e.target.value } })
                }
                className="px-3 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
              />
              <input
                type="text"
                value={footer.socials.twitter}
                placeholder="Twitter URL"
                onChange={(e) =>
                  setFooter({ ...footer, socials: { ...footer.socials, twitter: e.target.value } })
                }
                className="px-3 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
              />
              <input
                type="text"
                value={footer.socials.youtube}
                placeholder="YouTube URL"
                onChange={(e) =>
                  setFooter({ ...footer, socials: { ...footer.socials, youtube: e.target.value } })
                }
                className="px-3 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
              />
              <input
                type="text"
                value={footer.socials.imdb}
                placeholder="IMDb Profile URL"
                onChange={(e) =>
                  setFooter({ ...footer, socials: { ...footer.socials, imdb: e.target.value } })
                }
                className="px-3 py-1.5 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
              />
            </div>
          </div>

          <button
            onClick={() => handleSave("footer", footer)}
            className="w-full mt-2 py-2.5 rounded-lg bg-gold-accent hover:bg-gold-hover text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Save className="h-4 w-4" /> Save Footer Config
          </button>
        </div>

        {/* Admin Security Settings */}
        <div className="glass-card p-6 flex flex-col gap-5 border border-white/10 h-fit lg:col-span-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
            <Lock className="h-5 w-5 text-gold-accent" />
            Admin Security Settings
          </h3>

          {securityErrorMsg && (
            <div className="p-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-lg text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {securityErrorMsg}
            </div>
          )}

          {securitySuccessMsg && (
            <div className="p-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {securitySuccessMsg}
            </div>
          )}

          <form onSubmit={handleSaveSecurity} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Admin Email Address</label>
                <input
                  type="email"
                  required
                  value={securityEmail}
                  onChange={(e) => setSecurityEmail(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Current Password (Required to Save)</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">New Password (Leave Blank to Keep Same)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={securityStatus === "saving"}
              className="w-full mt-2 py-2.5 rounded-lg bg-gold-accent hover:bg-gold-hover text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save className="h-4 w-4" /> Save Security Credentials
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

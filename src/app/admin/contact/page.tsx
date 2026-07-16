"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminContactPageEditor() {
  const [headerText, setHeaderText] = useState("");
  
  // Custom texts
  const [badgeText, setBadgeText] = useState("");
  const [titleText, setTitleText] = useState("");
  const [officeTitle, setOfficeTitle] = useState("");
  const [addressLabel, setAddressLabel] = useState("");
  const [emailLabel, setEmailLabel] = useState("");
  const [phoneLabel, setPhoneLabel] = useState("");
  const [socialLabel, setSocialLabel] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formNameLabel, setFormNameLabel] = useState("");
  const [formEmailLabel, setFormEmailLabel] = useState("");
  const [formSubjectLabel, setFormSubjectLabel] = useState("");
  const [formMessageLabel, setFormMessageLabel] = useState("");
  const [formButtonText, setFormButtonText] = useState("");
  const [formSuccessTitle, setFormSuccessTitle] = useState("");
  const [formSuccessText, setFormSuccessText] = useState("");

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    async function fetchContactData() {
      try {
        const res = await fetch("/api/pages/contact");
        if (!res.ok) throw new Error("Failed to fetch contact page data");
        const data = await res.json();
        
        const fm = data.frontmatter || {};
        setHeaderText(fm.headerText || "");
        setBadgeText(fm.badgeText || "Reach Out");
        setTitleText(fm.titleText || "Contact Me");
        setOfficeTitle(fm.officeTitle || "Office & Inquiries");
        setAddressLabel(fm.addressLabel || "Location Address");
        setEmailLabel(fm.emailLabel || "Email Inquiries");
        setPhoneLabel(fm.phoneLabel || "Phone Contact");
        setSocialLabel(fm.socialLabel || "Connect Digitally");
        setFormTitle(fm.formTitle || "Send Message");
        setFormNameLabel(fm.formNameLabel || "Your Name");
        setFormEmailLabel(fm.formEmailLabel || "Email Address");
        setFormSubjectLabel(fm.formSubjectLabel || "Subject");
        setFormMessageLabel(fm.formMessageLabel || "Message");
        setFormButtonText(fm.formButtonText || "Submit Inquiry");
        setFormSuccessTitle(fm.formSuccessTitle || "Message Sent Successfully!");
        setFormSuccessText(fm.formSuccessText || "Thank you. I will get back to you shortly.");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchContactData();
  }, []);

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const frontmatter = {
        title: "Contact Details",
        headerText,
        badgeText,
        titleText,
        officeTitle,
        addressLabel,
        emailLabel,
        phoneLabel,
        socialLabel,
        formTitle,
        formNameLabel,
        formEmailLabel,
        formSubjectLabel,
        formMessageLabel,
        formButtonText,
        formSuccessTitle,
        formSuccessText,
      };

      const res = await fetch("/api/pages/contact", {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-gold-accent animate-spin" />
        <span className="ml-3 text-sm text-white/60">Loading contact page config...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Contact Page</h1>
          <p className="text-sm text-white/50 mt-1">Manage text fields, label titles, and form buttons.</p>
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
          {/* Header Config */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">Page Header Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Contact Page Badge</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Reach Out"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Contact Page Title</label>
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  placeholder="e.g. Contact Me"
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

          {/* Contact Details Labels */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">Contact Card Labels</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Office details heading</label>
                <input
                  type="text"
                  value={officeTitle}
                  onChange={(e) => setOfficeTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Address Label</label>
                <input
                  type="text"
                  value={addressLabel}
                  onChange={(e) => setAddressLabel(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Email Label</label>
                <input
                  type="text"
                  value={emailLabel}
                  onChange={(e) => setEmailLabel(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Phone Label</label>
                <input
                  type="text"
                  value={phoneLabel}
                  onChange={(e) => setPhoneLabel(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Social Link Section Heading</label>
                <input
                  type="text"
                  value={socialLabel}
                  onChange={(e) => setSocialLabel(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
            </div>
          </div>

          {/* Form Labels & Submission */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">Inquiry Form Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Form Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Submit Button text</label>
                <input
                  type="text"
                  value={formButtonText}
                  onChange={(e) => setFormButtonText(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Name Input Label</label>
                <input
                  type="text"
                  value={formNameLabel}
                  onChange={(e) => setFormNameLabel(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Email Input Label</label>
                <input
                  type="text"
                  value={formEmailLabel}
                  onChange={(e) => setFormEmailLabel(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Subject Input Label</label>
                <input
                  type="text"
                  value={formSubjectLabel}
                  onChange={(e) => setFormSubjectLabel(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Message Input Label</label>
                <input
                  type="text"
                  value={formMessageLabel}
                  onChange={(e) => setFormMessageLabel(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Success Popup Title</label>
                <input
                  type="text"
                  value={formSuccessTitle}
                  onChange={(e) => setFormSuccessTitle(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Success Popup Description</label>
                <input
                  type="text"
                  value={formSuccessText}
                  onChange={(e) => setFormSuccessText(e.target.value)}
                  className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

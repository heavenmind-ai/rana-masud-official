"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Settings,
  Mail,
  MailOpen,
  Trash2,
  Clock,
  User,
  RefreshCw,
} from "lucide-react";

interface MessageItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminContactPageEditor() {
  const [activeTab, setActiveTab] = useState<"inbox" | "config">("inbox");

  // Contact Page configuration states
  const [headerText, setHeaderText] = useState("");
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
  const [notificationEmail, setNotificationEmail] = useState("");

  // Inbox Messages states
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  // Fetch page configs
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
        setNotificationEmail(fm.notificationEmail || "");
      } catch (error) {
        console.error(error);
      } finally {
        setConfigLoading(false);
      }
    }
    fetchContactData();
  }, []);

  // Fetch inbox messages
  const fetchInbox = async (showLoading = true) => {
    if (showLoading) setInboxLoading(true);
    try {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Failed to load contact messages");
      const list = await res.json();
      setMessages(list);

      // Keep selectedMessage object synced if it exists
      if (selectedMessage) {
        const updated = list.find((m: MessageItem) => m._id === selectedMessage._id);
        if (updated) setSelectedMessage(updated);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setInboxLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const handleSaveConfig = async () => {
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
        notificationEmail,
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

  const handleSelectMessage = async (msg: MessageItem) => {
    setSelectedMessage(msg);

    // If message is unread, mark as read in database
    if (!msg.read) {
      try {
        const res = await fetch("/api/contact", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: msg._id, read: true }),
        });

        if (res.ok) {
          // Update local state instantly
          setMessages((prev) =>
            prev.map((m) => (m._id === msg._id ? { ...m, read: true } : m))
          );
          setSelectedMessage((prev) => (prev ? { ...prev, read: true } : null));
        }
      } catch (err) {
        console.error("Failed to mark message as read:", err);
      }
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
        // Remove from local list
        setMessages((prev) => prev.filter((m) => m._id !== id));
      } else {
        alert("Failed to delete message.");
      }
    } catch (err) {
      console.error("Delete request error:", err);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  if (configLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-gold-accent animate-spin" />
        <span className="ml-3 text-sm text-white/60">Loading Contact page settings...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left max-w-5xl">
      {/* Tab Navigation header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-2">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`pb-2 text-sm font-bold uppercase tracking-widest cursor-pointer transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "inbox"
                ? "border-gold-accent text-white"
                : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            <Inbox className="h-4.5 w-4.5" />
            Inbox Messages
            {unreadCount > 0 && (
              <span className="bg-gold-accent text-black font-extrabold text-[10px] px-1.5 py-0.5 rounded-full leading-none">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`pb-2 text-sm font-bold uppercase tracking-widest cursor-pointer transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === "config"
                ? "border-gold-accent text-white"
                : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            <Settings className="h-4.5 w-4.5" />
            Form Text Config
          </button>
        </div>

        {activeTab === "config" && (
          <button
            onClick={handleSaveConfig}
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
        )}
      </div>

      {/* Tabs Viewport content */}
      {activeTab === "inbox" ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[500px]">
          {/* Messages list (left 1/3) */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                Total Inquiries ({messages.length})
              </span>
              <button
                onClick={() => fetchInbox(false)}
                disabled={inboxLoading}
                className="text-white/40 hover:text-white cursor-pointer transition-colors p-1"
                title="Sync inbox"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${inboxLoading ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[600px] pr-1">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedMessage?._id === msg._id
                      ? "bg-gold-accent/5 border-gold-accent/40"
                      : msg.read
                      ? "bg-white/[0.02] border-white/5 hover:border-white/10"
                      : "bg-white/[0.06] border-white/10 hover:border-white/20 shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-xs truncate ${msg.read ? "text-white/60" : "font-extrabold text-white"}`}>
                      {msg.name}
                    </h4>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-gold-accent shrink-0 mt-1" />
                    )}
                  </div>
                  <p className={`text-xs mt-1 truncate ${msg.read ? "text-white/40" : "font-bold text-white/80"}`}>
                    {msg.subject}
                  </p>
                  <div className="flex items-center gap-1.5 text-[9px] text-white/30 mt-3 font-semibold uppercase">
                    <Clock className="h-3 w-3 text-white/20" />
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-white/30 text-center border border-dashed border-white/10 rounded-lg">
                  <Inbox className="h-8 w-8 text-white/10 mb-2" />
                  <p className="text-xs font-semibold uppercase tracking-wider">Inbox is Empty</p>
                  <p className="text-[10px] mt-1">No contact inquiries have been logged yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Details pane (right 2/3) */}
          <div className="md:col-span-8">
            {selectedMessage ? (
              <div className="glass-card p-6 border border-white/10 flex flex-col justify-between min-h-[500px] text-left">
                <div className="flex flex-col gap-6">
                  {/* Message details header */}
                  <div className="flex justify-between items-start pb-4 border-b border-white/5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-gold-accent uppercase tracking-widest">
                        Inquiry Details
                      </span>
                      <h2 className="text-xl font-extrabold text-white">{selectedMessage.subject}</h2>
                    </div>

                    <button
                      onClick={() => handleDeleteMessage(selectedMessage._id)}
                      className="text-red-500/60 hover:text-red-500 hover:bg-red-500/5 px-2.5 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/25 transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>

                  {/* Metadata fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-gold-accent/10 flex items-center justify-center text-gold-accent">
                        <User className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-[9px] text-white/40 block font-bold uppercase tracking-wider">
                          Sender Name
                        </span>
                        <span className="text-white/80 font-bold">{selectedMessage.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-gold-accent/10 flex items-center justify-center text-gold-accent">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-[9px] text-white/40 block font-bold uppercase tracking-wider">
                          Email Address
                        </span>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-gold-accent hover:underline font-bold"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Message body content */}
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
                      Message Content
                    </span>
                    <div className="bg-black/40 border border-white/5 p-5 rounded-lg text-white/90 text-sm leading-relaxed whitespace-pre-wrap font-sans italic min-h-[180px]">
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>

                {/* Footer metadata details */}
                <div className="flex items-center justify-between text-[10px] text-white/30 border-t border-white/5 pt-4 mt-6 font-semibold uppercase">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-white/20" />
                    Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {selectedMessage.read ? (
                      <>
                        <MailOpen className="h-3.5 w-3.5 text-emerald-500" />
                        Marked as Read
                      </>
                    ) : (
                      <>
                        <Mail className="h-3.5 w-3.5 text-gold-accent" />
                        Unread Inquiry
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-center p-20 min-h-[500px]">
                <Mail className="h-10 w-10 text-white/10 mb-3 animate-pulse" />
                <h3 className="font-extrabold text-white text-sm uppercase tracking-widest">Select an Inquiry</h3>
                <p className="text-xs text-white/40 mt-1.5 max-w-xs">
                  Click on any contact message in the left-side list to view sender details and message text here.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Notification Alerts Settings */}
            <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                Notification Alerts
              </h3>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 font-bold uppercase">Alert Notification Email</label>
                <input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="px-3 py-2.5 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 w-full"
                  placeholder="e.g. alerts@myemail.com (receive alerts when forms are filled)"
                />
                <p className="text-[10px] text-white/30 italic">
                  Leave empty if you do not want to receive copy emails of contact submissions.
                </p>
              </div>
            </div>

            {/* Header Config */}
            <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                Page Header Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/40 font-bold uppercase">Contact Badge</label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/40 font-bold uppercase">Contact Title</label>
                  <input
                    type="text"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
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
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                Contact Card Labels
              </h3>
              
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
                  <label className="text-[10px] text-white/40 font-bold uppercase">Social Link Heading</label>
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
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">
                Inquiry Form Configuration
              </h3>
              
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
      )}
    </div>
  );
}

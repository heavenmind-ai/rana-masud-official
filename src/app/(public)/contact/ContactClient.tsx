"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Youtube, Link as LinkIcon } from "lucide-react";

interface ContactClientProps {
  email: string;
  emailFallback: string;
  phone: string;
  address: string;
  socials: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    imdb?: string;
  };
  headerText: string;
  badgeText?: string;
  titleText?: string;
  officeTitle?: string;
  addressLabel?: string;
  emailLabel?: string;
  phoneLabel?: string;
  socialLabel?: string;
  formTitle?: string;
  formNameLabel?: string;
  formEmailLabel?: string;
  formSubjectLabel?: string;
  formMessageLabel?: string;
  formButtonText?: string;
  formSuccessTitle?: string;
  formSuccessText?: string;
}

export default function ContactClient({
  email,
  emailFallback,
  phone,
  address,
  socials,
  headerText,
  badgeText = "Reach Out",
  titleText = "Contact Me",
  officeTitle = "Office & Inquiries",
  addressLabel = "Location Address",
  emailLabel = "Email Inquiries",
  phoneLabel = "Phone Contact",
  socialLabel = "Connect Digitally",
  formTitle = "Send Message",
  formNameLabel = "Your Name",
  formEmailLabel = "Email Address",
  formSubjectLabel = "Subject",
  formMessageLabel = "Message",
  formButtonText = "Submit Inquiry",
  formSuccessTitle = "Message Sent Successfully!",
  formSuccessText = "Thank you. I will get back to you shortly.",
}: ContactClientProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.subject || !formState.message) return;

    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!res.ok) throw new Error("Failed to send message. Please try again.");

      setSubmitted(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-12">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">{badgeText}</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">{titleText}</h1>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        <p className="text-white/60 mt-6 leading-relaxed">{headerText}</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        {/* Info Column */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">{officeTitle}</h2>
            <div className="h-0.5 w-12 bg-gold-accent mt-1" />

            <div className="flex flex-col gap-5 mt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{addressLabel}</h4>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{emailLabel}</h4>
                  {email && (
                    <p className="text-xs text-white/50 mt-1">
                      <a href={`mailto:${email}`} className="hover:text-gold-accent transition-colors">
                        {email}
                      </a>
                    </p>
                  )}
                  {emailFallback && (
                    <p className="text-xs text-white/40">
                      <a
                        href={`mailto:${emailFallback}`}
                        className="hover:text-gold-accent transition-colors"
                      >
                        {emailFallback}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{phoneLabel}</h4>
                  <p className="text-xs text-white/50 mt-1">
                    <a href={`tel:${phone}`} className="hover:text-gold-accent transition-colors">
                      {phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social connections */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">{socialLabel}</h4>
            <div className="flex gap-4">
              {socials.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-gold-accent/40 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-gold-accent transition-all cursor-pointer"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-gold-accent/40 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-gold-accent transition-all cursor-pointer"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {socials.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-gold-accent/40 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-gold-accent transition-all cursor-pointer"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {socials.imdb && (
                <a
                  href={socials.imdb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-gold-accent/40 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-gold-accent transition-all cursor-pointer"
                >
                  <LinkIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-6">{formTitle}</h2>
            {submitted ? (
              <div className="p-8 rounded-lg bg-gold-accent/10 border border-gold-accent/30 text-center flex flex-col gap-2">
                <Send className="h-8 w-8 text-gold-accent mx-auto animate-pulse" />
                <h4 className="font-bold text-white mt-2">{formSuccessTitle}</h4>
                <p className="text-xs text-white/60">{formSuccessText}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs text-white/50 font-semibold uppercase">
                      {formNameLabel}
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="John Doe"
                      className="px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:border-gold-accent/40 focus:ring-1 focus:ring-gold-accent/20 outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs text-white/50 font-semibold uppercase">
                      {formEmailLabel}
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="john@example.com"
                      className="px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:border-gold-accent/40 focus:ring-1 focus:ring-gold-accent/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-xs text-white/50 font-semibold uppercase">
                    {formSubjectLabel}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    placeholder="Project Inquiry"
                    className="px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:border-gold-accent/40 focus:ring-1 focus:ring-gold-accent/20 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs text-white/50 font-semibold uppercase">
                    {formMessageLabel}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell me about your project or inquiry..."
                    className="px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:border-gold-accent/40 focus:ring-1 focus:ring-gold-accent/20 outline-none transition-all resize-none"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-lg bg-gold-accent hover:bg-gold-hover disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed text-black font-semibold tracking-wide transition-all shadow-lg hover:shadow-gold-accent/15 cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <Send className={`h-4 w-4 ${submitting ? "animate-pulse" : ""}`} />
                  {submitting ? "Submitting Inquiry..." : formButtonText}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

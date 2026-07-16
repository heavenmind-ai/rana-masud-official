"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Youtube } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.subject) return;

    // Fake submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col gap-12">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-bold text-gold-accent tracking-widest uppercase">Reach Out</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white">Contact Me</h1>
        <div className="h-0.5 w-16 bg-gold-accent mx-auto mt-4" />
        <p className="text-white/60 mt-6 leading-relaxed">
          Get in touch for film production details, commercial TVC creations, speaking assignments, or academic training opportunities.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        {/* Info Column */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">Office & Inquiries</h2>
            <div className="h-0.5 w-12 bg-gold-accent mt-1" />

            <div className="flex flex-col gap-5 mt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Location Address</h4>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    Block: A, Road: 02, House: 73, Flat: A/9, Niketon, Dhaka, Bangladesh.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Email Inquiries</h4>
                  <p className="text-xs text-white/50 mt-1">
                    <a href="mailto:info@ranamasudbd.com" className="hover:text-gold-accent transition-colors">info@ranamasudbd.com</a>
                  </p>
                  <p className="text-xs text-white/40">
                    <a href="mailto:ranaferywala@gmail.com" className="hover:text-gold-accent transition-colors">ranaferywala@gmail.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-accent/10 border border-gold-accent/20 flex items-center justify-center text-gold-accent shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Phone Contact</h4>
                  <p className="text-xs text-white/50 mt-1">
                    <a href="tel:+8801711704545" className="hover:text-gold-accent transition-colors">+8801711704545</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social connections */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Connect Digitally</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 hover:border-gold-accent/40 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-gold-accent transition-all cursor-pointer"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 hover:border-gold-accent/40 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-gold-accent transition-all cursor-pointer"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 hover:border-gold-accent/40 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-gold-accent transition-all cursor-pointer"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold text-white mb-6">Send Message</h2>
            {submitted ? (
              <div className="p-8 rounded-lg bg-gold-accent/10 border border-gold-accent/30 text-center flex flex-col gap-2">
                <Send className="h-8 w-8 text-gold-accent mx-auto animate-pulse" />
                <h4 className="font-bold text-white mt-2">Message Sent Successfully!</h4>
                <p className="text-xs text-white/60">Thank you. I will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs text-white/50 font-semibold uppercase">Your Name</label>
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
                    <label htmlFor="email" className="text-xs text-white/50 font-semibold uppercase">Email Address</label>
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
                  <label htmlFor="subject" className="text-xs text-white/50 font-semibold uppercase">Subject</label>
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
                  <label htmlFor="message" className="text-xs text-white/50 font-semibold uppercase">Message (Optional)</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell me about your project or inquiry..."
                    className="px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:border-gold-accent/40 focus:ring-1 focus:ring-gold-accent/20 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-gold-accent hover:bg-gold-hover text-black font-semibold tracking-wide transition-all shadow-lg hover:shadow-gold-accent/15 cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

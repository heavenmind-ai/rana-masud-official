"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Save, ArrowLeft, Image as ImageIcon, CheckCircle2, AlertCircle, Eye, Code } from "lucide-react";

export default function AdminBlogCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    
    // Convert text to slug
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, "-") // replace spaces/underscores with dashes
      .replace(/[^\w\u0980-\u09FF\-]+/g, ""); // allow alphanumeric, bengali characters, and dashes
    setSlug(generatedSlug);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, isCover = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();

      if (isCover) {
        setImage(url);
      } else {
        // Insert inline image at cursor
        const markdownCode = `![Image](${url})`;
        if (textareaRef.current) {
          const textarea = textareaRef.current;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = textarea.value;
          const newText = text.substring(0, start) + "\n" + markdownCode + "\n" + text.substring(end);
          setContent(newText);
        } else {
          setContent((prev) => `${prev}\n${markdownCode}\n`);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      setErrorMsg("Title and Slug are required fields.");
      return;
    }

    setSaveStatus("saving");
    setErrorMsg("");

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content,
          description,
          image,
          summary: description,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save request failed");
      }

      setSaveStatus("success");
      setTimeout(() => {
        router.push("/admin/blog");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Failed to create post.");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/admin/blog")}
            className="text-white/40 hover:text-white transition-colors cursor-pointer mr-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Create Blog Post</h1>
            <p className="text-sm text-white/50 mt-1">Compose a new dynamic blog post / news article.</p>
          </div>
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
              Publishing...
            </>
          ) : saveStatus === "success" ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Published!
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              Publish Post
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-600/10 border border-red-500/20 text-red-500 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor details form */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1 border-b border-white/5">Details</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Article Title</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="px-3 py-2 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40"
                placeholder="Post title in Bengali or English..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="px-3 py-2 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40 font-mono"
                placeholder="Generated-url-slug"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/40 font-bold uppercase">Summary / Excerpt</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-3 py-2 rounded bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-normal"
                placeholder="Brief summary sentence displayed in feed listing cards..."
              />
            </div>
          </div>

          {/* Body markdown editor */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/10 min-h-[400px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("write")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "write" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  <Code className="h-3.5 w-3.5" />
                  Markdown Workspace
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "preview" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Live Preview
                </button>
              </div>

              {/* Inline Upload */}
              <label className="text-[10px] bg-gold-accent/10 hover:bg-gold-accent/20 text-gold-accent border border-gold-accent/20 px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider transition-colors">
                <ImageIcon className="h-3.5 w-3.5" />
                Insert Image (R2)
                <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, false)} className="hidden" disabled={uploading} />
              </label>
            </div>

            {activeTab === "write" ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write post content here utilizing standard Markdown format..."
                className="w-full flex-1 p-4 rounded bg-black/20 border border-white/10 text-white text-sm outline-none focus:border-gold-accent/40 font-mono resize-none leading-relaxed"
                style={{ minHeight: "300px" }}
              />
            ) : (
              <div className="prose prose-invert max-w-none text-white/80 leading-relaxed text-sm text-left flex flex-col gap-4 p-4 rounded border border-white/5 bg-black/10">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-4 mb-1">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-bold text-white mt-4 mb-1">{children}</h2>,
                    p: ({ children }) => <p className="mb-3 text-white/70 leading-relaxed text-sm">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-5 mb-3 flex flex-col gap-1">{children}</ul>,
                    li: ({ children }) => <li className="text-white/70 text-xs">{children}</li>,
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-gold-accent hover:underline">
                        {children}
                      </a>
                    ),
                    img: ({ src, alt }) => (
                      <div className="relative my-4 rounded-lg overflow-hidden border border-white/10 shadow-lg bg-zinc-950">
                        <img src={src} alt={alt || "Post Media"} className="w-full object-cover max-h-[300px]" />
                      </div>
                    ),
                  }}
                >
                  {content || "*No content entered yet.*"}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Right column - cover photo */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 border border-white/10 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-2 border-b border-white/5">Cover Photo</h3>
            {image ? (
              <img src={image} alt="Cover Preview" className="w-full aspect-video object-cover rounded-lg border border-white/10 shadow-md bg-black" />
            ) : (
              <div className="w-full aspect-video bg-white/5 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-white/20 text-xs">
                No Cover Image uploaded
              </div>
            )}

            <label className="flex items-center justify-center gap-1.5 w-full py-2 rounded bg-gold-accent/10 hover:bg-gold-accent/20 border border-gold-accent/20 text-gold-accent text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors">
              <ImageIcon className="h-4 w-4 text-gold-accent" />
              {uploading ? "Uploading..." : "Upload Cover Image"}
              <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, true)} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

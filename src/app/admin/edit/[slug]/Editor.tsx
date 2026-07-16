"use client";

import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Save, Image as ImageIcon, Eye, Code, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface EditorProps {
  initialData: {
    slug: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    frontmatter: Record<string, any>;
    content: string;
  };
  assets: string[];
}

export default function Editor({ initialData, assets }: EditorProps) {
  const [frontmatter, setFrontmatter] = useState(initialData.frontmatter);
  const [content, setContent] = useState(initialData.content);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [copiedAsset, setCopiedAsset] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upload image");
      }

      const { url, filename } = await res.json();
      const markdownCode = `![${filename.split("/").pop()?.split(".")[0] || "Image"}](${url})`;

      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + "\n" + markdownCode + "\n" + text.substring(end);
        setContent(newText);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + markdownCode.length + 2, start + markdownCode.length + 2);
        }, 50);
      } else {
        setContent((prev) => `${prev}\n${markdownCode}\n`);
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const response = await fetch(`/api/pages/${encodeURIComponent(initialData.slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frontmatter, content }),
      });

      if (!response.ok) throw new Error("Save request failed");
      
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (error) {
      console.error(error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  const handleAssetClick = (assetPath: string) => {
    // Copy markdown code to clipboard
    const fileName = assetPath.split("/").pop() || "Image";
    const markdownCode = `![${fileName.split(".")[0]}](${assetPath})`;
    
    navigator.clipboard.writeText(markdownCode);
    setCopiedAsset(assetPath);
    setTimeout(() => setCopiedAsset(null), 2000);

    // Also insert at textarea cursor if textarea is focused
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const newText = text.substring(0, start) + "\n" + markdownCode + "\n" + text.substring(end);
      setContent(newText);
      textarea.focus();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 h-full min-h-0">
      {/* Edit Pane */}
      <div className="lg:col-span-7 flex flex-col gap-4 h-full min-h-0 bg-[#0c0c0e]/60 rounded-xl border border-white/10 p-5 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("write")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase flex items-center gap-1.5 cursor-pointer ${
                activeTab === "write" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              Editor Workspace
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase flex items-center gap-1.5 lg:hidden cursor-pointer ${
                activeTab === "preview" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Live Preview
            </button>
          </div>

          {/* Action Save Button */}
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
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

        {/* Frontmatter form inputs */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-gold-accent/70" />
            Meta Frontmatter (YAML)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-white/40 font-bold uppercase">Page Title</label>
              <input
                type="text"
                value={frontmatter.title || ""}
                onChange={(e) => setFrontmatter({ ...frontmatter, title: e.target.value })}
                className="px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-white/40 font-bold uppercase">Source Url</label>
              <input
                type="text"
                value={frontmatter.source || ""}
                onChange={(e) => setFrontmatter({ ...frontmatter, source: e.target.value })}
                className="px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-white/40 font-bold uppercase">Description / SEO Snippet</label>
            <textarea
              rows={2}
              value={frontmatter.description || ""}
              onChange={(e) => setFrontmatter({ ...frontmatter, description: e.target.value })}
              className="px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none"
            />
          </div>
        </div>

        {/* Body markdown text field */}
        <div className="flex-1 flex flex-col gap-2 min-h-[300px] mt-2">
          <label className="text-[10px] text-white/40 font-bold uppercase">Markdown Body</label>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type page markdown content here..."
            className="w-full flex-1 p-4 rounded-lg border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-gold-accent/40 font-mono resize-none leading-relaxed"
          />
        </div>

        {/* Cloudflare R2 Upload Area */}
        <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-white/5">
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-1">
            <ImageIcon className="h-3.5 w-3.5 text-gold-accent/70" />
            Media Upload (Cloudflare R2)
          </h4>
          <div className="flex flex-col sm:flex-row gap-4 items-center mt-1">
            <label className="flex flex-col items-center justify-center w-full sm:w-auto px-6 py-4 rounded-lg border border-dashed border-white/15 hover:border-gold-accent/40 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center text-xs font-semibold text-white/60 hover:text-white shrink-0">
              <ImageIcon className="h-5 w-5 text-gold-accent mb-1.5" />
              {uploading ? "Uploading file..." : "Select & Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <div className="flex-1 text-left">
              <p className="text-[10px] text-white/40 leading-normal">
                Supports JPG, PNG, WEBP, SVG, and GIF. Images are uploaded to Cloudflare R2 and inserted automatically into your Markdown body at your cursor position.
              </p>
              {uploadError && (
                <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{uploadError}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Pane */}
      <div className={`lg:col-span-5 flex flex-col bg-[#09090b] rounded-xl border border-white/10 p-5 h-full min-h-0 overflow-y-auto ${
        activeTab === "preview" ? "flex" : "hidden lg:flex"
      }`}>
        <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
          <Eye className="h-4 w-4 text-gold-accent" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Live Render Viewport</h3>
        </div>

        {/* Cinematic Preview Renderer */}
        <div className="prose prose-invert max-w-none text-white/80 leading-relaxed text-sm text-left flex flex-col gap-4">
          <h2 className="text-2xl font-serif font-bold text-white leading-tight">{frontmatter.title || "Untitle Page"}</h2>
          <div className="h-px bg-white/10 w-full mb-2" />
          
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
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

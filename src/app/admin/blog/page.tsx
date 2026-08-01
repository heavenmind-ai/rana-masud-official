"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Plus, Edit3, Trash2, Calendar, Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminBlogListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  // Feed settings
  const [blogBadgeText, setBlogBadgeText] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [headerText, setHeaderText] = useState("");

  useEffect(() => {
    async function initPage() {
      try {
        // Fetch posts
        const postsRes = await fetch("/api/blog");
        if (!postsRes.ok) throw new Error("Failed to load blog posts");
        const postsData = await postsRes.json();
        setPosts(postsData);

        // Fetch blog header config
        const metaRes = await fetch("/api/pages/blog");
        if (metaRes.ok) {
          const metaData = await metaRes.json();
          const fm = metaData.frontmatter || {};
          setBlogBadgeText(fm.blogBadgeText || "Articles");
          setBlogTitle(fm.blogTitle || "Director's Blog");
          setHeaderText(fm.headerText || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initPage();
  }, []);

  const handleSaveFeedConfig = async () => {
    setSaveStatus("saving");
    try {
      const frontmatter = {
        title: "Blog",
        blogBadgeText,
        blogTitle,
        headerText,
      };

      const res = await fetch("/api/pages/blog", {
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

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog post? This action is permanent.")) {
      return;
    }

    try {
      const res = await fetch(`/api/blog/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete post");
      
      // Update state
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error(err);
      alert("Failed to delete the blog post.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-gold-accent animate-spin" />
        <span className="ml-3 text-sm text-white/60">Loading blog manager...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left max-w-5xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-gold-accent" />
            Blog Manager
          </h1>
          <p className="text-sm text-white/50 mt-1">Write articles, publish press releases, and manage director&apos;s blog feed.</p>
        </div>

        <Link
          href="/admin/blog/create"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-gold-accent hover:bg-gold-hover text-black font-semibold text-xs transition-all cursor-pointer uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </Link>
      </div>

      {/* Feed headers config */}
      <div className="glass-card p-6 flex flex-col gap-4 border border-white/10">
        <div className="flex justify-between items-center pb-1 border-b border-white/5">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Blog Feed Header Config</h3>
          <button
            onClick={handleSaveFeedConfig}
            disabled={saveStatus === "saving"}
            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
              saveStatus === "saving"
                ? "bg-white/10 text-white/55"
                : saveStatus === "success"
                ? "bg-emerald-600 text-white"
                : saveStatus === "error"
                ? "bg-red-600 text-white"
                : "bg-gold-accent text-black hover:bg-gold-hover"
            }`}
          >
            {saveStatus === "saving" ? (
              "Saving..."
            ) : saveStatus === "success" ? (
              <>
                <CheckCircle2 className="h-3 w-3" /> Saved!
              </>
            ) : saveStatus === "error" ? (
              <>
                <AlertCircle className="h-3 w-3" /> Failed
              </>
            ) : (
              <>
                <Save className="h-3 w-3" /> Save Headers
              </>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/40 font-bold uppercase">Blog Page Badge</label>
            <input
              type="text"
              value={blogBadgeText}
              onChange={(e) => setBlogBadgeText(e.target.value)}
              className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              placeholder="e.g. Articles"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/40 font-bold uppercase">Blog Page Title</label>
            <input
              type="text"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40"
              placeholder="e.g. Director's Blog"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/40 font-bold uppercase">Blog Page Description</label>
          <textarea
            rows={2}
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
            className="px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/40 resize-none leading-normal"
            placeholder="e.g. Read articles, writeups, and press statements..."
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="glass-card p-6 border border-white/10">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pb-2 border-b border-white/5 mb-6">Blog Posts</h3>
        
        {posts.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-4">
            <BookOpen className="w-12 h-12 text-white/20" />
            <div>
              <h3 className="font-bold text-white text-lg">No posts found</h3>
              <p className="text-white/40 text-xs mt-1">Create your first blog post by clicking the &quot;Create Post&quot; button.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="flex items-center justify-between p-4 rounded bg-white/5 border border-white/5 hover:border-white/10 transition-all text-xs"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">{post.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-white/40 mt-0.5">
                    <Calendar className="h-3 w-3 text-gold-accent" />
                    <span>{post.frontmatter?.date || "No Date"}</span>
                    <span>&bull;</span>
                    <span className="font-mono text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-white/50">{post.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/blog/edit/${post.slug}`}
                    className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
                    title="Edit Post"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="p-2 rounded bg-red-950/20 hover:bg-red-900/30 border border-red-500/10 hover:border-red-500/30 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

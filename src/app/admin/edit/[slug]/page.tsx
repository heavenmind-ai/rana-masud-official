import React from "react";
import Link from "next/link";
import { getPageBySlug, getPageAssets } from "@/lib/content";
import Editor from "@/app/admin/edit/[slug]/Editor";
import { ArrowLeft } from "lucide-react";

export default async function PageEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  const pageData = await getPageBySlug(slug);

  const assets = await getPageAssets(slug);

  if (!pageData) {
    return (
      <div className="container mx-auto py-20 text-center flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-bold text-red-500 font-serif">Page Not Found</h1>
        <p className="text-white/60">Could not resolve content file for slug: &quot;{slug}&quot;</p>
        <Link href="/admin/pages" className="text-gold-accent hover:underline flex items-center gap-1.5 text-sm font-semibold">
          <ArrowLeft className="h-4 w-4" />
          Back to Page List
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8.5rem)] text-left">
      {/* Editor Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <Link href="/admin/pages" className="text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Edit: {pageData.title.split(" - ")[0]}</h1>
          </div>
          <p className="text-xs text-white/40 pl-6">Editing {pageData.contentFile}</p>
        </div>
      </div>

      {/* Editor Workspace Client Component */}
      <Editor
        initialData={{
          slug: pageData.slug,
          frontmatter: pageData.frontmatter,
          content: pageData.content,
        }}
        assets={assets}
      />
    </div>
  );
}

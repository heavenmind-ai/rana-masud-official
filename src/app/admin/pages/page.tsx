import React from "react";
import Link from "next/link";
import { getManifest } from "@/lib/content";
import { Edit3, ExternalLink, Image as ImageIcon } from "lucide-react";

export default async function AdminPagesListPage() {
  const manifest = await getManifest();

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-3xl font-bold text-white">Page Contents</h1>
        <p className="text-sm text-white/50 mt-1">Manage and edit markdown files corresponding to your site layout routes.</p>
      </div>

      {/* Pages Table */}
      <div className="glass-card overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 text-xs text-white/40 uppercase tracking-widest border-b border-white/10">
              <tr>
                <th scope="col" className="px-6 py-4">Page Title</th>
                <th scope="col" className="px-6 py-4">URL Path / Slug</th>
                <th scope="col" className="px-6 py-4 text-center">Lang</th>
                <th scope="col" className="px-6 py-4 text-center">Images</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {manifest.pages.map((page) => {
                // Check if slug is Bengali by checking if it contains percent encoding (%e0%a6...)
                const isBengali = page.slug.includes("%") || page.slug.match(/[\u0980-\u09FF]/);
                const decodedSlug = decodeURIComponent(page.slug);
                const pathSlug = page.slug === "home" ? "" : page.slug;
                const encodedEditSlug = encodeURIComponent(page.slug);

                return (
                  <tr key={page.slug} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      {page.title.split(" - ")[0]}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-white/50">
                      {decodedSlug}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isBengali ? "bg-[#ca8a04]/10 text-[#ca8a04] border border-[#ca8a04]/20" : "bg-[#27272a] text-[#a1a1aa] border border-white/5"
                      }`}>
                        {isBengali ? "BN" : "EN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-xs">
                      <span className="inline-flex items-center gap-1 text-white/40">
                        <ImageIcon className="h-3.5 w-3.5 text-gold-accent/70" />
                        {page.imageCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-3.5">
                      {/* Live preview link */}
                      <Link
                        href={`/${pathSlug}`}
                        target="_blank"
                        className="text-white/40 hover:text-gold-accent transition-colors flex items-center gap-0.5 text-xs font-semibold"
                      >
                        View
                        <ExternalLink className="h-3 w-3" />
                      </Link>

                      {/* Edit control */}
                      <Link
                        href={`/admin/edit/${encodedEditSlug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold-accent hover:bg-gold-hover text-black font-semibold text-xs transition-all cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

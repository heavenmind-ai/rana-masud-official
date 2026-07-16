import React from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, ArrowLeft, Shield } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#09090b] text-[#f4f4f5]">
      {/* Sidebar navigation */}
      <aside className="w-64 border-r border-white/10 bg-[#0c0c0e]/80 backdrop-blur-md flex flex-col justify-between p-6 shrink-0">
        <div className="flex flex-col gap-8">
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 text-gold-accent font-bold tracking-wider">
            <Shield className="h-6 w-6 text-gold-accent" />
            <span className="uppercase text-sm tracking-widest text-white">Admin Panel</span>
          </div>

          {/* Navigation link listings */}
          <nav className="flex flex-col gap-1.5 text-sm font-medium text-white/70">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <LayoutDashboard className="h-4 w-4 text-gold-accent" />
              Dashboard
            </Link>
            <Link
              href="/admin/pages"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <FileText className="h-4 w-4 text-gold-accent" />
              Page Content
            </Link>
          </nav>
        </div>

        {/* Bottom utility */}
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Site
          </Link>
          <div className="text-[10px] text-white/20 px-4 pt-2 border-t border-white/5">
            Rana Masud CMS v1.0
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-white/10 bg-[#09090b] flex items-center justify-between px-8">
          <h2 className="text-sm font-bold tracking-widest uppercase text-white/40">Workspace Area</h2>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-white/70">Local Database Sync Online</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

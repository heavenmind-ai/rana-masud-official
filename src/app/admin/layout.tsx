import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import AdminLoginForm from "@/components/AdminLoginForm";
import {
  LayoutDashboard,
  BarChart3,
  ArrowLeft,
  Shield,
  Settings,
  Home,
  User,
  Film,
  Award,
  Globe,
  Image,
  BookOpen,
  Newspaper,
  Tv,
  Sparkles,
  Mail,
  LogOut,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const isAuthenticated = await verifySession(token);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-[#f4f4f5] p-6">
        <AdminLoginForm />
      </div>
    );
  }

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
              href="/admin/stats"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <BarChart3 className="h-4 w-4 text-gold-accent" />
              Site Stats
            </Link>
            <Link
              href="/admin/home"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <Home className="h-4 w-4 text-gold-accent" />
              Home Page
            </Link>
            <Link
              href="/admin/biography"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <User className="h-4 w-4 text-gold-accent" />
              Biography
            </Link>
            <Link
              href="/admin/about"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <Sparkles className="h-4 w-4 text-gold-accent" />
              About Banner
            </Link>
            <Link
              href="/admin/filmography"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <Film className="h-4 w-4 text-gold-accent" />
              Filmography
            </Link>
            <Link
              href="/admin/awards"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <Award className="h-4 w-4 text-gold-accent" />
              Awards
            </Link>
            <Link
              href="/admin/festivals"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <Globe className="h-4 w-4 text-gold-accent" />
              Festivals
            </Link>
            <Link
              href="/admin/gallery"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <Image className="h-4 w-4 text-gold-accent" />
              Gallery Manager
            </Link>
            <Link
              href="/admin/blog"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <BookOpen className="h-4 w-4 text-gold-accent" />
              Blog Manager
            </Link>
            <Link
              href="/admin/press"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <Newspaper className="h-4 w-4 text-gold-accent" />
              Press Coverage
            </Link>
            <Link
              href="/admin/tv-shows"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <Tv className="h-4 w-4 text-gold-accent" />
              TV Shows
            </Link>
            <Link
              href="/admin/contact"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <Mail className="h-4 w-4 text-gold-accent" />
              Contact Details
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:text-white hover:bg-white/5 transition-all"
            >
              <Settings className="h-4 w-4 text-gold-accent" />
              Global Settings
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
          <a
            href="/api/admin/logout"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-500/60 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log Out
          </a>
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

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

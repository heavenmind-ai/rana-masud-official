export const dynamic = "force-dynamic";

import React from "react";
import { getPageBySlug } from "@/lib/content";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  const pageData = await getPageBySlug("gallery");

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error loading gallery.</h1>
      </div>
    );
  }

  const galleryItems = pageData.frontmatter.galleryItems || [
    {
      src: "/content/gallery/assets/Shooting-1-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "Shooting scene on location",
    },
    {
      src: "/content/gallery/assets/Shooting-3-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "Camera set-up overview",
    },
    {
      src: "/content/gallery/assets/Shooting-4-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "Director instructing actors",
    },
    {
      src: "/content/gallery/assets/rana-masud-seminar.jpg",
      category: "seminar",
      title: "Guest lecturer at Bangladesh Film Institute",
    },
    {
      src: "/content/gallery/assets/Film-Awards-Rana-Masud-2.jpg",
      category: "awards",
      title: "Receiving Best Short Film Laurel",
    },
    {
      src: "/content/gallery/assets/Rana-Masud-Awards-3.jpg",
      category: "awards",
      title: "Moroccan festival jury honors",
    },
    {
      src: "/content/gallery/assets/Rana-Masud-Awards-4.jpg",
      category: "awards",
      title: "Sat Rong Film Festival Trophy",
    },
    {
      src: "/content/gallery/assets/Shooting-5-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "On-set production crew briefing",
    },
    {
      src: "/content/gallery/assets/Shooting-7-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "Behind-the-scenes camera rig",
    },
    {
      src: "/content/gallery/assets/Shooting-10-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "Night shoot coordinates",
    },
    {
      src: "/content/gallery/assets/Shooting-14-Rana-Masud-Film-Director-scaled.jpg",
      category: "shooting",
      title: "Director reviewing script drafts",
    },
    {
      src: "/content/gallery/assets/Rana-Masud-Awards-11.png",
      category: "awards",
      title: "Official screening certificate",
    },
  ];

  const headerText =
    pageData.frontmatter.headerText ||
    "Explore production stills, behind-the-scenes shoots, award ceremonies, and BFI classroom highlights representing decades of filmmaking.";

  const badgeText = pageData.frontmatter.galleryBadgeText || "Moments";
  const titleText = pageData.frontmatter.galleryTitle || "Photo Gallery";

  return (
    <GalleryClient
      galleryItems={galleryItems}
      headerText={headerText}
      badgeText={badgeText}
      titleText={titleText}
    />
  );
}

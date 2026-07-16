import { connectToDatabase } from "./mongodb";
import { Page } from "@/models/Page";

export interface PageMetadata {
  url: string;
  slug: string;
  title: string;
  contentFile: string;
  assetsDir: string;
  imageCount: number;
}

export interface ManifestData {
  pages: PageMetadata[];
}

export interface PageData extends PageMetadata {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontmatter: Record<string, any>;
  content: string;
  rawMarkdown: string;
}

// Ensure the symbolic link is set up (noop in database mode)
export function setupContentAssetsLink() {}

// Get the manifest list of all pages
export async function getManifest(): Promise<ManifestData> {
  try {
    await connectToDatabase();
    const pages = await Page.find({}, "slug title frontmatter content").lean();
    
    return {
      pages: pages.map((p: any) => {
        // Count image references in markdown content
        const imageCount = (p.content.match(/\!\[.*?\]\(.*?\)/g) || []).length;
        return {
          slug: p.slug,
          title: p.title || p.frontmatter?.title || p.slug,
          url: `/${p.slug === "home" ? "" : p.slug}`,
          contentFile: `output/content/${p.slug}/index.md`,
          assetsDir: `output/content/${p.slug}/assets`,
          imageCount,
        };
      }),
    };
  } catch (error) {
    console.error("Failed to fetch manifest from DB:", error);
    return { pages: [] };
  }
}

// Fetch single page data by slug
export async function getPageBySlug(slug: string): Promise<PageData | null> {
  try {
    await connectToDatabase();
    const page = await Page.findOne({ slug }).lean() as any;
    if (!page) return null;

    const imageCount = (page.content.match(/\!\[.*?\]\(.*?\)/g) || []).length;

    return {
      slug: page.slug,
      title: page.title || page.frontmatter?.title || page.slug,
      url: `/${page.slug === "home" ? "" : page.slug}`,
      contentFile: `output/content/${page.slug}/index.md`,
      assetsDir: `output/content/${page.slug}/assets`,
      imageCount,
      frontmatter: page.frontmatter || {},
      content: page.content || "",
      rawMarkdown: "",
    };
  } catch (error) {
    console.error(`Failed to fetch page ${slug} from DB:`, error);
    return null;
  }
}

// Save single page data back to database
export async function savePageData(
  slug: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontmatter: Record<string, any>,
  content: string
): Promise<boolean> {
  try {
    await connectToDatabase();
    const title = frontmatter.title || slug;
    const description = frontmatter.description || "";

    const result = await Page.findOneAndUpdate(
      { slug },
      {
        $set: {
          title,
          description,
          frontmatter,
          content,
        },
      },
      { upsert: true, new: true }
    );

    return !!result;
  } catch (error) {
    console.error(`Failed to save page ${slug} to DB:`, error);
    return false;
  }
}

// Helper to scan files in a page's assets directory (empty for DB-first mode)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getPageAssets(slug: string): Promise<string[]> {
  return [];
}

import type { Metadata } from "next";

export async function generatePageMetadata(
  slug: string,
  defaultTitle: string,
  defaultDesc: string
): Promise<Metadata> {
  const page = await getPageBySlug(slug);
  if (!page || !page.frontmatter) {
    return {
      title: defaultTitle,
      description: defaultDesc,
    };
  }

  const fm = page.frontmatter;
  const title = fm.seoTitle || fm.title || defaultTitle;
  const description = fm.seoDescription || fm.description || defaultDesc;
  const keywords = fm.seoKeywords
    ? fm.seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
    : undefined;

  const metadata: Metadata = {
    title,
    description,
    keywords,
  };

  if (fm.seoOgImage) {
    metadata.openGraph = {
      title,
      description,
      images: [
        {
          url: fm.seoOgImage,
          alt: title,
        },
      ],
    };
    metadata.twitter = {
      card: "summary_large_image",
      title,
      description,
      images: [fm.seoOgImage],
    };
  }

  return metadata;
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Constants mapping to local directories
const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.join(ROOT_DIR, "output");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "manifest.json");
const CONTENT_DIR = path.join(OUTPUT_DIR, "content");
const PUBLIC_CONTENT_DIR = path.join(ROOT_DIR, "public", "content");

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

// Ensure the symbolic link or public folder is set up for assets
export function setupContentAssetsLink() {
  try {
    if (!fs.existsSync(path.dirname(PUBLIC_CONTENT_DIR))) {
      fs.mkdirSync(path.dirname(PUBLIC_CONTENT_DIR), { recursive: true });
    }

    if (!fs.existsSync(PUBLIC_CONTENT_DIR)) {
      // Create symlink from output/content to public/content for Next.js to serve images
      fs.symlinkSync(CONTENT_DIR, PUBLIC_CONTENT_DIR, "dir");
      console.log("Created content assets symlink in public folder.");
    }
  } catch (error) {
    console.error("Failed to link assets directory. Trying to copy key assets as fallback.", error);
  }
}

// Get the manifest list of all pages
export function getManifest(): ManifestData {
  setupContentAssetsLink();
  if (!fs.existsSync(MANIFEST_PATH)) {
    return { pages: [] };
  }
  const data = fs.readFileSync(MANIFEST_PATH, "utf8");
  return JSON.parse(data) as ManifestData;
}

// Save the manifest data
export function saveManifest(manifest: ManifestData) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
}

// Process markdown content to replace relative image paths with public URLs
export function processMarkdownImages(content: string, slug: string): string {
  // Replace references like `./assets/image.jpg` with `/content/slug/assets/image.jpg`
  // Also matches simple `assets/image.jpg`
  const regex = /(\!\[.*?\]\()(\.\/)?(assets\/[^\)]+)(\))/g;
  return content.replace(regex, (match, p1, p2, p3, p4) => {
    return `${p1}/content/${slug}/${p3}${p4}`;
  });
}

// Revert public URLs back to local markdown paths before saving
export function revertMarkdownImages(content: string, slug: string): string {
  // Replaces `/content/slug/assets/image.jpg` back to `./assets/image.jpg`
  const regex = new RegExp(`(\\!\\[.*?\\]\\()(\\/content\\/${slug}\\/)(assets\\/[^\\)]+)(\\))`, "g");
  return content.replace(regex, (match, p1, p2, p3, p4) => {
    return `${p1}./${p3}${p4}`;
  });
}

// Fetch single page data by slug
export function getPageBySlug(slug: string): PageData | null {
  const manifest = getManifest();
  const pageMeta = manifest.pages.find((p) => p.slug === slug || encodeURIComponent(p.slug) === slug);
  if (!pageMeta) return null;

  const fullPath = path.join(OUTPUT_DIR, pageMeta.contentFile);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data: frontmatter, content } = matter(fileContents);

  // Process the content body to make image URLs resolve correctly in Next.js
  const processedContent = processMarkdownImages(content, pageMeta.slug);

  return {
    ...pageMeta,
    frontmatter,
    content: processedContent,
    rawMarkdown: fileContents,
  };
}

// Save single page data back to files
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function savePageData(slug: string, frontmatter: Record<string, any>, content: string): boolean {
  const manifest = getManifest();
  const pageIndex = manifest.pages.findIndex((p) => p.slug === slug);
  if (pageIndex === -1) return false;

  const pageMeta = manifest.pages[pageIndex];
  const fullPath = path.join(OUTPUT_DIR, pageMeta.contentFile);

  // Revert content image URLs back to standard `./assets/` markdown style
  const revertedContent = revertMarkdownImages(content, slug);

  // Build markdown structure with gray-matter stringify
  const newFileContent = matter.stringify(revertedContent, frontmatter);

  fs.writeFileSync(fullPath, newFileContent, "utf8");

  // Update title in manifest if it changed in frontmatter
  if (frontmatter.title && frontmatter.title !== pageMeta.title) {
    manifest.pages[pageIndex].title = frontmatter.title;
    saveManifest(manifest);
  }

  return true;
}

// Helper to scan files directly in a page's assets directory
export function getPageAssets(slug: string): string[] {
  const manifest = getManifest();
  const pageMeta = manifest.pages.find((p) => p.slug === slug);
  if (!pageMeta) return [];

  const assetsFullPath = path.join(OUTPUT_DIR, pageMeta.assetsDir);
  if (!fs.existsSync(assetsFullPath)) return [];

  try {
    const files = fs.readdirSync(assetsFullPath);
    return files
      .filter((file) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
      .map((file) => `/content/${slug}/assets/${file}`);
  } catch (error) {
    console.error("Failed to read assets directory:", error);
    return [];
  }
}

/**
 * scrape-site.mjs
 * ------------------------------------------------------------------
 * Run this LOCALLY (on your own machine, not in a sandbox) with:
 *
 *   npm install cheerio node-fetch p-limit
 *   node scrape-site.mjs
 *
 * What it does:
 *   1. Discovers all pages on the target site (via sitemap.xml, falling
 *      back to a same-domain link crawl if no sitemap exists).
 *   2. For each page, extracts structured content (title, headings,
 *      paragraphs, lists, links, images) and writes a clean .md file.
 *   3. Downloads every image referenced anywhere on the site into
 *      ./output/public/images/, preserving unique filenames.
 *   4. Rewrites image paths in the generated markdown to point at the
 *      local copies, so nothing depends on the old domain anymore.
 *
 * Output structure:
 *   output/
 *     content/            <- one .md file per page
 *     public/images/       <- every downloaded image
 *     manifest.json         <- map of every page + every image found
 * ------------------------------------------------------------------
 */

import fs from "fs/promises";
import path from "path";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import pLimit from "p-limit";

const BASE_URL = "https://ranamasudbd.com"; // <-- change if needed
const OUT_DIR = "./output";
const CONTENT_DIR = path.join(OUT_DIR, "content");
const IMAGES_DIR = path.join(OUT_DIR, "public/images");
const CONCURRENCY = 4;

const limit = pLimit(CONCURRENCY);
const visited = new Set();
const imageManifest = new Map(); // originalUrl -> localFilename
const pageManifest = [];

// ---------- helpers ----------

function toAbsoluteUrl(url, base) {
  try {
    return new URL(url, base).href;
  } catch {
    return null;
  }
}

function sameDomain(url) {
  try {
    return new URL(url).hostname === new URL(BASE_URL).hostname;
  } catch {
    return false;
  }
}

function slugFromUrl(url) {
  const u = new URL(url);
  let p = u.pathname.replace(/\/$/, "");
  if (p === "" || p === "/") return "home";
  return p.replace(/^\//, "").replace(/\//g, "-");
}

function safeFilenameFromUrl(url) {
  const u = new URL(url);
  const base = path.basename(u.pathname).split("?")[0];
  return base || `image-${Date.now()}`;
}

async function ensureDirs() {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });
}

// ---------- sitemap discovery ----------

async function getUrlsFromSitemap() {
  const candidates = ["/sitemap.xml", "/sitemap_index.xml"];
  for (const c of candidates) {
    try {
      const res = await fetch(BASE_URL + c);
      if (!res.ok) continue;
      const xml = await res.text();
      const $ = cheerio.load(xml, { xmlMode: true });
      const locs = $("loc")
        .map((_, el) => $(el).text().trim())
        .get();
      if (locs.length) return locs.filter(sameDomain);
    } catch {
      // ignore, try next candidate
    }
  }
  return [];
}

// ---------- link crawl fallback ----------

async function crawlLinks(startUrl, maxPages = 200) {
  const queue = [startUrl];
  const found = new Set();

  while (queue.length && found.size < maxPages) {
    const url = queue.shift();
    if (found.has(url)) continue;
    found.add(url);

    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        const abs = toAbsoluteUrl(href, url);
        if (abs && sameDomain(abs) && !abs.includes("#") && !found.has(abs)) {
          queue.push(abs.split("?")[0]);
        }
      });
    } catch (e) {
      console.warn("Failed to crawl", url, e.message);
    }
  }
  return [...found];
}

// ---------- image downloading ----------

async function downloadImage(imgUrl) {
  if (imageManifest.has(imgUrl)) return imageManifest.get(imgUrl);

  let filename = safeFilenameFromUrl(imgUrl);
  // de-duplicate filenames
  let finalName = filename;
  let counter = 1;
  while ([...imageManifest.values()].includes(finalName)) {
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);
    finalName = `${base}-${counter}${ext}`;
    counter++;
  }

  try {
    const res = await fetch(imgUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    await fs.writeFile(path.join(IMAGES_DIR, finalName), Buffer.from(buffer));
    imageManifest.set(imgUrl, finalName);
    console.log("Downloaded image:", imgUrl, "->", finalName);
    return finalName;
  } catch (e) {
    console.warn("Failed to download image:", imgUrl, e.message);
    imageManifest.set(imgUrl, null);
    return null;
  }
}

// ---------- content extraction ----------

function extractContentAsMarkdown($, pageUrl) {
  const title = $("title").text().trim() || $("h1").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content") || "";

  let md = `---\n`;
  md += `title: "${title.replace(/"/g, '\\"')}"\n`;
  md += `description: "${metaDescription.replace(/"/g, '\\"')}"\n`;
  md += `source: "${pageUrl}"\n`;
  md += `---\n\n`;

  const imageUrls = [];

  // Walk the main content area (fallback to body)
  const root = $("main").length ? $("main") : $("body");

  root
    .find("h1, h2, h3, h4, p, li, img, blockquote")
    .each((_, el) => {
      const tag = el.tagName.toLowerCase();
      const $el = $(el);

      if (tag.match(/^h[1-4]$/)) {
        const level = Number(tag[1]);
        const text = $el.text().trim();
        if (text) md += `${"#".repeat(level)} ${text}\n\n`;
      } else if (tag === "p") {
        const text = $el.text().trim();
        if (text) md += `${text}\n\n`;
      } else if (tag === "li") {
        const text = $el.text().trim();
        if (text) md += `- ${text}\n`;
      } else if (tag === "blockquote") {
        const text = $el.text().trim();
        if (text) md += `> ${text}\n\n`;
      } else if (tag === "img") {
        const src = $el.attr("src") || $el.attr("data-src");
        const alt = $el.attr("alt") || "";
        const abs = toAbsoluteUrl(src, pageUrl);
        if (abs) {
          imageUrls.push(abs);
          md += `![${alt}](__IMG__${abs}__IMG__)\n\n`;
        }
      }
    });

  return { md, imageUrls, title };
}

// ---------- page processing ----------

async function processPage(pageUrl) {
  if (visited.has(pageUrl)) return;
  visited.add(pageUrl);

  try {
    const res = await fetch(pageUrl);
    if (!res.ok) {
      console.warn("Skipping (bad status):", pageUrl, res.status);
      return;
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    const { md, imageUrls, title } = extractContentAsMarkdown($, pageUrl);

    // download all images referenced on this page
    const localNames = await Promise.all(
      imageUrls.map((url) => limit(() => downloadImage(url)))
    );

    // rewrite placeholders with local paths
    let finalMd = md;
    imageUrls.forEach((url, i) => {
      const local = localNames[i];
      const replacement = local ? `/images/${local}` : url; // fallback to original if download failed
      finalMd = finalMd.replaceAll(`__IMG__${url}__IMG__`, replacement);
    });

    const slug = slugFromUrl(pageUrl);
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    await fs.writeFile(filePath, finalMd, "utf-8");

    pageManifest.push({ url: pageUrl, slug, title, file: `content/${slug}.md` });
    console.log("Saved page:", pageUrl, "->", filePath);
  } catch (e) {
    console.warn("Failed to process page:", pageUrl, e.message);
  }
}

// ---------- main ----------

async function main() {
  await ensureDirs();

  let urls = await getUrlsFromSitemap();
  if (!urls.length) {
    console.log("No sitemap found, falling back to link crawl...");
    urls = await crawlLinks(BASE_URL);
  }
  if (!urls.includes(BASE_URL)) urls.unshift(BASE_URL);

  console.log(`Found ${urls.length} pages. Starting scrape...`);

  await Promise.all(urls.map((u) => limit(() => processPage(u))));

  await fs.writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(
      {
        pages: pageManifest,
        images: [...imageManifest.entries()].map(([original, local]) => ({
          original,
          local,
        })),
      },
      null,
      2
    )
  );

  console.log("\nDone!");
  console.log(`Pages saved: ${pageManifest.length}`);
  console.log(`Images downloaded: ${[...imageManifest.values()].filter(Boolean).length}`);
}

main().catch(console.error);

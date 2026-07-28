/**
 * scrape-site-v2.mjs
 * ------------------------------------------------------------------
 * Run LOCALLY (not in a sandbox):
 *
 *   npm install cheerio node-fetch p-limit
 *   node scrape-site-v2.mjs
 *
 * Fixes vs v1:
 *   - Properly resolves WordPress-style sitemap INDEXES
 *     (sitemap.xml -> page-sitemap.xml / post-sitemap.xml / ... -> real URLs)
 *   - Each page gets its own folder: content/<slug>/index.md + content/<slug>/assets/*
 *   - Also grabs images from data-src, data-lazy-src, srcset, and inline
 *     background-image styles (common in slider plugins/WordPress themes)
 *   - Wider content capture (not just <main>) since many WP themes don't
 *     wrap content semantically
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
const CONCURRENCY = 4;
const MAX_PAGES = 300;

const limit = pLimit(CONCURRENCY);
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
  return p.replace(/^\//, "").replace(/\//g, "-") || "home";
}

function safeFilenameFromUrl(url) {
  const u = new URL(url);
  const base = path.basename(u.pathname).split("?")[0];
  return base || `image-${Date.now()}`;
}

// ---------- sitemap resolution (recursive) ----------

async function fetchXml(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const xml = await res.text();
    return cheerio.load(xml, { xmlMode: true });
  } catch {
    return null;
  }
}

// Returns a flat list of real page URLs (not sitemap files themselves)
async function resolveSitemapUrls(sitemapUrl, seen = new Set()) {
  if (seen.has(sitemapUrl)) return [];
  seen.add(sitemapUrl);

  const $ = await fetchXml(sitemapUrl);
  if (!$) return [];

  // Case 1: this is a sitemap INDEX -> <sitemapindex><sitemap><loc>...
  const nestedSitemaps = $("sitemapindex > sitemap > loc")
    .map((_, el) => $(el).text().trim())
    .get();

  if (nestedSitemaps.length) {
    let all = [];
    for (const nested of nestedSitemaps) {
      const urls = await resolveSitemapUrls(nested, seen);
      all = all.concat(urls);
    }
    return all;
  }

  // Case 2: this is a URL SET -> <urlset><url><loc>...
  const urls = $("urlset > url > loc")
    .map((_, el) => $(el).text().trim())
    .get();

  return urls.filter(sameDomain);
}

async function getAllPageUrls() {
  const urls = await resolveSitemapUrls(`${BASE_URL}/sitemap.xml`);
  const unique = [...new Set(urls)];
  // filter out any stray sitemap-looking urls just in case
  return unique.filter((u) => !u.includes("sitemap") || !u.endsWith(".xml"));
}

// ---------- link crawl fallback ----------

async function crawlLinks(startUrl, maxPages = MAX_PAGES) {
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
        if (
          abs &&
          sameDomain(abs) &&
          !abs.includes("#") &&
          !abs.includes("wp-admin") &&
          !abs.includes("/feed") &&
          !found.has(abs)
        ) {
          queue.push(abs.split("?")[0]);
        }
      });
    } catch (e) {
      console.warn("Failed to crawl", url, e.message);
    }
  }
  return [...found];
}

// ---------- image downloading (per-page assets folder) ----------

async function downloadImageTo(imgUrl, assetsDir, usedNames) {
  let filename = safeFilenameFromUrl(imgUrl);
  let finalName = filename;
  let counter = 1;
  while (usedNames.has(finalName)) {
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);
    finalName = `${base}-${counter}${ext}`;
    counter++;
  }
  usedNames.add(finalName);

  try {
    const res = await fetch(imgUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    await fs.writeFile(path.join(assetsDir, finalName), Buffer.from(buffer));
    return finalName;
  } catch (e) {
    console.warn("Failed to download image:", imgUrl, e.message);
    return null;
  }
}

// ---------- content + image extraction ----------

function extractImagesFromPage($, pageUrl) {
  const found = new Set();

  $("img").each((_, el) => {
    const $el = $(el);
    const candidates = [
      $el.attr("src"),
      $el.attr("data-src"),
      $el.attr("data-lazy-src"),
    ].filter(Boolean);
    candidates.forEach((c) => {
      const abs = toAbsoluteUrl(c, pageUrl);
      if (abs) found.add(abs);
    });
    const srcset = $el.attr("srcset") || $el.attr("data-srcset");
    if (srcset) {
      srcset.split(",").forEach((part) => {
        const url = part.trim().split(" ")[0];
        const abs = toAbsoluteUrl(url, pageUrl);
        if (abs) found.add(abs);
      });
    }
  });

  // inline background-image styles
  $("[style*='background']").each((_, el) => {
    const style = $(el).attr("style") || "";
    const match = style.match(/background-image\s*:\s*url\((['"]?)(.*?)\1\)/i);
    if (match) {
      const abs = toAbsoluteUrl(match[2], pageUrl);
      if (abs) found.add(abs);
    }
  });

  // data attributes some slider plugins use for backgrounds
  $("[data-fill-mode], [data-bg], [data-thumb], [data-background]").each((_, el) => {
    const $el = $(el);
    ["data-bg", "data-thumb", "data-background"].forEach((attr) => {
      const val = $el.attr(attr);
      if (val) {
        const abs = toAbsoluteUrl(val, pageUrl);
        if (abs) found.add(abs);
      }
    });
  });

  return [...found];
}

function extractContentAsMarkdown($, pageUrl, imageUrlToLocal) {
  const title = $("title").text().trim() || $("h1").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content") || "";

  let md = `---\n`;
  md += `title: "${title.replace(/"/g, '\\"')}"\n`;
  md += `description: "${metaDescription.replace(/"/g, '\\"')}"\n`;
  md += `source: "${pageUrl}"\n`;
  md += `---\n\n`;

  // Exclude nav/header/footer/script/style/noscript from content walk
  $("script, style, noscript, header, footer, nav").remove();

  const root = $("body");

  root
    .find("h1, h2, h3, h4, h5, p, li, img, blockquote, a")
    .each((_, el) => {
      const tag = el.tagName.toLowerCase();
      const $el = $(el);

      if (tag.match(/^h[1-5]$/)) {
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
        const candidates = [
          $el.attr("src"),
          $el.attr("data-src"),
          $el.attr("data-lazy-src"),
        ].filter(Boolean);
        const raw = candidates[0];
        const alt = $el.attr("alt") || "";
        const abs = raw ? toAbsoluteUrl(raw, pageUrl) : null;
        if (abs) {
          const local = imageUrlToLocal.get(abs);
          md += `![${alt}](${local ? `./assets/${local}` : abs})\n\n`;
        }
      } else if (tag === "a") {
        const text = $el.text().trim();
        const href = $el.attr("href");
        if (text && href && !href.startsWith("#") && text.length > 1) {
          const abs = toAbsoluteUrl(href, pageUrl);
          md += `[${text}](${abs || href})\n\n`;
        }
      }
    });

  return md;
}

// ---------- page processing ----------

async function processPage(pageUrl) {
  try {
    const res = await fetch(pageUrl);
    if (!res.ok) {
      console.warn("Skipping (bad status):", pageUrl, res.status);
      return;
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    const slug = slugFromUrl(pageUrl);
    const pageDir = path.join(CONTENT_DIR, slug);
    const assetsDir = path.join(pageDir, "assets");
    await fs.mkdir(assetsDir, { recursive: true });

    const imageUrls = extractImagesFromPage($, pageUrl);
    const usedNames = new Set();
    const imageUrlToLocal = new Map();

    for (const url of imageUrls) {
      const local = await limit(() => downloadImageTo(url, assetsDir, usedNames));
      if (local) imageUrlToLocal.set(url, local);
    }

    const md = extractContentAsMarkdown($, pageUrl, imageUrlToLocal);
    await fs.writeFile(path.join(pageDir, "index.md"), md, "utf-8");

    const title = $("title").text().trim();
    pageManifest.push({
      url: pageUrl,
      slug,
      title,
      contentFile: `content/${slug}/index.md`,
      assetsDir: `content/${slug}/assets`,
      imageCount: imageUrlToLocal.size,
    });
    console.log(`Saved: ${pageUrl} -> content/${slug}/  (${imageUrlToLocal.size} images)`);
  } catch (e) {
    console.warn("Failed to process page:", pageUrl, e.message);
  }
}

// ---------- main ----------

async function main() {
  await fs.mkdir(CONTENT_DIR, { recursive: true });

  let urls = await getAllPageUrls();
  console.log(`Sitemap resolved ${urls.length} real page URLs.`);

  if (urls.length < 2) {
    console.log("Sitemap yielded too few pages, falling back to link crawl...");
    urls = await crawlLinks(BASE_URL);
  }
  if (!urls.includes(BASE_URL) && !urls.includes(`${BASE_URL}/`)) {
    urls.unshift(BASE_URL);
  }

  console.log(`Processing ${urls.length} pages...\n`);

  // Process sequentially-ish per page (images inside are already limited),
  // but allow a few pages in flight at once.
  const pageLimit = pLimit(2);
  await Promise.all(urls.map((u) => pageLimit(() => processPage(u))));

  await fs.writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify({ pages: pageManifest }, null, 2)
  );

  console.log("\nDone!");
  console.log(`Pages saved: ${pageManifest.length}`);
  console.log(
    `Total images downloaded: ${pageManifest.reduce((sum, p) => sum + p.imageCount, 0)}`
  );
}

main().catch(console.error);

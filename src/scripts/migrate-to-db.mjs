import fs from "fs";
import path from "path";
import matter from "gray-matter";
import mongoose from "mongoose";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// 1. Load env variables from .env.local manually
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

console.log("Migration Script Started.");
console.log("MONGODB_URI configured:", !!MONGODB_URI);
console.log(
  "R2 configured:",
  !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME)
);

if (!MONGODB_URI || MONGODB_URI.includes("<username>")) {
  console.error(
    "CRITICAL: MONGODB_URI is not set or still contains placeholders in .env.local"
  );
  process.exit(1);
}

// 2. Initialize S3 client for R2
let r2Client = null;
const isR2Configured = !!(
  R2_ACCOUNT_ID &&
  R2_ACCESS_KEY_ID &&
  R2_SECRET_ACCESS_KEY &&
  R2_BUCKET_NAME
);
if (isR2Configured) {
  r2Client = new S3Client({
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    region: "auto",
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
} else {
  console.log(
    "Warning: R2 is not fully configured. Images will NOT be uploaded to R2 (local paths will be kept as fallbacks)."
  );
}

// 3. Define Schemas inline
const PageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    content: { type: String, default: "" },
    frontmatter: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { updatedAt: true, createdAt: false } }
);

const Page = mongoose.models.Page || mongoose.model("Page", PageSchema);

const GlobalSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const GlobalSettings =
  mongoose.models.GlobalSettings || mongoose.model("GlobalSettings", GlobalSettingsSchema);

// Helper function to upload local file to R2
async function uploadToR2(localPath, slug) {
  if (!r2Client) return null;
  if (!fs.existsSync(localPath)) {
    console.error(`Asset file not found: ${localPath}`);
    return null;
  }

  try {
    const buffer = fs.readFileSync(localPath);
    const fileName = path.basename(localPath);
    const r2Key = `uploads/${slug}/${fileName}`;
    const cleanPublicUrl = R2_PUBLIC_URL.endsWith("/")
      ? R2_PUBLIC_URL
      : `${R2_PUBLIC_URL}/`;

    let contentType = "image/png";
    if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) contentType = "image/jpeg";
    else if (fileName.endsWith(".webp")) contentType = "image/webp";
    else if (fileName.endsWith(".svg")) contentType = "image/svg+xml";
    else if (fileName.endsWith(".gif")) contentType = "image/gif";

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: r2Key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    console.log(`Uploaded to R2: ${localPath} -> ${cleanPublicUrl}${r2Key}`);
    return `${cleanPublicUrl}${r2Key}`;
  } catch (error) {
    console.error(`R2 upload failed for ${localPath}:`, error.message);
    return null;
  }
}

// Helper to extract and replace image paths in markdown content
async function processMarkdownAndUploadImages(content, assetsDir, slug) {
  const regex = /\!\[(.*?)\]\((.*?)\)/g;
  let match;
  let newContent = content;

  const matches = [];
  while ((match = regex.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      alt: match[1],
      imagePath: match[2],
    });
  }

  for (const m of matches) {
    if (
      m.imagePath.startsWith("http://") ||
      m.imagePath.startsWith("https://") ||
      m.imagePath.startsWith("//")
    ) {
      continue;
    }

    let localImagePath = m.imagePath;
    if (localImagePath.startsWith("./")) {
      localImagePath = localImagePath.slice(2);
    }

    const resolvedLocalPath = path.join(
      process.cwd(),
      "output",
      assetsDir,
      localImagePath
    );
    const r2Url = await uploadToR2(resolvedLocalPath, slug);
    if (r2Url) {
      newContent = newContent.replace(m.fullMatch, `![${m.alt}](${r2Url})`);
    }
  }

  return newContent;
}

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    const manifestPath = path.join(process.cwd(), "output", "manifest.json");
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Manifest not found at ${manifestPath}`);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    console.log(`Found ${manifest.pages.length} pages in local manifest.`);

    for (const pageMeta of manifest.pages) {
      console.log(`\nMigrating page: ${pageMeta.slug}...`);
      const fullPath = path.join(process.cwd(), "output", pageMeta.contentFile);

      if (!fs.existsSync(fullPath)) {
        console.error(`Markdown file not found: ${fullPath}`);
        continue;
      }

      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data: frontmatter, content } = matter(fileContents);

      const processedContent = await processMarkdownAndUploadImages(
        content,
        pageMeta.assetsDir,
        pageMeta.slug
      );

      const processedFrontmatter = { ...frontmatter };

      // Upload frontmatter images
      for (const [key, value] of Object.entries(processedFrontmatter)) {
        if (
          typeof value === "string" &&
          /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value) &&
          !value.startsWith("http")
        ) {
          let localImagePath = value;
          if (localImagePath.startsWith("./")) {
            localImagePath = localImagePath.slice(2);
          }
          if (localImagePath.startsWith("/content/")) {
            const parts = localImagePath.split("/");
            localImagePath = parts.slice(3).join("/");
          }
          const resolvedLocalPath = path.join(
            process.cwd(),
            "output",
            pageMeta.assetsDir,
            localImagePath
          );
          const r2Url = await uploadToR2(resolvedLocalPath, pageMeta.slug);
          if (r2Url) {
            processedFrontmatter[key] = r2Url;
          }
        }
      }

      await Page.findOneAndUpdate(
        { slug: pageMeta.slug },
        {
          $set: {
            slug: pageMeta.slug,
            title: pageMeta.title,
            description: processedFrontmatter.description || "",
            frontmatter: processedFrontmatter,
            content: processedContent,
          },
        },
        { upsert: true, new: true }
      );

      console.log(`Page ${pageMeta.slug} successfully saved to DB.`);
    }

    // Seed default global settings for Header and Footer
    console.log("\nSetting up initial dynamic settings...");

    const defaultHeader = {
      logoText: "Rana Masud",
      logoIcon: "Film",
      menuLinks: [
        { label: "Home", href: "/" },
        { label: "Biography", href: "/biography" },
        { label: "Filmography", href: "/filmography" },
        { label: "Awards", href: "/awards" },
        { label: "Festivals", href: "/festivals" },
        { label: "Gallery", href: "/gallery" },
        { label: "Press", href: "/press" },
        { label: "TV Shows", href: "/tv-shows" },
        { label: "Contact", href: "/contact" },
      ],
    };

    const defaultFooter = {
      copyrightText: `© ${new Date().getFullYear()} Rana Masud. All Rights Reserved. Powered by Next.js.`,
      brandName: "RANA MASUD",
      brandSubtitle: "Film Director • Producer • Teacher",
      contactEmail: "info@ranamasudbd.com",
      contactPhone: "+8801711704545",
      address: "Block: A, Road: 02, House: 73, Flat: A/9, Niketon, Dhaka, Bangladesh.",
      socials: {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        youtube: "https://youtube.com",
        imdb: "https://www.imdb.com/name/nm7851085/",
      },
    };

    await GlobalSettings.findOneAndUpdate(
      { key: "header" },
      { $setOnInsert: { data: defaultHeader } },
      { upsert: true, new: true }
    );
    console.log("Dynamic Header settings initialized.");

    await GlobalSettings.findOneAndUpdate(
      { key: "footer" },
      { $setOnInsert: { data: defaultFooter } },
      { upsert: true, new: true }
    );
    console.log("Dynamic Footer settings initialized.");

    console.log("\nMigration completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

migrate();

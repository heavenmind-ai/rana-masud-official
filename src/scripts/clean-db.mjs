import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";

// Load env variables
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

async function clean() {
  console.log("Starting Clean-Up Script...");

  // 1. Clear Cloudflare R2 Bucket
  const isR2Configured = !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);
  if (isR2Configured) {
    console.log("Cleaning Cloudflare R2 bucket...");
    try {
      const r2Client = new S3Client({
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: "auto",
        credentials: {
          accessKeyId: R2_ACCESS_KEY_ID,
          secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
      });

      // List all objects in the bucket
      const listCommand = new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
      });

      const listResponse = await r2Client.send(listCommand);
      const objects = listResponse.Contents || [];

      if (objects.length > 0) {
        const deleteParams = {
          Bucket: R2_BUCKET_NAME,
          Delete: {
            Objects: objects.map((obj) => ({ Key: obj.Key })),
          },
        };

        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        await r2Client.send(deleteCommand);
        console.log(`Successfully deleted ${objects.length} assets from R2 bucket.`);
      } else {
        console.log("R2 bucket is already empty.");
      }
    } catch (error) {
      console.error("Failed to empty Cloudflare R2 bucket:", error.message);
    }
  } else {
    console.log("R2 credentials not fully set, skipping R2 clean-up.");
  }

  // 2. Clear MongoDB Databases
  if (MONGODB_URI) {
    console.log("Connecting to MongoDB to drop collections...");
    try {
      await mongoose.connect(MONGODB_URI);
      
      const db = mongoose.connection.db;
      
      // Drop pages collection
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map((col) => col.name);

      if (collectionNames.includes("pages")) {
        await db.collection("pages").drop();
        console.log("Dropped 'pages' collection from MongoDB.");
      }

      if (collectionNames.includes("globalsettings")) {
        await db.collection("globalsettings").drop();
        console.log("Dropped 'globalsettings' collection from MongoDB.");
      }

      console.log("MongoDB clean-up finished successfully!");
    } catch (error) {
      console.error("Failed to clean MongoDB:", error.message);
    } finally {
      await mongoose.disconnect();
    }
  } else {
    console.error("MONGODB_URI not found. Skipping MongoDB clean-up.");
  }

  console.log("Clean-up operation completed.");
}

clean();

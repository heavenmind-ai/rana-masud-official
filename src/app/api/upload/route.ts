import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL, isR2Configured } from "@/lib/r2";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { GridFSBucket } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const isAuthenticated = await verifySession(token);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique name using hash to prevent duplicates/collisions
    const hash = crypto.createHash("md5").update(buffer).digest("hex");
    const ext = file.name.split(".").pop() || "png";
    const filename = `${hash}.${ext}`;
    const contentType = file.type || "image/png";

    // 1. If Cloudflare R2 is configured, upload to R2
    if (isR2Configured) {
      await r2Client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: `uploads/${filename}`,
          Body: buffer,
          ContentType: contentType,
        })
      );

      const cleanBaseUrl = R2_PUBLIC_URL.endsWith("/")
        ? R2_PUBLIC_URL
        : `${R2_PUBLIC_URL}/`;
      const publicUrl = `${cleanBaseUrl}uploads/${filename}`;

      return NextResponse.json({ url: publicUrl, filename });
    }

    // 2. Otherwise, save the file to MongoDB GridFS (safe for serverless/Vercel)
    const conn = await connectToDatabase();
    const db = conn.connection.db;
    if (!db) {
      throw new Error("Failed to retrieve native MongoDB database reference");
    }
    const bucket = new GridFSBucket(db, { bucketName: "media" });

    // Check if the file already exists in GridFS to avoid duplicating uploads
    const existingFiles = await bucket.find({ filename }).toArray();
    if (existingFiles.length === 0) {
      await new Promise<void>((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(filename, {
          metadata: { contentType },
        });
        uploadStream.write(buffer);
        uploadStream.end();
        uploadStream.on("finish", () => resolve());
        uploadStream.on("error", (err) => reject(err));
      });
    }

    // Return the dynamic route URL pointing to our GridFS serving endpoint
    const publicUrl = `/api/upload/${filename}`;
    return NextResponse.json({ url: publicUrl, filename });
  } catch (error: any) {
    console.error("Upload error details:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during file upload." },
      { status: 500 }
    );
  }
}

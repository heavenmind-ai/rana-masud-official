import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL, isR2Configured } from "@/lib/r2";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const MAX_LOCAL_SIZE = 1 * 1024 * 1024; // 1MB threshold for local storage

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
    const filename = `uploads/${hash}.${ext}`;

    const contentType = file.type || "image/png";

    // If the image size is small, store it locally on the public content folder
    if (buffer.length <= MAX_LOCAL_SIZE) {
      const localUploadDir = path.join(process.cwd(), "public", "content", "uploads");
      await fs.mkdir(localUploadDir, { recursive: true });
      const localFilePath = path.join(localUploadDir, `${hash}.${ext}`);
      await fs.writeFile(localFilePath, buffer);

      const publicUrl = `/content/uploads/${hash}.${ext}`;
      return NextResponse.json({ url: publicUrl, filename });
    }

    // For larger files, proceed with Cloudflare R2 upload (requires configuration)
    if (!isR2Configured) {
      return NextResponse.json(
        { error: "Cloudflare R2 is not fully configured in your environment for large files." },
        { status: 500 }
      );
    }

    // Put Object in S3/R2 Bucket
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      })
    );

    // Construct the public URL for serving this asset
    const cleanBaseUrl = R2_PUBLIC_URL.endsWith("/")
      ? R2_PUBLIC_URL
      : `${R2_PUBLIC_URL}/`;
    const publicUrl = `${cleanBaseUrl}${filename}`;

    return NextResponse.json({ url: publicUrl, filename });
  } catch (error: any) {
    console.error("Upload error details:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during file upload." },
      { status: 500 }
    );
  }
}

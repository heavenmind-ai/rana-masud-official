import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL, isR2Configured } from "@/lib/r2";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    if (!isR2Configured) {
      return NextResponse.json(
        { error: "Cloudflare R2 is not fully configured in your environment." },
        { status: 500 }
      );
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

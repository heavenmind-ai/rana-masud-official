import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL, isR2Configured } from "@/lib/r2";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import crypto from "crypto";

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

    if (!isR2Configured) {
      return NextResponse.json(
        { error: "Cloudflare R2 storage is not configured. Upload failed." },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique name using hash to prevent duplicates/collisions
    const hash = crypto.createHash("md5").update(buffer).digest("hex");
    const ext = file.name.split(".").pop() || "png";
    const filename = `${hash}.${ext}`;
    const contentType = file.type || "image/png";

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
  } catch (error: any) {
    console.error("Upload error details:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during file upload." },
      { status: 500 }
    );
  }
}

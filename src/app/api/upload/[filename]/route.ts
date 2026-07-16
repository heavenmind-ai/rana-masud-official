import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { GridFSBucket } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await props.params;
    const conn = await connectToDatabase();
    const db = conn.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const bucket = new GridFSBucket(db, { bucketName: "media" });

    // Check if file exists
    const files = await bucket.find({ filename }).toArray();
    if (!files || files.length === 0) {
      return new NextResponse("File not found", { status: 404 });
    }

    const file = files[0];

    // Download stream from GridFS
    const downloadStream = bucket.openDownloadStreamByName(filename);
    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(Buffer.from(chunk));
    }
    const fileBuffer = Buffer.concat(chunks);

    const contentType = (file as any).contentType || (file as any).metadata?.contentType || "image/png";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Serving uploaded file error:", error);
    return new NextResponse("Error loading asset", { status: 500 });
  }
}

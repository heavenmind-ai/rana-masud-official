import { NextResponse } from "next/server";
import { getManifest } from "@/lib/content";

export async function GET() {
  try {
    const manifest = getManifest();
    return NextResponse.json(manifest);
  } catch (error) {
    console.error("Failed to read manifest:", error);
    return NextResponse.json({ error: "Failed to load manifest data" }, { status: 500 });
  }
}

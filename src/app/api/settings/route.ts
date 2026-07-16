import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { GlobalSettings } from "@/models/GlobalSettings";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (key) {
      const setting = await GlobalSettings.findOne({ key }).lean();
      return NextResponse.json(setting ? (setting as any).data : {});
    }

    const allSettings = await GlobalSettings.find({ key: { $ne: "admin_credentials" } }).lean();
    const settingsMap = allSettings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.data;
      return acc;
    }, {});

    return NextResponse.json(settingsMap);
  } catch (error: any) {
    console.error("Failed to load settings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { key, data } = body;

    if (!key || !data) {
      return NextResponse.json(
        { error: "Missing key or data parameters" },
        { status: 400 }
      );
    }

    if (key === "admin_credentials") {
      return NextResponse.json(
        { error: "Access Denied: Direct credentials modification prohibited." },
        { status: 403 }
      );
    }

    const result = await GlobalSettings.findOneAndUpdate(
      { key },
      { $set: { data } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, setting: result });
  } catch (error: any) {
    console.error("Failed to save settings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save settings" },
      { status: 500 }
    );
  }
}

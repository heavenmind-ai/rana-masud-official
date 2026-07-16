import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AnalyticsEvent } from "@/models/Analytics";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, path, referrer, sessionId, clickData } = body;

    if (!type || !path || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || "";
    const { browser, os, device } = parseUserAgent(userAgent);

    await connectToDatabase();

    const event = await AnalyticsEvent.create({
      type,
      path,
      referrer: referrer || "",
      userAgent,
      browser,
      os,
      device,
      sessionId,
      clickData: clickData || undefined,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, eventId: event._id });
  } catch (error: any) {
    console.error("Analytics endpoint error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function parseUserAgent(ua: string) {
  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let device = "desktop";

  const uaLower = ua.toLowerCase();

  // Browser Matching
  if (uaLower.includes("firefox")) {
    browser = "Firefox";
  } else if (uaLower.includes("opera") || uaLower.includes("opr")) {
    browser = "Opera";
  } else if (uaLower.includes("edg") || uaLower.includes("edge")) {
    browser = "Edge";
  } else if (uaLower.includes("chrome")) {
    browser = "Chrome";
  } else if (uaLower.includes("safari")) {
    browser = "Safari";
  }

  // OS Matching
  if (uaLower.includes("windows")) {
    os = "Windows";
  } else if (uaLower.includes("macintosh") || uaLower.includes("mac os") || uaLower.includes("mac_powerpc")) {
    os = "macOS";
  } else if (uaLower.includes("linux")) {
    os = "Linux";
  } else if (uaLower.includes("iphone") || uaLower.includes("ipad")) {
    os = "iOS";
  } else if (uaLower.includes("android")) {
    os = "Android";
  }

  // Device Matching
  if (uaLower.includes("ipad") || (uaLower.includes("android") && !uaLower.includes("mobile"))) {
    device = "tablet";
  } else if (uaLower.includes("iphone") || uaLower.includes("mobile") || uaLower.includes("phone")) {
    device = "mobile";
  } else {
    device = "desktop";
  }

  return { browser, os, device };
}

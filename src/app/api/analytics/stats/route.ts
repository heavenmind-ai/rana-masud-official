import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";
import { AnalyticsEvent } from "@/models/Analytics";

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Session
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const isAuthenticated = await verifySession(token);
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    await connectToDatabase();

    // Calculate dates
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch all events from the last 30 days for in-memory aggregation.
    const events = await AnalyticsEvent.find({ timestamp: { $gte: thirtyDaysAgo } })
      .sort({ timestamp: -1 })
      .lean();

    const totalViews = events.filter((e) => e.type === "pageview").length;
    const totalClicks = events.filter((e) => e.type === "click").length;

    // Unique visitors
    const uniqueSessionIds = new Set(events.map((e) => e.sessionId));
    const uniqueVisitors = uniqueSessionIds.size;

    // Bounce Rate: Session with only 1 event / total sessions
    const sessionEventCounts: Record<string, number> = {};
    events.forEach((e) => {
      sessionEventCounts[e.sessionId] = (sessionEventCounts[e.sessionId] || 0) + 1;
    });
    const totalSessions = Object.keys(sessionEventCounts).length;
    const bounceSessions = Object.values(sessionEventCounts).filter((count) => count === 1).length;
    const bounceRate = totalSessions > 0 ? Math.round((bounceSessions / totalSessions) * 100) : 0;

    // Top Pages
    const pagesMap: Record<string, number> = {};
    events
      .filter((e) => e.type === "pageview")
      .forEach((e) => {
        pagesMap[e.path] = (pagesMap[e.path] || 0) + 1;
      });
    const topPages = Object.entries(pagesMap)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Browser Splits
    const browserMap: Record<string, number> = {};
    events.forEach((e) => {
      const b = e.browser || "Unknown";
      browserMap[b] = (browserMap[b] || 0) + 1;
    });
    const browsers = Object.entries(browserMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // OS Splits
    const osMap: Record<string, number> = {};
    events.forEach((e) => {
      const o = e.os || "Unknown";
      osMap[o] = (osMap[o] || 0) + 1;
    });
    const os = Object.entries(osMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Device Splits
    const deviceMap: Record<string, number> = {};
    events.forEach((e) => {
      const d = e.device || "desktop";
      deviceMap[d] = (deviceMap[d] || 0) + 1;
    });
    const devices = Object.entries(deviceMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Clicks log (last 50 click events)
    const clicksLog = events
      .filter((e) => e.type === "click" && e.clickData)
      .map((e) => ({
        path: e.path,
        label: e.clickData?.label || "Clicked Link",
        targetUrl: e.clickData?.targetUrl || "",
        browser: e.browser,
        os: e.os,
        timestamp: e.timestamp,
      }))
      .slice(0, 50);

    // Timeline over the last 14 days (views per day)
    const timelineMap: Record<string, { views: number; visitors: Set<string> }> = {};
    
    // Initialize last 14 days
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split("T")[0]; // YYYY-MM-DD
      timelineMap[dateString] = { views: 0, visitors: new Set() };
    }

    events.forEach((e) => {
      const dateString = new Date(e.timestamp).toISOString().split("T")[0];
      if (timelineMap[dateString]) {
        if (e.type === "pageview") {
          timelineMap[dateString].views++;
        }
        timelineMap[dateString].visitors.add(e.sessionId);
      }
    });

    const timeline = Object.entries(timelineMap).map(([date, data]) => ({
      date: date.substring(5), // MM-DD for cleaner chart labels
      views: data.views,
      visitors: data.visitors.size,
    }));

    return NextResponse.json({
      summary: {
        totalViews,
        totalClicks,
        uniqueVisitors,
        bounceRate,
      },
      topPages,
      browsers,
      os,
      devices,
      clicksLog,
      timeline,
    });
  } catch (error: any) {
    console.error("Failed to load statistics:", error);
    return NextResponse.json(
      { error: error.message || "Failed to aggregate statistics" },
      { status: 500 }
    );
  }
}

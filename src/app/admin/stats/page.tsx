"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  Users,
  MousePointerClick,
  Percent,
  Calendar,
  Layers,
  Monitor,
  Compass,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

interface Summary {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  bounceRate: number;
}

interface TopPage {
  path: string;
  count: number;
}

interface MetricSplit {
  name: string;
  count: number;
}

interface ClickLog {
  path: string;
  label: string;
  targetUrl: string;
  browser: string;
  os: string;
  timestamp: string;
}

interface TimelineEntry {
  date: string;
  views: number;
  visitors: number;
}

interface StatsData {
  summary: Summary;
  topPages: TopPage[];
  browsers: MetricSplit[];
  os: MetricSplit[];
  devices: MetricSplit[];
  clicksLog: ClickLog[];
  timeline: TimelineEntry[];
}

export default function AdminStatsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/analytics/stats");
      if (!res.ok) throw new Error("Failed to load analytics statistics");
      const json = await res.json();
      setData(json);
      setError("");
    } catch (err: any) {
      setError(err.message || "An error occurred while loading stats");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/50">
        <RefreshCw className="h-8 w-8 animate-spin text-gold-accent" />
        <p className="text-xs uppercase tracking-widest font-semibold">Gathering site analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center glass-card border border-white/5 max-w-md mx-auto mt-10">
        <p className="text-sm text-red-500 font-semibold">Error Loading Analytics</p>
        <p className="text-xs text-white/40 mt-2">{error || "Failed to load metrics data."}</p>
        <button
          onClick={() => fetchStats()}
          className="mt-4 px-4 py-2 bg-gold-accent text-black font-bold text-xs rounded uppercase hover:bg-gold-hover transition-colors cursor-pointer"
        >
          Retry Load
        </button>
      </div>
    );
  }

  const { summary, topPages, browsers, os, devices, clicksLog, timeline } = data;

  // Compute total counts for metrics splitting percentages
  const totalBrowserHits = browsers.reduce((sum, b) => sum + b.count, 0) || 1;
  const totalOSHits = os.reduce((sum, o) => sum + o.count, 0) || 1;
  const totalDeviceHits = devices.reduce((sum, d) => sum + d.count, 0) || 1;

  // Timeline SVG calculations
  const chartWidth = 600;
  const chartHeight = 200;
  const maxVal = Math.max(...timeline.map((t) => Math.max(t.views, t.visitors)), 10) * 1.1;

  const pointsViews = timeline
    .map((t, idx) => {
      const x = (idx / (timeline.length - 1)) * chartWidth;
      const y = chartHeight - (t.views / maxVal) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const pointsVisitors = timeline
    .map((t, idx) => {
      const x = (idx / (timeline.length - 1)) * chartWidth;
      const y = chartHeight - (t.visitors / maxVal) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col gap-8 text-left max-w-6xl pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wide">Website Analytics</h1>
          <p className="text-xs text-white/50 mt-1">
            Real-time tracking of visitor traffic, browser statistics, and interaction details over the last 30 days.
          </p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Syncing..." : "Refresh"}
        </button>
      </div>

      {/* Summary KPI Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Page Views</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{summary.totalViews.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold-accent/5 border border-gold-accent/15 flex items-center justify-center text-gold-accent">
            <Eye className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-card p-5 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Unique Visitors</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{summary.uniqueVisitors.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold-accent/5 border border-gold-accent/15 flex items-center justify-center text-gold-accent">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-card p-5 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Total Clicks</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{summary.totalClicks.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold-accent/5 border border-gold-accent/15 flex items-center justify-center text-gold-accent">
            <MousePointerClick className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-card p-5 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Bounce Rate</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{summary.bounceRate}%</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold-accent/5 border border-gold-accent/15 flex items-center justify-center text-gold-accent">
            <Percent className="h-5 w-5" />
          </div>
        </div>
      </section>

      {/* Main Charts area */}
      <section className="glass-card p-6 border border-white/5 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gold-accent" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Traffic Timeline (Last 14 Days)</h3>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] h-[250px] relative pr-4">
            {/* SVG Chart */}
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-[200px] overflow-visible">
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={chartHeight * p}
                  x2={chartWidth}
                  y2={chartHeight * p}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
              ))}

              {/* Area under curves */}
              <polygon
                points={`0,${chartHeight} ${pointsViews} ${chartWidth},${chartHeight}`}
                fill="url(#viewsGrad)"
              />
              <polygon
                points={`0,${chartHeight} ${pointsVisitors} ${chartWidth},${chartHeight}`}
                fill="url(#visitorsGrad)"
              />

              {/* Lines */}
              <polyline
                fill="none"
                stroke="#d4af37"
                strokeWidth="2.5"
                points={pointsViews}
              />
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="4 4"
                points={pointsVisitors}
              />

              {/* Data points */}
              {timeline.map((t, idx) => {
                const x = (idx / (timeline.length - 1)) * chartWidth;
                const yV = chartHeight - (t.views / maxVal) * chartHeight;
                const yP = chartHeight - (t.visitors / maxVal) * chartHeight;

                return (
                  <g key={idx}>
                    <circle cx={x} cy={yV} r="3.5" fill="#d4af37" />
                    <circle cx={x} cy={yP} r="3" fill="#3b82f6" />
                  </g>
                );
              })}
            </svg>

            {/* Labels overlay bottom */}
            <div className="flex justify-between text-[10px] text-white/30 font-bold uppercase mt-4 px-2 select-none">
              {timeline.map((t, idx) => (
                <div key={idx} className="text-center w-8">
                  {t.date}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-2 text-xs border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#d4af37]" />
            <span className="font-medium text-white/70">Page Views (Views)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#3b82f6]" />
            <span className="font-medium text-white/70">Unique Visitors (Sessions)</span>
          </div>
        </div>
      </section>

      {/* Pages and Audience splits */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Most Viewed Pages */}
        <div className="glass-card p-6 border border-white/5 md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-gold-accent" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Top Visited Pages</h3>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            {topPages.map((page, idx) => (
              <div key={page.path} className="flex flex-col gap-1.5 p-2.5 rounded bg-white/5 border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-white/80">{page.path}</span>
                  <span className="font-bold text-gold-accent">{page.count.toLocaleString()} views</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-accent rounded-full"
                    style={{ width: `${(page.count / Math.max(...topPages.map((p) => p.count), 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {topPages.length === 0 && (
              <p className="text-xs text-white/40 italic text-center py-8">No pages tracked yet.</p>
            )}
          </div>
        </div>

        {/* Systems and Devices breakdowns */}
        <div className="glass-card p-6 border border-white/5 flex flex-col gap-6">
          {/* Device Type Breakdown */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Monitor className="h-4.5 w-4.5 text-gold-accent" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Devices</h3>
            </div>
            <div className="flex flex-col gap-2">
              {devices.map((device) => {
                const percent = Math.round((device.count / totalDeviceHits) * 100);
                return (
                  <div key={device.name} className="flex justify-between items-center text-xs p-1.5 border-b border-white/5">
                    <span className="capitalize text-white/70 font-semibold">{device.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-[10px]">{device.count} hits</span>
                      <span className="font-bold text-gold-accent w-8 text-right">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Browser Breakdown */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Compass className="h-4.5 w-4.5 text-gold-accent" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Browsers</h3>
            </div>
            <div className="flex flex-col gap-2">
              {browsers.slice(0, 5).map((browser) => {
                const percent = Math.round((browser.count / totalBrowserHits) * 100);
                return (
                  <div key={browser.name} className="flex justify-between items-center text-xs p-1.5 border-b border-white/5">
                    <span className="text-white/70 font-semibold">{browser.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-[10px]">{browser.count} hits</span>
                      <span className="font-bold text-gold-accent w-8 text-right">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OS Breakdown */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-gold-accent" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Operating Systems</h3>
            </div>
            <div className="flex flex-col gap-2">
              {os.slice(0, 5).map((system) => {
                const percent = Math.round((system.count / totalOSHits) * 100);
                return (
                  <div key={system.name} className="flex justify-between items-center text-xs p-1.5 border-b border-white/5">
                    <span className="text-white/70 font-semibold">{system.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-[10px]">{system.count} hits</span>
                      <span className="font-bold text-gold-accent w-8 text-right">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Outbound Clicks Log */}
      <section className="glass-card p-6 border border-white/5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <MousePointerClick className="h-5 w-5 text-gold-accent" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Recent Clicks & Interactions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest text-[9px] font-bold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Trigger Label</th>
                <th className="py-3 px-4">Destination Link</th>
                <th className="py-3 px-4">Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clicksLog.map((log, index) => (
                <tr key={index} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 text-white/50">
                    {new Date(log.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4 font-mono text-white/60">{log.path}</td>
                  <td className="py-3 px-4 font-bold text-gold-accent">{log.label}</td>
                  <td className="py-3 px-4 max-w-[200px] truncate text-white/40" title={log.targetUrl}>
                    {log.targetUrl}
                  </td>
                  <td className="py-3 px-4 text-white/50">
                    {log.os} / {log.browser}
                  </td>
                </tr>
              ))}
              {clicksLog.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/40 italic">
                    No action clicks logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

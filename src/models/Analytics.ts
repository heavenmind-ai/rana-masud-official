import mongoose, { Schema, Document } from "mongoose";

export interface IAnalyticsEvent extends Document {
  type: "pageview" | "click";
  path: string;
  referrer?: string;
  userAgent?: string;
  browser?: string;
  os?: string;
  device?: string; // desktop, mobile, tablet
  sessionId: string;
  clickData?: {
    label?: string;
    targetUrl?: string;
  };
  timestamp: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    type: { type: String, required: true, enum: ["pageview", "click"], index: true },
    path: { type: String, required: true, index: true },
    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    browser: { type: String, default: "Unknown", index: true },
    os: { type: String, default: "Unknown", index: true },
    device: { type: String, default: "Unknown", index: true },
    sessionId: { type: String, required: true, index: true },
    clickData: {
      label: { type: String },
      targetUrl: { type: String },
    },
    timestamp: { type: Date, default: Date.now, index: true },
  }
);

export const AnalyticsEvent =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);

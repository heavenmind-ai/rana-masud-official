import mongoose, { Schema, Document } from "mongoose";

export interface IPage extends Document {
  slug: string;
  title: string;
  description?: string;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontmatter: Record<string, any>;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String, default: "" },
    frontmatter: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { updatedAt: true, createdAt: false } }
);

export const Page = mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);

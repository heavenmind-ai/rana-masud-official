import mongoose, { Schema, Document } from "mongoose";

export interface IGlobalSettings extends Document {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

const GlobalSettingsSchema = new Schema<IGlobalSettings>({
  key: { type: String, required: true, unique: true, index: true },
  data: { type: Schema.Types.Mixed, default: {} },
});

export const GlobalSettings =
  mongoose.models.GlobalSettings ||
  mongoose.model<IGlobalSettings>("GlobalSettings", GlobalSettingsSchema);

import mongoose, { Document } from "mongoose";

// Url interface
interface UrlDoc extends Document {
  urlCode: string;
  longUrl: string;
  shortUrl: string;
}

// Url schema
const urlSchema = new mongoose.Schema({
  urlCode: { type: String, required: true },
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
});

export const Url = mongoose.model<UrlDoc>("Url", urlSchema);

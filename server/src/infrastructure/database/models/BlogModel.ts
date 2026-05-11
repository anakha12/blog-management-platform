import mongoose, { Schema, Document } from "mongoose";
import { Blog } from "../../../domain/entities/Blog";

export interface BlogDocument extends Blog, Document {
  id: string;
}

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    authorId: { type: String, required: true, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const BlogModel = mongoose.model<BlogDocument>("Blog", BlogSchema);

import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import { ImageSubSchema } from './Image.js';

const PostSeoSubSchema = new Schema(
  {
    metaTitle: { type: String, default: '', maxlength: 70 },
    metaDescription: { type: String, default: '', maxlength: 160 },
    ogImage: { type: ImageSubSchema, default: null },
  },
  { _id: false },
);

const PostSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 180 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, maxlength: 240 },
    body: { type: String, required: true, maxlength: 50000 },
    coverImage: { type: ImageSubSchema, default: null },
    tags: { type: [String], default: [] },
    category: { type: String, default: 'engineering', maxlength: 60 },
    status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
    publishedAt: { type: Date, default: null },
    scheduledAt: { type: Date, default: null },
    readingTime: { type: Number, default: 1 },
    seo: { type: PostSeoSubSchema, default: () => ({}) },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ tags: 1 });

export type PostDoc = InferSchemaType<typeof PostSchema>;
export const Post = mongoose.model('Post', PostSchema);

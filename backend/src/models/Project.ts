import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import { ImageSubSchema } from './Image.js';

const ProjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, maxlength: 150 },
    summary: { type: String, required: true, maxlength: 300 },
    category: {
      type: String,
      enum: ['fullstack', 'frontend', 'backend', 'wordpress', 'marketing'],
      default: 'fullstack',
    },
    description: { type: String, required: true, maxlength: 5000 },
    caseStudy: { type: String, default: '', maxlength: 20000 },
    cover: { type: ImageSubSchema, default: null },
    gallery: { type: [ImageSubSchema], default: [] },
    techStack: { type: [String], default: [] },
    liveUrl: { type: String, default: null },
    repoUrl: { type: String, default: null },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true },
);

ProjectSchema.index({ status: 1, order: 1 });

export type ProjectDoc = InferSchemaType<typeof ProjectSchema>;
export const Project = (mongoose.models.Project ||
  mongoose.model('Project', ProjectSchema)) as mongoose.Model<ProjectDoc>;

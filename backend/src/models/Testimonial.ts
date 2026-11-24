import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import { ImageSubSchema } from './Image.js';

const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    role: { type: String, required: true, maxlength: 120 },
    company: { type: String, default: '', maxlength: 120 },
    quote: { type: String, required: true, maxlength: 1500 },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatar: { type: ImageSubSchema, default: null },
    verified: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true },
);

TestimonialSchema.index({ status: 1, order: 1 });

export type TestimonialDoc = InferSchemaType<typeof TestimonialSchema>;
export const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

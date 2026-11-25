import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import { ImageSubSchema } from './Image.js';

const AchievementSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 150 },
    category: {
      type: String,
      enum: ['award', 'competition', 'publication', 'speaking', 'other'],
      default: 'other',
    },
    issuer: { type: String, required: true, maxlength: 120 },
    date: { type: Date, required: true },
    description: { type: String, default: '', maxlength: 4000 },
    link: { type: String, default: null },
    image: { type: ImageSubSchema, default: null },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true },
);

AchievementSchema.index({ status: 1, order: 1 });

export type AchievementDoc = InferSchemaType<typeof AchievementSchema>;
export const Achievement = (mongoose.models.Achievement ||
  mongoose.model('Achievement', AchievementSchema)) as mongoose.Model<AchievementDoc>;

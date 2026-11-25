import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 120 },
    summary: { type: String, default: '', maxlength: 300 },
    description: { type: String, default: '', maxlength: 4000 },
    icon: { type: String, default: '', maxlength: 60 },
    deliverables: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true },
);

ServiceSchema.index({ status: 1, order: 1 });

export type ServiceDoc = InferSchemaType<typeof ServiceSchema>;
export const Service = mongoose.model('Service', ServiceSchema);

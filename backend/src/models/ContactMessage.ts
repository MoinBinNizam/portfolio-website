import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 160 },
    message: { type: String, required: true, maxlength: 3000 },
    read: { type: Boolean, default: false },
    ipHash: { type: String, required: true },
  },
  { timestamps: true },
);

ContactMessageSchema.index({ createdAt: -1 });

export type ContactMessageDoc = InferSchemaType<typeof ContactMessageSchema>;
export const ContactMessage = mongoose.model('ContactMessage', ContactMessageSchema);

import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const ContactReplySubSchema = new Schema(
  {
    subject: { type: String, required: true, maxlength: 160 },
    message: { type: String, required: true, maxlength: 5000 },
    sentAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 160 },
    message: { type: String, required: true, maxlength: 3000 },
    read: { type: Boolean, default: false },
    ipHash: { type: String, required: true },
    replies: { type: [ContactReplySubSchema], default: [] },
  },
  { timestamps: true },
);

ContactMessageSchema.index({ createdAt: -1 });

export type ContactMessageDoc = InferSchemaType<typeof ContactMessageSchema>;
export const ContactMessage = (mongoose.models.ContactMessage ||
  mongoose.model('ContactMessage', ContactMessageSchema)) as mongoose.Model<ContactMessageDoc>;

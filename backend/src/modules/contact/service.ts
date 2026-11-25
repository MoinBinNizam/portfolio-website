import type { ContactInput } from '@portfolio/shared';
import mongoose from 'mongoose';
import { ContactMessage } from '../../models/ContactMessage.js';
import { hashIp } from '../../utils/hashIp.js';
import { httpError } from '../../utils/httpError.js';

export async function submitMessage(input: ContactInput, ip: string) {
  const doc = await ContactMessage.create({
    name: input.name,
    email: input.email,
    message: input.message,
    read: false,
    ipHash: hashIp(ip),
  });

  return {
    submitted: true,
    id: String(doc._id),
  };
}

export async function listMessages() {
  return ContactMessage.find().sort({ createdAt: -1 }).lean();
}

export async function markMessageRead(id: string, read: boolean) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Message not found');
  }
  const updated = await ContactMessage.findByIdAndUpdate(id, { read }, { new: true }).lean();
  if (!updated) {
    throw httpError(404, 'NOT_FOUND', 'Message not found');
  }
  return updated;
}

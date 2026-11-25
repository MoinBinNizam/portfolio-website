import type { ContactInput, ContactReplyInput } from '@portfolio/shared';
import mongoose from 'mongoose';
import { ContactMessage } from '../../models/ContactMessage.js';
import { hashIp } from '../../utils/hashIp.js';
import { httpError } from '../../utils/httpError.js';
import { sendContactNotification, sendContactReply } from '../../utils/mailer.js';

export async function submitMessage(input: ContactInput, ip: string) {
  const doc = await ContactMessage.create({
    name: input.name,
    email: input.email,
    message: input.message,
    read: false,
    ipHash: hashIp(ip),
  });

  let emailSent = false;
  try {
    const mailResult = await sendContactNotification({
      name: input.name,
      email: input.email,
      message: input.message,
      messageId: String(doc._id),
    });
    emailSent = mailResult.sent;
  } catch (err) {
    console.error('Failed to send contact notification email:', err);
  }

  return {
    submitted: true,
    id: String(doc._id),
    emailSent,
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

export async function replyToMessage(id: string, input: ContactReplyInput) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(404, 'NOT_FOUND', 'Message not found');
  }
  const existing = await ContactMessage.findById(id);
  if (!existing) {
    throw httpError(404, 'NOT_FOUND', 'Message not found');
  }

  await sendContactReply({
    to: existing.email,
    recipientName: existing.name,
    subject: input.subject,
    message: input.message,
  });

  existing.read = true;
  existing.replies.push({
    subject: input.subject,
    message: input.message,
    sentAt: new Date(),
  });
  await existing.save();

  return existing.toObject();
}

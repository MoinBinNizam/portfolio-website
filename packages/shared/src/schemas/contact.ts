import { z } from 'zod';

export const ContactInputSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address').max(160),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(3000),
  honeypot: z.string().max(0).optional().default(''),
});

export const ContactMessageUpdateSchema = z.object({
  read: z.boolean(),
});

export const ContactReplyInputSchema = z.object({
  subject: z.string().trim().min(2, 'Subject must be at least 2 characters').max(160),
  message: z.string().trim().min(2, 'Reply message must be at least 2 characters').max(5000),
});

export type ContactInput = z.infer<typeof ContactInputSchema>;
export type ContactMessageUpdate = z.infer<typeof ContactMessageUpdateSchema>;
export type ContactReplyInput = z.infer<typeof ContactReplyInputSchema>;

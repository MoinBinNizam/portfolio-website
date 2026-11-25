import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { httpError } from './httpError.js';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isSmtpConfigured(): boolean {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

function createTransporter() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

export async function sendContactNotification(params: {
  name: string;
  email: string;
  message: string;
  messageId: string;
}): Promise<{ sent: boolean; reason?: string }> {
  if (!isSmtpConfigured()) {
    return { sent: false, reason: 'SMTP not configured' };
  }

  const toAddress = env.CONTACT_TO_EMAIL || env.SMTP_USER || env.OWNER_EMAIL;
  if (!toAddress) {
    return { sent: false, reason: 'No recipient email configured' };
  }

  const transporter = createTransporter();
  const safeName = escapeHtml(params.name);
  const safeEmail = escapeHtml(params.email);
  const safeMessage = escapeHtml(params.message).replace(/\n/g, '<br />');

  await transporter.sendMail({
    from: `"Portfolio Contact" <${env.SMTP_USER}>`,
    to: toAddress,
    replyTo: `"${params.name.replace(/"/g, '')}" <${params.email}>`,
    subject: `New Portfolio Inquiry from ${params.name}`,
    text: [
      `Name: ${params.name}`,
      `Email: ${params.email}`,
      `Message ID: ${params.messageId}`,
      '',
      'Message:',
      params.message,
      '',
      '---',
      'Reply directly to this email in Gmail to respond to the sender, or reply from your Admin Messages inbox.',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 12px;">New Portfolio Contact Inquiry</h2>
        <p style="margin: 4px 0;"><strong>From:</strong> ${safeName} (&lt;${safeEmail}&gt;)</p>
        <p style="margin: 4px 0 16px;"><strong>Message ID:</strong> ${escapeHtml(params.messageId)}</p>
        <div style="padding: 14px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;">
          ${safeMessage}
        </div>
        <p style="margin-top: 16px; font-size: 12px; color: #6b7280;">
          Hit Reply in Gmail to respond directly to ${safeEmail}, or reply from your Admin Messages inbox.
        </p>
      </div>
    `,
  });

  return { sent: true };
}

export async function sendContactReply(params: {
  to: string;
  recipientName: string;
  subject: string;
  message: string;
}): Promise<void> {
  if (!isSmtpConfigured()) {
    throw httpError(
      503,
      'INTERNAL_ERROR',
      'SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env to send replies.',
    );
  }

  const transporter = createTransporter();
  const safeName = escapeHtml(params.recipientName);
  const safeMessage = escapeHtml(params.message).replace(/\n/g, '<br />');

  await transporter.sendMail({
    from: `"Moin Uddin" <${env.SMTP_USER}>`,
    to: params.to,
    replyTo: env.CONTACT_TO_EMAIL || env.SMTP_USER,
    subject: params.subject,
    text: `Hi ${params.recipientName},\n\n${params.message}\n\nBest regards,\nMoin Uddin`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <p>Hi ${safeName},</p>
        <p>${safeMessage}</p>
        <p style="margin-top: 20px;">Best regards,<br /><strong>Moin Uddin</strong></p>
      </div>
    `,
  });
}

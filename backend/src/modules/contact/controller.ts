import type { Request, Response } from 'express';
import * as contactService from './service.js';

export async function submit(req: Request, res: Response): Promise<void> {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const result = await contactService.submitMessage(req.body, ip);
  res.status(201).json({ data: result });
}

export async function listAdmin(_req: Request, res: Response): Promise<void> {
  const messages = await contactService.listMessages();
  res.json({ data: messages });
}

export async function markReadAdmin(req: Request, res: Response): Promise<void> {
  const updated = await contactService.markMessageRead(String(req.params.id), req.body.read);
  res.json({ data: updated });
}

export async function replyAdmin(req: Request, res: Response): Promise<void> {
  const updated = await contactService.replyToMessage(String(req.params.id), req.body);
  res.json({ data: updated });
}

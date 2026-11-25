import type { Request, Response } from 'express';
import * as uploadService from './service.js';

export async function uploadFile(req: Request, res: Response): Promise<void> {
  const alt = typeof req.body?.alt === 'string' ? req.body.alt : undefined;
  const result = await uploadService.handleUpload(req.file, alt);
  res.status(201).json({ data: result });
}

export async function deleteFile(req: Request, res: Response): Promise<void> {
  await uploadService.handleDelete(String(req.params.publicId));
  res.json({ data: { deleted: true } });
}

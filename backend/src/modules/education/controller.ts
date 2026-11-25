import type { Request, Response } from 'express';
import * as educationService from './service.js';

export async function listPublic(_req: Request, res: Response): Promise<void> {
  const items = await educationService.list({ status: 'published' });
  res.json({ data: items });
}

export async function listAdmin(req: Request, res: Response): Promise<void> {
  const status =
    req.query.status === 'draft' || req.query.status === 'published' ? req.query.status : undefined;
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  const items = await educationService.list({ status, q });
  res.json({ data: items });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const item = await educationService.get(String(req.params.id));
  res.json({ data: item });
}

export async function createAdmin(req: Request, res: Response): Promise<void> {
  const created = await educationService.create(req.body);
  res.status(201).json({ data: created });
}

export async function updateAdmin(req: Request, res: Response): Promise<void> {
  const updated = await educationService.update(String(req.params.id), req.body);
  res.json({ data: updated });
}

export async function removeAdmin(req: Request, res: Response): Promise<void> {
  await educationService.remove(String(req.params.id));
  res.json({ data: { deleted: true } });
}

export async function reorderAdmin(req: Request, res: Response): Promise<void> {
  const items = await educationService.reorder(req.body.ids);
  res.json({ data: items });
}

import type { Request, Response } from 'express';
import * as certService from './service.js';

export async function listPublic(_req: Request, res: Response): Promise<void> {
  const items = await certService.list({ status: 'published' });
  res.json({ data: items });
}

export async function listAdmin(req: Request, res: Response): Promise<void> {
  const status =
    req.query.status === 'draft' || req.query.status === 'published' ? req.query.status : undefined;
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  const items = await certService.list({ status, q });
  res.json({ data: items });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const item = await certService.get(String(req.params.id));
  res.json({ data: item });
}

export async function createAdmin(req: Request, res: Response): Promise<void> {
  const created = await certService.create(req.body);
  res.status(201).json({ data: created });
}

export async function updateAdmin(req: Request, res: Response): Promise<void> {
  const updated = await certService.update(String(req.params.id), req.body);
  res.json({ data: updated });
}

export async function removeAdmin(req: Request, res: Response): Promise<void> {
  await certService.remove(String(req.params.id));
  res.json({ data: { deleted: true } });
}

export async function reorderAdmin(req: Request, res: Response): Promise<void> {
  const items = await certService.reorder(req.body.ids);
  res.json({ data: items });
}

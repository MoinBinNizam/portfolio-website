import type { Request, Response } from 'express';
import * as projectService from './service.js';

export async function listPublic(req: Request, res: Response): Promise<void> {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const featured = req.query.featured === 'true' ? true : undefined;
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  const items = await projectService.list({ status: 'published', category, featured, q });
  res.json({ data: items });
}

export async function getPublicBySlug(req: Request, res: Response): Promise<void> {
  const item = await projectService.getBySlugPublic(String(req.params.slug));
  res.json({ data: item });
}

export async function listAdmin(req: Request, res: Response): Promise<void> {
  const status =
    req.query.status === 'draft' || req.query.status === 'published' ? req.query.status : undefined;
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  const items = await projectService.list({ status, category, q });
  res.json({ data: items });
}

export async function getAdmin(req: Request, res: Response): Promise<void> {
  const item = await projectService.get(String(req.params.id));
  res.json({ data: item });
}

export async function createAdmin(req: Request, res: Response): Promise<void> {
  const created = await projectService.create(req.body);
  res.status(201).json({ data: created });
}

export async function updateAdmin(req: Request, res: Response): Promise<void> {
  const updated = await projectService.update(String(req.params.id), req.body);
  res.json({ data: updated });
}

export async function removeAdmin(req: Request, res: Response): Promise<void> {
  await projectService.remove(String(req.params.id));
  res.json({ data: { deleted: true } });
}

export async function reorderAdmin(req: Request, res: Response): Promise<void> {
  const items = await projectService.reorder(req.body.ids);
  res.json({ data: items });
}

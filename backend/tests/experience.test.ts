import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';
import { AUTH_COOKIE_NAME } from '../src/middleware/requireAuth.js';
import { Experience } from '../src/models/Experience.js';

function makeAuthCookie(): string {
  const token = jwt.sign({ sub: 'owner-1', email: 'moinuddinpkt@gmail.com' }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

describe('Experience CRUD Module', () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects anonymous requests to admin routes with 401', async () => {
    const res = await request(app).get('/api/admin/experience');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('returns 422 with field details when creating invalid experience', async () => {
    const res = await request(app)
      .post('/api/admin/experience')
      .set('Cookie', makeAuthCookie())
      .send({
        company: '',
        role: 'Developer',
        startDate: 'not-a-date',
      });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(res.body.error.details)).toBe(true);
  });

  it('filters public list to published items only and sorts by order', async () => {
    const lean = vi
      .fn()
      .mockResolvedValue([
        { company: 'TechVelly', role: 'Full-Stack Developer', status: 'published', order: 0 },
      ]);
    const sort = vi.fn().mockReturnValue({ lean });
    const findSpy = vi.spyOn(Experience, 'find').mockReturnValue({ sort } as never);

    const res = await request(app).get('/api/experience');
    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith({ status: 'published' });
    expect(sort).toHaveBeenCalledWith({ order: 1, startDate: -1 });
    expect(res.body.data).toHaveLength(1);
  });

  it('reorders experience entries using bulkWrite', async () => {
    const bulkWriteSpy = vi.spyOn(Experience, 'bulkWrite').mockResolvedValue({} as never);
    const lean = vi.fn().mockResolvedValue([]);
    const sort = vi.fn().mockReturnValue({ lean });
    vi.spyOn(Experience, 'find').mockReturnValue({ sort } as never);

    const res = await request(app)
      .patch('/api/admin/experience/reorder')
      .set('Cookie', makeAuthCookie())
      .send({ ids: ['id-2', 'id-1'] });

    expect(res.status).toBe(200);
    expect(bulkWriteSpy).toHaveBeenCalledTimes(1);
    const ops = bulkWriteSpy.mock.calls[0]?.[0] as Array<{
      updateOne: { filter: { _id: string }; update: { $set: { order: number } } };
    }>;
    expect(ops[0]?.updateOne.filter._id).toBe('id-2');
    expect(ops[0]?.updateOne.update.$set.order).toBe(0);
    expect(ops[1]?.updateOne.filter._id).toBe('id-1');
    expect(ops[1]?.updateOne.update.$set.order).toBe(1);
  });
});

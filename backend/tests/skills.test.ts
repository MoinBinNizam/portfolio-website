import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';
import { AUTH_COOKIE_NAME } from '../src/middleware/requireAuth.js';
import { Skill } from '../src/models/Skill.js';

function makeAuthCookie(): string {
  const token = jwt.sign({ sub: 'owner-1', email: 'moinuddinpkt@gmail.com' }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

describe('Skills CRUD Module', () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects anonymous requests to admin routes with 401', async () => {
    const res = await request(app).get('/api/admin/skills');
    expect(res.status).toBe(401);
  });

  it('returns 422 when level is outside 1..5', async () => {
    const res = await request(app).post('/api/admin/skills').set('Cookie', makeAuthCookie()).send({
      name: 'TypeScript',
      category: 'frontend',
      level: 7,
    });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('filters public skills to published items only', async () => {
    const lean = vi.fn().mockResolvedValue([]);
    const sort = vi.fn().mockReturnValue({ lean });
    const findSpy = vi.spyOn(Skill, 'find').mockReturnValue({ sort } as never);

    const res = await request(app).get('/api/skills');
    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith({ status: 'published' });
  });

  it('reorders skills using bulkWrite', async () => {
    const bulkWriteSpy = vi.spyOn(Skill, 'bulkWrite').mockResolvedValue({} as never);
    const lean = vi.fn().mockResolvedValue([]);
    const sort = vi.fn().mockReturnValue({ lean });
    vi.spyOn(Skill, 'find').mockReturnValue({ sort } as never);

    const res = await request(app)
      .patch('/api/admin/skills/reorder')
      .set('Cookie', makeAuthCookie())
      .send({ ids: ['skill-2', 'skill-1'] });

    expect(res.status).toBe(200);
    expect(bulkWriteSpy).toHaveBeenCalledTimes(1);
  });
});

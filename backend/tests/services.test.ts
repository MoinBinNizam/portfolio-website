import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';
import { AUTH_COOKIE_NAME } from '../src/middleware/requireAuth.js';
import { Service } from '../src/models/Service.js';

function makeAuthCookie(): string {
  const token = jwt.sign({ sub: 'owner-1', email: 'moinuddinpkt@gmail.com' }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

describe('Services CRUD Module', () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects anonymous requests to admin routes with 401', async () => {
    const res = await request(app).get('/api/admin/services');
    expect(res.status).toBe(401);
  });

  it('returns 422 when creating invalid service', async () => {
    const res = await request(app)
      .post('/api/admin/services')
      .set('Cookie', makeAuthCookie())
      .send({ title: 'A' });
    expect(res.status).toBe(422);
  });

  it('filters public services to published items only', async () => {
    const lean = vi.fn().mockResolvedValue([]);
    const sort = vi.fn().mockReturnValue({ lean });
    const findSpy = vi.spyOn(Service, 'find').mockReturnValue({ sort } as never);

    const res = await request(app).get('/api/services');
    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith({ status: 'published' });
  });
});

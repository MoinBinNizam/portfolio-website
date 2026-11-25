import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';
import { AUTH_COOKIE_NAME } from '../src/middleware/requireAuth.js';
import { Education } from '../src/models/Education.js';

function makeAuthCookie(): string {
  const token = jwt.sign({ sub: 'owner-1', email: 'moinuddinpkt@gmail.com' }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

describe('Education CRUD Module', () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects anonymous requests to admin routes with 401', async () => {
    const res = await request(app).get('/api/admin/education');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('returns 422 with field details when endYear is before startYear', async () => {
    const res = await request(app)
      .post('/api/admin/education')
      .set('Cookie', makeAuthCookie())
      .send({
        institution: 'University of Greenwich',
        degree: 'BSc (Hons)',
        startYear: 2024,
        endYear: 2020,
      });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details[0]?.field).toBe('endYear');
  });

  it('filters public list to published items only and sorts by order', async () => {
    const lean = vi
      .fn()
      .mockResolvedValue([
        {
          institution: 'University of Greenwich, UK',
          degree: 'BSc (Hons)',
          status: 'published',
          order: 0,
        },
      ]);
    const sort = vi.fn().mockReturnValue({ lean });
    const findSpy = vi.spyOn(Education, 'find').mockReturnValue({ sort } as never);

    const res = await request(app).get('/api/education');
    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith({ status: 'published' });
    expect(sort).toHaveBeenCalledWith({ order: 1, endYear: -1 });
    expect(res.body.data).toHaveLength(1);
  });

  it('reorders education entries using bulkWrite', async () => {
    const bulkWriteSpy = vi.spyOn(Education, 'bulkWrite').mockResolvedValue({} as never);
    const lean = vi.fn().mockResolvedValue([]);
    const sort = vi.fn().mockReturnValue({ lean });
    vi.spyOn(Education, 'find').mockReturnValue({ sort } as never);

    const res = await request(app)
      .patch('/api/admin/education/reorder')
      .set('Cookie', makeAuthCookie())
      .send({ ids: ['edu-2', 'edu-1'] });

    expect(res.status).toBe(200);
    expect(bulkWriteSpy).toHaveBeenCalledTimes(1);
    const ops = bulkWriteSpy.mock.calls[0]?.[0] as Array<{
      updateOne: { filter: { _id: string }; update: { $set: { order: number } } };
    }>;
    expect(ops[0]?.updateOne.filter._id).toBe('edu-2');
    expect(ops[0]?.updateOne.update.$set.order).toBe(0);
    expect(ops[1]?.updateOne.filter._id).toBe('edu-1');
    expect(ops[1]?.updateOne.update.$set.order).toBe(1);
  });
});

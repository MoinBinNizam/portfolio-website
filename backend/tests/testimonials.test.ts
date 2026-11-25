import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';
import { AUTH_COOKIE_NAME } from '../src/middleware/requireAuth.js';
import { Testimonial } from '../src/models/Testimonial.js';

function makeAuthCookie(): string {
  const token = jwt.sign({ sub: 'owner-1', email: 'moinuddinpkt@gmail.com' }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

describe('Testimonials CRUD Module', () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects anonymous requests to admin routes with 401', async () => {
    const res = await request(app).get('/api/admin/testimonials');
    expect(res.status).toBe(401);
  });

  it('returns 422 when rating is outside 1..5', async () => {
    const res = await request(app)
      .post('/api/admin/testimonials')
      .set('Cookie', makeAuthCookie())
      .send({
        name: 'Client Name',
        role: 'Founder',
        quote: 'Great work on our web platform.',
        rating: 6,
      });
    expect(res.status).toBe(422);
  });

  it('filters public testimonials to published items only', async () => {
    const lean = vi.fn().mockResolvedValue([]);
    const sort = vi.fn().mockReturnValue({ lean });
    const findSpy = vi.spyOn(Testimonial, 'find').mockReturnValue({ sort } as never);

    const res = await request(app).get('/api/testimonials');
    expect(res.status).toBe(200);
    expect(findSpy).toHaveBeenCalledWith({ status: 'published' });
  });
});

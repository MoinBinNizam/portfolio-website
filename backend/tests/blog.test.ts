import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';
import { AUTH_COOKIE_NAME } from '../src/middleware/requireAuth.js';
import { Post } from '../src/models/Post.js';
import { Project } from '../src/models/Project.js';

function makeAuthCookie(): string {
  const token = jwt.sign({ sub: 'owner-1', email: 'moinuddinpkt@gmail.com' }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return `${AUTH_COOKIE_NAME}=${token}`;
}

describe('Blog & SEO Modules', () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects anonymous requests to admin blog routes with 401', async () => {
    const res = await request(app).get('/api/admin/blog');
    expect(res.status).toBe(401);
  });

  it('returns 422 when creating post with invalid slug or short body', async () => {
    const res = await request(app).post('/api/admin/blog').set('Cookie', makeAuthCookie()).send({
      title: 'Hi',
      slug: 'Bad Slug!',
      excerpt: 'short',
      body: 'too short',
    });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 404 when requesting an unpublished/missing post slug', async () => {
    const lean = vi.fn().mockResolvedValue(null);
    const findOneSpy = vi.spyOn(Post, 'findOne').mockReturnValue({ lean } as never);

    const res = await request(app).get('/api/blog/draft-post');
    expect(res.status).toBe(404);
    expect(findOneSpy).toHaveBeenCalledWith({ slug: 'draft-post', status: 'published' });
  });

  it('generates valid XML for /sitemap.xml and /rss.xml', async () => {
    const selectLean = { lean: vi.fn().mockResolvedValue([]) };
    vi.spyOn(Project, 'find').mockReturnValue({
      select: vi.fn().mockReturnValue(selectLean),
    } as never);
    vi.spyOn(Post, 'find').mockReturnValue({
      select: vi.fn().mockReturnValue(selectLean),
      sort: vi
        .fn()
        .mockReturnValue({
          limit: vi.fn().mockReturnValue({ lean: vi.fn().mockResolvedValue([]) }),
        }),
    } as never);

    const sitemap = await request(app).get('/sitemap.xml');
    expect(sitemap.status).toBe(200);
    expect(sitemap.text).toContain('<urlset');

    const rss = await request(app).get('/rss.xml');
    expect(rss.status).toBe(200);
    expect(rss.text).toContain('<rss version="2.0">');
  });
});

import { Router } from 'express';
import { env } from '../../config/env.js';
import { Post } from '../../models/Post.js';
import { Project } from '../../models/Project.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const seoRouter = Router();

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

seoRouter.get(
  '/sitemap.xml',
  asyncHandler(async (_req, res) => {
    const baseUrl =
      env.CORS_ORIGIN.split(',')[0]?.trim().replace(/\/$/, '') || 'https://moinuddinbd.com';
    const staticRoutes = [
      '/',
      '/about',
      '/experience',
      '/education',
      '/certifications',
      '/achievements',
      '/projects',
      '/services',
      '/blog',
      '/contact',
    ];

    const [projects, posts] = await Promise.all([
      Project.find({ status: 'published' }).select('slug updatedAt').lean(),
      Post.find({ status: 'published' }).select('slug updatedAt publishedAt').lean(),
    ]);

    const urls = [
      ...staticRoutes.map((route) => `<url><loc>${escapeXml(`${baseUrl}${route}`)}</loc></url>`),
      ...projects.map(
        (p) =>
          `<url><loc>${escapeXml(`${baseUrl}/projects/${p.slug}`)}</loc>${
            p.updatedAt ? `<lastmod>${new Date(p.updatedAt).toISOString()}</lastmod>` : ''
          }</url>`,
      ),
      ...posts.map(
        (post) =>
          `<url><loc>${escapeXml(`${baseUrl}/blog/${post.slug}`)}</loc>${
            post.updatedAt ? `<lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>` : ''
          }</url>`,
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  }),
);

seoRouter.get(
  '/rss.xml',
  asyncHandler(async (_req, res) => {
    const baseUrl =
      env.CORS_ORIGIN.split(',')[0]?.trim().replace(/\/$/, '') || 'https://moinuddinbd.com';
    const posts = await Post.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(20)
      .lean();

    const items = posts
      .map((post) => {
        const link = `${baseUrl}/blog/${post.slug}`;
        const pubDate = new Date(post.publishedAt ?? post.createdAt ?? Date.now()).toUTCString();
        return `<item><title>${escapeXml(post.title)}</title><link>${escapeXml(
          link,
        )}</link><guid>${escapeXml(link)}</guid><pubDate>${pubDate}</pubDate><description>${escapeXml(
          post.excerpt,
        )}</description></item>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Moin Uddin — Blog</title><link>${escapeXml(
      `${baseUrl}/blog`,
    )}</link><description>Technical articles on MERN, TypeScript, and web architecture.</description>${items}</channel></rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.send(xml);
  }),
);

import { Router } from 'express';
import { Achievement } from '../../models/Achievement.js';
import { Certification } from '../../models/Certification.js';
import { Education } from '../../models/Education.js';
import { Experience } from '../../models/Experience.js';
import { Post } from '../../models/Post.js';
import { Profile } from '../../models/Profile.js';
import { Project } from '../../models/Project.js';
import { Service } from '../../models/Service.js';
import { Skill } from '../../models/Skill.js';
import { Testimonial } from '../../models/Testimonial.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { httpError } from '../../utils/httpError.js';

export const publicRouter = Router();

publicRouter.use((req, res, next) => {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  }
  next();
});

publicRouter.get(
  '/home',
  asyncHandler(async (_req, res) => {
    const [
      profile,
      experience,
      education,
      certifications,
      achievements,
      projects,
      skills,
      services,
      testimonials,
      posts,
      postTotal,
    ] = await Promise.all([
      Profile.findOne().lean(),
      Experience.find({ status: 'published' }).sort({ order: 1, startDate: -1 }).lean(),
      Education.find({ status: 'published' }).sort({ order: 1, startYear: -1 }).lean(),
      Certification.find({ status: 'published' }).sort({ order: 1, issueDate: -1 }).lean(),
      Achievement.find({ status: 'published' }).sort({ order: 1, date: -1 }).lean(),
      Project.find({ status: 'published' }).sort({ order: 1, createdAt: -1 }).lean(),
      Skill.find({ status: 'published' }).sort({ order: 1, name: 1 }).lean(),
      Service.find({ status: 'published' }).sort({ order: 1, createdAt: -1 }).lean(),
      Testimonial.find({ status: 'published' }).sort({ order: 1, createdAt: -1 }).lean(),
      Post.find({ status: 'published' })
        .select('-body')
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(3)
        .lean(),
      Post.countDocuments({ status: 'published' }),
    ]);

    res.json({
      data: {
        profile: profile ?? null,
        experience,
        education,
        certifications,
        achievements,
        projects,
        skills,
        services,
        testimonials,
        posts: {
          data: posts,
          meta: {
            page: 1,
            limit: 3,
            total: postTotal,
            totalPages: Math.max(1, Math.ceil(postTotal / 3)),
          },
        },
      },
    });
  }),
);

publicRouter.get(
  '/profile',
  asyncHandler(async (_req, res) => {
    const profile = await Profile.findOne().lean();
    res.json({ data: profile ?? null });
  }),
);

publicRouter.get(
  '/experience',
  asyncHandler(async (_req, res) => {
    const items = await Experience.find({ status: 'published' })
      .sort({ order: 1, startDate: -1 })
      .lean();
    res.json({ data: items });
  }),
);

publicRouter.get(
  '/education',
  asyncHandler(async (_req, res) => {
    const items = await Education.find({ status: 'published' })
      .sort({ order: 1, startYear: -1 })
      .lean();
    res.json({ data: items });
  }),
);

publicRouter.get(
  '/certifications',
  asyncHandler(async (_req, res) => {
    const items = await Certification.find({ status: 'published' })
      .sort({ order: 1, issueDate: -1 })
      .lean();
    res.json({ data: items });
  }),
);

publicRouter.get(
  '/achievements',
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = { status: 'published' };
    if (typeof req.query.category === 'string' && req.query.category.trim()) {
      filter.category = req.query.category.trim();
    }
    const items = await Achievement.find(filter).sort({ order: 1, date: -1 }).lean();
    res.json({ data: items });
  }),
);

publicRouter.get(
  '/projects',
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = { status: 'published' };
    if (typeof req.query.category === 'string' && req.query.category.trim()) {
      filter.category = req.query.category.trim();
    }
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    const items = await Project.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    res.json({ data: items });
  }),
);

publicRouter.get(
  '/projects/:slug',
  asyncHandler(async (req, res) => {
    const item = await Project.findOne({
      slug: req.params.slug,
      status: 'published',
    }).lean();
    if (!item) {
      throw httpError(404, 'NOT_FOUND', 'Project not found');
    }
    res.json({ data: item });
  }),
);

publicRouter.get(
  '/skills',
  asyncHandler(async (_req, res) => {
    const items = await Skill.find({ status: 'published' }).sort({ order: 1, name: 1 }).lean();
    res.json({ data: items });
  }),
);

publicRouter.get(
  '/services',
  asyncHandler(async (_req, res) => {
    const items = await Service.find({ status: 'published' })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json({ data: items });
  }),
);

publicRouter.get(
  '/testimonials',
  asyncHandler(async (_req, res) => {
    const items = await Testimonial.find({ status: 'published' })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json({ data: items });
  }),
);

publicRouter.get(
  '/blog/tags',
  asyncHandler(async (_req, res) => {
    const tags = await Post.distinct('tags', { status: 'published' });
    res.json({ data: tags });
  }),
);

publicRouter.get(
  '/blog',
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 9));
    const filter: Record<string, unknown> = { status: 'published' };

    if (typeof req.query.tag === 'string' && req.query.tag.trim()) {
      filter.tags = req.query.tag.trim();
    }
    if (typeof req.query.q === 'string' && req.query.q.trim()) {
      const q = req.query.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Post.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    res.json({
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  }),
);

publicRouter.get(
  '/blog/:slug',
  asyncHandler(async (req, res) => {
    const post = await Post.findOne({
      slug: req.params.slug,
      status: 'published',
    }).lean();
    if (!post) {
      throw httpError(404, 'NOT_FOUND', 'Post not found');
    }
    res.json({ data: post });
  }),
);

import { ProfileUpdateSchema } from '@portfolio/shared';
import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { Achievement } from '../../models/Achievement.js';
import { Certification } from '../../models/Certification.js';
import { ContactMessage } from '../../models/ContactMessage.js';
import { Education } from '../../models/Education.js';
import { Experience } from '../../models/Experience.js';
import { Post } from '../../models/Post.js';
import { Profile } from '../../models/Profile.js';
import { Project } from '../../models/Project.js';
import { Service } from '../../models/Service.js';
import { Skill } from '../../models/Skill.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const adminCoreRouter = Router();
adminCoreRouter.use(requireAuth);

adminCoreRouter.get(
  '/dashboard',
  asyncHandler(async (_req, res) => {
    const [
      experience,
      education,
      certifications,
      achievements,
      projects,
      skills,
      services,
      posts,
      unreadMessages,
      totalMessages,
    ] = await Promise.all([
      Experience.countDocuments(),
      Education.countDocuments(),
      Certification.countDocuments(),
      Achievement.countDocuments(),
      Project.countDocuments(),
      Skill.countDocuments(),
      Service.countDocuments(),
      Post.countDocuments(),
      ContactMessage.countDocuments({ read: false }),
      ContactMessage.countDocuments(),
    ]);

    res.json({
      data: {
        counts: {
          experience,
          education,
          certifications,
          achievements,
          projects,
          skills,
          services,
          posts,
          unreadMessages,
          totalMessages,
        },
      },
    });
  }),
);

adminCoreRouter.get(
  '/profile',
  asyncHandler(async (_req, res) => {
    const profile = await Profile.findOne().lean();
    res.json({ data: profile ?? null });
  }),
);

adminCoreRouter.put(
  '/profile',
  validateBody(ProfileUpdateSchema),
  asyncHandler(async (req, res) => {
    const existing = await Profile.findOne();
    if (!existing) {
      const created = await Profile.create(req.body);
      res.json({ data: created.toObject() });
      return;
    }
    const updated = await Profile.findByIdAndUpdate(existing._id, req.body, {
      new: true,
      runValidators: true,
    }).lean();
    res.json({ data: updated });
  }),
);
